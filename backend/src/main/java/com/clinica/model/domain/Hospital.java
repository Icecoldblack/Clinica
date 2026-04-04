package com.clinica.model.domain;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class Hospital {
    private String id;
    private String name;
    private String address;
    private double lat;
    private double lng;
    private String phone;
    private double rating;
    private int userRatingsTotal;
    private String type;                // "Hospital", "Urgent Care", "Level I Trauma Center", etc.

    @JsonProperty("isOpenNow")          // Prevent Jackson from stripping the "is" prefix
    private boolean isOpenNow;

    private double distanceMiles;

    @JsonProperty("acceptsInsurance")   // Frontend expects acceptsInsurance, not inNetwork
    private Boolean inNetwork;

    private String insuranceNote;       // Gemini-generated note about coverage
    private String website;
    private String googleMapsUrl;
    private String estimatedWaitTime;   // e.g. "~25 min" — from seed data only
    private int matchScore;             // Computed ranking score
    private String matchReason;         // Human-readable reasons, semicolon-separated
}
