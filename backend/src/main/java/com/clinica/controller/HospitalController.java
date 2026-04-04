package com.clinica.controller;

import com.clinica.model.request.HospitalSearchRequest;
import com.clinica.model.response.HospitalListResponse;
import com.clinica.service.HospitalService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class HospitalController {

    private final HospitalService hospitalService;

    @PostMapping("/hospitals/search")
    public ResponseEntity<?> searchHospitals(@Valid @RequestBody HospitalSearchRequest request) {
        if ((request.getZipCode() == null || request.getZipCode().isBlank())
                && (request.getLat() == null || request.getLng() == null)) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Either zipCode or lat+lng is required"));
        }

        try {
            HospitalListResponse response = hospitalService.searchHospitals(request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(502)
                    .body(Map.of("error", "Hospital search is temporarily unavailable. Please try again."));
        }
    }
}
