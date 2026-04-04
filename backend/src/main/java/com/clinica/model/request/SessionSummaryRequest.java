package com.clinica.model.request;

import com.clinica.model.domain.ChatMessage;
import lombok.Data;

import java.util.List;

@Data
public class SessionSummaryRequest {
    private String sessionId;
    private String language;       // "en" | "es"
    private String situation;      // "no_insurance" | "undocumented" | "mental_health" | "insured"
    private List<ChatMessage> history;
}
