package com.clinica.model.response;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class SessionSummaryResponse {
    private String sessionId;
    private String title;          // e.g. "Respiratory & Fever Concern"
    private String summary;        // 1-2 sentence plain-language summary
    private String severity;       // "low" | "moderate" | "high" | "crisis"
    private List<String> tags;     // e.g. ["Fever", "Cough", "Urgent Care"]
}
