package com.clinica.model.domain;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class Hospital {
    private String id;                  // Google Places ID
    private String name;
    private String address;
    private double lat;
    private double lng;
    private String phone;
    private double rating;
    private int userRatingsTotal;
    private String type;                // "Hospital", "Urgent Care", etc.
    private boolean isOpenNow;
    private double distanceMiles;
    private Boolean acceptsInsurance;   // null = unknown, true/false = verified
    private String insuranceNote;       // Gemini-generated insurance note
    private String website;
    private String googleMapsUrl;       // Deep link: maps.google.com/maps/place/?q=place_id:...
}
