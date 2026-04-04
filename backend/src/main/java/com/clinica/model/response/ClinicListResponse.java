package com.clinica.model.response;

import com.clinica.model.domain.Clinic;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class ClinicListResponse {
    private List<Clinic> clinics;
}
