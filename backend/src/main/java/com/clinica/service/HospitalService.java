package com.clinica.service;

import com.clinica.data.HospitalSeedData;
import com.clinica.data.HospitalSeedData.SeedHospital;
import com.clinica.model.domain.Hospital;
import com.clinica.model.request.HospitalSearchRequest;
import com.clinica.model.response.HospitalListResponse;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Map;

@Service
@Slf4j
public class HospitalService {

    // Scoring weights — mirrors Medapath's proven algorithm
    private static final int SCORE_EXACT_PLAN   = 50;
    private static final int SCORE_PROVIDER      = 30;
    private static final int SCORE_DIST_VERY_NEAR = 25;  // < 2 miles
    private static final int SCORE_DIST_NEAR      = 15;  // 2–5 miles
    private static final int SCORE_DIST_MEDIUM    = 10;  // 5–10 miles
    private static final int SCORE_DIST_FAR       = 5;   // 10–30 miles
    private static final int SCORE_OPEN_NOW       = 5;
    private static final int SCORE_HIGH_RATING    = 5;   // rating >= 4.5
    private static final int SCORE_GOOD_RATING    = 3;   // rating >= 4.0

    private final GeocodingService geocodingService;
    private final PlacesService placesService;
    private final WebClient geminiWebClient;
    private final ObjectMapper objectMapper;
    private final String apiKey;
    private final String hospitalModel;

    public HospitalService(
            GeocodingService geocodingService,
            PlacesService placesService,
            @Qualifier("geminiWebClient") WebClient geminiWebClient,
            @Value("${gemini.api.key:}") String apiKey,
            @Value("${gemini.hospital.model:gemini-3-flash-preview}") String hospitalModel) {
        this.geocodingService = geocodingService;
        this.placesService = placesService;
        this.geminiWebClient = geminiWebClient;
        this.apiKey = apiKey;
        this.hospitalModel = hospitalModel;
        this.objectMapper = new ObjectMapper();
    }

    public HospitalListResponse searchHospitals(HospitalSearchRequest request) {
        // 1. Resolve coordinates
        double lat;
        double lng;
        String searchLocation;

        if (request.getLat() != null && request.getLng() != null) {
            lat = request.getLat();
            lng = request.getLng();
            searchLocation = request.getZipCode() != null ? request.getZipCode() : "near you";
        } else if (request.getZipCode() != null && !request.getZipCode().isBlank()) {
            double[] coords = geocodingService.geocode(request.getZipCode());
            if (coords == null) {
                log.warn("Geocoding failed for '{}', returning empty results", request.getZipCode());
                return new HospitalListResponse(
                        List.of(), request.getZipCode(),
                        request.getInsuranceProvider(), request.getPlanName(), 0, 0);
            }
            lat = coords[0];
            lng = coords[1];
            searchLocation = request.getZipCode();
        } else {
            // No location at all — the controller guards this, but be safe
            return new HospitalListResponse(
                    List.of(), "unknown",
                    request.getInsuranceProvider(), request.getPlanName(), 0, 0);
        }

        String provider = request.getInsuranceProvider();
        String plan     = request.getPlanName();

        // 2. Score and filter seed hospitals within cutoff radius
        List<Hospital> scored = new ArrayList<>();
        for (SeedHospital seed : HospitalSeedData.HOSPITALS) {
            double dist = haversine(lat, lng, seed.lat(), seed.lng());
            if (dist > HospitalSeedData.SEED_CUTOFF_MILES) continue;
            scored.add(scoreSeedHospital(seed, provider, plan, dist));
        }

        // 3. Determine whether to supplement with Places API
        //    Use Places if: no Google Maps key isn't the issue (placesService.isAvailable())
        //    AND either we have very few seed results OR the nearest seed is far
        double nearestSeedMiles = scored.stream()
                .mapToDouble(Hospital::getDistanceMiles)
                .min().orElse(Double.MAX_VALUE);

        boolean needsPlaces = placesService.isAvailable()
                && (scored.size() < 3 || nearestSeedMiles > HospitalSeedData.PLACES_SUPPLEMENT_MILES);

        if (needsPlaces) {
            List<Hospital> placesResults = placesService.findNearbyHospitals(
                    lat, lng, request.getRadiusMiles(), 8);

            for (Hospital placesHospital : placesResults) {
                // Avoid duplicating a seed hospital already in the list
                boolean duplicate = scored.stream()
                        .anyMatch(s -> isSameHospital(s, placesHospital));
                if (duplicate) continue;

                // Score Places result: distance + open + rating only (insurance unknown)
                scorePlacesHospital(placesHospital, provider);
                scored.add(placesHospital);
            }
        }

        if (scored.isEmpty()) {
            return new HospitalListResponse(
                    List.of(), searchLocation, provider, plan, 0, 0);
        }

        // 4. Sort by matchScore descending, then distance as tiebreaker
        scored.sort(Comparator
                .comparingInt(Hospital::getMatchScore).reversed()
                .thenComparingDouble(Hospital::getDistanceMiles));

        // 5. Take top 10
        List<Hospital> top = scored.stream().limit(10).toList();

        // 6. Gemini enrichment — write a coverage note for each hospital
        if (apiKey != null && !apiKey.isBlank()) {
            enrichWithCoverageNotes(top, provider, plan);
        }

        long inNetworkCount = top.stream().filter(h -> Boolean.TRUE.equals(h.getInNetwork())).count();

        return new HospitalListResponse(
                top, searchLocation, provider, plan, top.size(), (int) inNetworkCount);
    }

