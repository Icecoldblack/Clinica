package com.clinica.model.response;

import com.clinica.model.domain.Hospital;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class HospitalListResponse {
    private List<Hospital> hospitals;
    private String searchLocation;      // ZIP code or "near you"
    private String insuranceProvider;
    private String planName;
    private int totalFound;
    private int totalInNetwork;         // Count of confirmed in-network hospitals
}
