package com.clinica.model.request;

import lombok.Data;

@Data
public class ClinicFilterRequest {
    private double lat;
    private double lng;
    private int radius = 10;
    private boolean noInsurance;
    private boolean noDocuments;
    private boolean mentalHealth;
}
