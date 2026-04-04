package com.clinica.service;

import com.clinica.model.domain.Hospital;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.ArrayList;
import java.util.List;

@Service
@Slf4j
public class PlacesService {

    private final WebClient mapsWebClient;
    private final ObjectMapper objectMapper;
    private final String apiKey;

    public PlacesService(
            @Qualifier("mapsWebClient") WebClient mapsWebClient,
            @Value("${google.maps.api.key:}") String apiKey) {
        this.mapsWebClient = mapsWebClient;
        this.apiKey = apiKey;
        this.objectMapper = new ObjectMapper();
    }

    public boolean isAvailable() {
        return apiKey != null && !apiKey.isBlank();
    }

    /**
     * Find nearby hospitals using the Google Places Nearby Search API.
     * Returns up to maxResults hospitals within radiusMiles of the given coordinates.
     */
    public List<Hospital> findNearbyHospitals(double lat, double lng, int radiusMiles, int maxResults) {
        if (!isAvailable()) {
            log.info("Google Maps API key not configured, skipping Places search");
            return List.of();
        }

        List<Hospital> results = new ArrayList<>();
        int radiusMeters = (int) (radiusMiles * 1609.34);

        try {
            // Search for hospitals
            List<Hospital> hospitals = searchByType(lat, lng, radiusMeters, "hospital", maxResults);
            results.addAll(hospitals);

            // If we got fewer than 5 results, also search urgent care
            if (results.size() < 5) {
                int remaining = maxResults - results.size();
                List<Hospital> urgentCare = searchByType(lat, lng, radiusMeters, "doctor", remaining);
                results.addAll(urgentCare);
            }

        } catch (Exception e) {
            log.warn("Places API search failed: {}", e.getMessage());
        }

        // Sort by distance and cap at maxResults
        results.sort((a, b) -> Double.compare(a.getDistanceMiles(), b.getDistanceMiles()));
        return results.stream().limit(maxResults).toList();
    }

    private List<Hospital> searchByType(double lat, double lng, int radiusMeters, String type, int maxResults) throws Exception {
        List<Hospital> results = new ArrayList<>();

        String responseJson = mapsWebClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/place/nearbysearch/json")
                        .queryParam("location", lat + "," + lng)
                        .queryParam("radius", radiusMeters)
                        .queryParam("type", type)
                        .queryParam("key", apiKey)
                        .build())
                .retrieve()
                .bodyToMono(String.class)
                .block();

        JsonNode root = objectMapper.readTree(responseJson);
        String status = root.path("status").asText();

        if (!"OK".equals(status)) {
            if (!"ZERO_RESULTS".equals(status)) {
                log.warn("Places API status: {} — {}", status, root.path("error_message").asText(""));
            }
            return List.of();
        }

        JsonNode places = root.path("results");
        if (!places.isArray()) return List.of();

        for (int i = 0; i < Math.min(places.size(), maxResults); i++) {
            JsonNode place = places.get(i);
            Hospital hospital = mapPlaceNode(place, lat, lng);
            results.add(hospital);
        }

        log.info("Places API found {} results near ({}, {})", results.size(), lat, lng);
        return results;
    }

    private Hospital mapPlaceNode(JsonNode place, double userLat, double userLng) {
        String placeId = place.path("place_id").asText("");
        String name = place.path("name").asText("Unknown");
        String address = place.path("vicinity").asText(place.path("formatted_address").asText("Address unavailable"));
        double placeLat = place.path("geometry").path("location").path("lat").asDouble();
        double placeLng = place.path("geometry").path("location").path("lng").asDouble();
        double rating = place.path("rating").asDouble(0);
        int ratingsTotal = place.path("user_ratings_total").asInt(0);
        boolean isOpen = place.path("opening_hours").path("open_now").asBoolean(false);
        String website = place.path("website").asText(null);

        // Determine facility type from types array
        String type = classifyType(place.path("types"));

        double distanceMiles = haversineDistance(userLat, userLng, placeLat, placeLng);
        distanceMiles = Math.round(distanceMiles * 10.0) / 10.0;

        return Hospital.builder()
                .id(placeId)
                .name(name)
                .address(address)
                .lat(placeLat)
                .lng(placeLng)
                .phone(null)    // Requires a Details call — enriched later by HospitalService if needed
                .rating(rating)
                .userRatingsTotal(ratingsTotal)
                .type(type)
                .isOpenNow(isOpen)
                .distanceMiles(distanceMiles)
                .acceptsInsurance(null)     // Unknown until Gemini enrichment
                .insuranceNote(null)
                .website(website)
                .googleMapsUrl("https://www.google.com/maps/place/?q=place_id:" + placeId)
                .build();
    }

    private String classifyType(JsonNode typesNode) {
        if (!typesNode.isArray()) return "Health Facility";
        for (JsonNode t : typesNode) {
            String s = t.asText("");
            if (s.equals("hospital")) return "Hospital";
            if (s.equals("doctor")) return "Doctor's Office";
            if (s.contains("urgent_care")) return "Urgent Care";
            if (s.contains("health")) return "Health Facility";
            if (s.contains("pharmacy")) return "Pharmacy";
        }
        return "Health Facility";
    }

    private double haversineDistance(double lat1, double lon1, double lat2, double lon2) {
        double earthRadiusMiles = 3958.8;
        double dLat = Math.toRadians(lat2 - lat1);
        double dLon = Math.toRadians(lon2 - lon1);
        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                * Math.sin(dLon / 2) * Math.sin(dLon / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return earthRadiusMiles * c;
    }
}
