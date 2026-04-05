package com.clinica.model.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class HospitalSearchRequest {

    // At least one of zipCode or lat+lng must be provided
    private String zipCode;
    private Double lat;
    private Double lng;

    @NotBlank(message = "Insurance provider is required")
    private String insuranceProvider;

    private String planName;            // Optional — specific plan within the provider

    private int radiusMiles = 10;       // Default search radius

    private Integer age;                // Patient age — used to filter age-inappropriate hospitals (e.g. children's-only)
}
