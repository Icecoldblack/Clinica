package com.clinica.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

@Service
@Slf4j
public class GeocodingService {

    private final WebClient mapsWebClient;
    private final ObjectMapper objectMapper;
    private final String apiKey;

    public GeocodingService(
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
     * Convert a ZIP code or address string to lat/lng coordinates.
     * Returns null if geocoding fails or API key is not configured.
     */
    public double[] geocode(String addressOrZip) {
        if (!isAvailable()) {
            log.info("Google Maps API key not configured, skipping geocoding");
            return null;
        }

        try {
            String responseJson = mapsWebClient.get()
                    .uri(uriBuilder -> uriBuilder
                            .path("/geocode/json")
                            .queryParam("address", addressOrZip)
                            .queryParam("key", apiKey)
                            .build())
                    .retrieve()
                    .bodyToMono(String.class)
                    .block();

            JsonNode root = objectMapper.readTree(responseJson);
            String status = root.path("status").asText();

            if (!"OK".equals(status)) {
                log.warn("Geocoding returned status {} for: {}", status, addressOrZip);
                return null;
            }

            JsonNode results = root.path("results");
            if (!results.isArray() || results.isEmpty()) {
                log.warn("No geocoding results for: {}", addressOrZip);
                return null;
            }

            JsonNode location = results.get(0).path("geometry").path("location");
            double lat = location.path("lat").asDouble();
            double lng = location.path("lng").asDouble();

            log.info("Geocoded '{}' to ({}, {})", addressOrZip, lat, lng);
            return new double[]{lat, lng};

        } catch (Exception e) {
            log.warn("Geocoding failed for '{}': {}", addressOrZip, e.getMessage());
            return null;
        }
    }
}