    // ─── Scoring ────────────────────────────────────────────────────────────

    private Hospital scoreSeedHospital(SeedHospital seed, String provider, String plan, double distMiles) {
        int score = 0;
        List<String> reasons = new ArrayList<>();
        Boolean inNetwork = false;

        // Insurance matching (case-insensitive substring)
        String plans = seed.acceptedPlans().toLowerCase();
        if (plan != null && !plan.isBlank() && plans.contains(plan.toLowerCase())) {
            score += SCORE_EXACT_PLAN;
            inNetwork = true;
            reasons.add("Exact plan match: " + plan);
        } else if (provider != null && !provider.isBlank() && plans.contains(provider.toLowerCase())) {
            score += SCORE_PROVIDER;
            inNetwork = true;
            reasons.add("In-network: " + provider);
        } else if (plans.contains("self-pay")) {
            reasons.add("Accepts self-pay");
        }

        // Distance scoring
        score += distanceScore(distMiles, reasons);

        // Rating bonus
        score += ratingScore(seed.rating(), reasons);

        return Hospital.builder()
                .id(seed.id())
                .name(seed.name())
                .address(seed.address())
                .lat(seed.lat())
                .lng(seed.lng())
                .phone(seed.phone())
                .website(seed.website())
                .type(seed.type())
                .rating(seed.rating())
                .userRatingsTotal(0)
                .isOpenNow(false)           // Seed data doesn't have live hours
                .distanceMiles(Math.round(distMiles * 10.0) / 10.0)
                .inNetwork(inNetwork)
                .estimatedWaitTime(seed.estimatedWaitTime())
                .matchScore(score)
                .matchReason(String.join("; ", reasons))
                .googleMapsUrl("https://www.google.com/maps/search/?api=1&query="
                        + seed.name().replace(" ", "+") + "+" + seed.address().replace(" ", "+"))
                .build();
    }

    private void scorePlacesHospital(Hospital h, String provider) {
        int score = 0;
        List<String> reasons = new ArrayList<>();

        // Distance scoring (Places hospitals have distance already set)
        score += distanceScore(h.getDistanceMiles(), reasons);

        // Open now bonus
        if (h.isOpenNow()) {
            score += SCORE_OPEN_NOW;
            reasons.add("Open now");
        }

        // Rating bonus
        score += ratingScore(h.getRating(), reasons);

        // Insurance is unknown for Places results — leave inNetwork as null
        if (provider != null && !provider.isBlank()) {
            reasons.add("Insurance acceptance unverified");
        }

        h.setMatchScore(score);
        h.setMatchReason(String.join("; ", reasons));
    }

    private int distanceScore(double distMiles, List<String> reasons) {
        String distStr = String.format("%.1f mi away", distMiles);
        reasons.add(distStr);
        if (distMiles < 2)  return SCORE_DIST_VERY_NEAR;
        if (distMiles < 5)  return SCORE_DIST_NEAR;
        if (distMiles < 10) return SCORE_DIST_MEDIUM;
        return SCORE_DIST_FAR;
    }

    private int ratingScore(double rating, List<String> reasons) {
        if (rating >= 4.5) {
            reasons.add("Highly rated (" + rating + "★)");
            return SCORE_HIGH_RATING;
        }
        if (rating >= 4.0) {
            return SCORE_GOOD_RATING;
        }
        return 0;
    }

    // ─── Gemini enrichment ──────────────────────────────────────────────────

