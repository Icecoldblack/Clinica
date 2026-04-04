package com.clinica.model.response;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ChatResponse {
    private String sessionId;
    private String response;
    private boolean suggestClinics;
}
