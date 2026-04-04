package com.clinica.model.response;

import com.clinica.model.domain.Hospital;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ChatResponse {
    private String sessionId;
    private String response;
    private boolean suggestClinics;

    // ── Embedded hospital results (populated when AI suggests seeking care) ──
    private List<Hospital> hospitals;       // Top 3-5 matched hospitals, null if not applicable
    private String detectedCondition;       // What the AI thinks the user needs care for
    private String hospitalSearchContext;   // Short string for deep-linking: "hepatitis treatment near 30309"
    private String searchInsurance;         // The insurance used for hospital search (may differ from profile)
    private String searchPlan;              // The plan used for hospital search
}
