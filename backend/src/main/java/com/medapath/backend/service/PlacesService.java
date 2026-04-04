package com.medapath.backend.service;

import com.medapath.backend.dto.HospitalDto;
import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.ArrayList;
import java.util.List;

@Service
@Slf4j
public class PlacesService {

    private final RestClient restClient;
    private final ObjectMapper objectMapper;
    private final String apiKey;

    public PlacesService(@Value("${google.maps.api.key:}") String apiKey) {
        this.apiKey = apiKey;
        this.objectMapper = new ObjectMapper();
        this.restClient = RestClient.builder()
                .baseUrl("https://maps.googleapis.com/maps/api")
                .build();
    }

    public boolean isAvailable() {
        return apiKey != null && !apiKey.isBlank();
    }

    /**
     * Search for hospitals near the given coordinates using Google Places Nearby Search.
     * Returns up to {@code maxResults} hospitals within {@code radiusMeters}.
     */
    public List<HospitalDto> findNearbyHospitals(double lat, double lng, int radiusMeters, int maxResults) {
        if (!isAvailable()) {
            log.info("Google Maps API key not configured, skipping Places search");
            return List.of();
        }

        List<HospitalDto> results = new ArrayList<>();
        try {
            // Build URI as a plain string to avoid template expansion issues with the comma
            String uri = String.format(
                    "/place/nearbysearch/json?location=%f,%f&radius=%d&type=hospital&key=%s",
                    lat, lng, radiusMeters, apiKey);

            log.info("Places API request: location={},{} radius={}m", lat, lng, radiusMeters);

            String responseJson = restClient.get()
                    .uri(uri)
                    .retrieve()
                    .body(String.class);

            JsonNode root = objectMapper.readTree(responseJson);
            String status = root.path("status").stringValue();
            log.info("Places API response status: {}", status);

            if (!"OK".equals(status)) {
                if (!"ZERO_RESULTS".equals(status)) {
                    log.warn("Places API returned status: {} — error: {}",
                            status, root.path("error_message").stringValue("none"));
                }
                return List.of();
            }

            JsonNode placesArray = root.path("results");
            if (!placesArray.isArray()) return List.of();

            for (int i = 0; i < Math.min(placesArray.size(), maxResults); i++) {
                JsonNode place = placesArray.get(i);
                JsonNode location = place.path("geometry").path("location");

                double placeLat = location.path("lat").asDouble();
                double placeLng = location.path("lng").asDouble();
                double distanceMiles = calculateDistance(lat, lng, placeLat, placeLng);

                String name = place.path("name").stringValue("Unknown Hospital");
                String address = place.path("vicinity").stringValue("Address unavailable");
                double rating = place.path("rating").asDouble(0);
                boolean isOpen = place.path("opening_hours").path("open_now").asBoolean(false);

                // Determine hospital type from types array
                String type = "Hospital";
                JsonNode types = place.path("types");
                if (types.isArray()) {
                    for (JsonNode t : types) {
                        String typeStr = t.stringValue("");
                        if (typeStr.contains("hospital")) {
                            type = "Hospital";
                            break;
                        } else if (typeStr.contains("doctor")) {
                            type = "Doctor's Office";
                        } else if (typeStr.contains("health")) {
                            type = "Health Facility";
                        }
                    }
                }

                results.add(HospitalDto.builder()
                        .id((long) -(i + 1)) // Negative IDs to distinguish from DB hospitals
                        .name(name)
                        .address(address)
                        .latitude(placeLat)
                        .longitude(placeLng)
                        .type(type)
                        .inNetwork(false) // Unknown for Places results
                        .distance(String.format("%.1f mi", distanceMiles))
                        .distanceMiles(distanceMiles)
                        .rating(rating)
                        .estimatedWaitTime(isOpen ? "Open now" : null)
                        .matchScore(0) // Will be scored by HospitalService
                        .build());
            }

            log.info("Found {} hospitals near ({}, {}) via Places API", results.size(), lat, lng);
        } catch (Exception e) {
            log.warn("Places API search failed: {}", e.getMessage());
        }

        return results;
    }

    private double calculateDistance(double lat1, double lon1, double lat2, double lon2) {
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