    /**
     * Calls Gemini to write a one-sentence insurance coverage note per hospital.
     * Seed hospitals pass their known inNetwork status so Gemini writes accurate notes.
     * Places hospitals are marked as unknown so Gemini makes an educated estimate.
     * No Google Search grounding — uses Gemini's training knowledge (much faster).
     */
    private void enrichWithCoverageNotes(List<Hospital> hospitals, String provider, String plan) {
        try {
            String planDesc = (plan != null && !plan.isBlank())
                    ? provider + " (" + plan + ")"
                    : provider;

            StringBuilder hospitalList = new StringBuilder();
            for (int i = 0; i < hospitals.size(); i++) {
                Hospital h = hospitals.get(i);
                String networkStatus = Boolean.TRUE.equals(h.getInNetwork())  ? "IN-NETWORK"
                        : Boolean.FALSE.equals(h.getInNetwork()) ? "OUT-OF-NETWORK"
                        : "UNKNOWN";
                hospitalList.append(String.format("%d. %s — %s — Insurance: %s%n",
                        i + 1, h.getName(), h.getType(), networkStatus));
            }

            String prompt = """
                    You are a helpful healthcare insurance advisor. \
                    A patient has %s health insurance.

                    For each hospital below, write ONE concise sentence (max 25 words) \
                    about their likely insurance coverage situation. \
                    For IN-NETWORK hospitals, confirm it warmly. \
                    For OUT-OF-NETWORK, advise them to call first. \
                    For UNKNOWN, give your best estimate based on the hospital system's \
                    typical insurance contracts.

                    Hospitals:
                    %s
                    Respond ONLY with valid JSON, no markdown:
                    {"notes": ["note for 1", "note for 2", ...]}
                    """.formatted(planDesc, hospitalList);

            Map<String, Object> requestBody = Map.of(
                    "contents", List.of(Map.of(
                            "role", "user",
                            "parts", List.of(Map.of("text", prompt))
                    )),
                    "generationConfig", Map.of(
                            "temperature", 0.2,
                            "maxOutputTokens", 800
                    )
            );

            String responseJson = geminiWebClient.post()
                    .uri("/{model}:generateContent?key={key}", hospitalModel, apiKey)
                    .bodyValue(requestBody)
                    .retrieve()
                    .bodyToMono(String.class)
                    .block();

            applyNotes(hospitals, responseJson);

        } catch (Exception e) {
            log.warn("Gemini coverage enrichment failed (hospitals still returned): {}", e.getMessage());
        }
    }

    private void applyNotes(List<Hospital> hospitals, String responseJson) throws Exception {
        JsonNode root = objectMapper.readTree(responseJson);
        JsonNode candidates = root.path("candidates");
        if (candidates.isEmpty() || !candidates.isArray()) return;

        String text = candidates.get(0)
                .path("content").path("parts").get(0).path("text").asText(null);
        if (text == null) return;

        text = text.replaceAll("```json\\s*", "").replaceAll("```\\s*", "").trim();
        int start = text.indexOf('{');
        int end   = text.lastIndexOf('}');
        if (start == -1 || end == -1) return;

        JsonNode parsed = objectMapper.readTree(text.substring(start, end + 1));
        JsonNode notes = parsed.path("notes");
        if (!notes.isArray()) return;

        for (int i = 0; i < Math.min(notes.size(), hospitals.size()); i++) {
            String note = notes.get(i).asText(null);
            if (note != null && !note.isBlank()) {
                hospitals.get(i).setInsuranceNote(note);
            }
        }
    }

    // ─── Utilities ──────────────────────────────────────────────────────────

    /** Fuzzy duplicate check: same name prefix or coordinates within ~100m */
    private boolean isSameHospital(Hospital seed, Hospital places) {
        double latDiff = Math.abs(seed.getLat() - places.getLat());
        double lngDiff = Math.abs(seed.getLng() - places.getLng());
        if (latDiff < 0.001 && lngDiff < 0.001) return true;

        String seedName  = seed.getName().toLowerCase().replaceAll("[^a-z]", "");
        String placeName = places.getName().toLowerCase().replaceAll("[^a-z]", "");
        return seedName.length() > 5 && (seedName.contains(placeName.substring(0, Math.min(8, placeName.length())))
                || placeName.contains(seedName.substring(0, Math.min(8, seedName.length()))));
    }

    private double haversine(double lat1, double lon1, double lat2, double lon2) {
        double R = 3958.8;
        double dLat = Math.toRadians(lat2 - lat1);
        double dLon = Math.toRadians(lon2 - lon1);
        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                * Math.sin(dLon / 2) * Math.sin(dLon / 2);
        return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    }
}
