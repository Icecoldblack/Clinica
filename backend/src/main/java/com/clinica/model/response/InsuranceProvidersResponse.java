package com.clinica.model.response;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class InsuranceProvidersResponse {

    private List<InsuranceProvider> providers;

    @Data
    @AllArgsConstructor
    public static class InsuranceProvider {
        private String name;
        private List<String> plans;
    }
}
