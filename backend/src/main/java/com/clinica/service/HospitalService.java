package com.clinica.service;

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
import java.util.List;
import java.util.Map;

@Service
@Slf4j
public class HospitalService {

    // Atlanta city center — used when all location resolution fails
    private static final double FALLBACK_LAT = 33.749;
    private static final double FALLBACK_LNG = -84.388;

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
            @Value("${gemini.hospital.model:gemini-2.5-flash}") String hospitalModel) {
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
            if (coords != null) {
                lat = coords[0];
                lng = coords[1];
            } else {
                log.warn("Geocoding failed for ZIP {}, falling back to Atlanta", request.getZipCode());
                lat = FALLBACK_LAT;
                lng = FALLBACK_LNG;
            }
            searchLocation = request.getZipCode();
        } else {
            lat = FALLBACK_LAT;
            lng = FALLBACK_LNG;
            searchLocation = "Atlanta, GA";
        }

        // 2. Find nearby hospitals via Google Places
        List<Hospital> hospitals;
        if (placesService.isAvailable()) {
            hospitals = placesService.findNearbyHospitals(lat, lng, request.getRadiusMiles(), 10);
        } else {
            log.warn("Google Maps API not configured — returning empty hospital list");
            hospitals = new ArrayList<>();
        }

        if (hospitals.isEmpty()) {
            return new HospitalListResponse(
                    List.of(), searchLocation,
                    request.getInsuranceProvider(), request.getPlanName(), 0);
        }

        // 3. Enrich with insurance acceptance info via Gemini + Google Search grounding
        if (request.getInsuranceProvider() != null && !request.getInsuranceProvider().isBlank()
                && apiKey != null && !apiKey.isBlank()) {
            enrichWithInsuranceInfo(hospitals, request.getInsuranceProvider(),
                    request.getPlanName(), searchLocation);
        }

        return new HospitalListResponse(
                hospitals, searchLocation,
                request.getInsuranceProvider(), request.getPlanName(), hospitals.size());
    }

    /**
     * Calls Gemini with Google Search grounding to verify insurance acceptance for each hospital.
     * Mutates each Hospital object in-place to set acceptsInsurance and insuranceNote.
     */
    private void enrichWithInsuranceInfo(List<Hospital> hospitals, String insuranceProvider,
                                          String planName, String location) {
        try {
            StringBuilder hospitalList = new StringBuilder();
            for (int i = 0; i < hospitals.size(); i++) {
                Hospital h = hospitals.get(i);
                hospitalList.append(String.format("%d. %s — %s%n", i + 1, h.getName(), h.getAddress()));
            }

            String planDescription = (planName != null && !planName.isBlank())
                    ? insuranceProvider + " (" + planName + ")"
                    : insuranceProvider;

            String prompt = """
                    A patient near %s has %s health insurance. \
                    They need to know which of the following hospitals/health facilities accept this insurance.

                    Use Google Search to look up each hospital's insurance acceptance policy. \
                    For each facility, determine:
                    - acceptsInsurance: true if they accept %s, false if they don't, null if you cannot determine
                    - note: one sentence (max 25 words) summarizing insurance acceptance for this patient

                    Hospitals:
                    %s
                    Respond ONLY with valid JSON, no markdown:
                    {
                      "results": [
                        { "index": 1, "acceptsInsurance": true, "note": "..." },
                        { "index": 2, "acceptsInsurance": null, "note": "..." }
                      ]
                    }
                    """.formatted(location, planDescription, planDescription, hospitalList);

            Map<String, Object> requestBody = Map.of(
                    "tools", List.of(Map.of("google_search", Map.of())),
                    "contents", List.of(Map.of(
                            "role", "user",
                            "parts", List.of(Map.of("text", prompt))
                    )),
                    "generationConfig", Map.of(
                            "temperature", 0.1,
                            "maxOutputTokens", 2048
                    )
            );

            String responseJson = geminiWebClient.post()
                    .uri("/{model}:generateContent?key={key}", hospitalModel, apiKey)
                    .bodyValue(requestBody)
                    .retrieve()
                    .bodyToMono(String.class)
                    .block();

            applyEnrichmentToHospitals(hospitals, responseJson);

        } catch (Exception e) {
            log.warn("Gemini insurance enrichment failed, returning hospitals without insurance info: {}",
                    e.getMessage());
            // Leave acceptsInsurance as null — frontend should handle gracefully
        }
    }

    private void applyEnrichmentToHospitals(List<Hospital> hospitals, String responseJson) throws Exception {
        JsonNode root = objectMapper.readTree(responseJson);
        JsonNode candidates = root.path("candidates");
        if (candidates.isEmpty() || !candidates.isArray()) return;

        String text = candidates.get(0)
                .path("content").path("parts").get(0).path("text").asText(null);
        if (text == null) return;

        // Strip markdown code fences if present
        text = text.replaceAll("```json\\s*", "").replaceAll("```\\s*", "").trim();

        // Gemini with Google Search sometimes wraps the answer in extra text — extract the JSON block
        int start = text.indexOf('{');
        int end = text.lastIndexOf('}');
        if (start == -1 || end == -1) return;
        text = text.substring(start, end + 1);

        JsonNode parsed = objectMapper.readTree(text);
        JsonNode results = parsed.path("results");
        if (!results.isArray()) return;

        for (JsonNode result : results) {
            int index = result.path("index").asInt(-1);
            if (index < 1 || index > hospitals.size()) continue;

            Hospital hospital = hospitals.get(index - 1);
            JsonNode acceptsNode = result.path("acceptsInsurance");
            Boolean accepts = acceptsNode.isNull() ? null : acceptsNode.asBoolean();
            String note = result.path("note").asText(null);

            hospital.setAcceptsInsurance(accepts);
            hospital.setInsuranceNote(note);
        }
    }
}
