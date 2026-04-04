package com.clinica.model.request;

import com.clinica.model.domain.ChatMessage;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.util.List;

@Data
public class ChatRequest {
    private String sessionId;

    @NotBlank(message = "Language is required")
    private String language;       // "en" | "es"

    @NotBlank(message = "Situation is required")
    private String situation;      // "no_insurance" | "undocumented" | "mental_health" | "insured"

    private List<ChatMessage> history;

    @NotBlank(message = "Message is required")
    private String message;

    // ── User profile context (passed from frontend on every request) ──

    private Integer age;

    private String insuranceProvider;   // e.g. "Aetna" — from onboarding
    private String planName;            // e.g. "Aetna PPO" — from onboarding

    private String zipCode;             // User's ZIP for hospital search
    private Double lat;                 // User's latitude (geolocation)
    private Double lng;                 // User's longitude (geolocation)
}
