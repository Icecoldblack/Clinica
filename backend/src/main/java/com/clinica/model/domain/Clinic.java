package com.clinica.model.domain;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class Clinic {
    private String id;
    private String name;
    private String address;
    private double lat;
    private double lng;
    private String phone;
    private boolean isFqhc;
    private boolean acceptsUninsured;
    private boolean hasMentalHealth;
    private double distanceMiles;
    private String hoursDisplay;
}
