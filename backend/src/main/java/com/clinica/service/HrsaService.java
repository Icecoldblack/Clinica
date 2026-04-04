package com.clinica.service;

import com.clinica.model.domain.Clinic;
import com.clinica.model.request.ClinicFilterRequest;
import com.clinica.model.response.ClinicListResponse;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

@Service
@Slf4j
public class HrsaService {

    private final WebClient hrsaWebClient;
    private final ObjectMapper objectMapper;

    private static final List<Clinic> FALLBACK_CLINICS = List.of(
            Clinic.builder()
                    .id("hrsa-fallback-1")
                    .name("Grady Health System Community Health Center")
                    .address("800 Jesse Hill Jr Dr SE, Atlanta, GA 30315")
                    .lat(33.7473).lng(-84.3733)
                    .phone("(404) 616-1000")
                    .isFqhc(true).acceptsUninsured(true).hasMentalHealth(true)
                    .hoursDisplay("Mon\u2013Fri 8am\u20135pm")
                    .build(),
            Clinic.builder()
                    .id("hrsa-fallback-2")
                    .name("Fulton County Department of Health and Wellness")
                    .address("137 Peachtree Memorial Dr NW, Atlanta, GA 30309")
                    .lat(33.7939).lng(-84.3909)
                    .phone("(404) 730-1205")
                    .isFqhc(true).acceptsUninsured(true).hasMentalHealth(false)
                    .hoursDisplay("Mon\u2013Fri 8am\u20135pm")
                    .build(),
            Clinic.builder()
                    .id("hrsa-fallback-3")
                    .name("Georgia CARE Project")
                    .address("1764 Georgian Terrace, Atlanta, GA 30309")
                    .lat(33.7893).lng(-84.3831)
                    .phone("(404) 874-7926")
                    .isFqhc(true).acceptsUninsured(true).hasMentalHealth(true)
                    .hoursDisplay("Mon\u2013Fri 9am\u20134pm")
                    .build()
    );

    public HrsaService(@Qualifier("hrsaWebClient") WebClient hrsaWebClient) {
        this.hrsaWebClient = hrsaWebClient;
        this.objectMapper = new ObjectMapper();
    }

    public ClinicListResponse getClinics(ClinicFilterRequest request) {
        try {
            String responseJson = hrsaWebClient.get()
                    .uri(uriBuilder -> uriBuilder
                            .path("/api/findahealthcenter")
                            .queryParam("latitude", request.getLat())
                            .queryParam("longitude", request.getLng())
                            .queryParam("radius", request.getRadius())
                            .queryParam("ssd", request.isMentalHealth())
                            .build())
                    .retrieve()
                    .bodyToMono(String.class)
                    .block();

            List<Clinic> clinics = parseHrsaResponse(responseJson, request);
            return new ClinicListResponse(clinics);
        } catch (Exception e) {
            log.warn("HRSA API call failed, returning fallback clinics: {}", e.getMessage());
            return getFallbackClinics(request);
        }
    }

    private List<Clinic> parseHrsaResponse(String responseJson, ClinicFilterRequest request) throws Exception {
        JsonNode root = objectMapper.readTree(responseJson);
        List<Clinic> clinics = new ArrayList<>();

        // HRSA may return results under different keys depending on version
        JsonNode results = root;
        if (root.has("results")) {
            results = root.get("results");
        } else if (root.has("healthCenters")) {
            results = root.get("healthCenters");
        }

        if (results.isArray()) {
            for (JsonNode node : results) {
                Clinic clinic = mapHrsaNode(node, request.getLat(), request.getLng());

                // Apply filters
                if (request.isNoInsurance() && !clinic.isAcceptsUninsured()) {
                    continue;
                }
                if (request.isMentalHealth() && !clinic.isHasMentalHealth()) {
                    continue;
                }

                clinics.add(clinic);
            }
        }

        // Sort by distance
        clinics.sort(Comparator.comparingDouble(Clinic::getDistanceMiles));
        return clinics;
    }

    private Clinic mapHrsaNode(JsonNode node, double userLat, double userLng) {
        String id = "hrsa-" + getTextOrDefault(node, "bhk", getTextOrDefault(node, "id", "unknown"));
        String name = getTextOrDefault(node, "site_name", getTextOrDefault(node, "name", "Health Center"));

        // Build address from parts or use single field
        String address;
        if (node.has("site_address")) {
            String street = getTextOrDefault(node, "site_address", "");
            String city = getTextOrDefault(node, "site_city", "");
            String state = getTextOrDefault(node, "site_state_abbreviation", "");
            String zip = getTextOrDefault(node, "site_postal_code", "");
            address = String.format("%s, %s, %s %s", street, city, state, zip).trim();
        } else {
            address = getTextOrDefault(node, "address", "Address unavailable");
        }

        double lat = node.path("latitude").asDouble(0);
        double lng = node.path("longitude").asDouble(0);
        String phone = getTextOrDefault(node, "site_telephone_number",
                getTextOrDefault(node, "phone", ""));

        boolean acceptsUninsured = node.path("sliding_fee_scale").asBoolean(true);
        boolean hasMentalHealth = node.path("behavioral_health").asBoolean(false)
                || node.path("substance_use_disorder_services").asBoolean(false);

        String hours = getTextOrDefault(node, "hours", null);

        double distance = haversineDistance(userLat, userLng, lat, lng);

        return Clinic.builder()
                .id(id)
                .name(name)
                .address(address)
                .lat(lat)
                .lng(lng)
                .phone(phone)
                .isFqhc(true)
                .acceptsUninsured(acceptsUninsured)
                .hasMentalHealth(hasMentalHealth)
                .distanceMiles(Math.round(distance * 10.0) / 10.0)
                .hoursDisplay(hours)
                .build();
    }

    private ClinicListResponse getFallbackClinics(ClinicFilterRequest request) {
        List<Clinic> clinics = new ArrayList<>();
        for (Clinic fallback : FALLBACK_CLINICS) {
            double distance = haversineDistance(request.getLat(), request.getLng(),
                    fallback.getLat(), fallback.getLng());
            clinics.add(Clinic.builder()
                    .id(fallback.getId())
                    .name(fallback.getName())
                    .address(fallback.getAddress())
                    .lat(fallback.getLat())
                    .lng(fallback.getLng())
                    .phone(fallback.getPhone())
                    .isFqhc(true)
                    .acceptsUninsured(true)
                    .hasMentalHealth(fallback.isHasMentalHealth())
                    .distanceMiles(Math.round(distance * 10.0) / 10.0)
                    .hoursDisplay(fallback.getHoursDisplay())
                    .build());
        }
        clinics.sort(Comparator.comparingDouble(Clinic::getDistanceMiles));
        return new ClinicListResponse(clinics);
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

    private String getTextOrDefault(JsonNode node, String field, String defaultValue) {
        JsonNode value = node.path(field);
        if (value.isMissingNode() || value.isNull()) {
            return defaultValue;
        }
        return value.asText(defaultValue);
    }
}
