package com.clinica.controller;

import com.clinica.model.request.ClinicFilterRequest;
import com.clinica.model.response.ClinicListResponse;
import com.clinica.service.HrsaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class ClinicController {

    private final HrsaService hrsaService;

    @GetMapping("/clinics")
    public ResponseEntity<ClinicListResponse> getClinics(
            @RequestParam double lat,
            @RequestParam double lng,
            @RequestParam(defaultValue = "10") int radius,
            @RequestParam(defaultValue = "false") boolean noInsurance,
            @RequestParam(defaultValue = "false") boolean noDocuments,
            @RequestParam(defaultValue = "false") boolean mentalHealth) {

        ClinicFilterRequest request = new ClinicFilterRequest();
        request.setLat(lat);
        request.setLng(lng);
        request.setRadius(radius);
        request.setNoInsurance(noInsurance);
        request.setNoDocuments(noDocuments);
        request.setMentalHealth(mentalHealth);

        ClinicListResponse response = hrsaService.getClinics(request);
        return ResponseEntity.ok(response);
    }
}
