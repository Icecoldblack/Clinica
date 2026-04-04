package com.medapath.backend.dto;

import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HospitalMatchResponse {

    private Long sessionId;
    private String diagnosis;
    private String urgencyLevel;
    private Double patientLatitude;
    private Double patientLongitude;
    private List<HospitalDto> hospitals;
}
