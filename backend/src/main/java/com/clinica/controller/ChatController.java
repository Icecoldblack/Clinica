package com.clinica.controller;

import com.clinica.model.request.ChatRequest;
import com.clinica.model.request.SessionSummaryRequest;
import com.clinica.model.response.ChatResponse;
import com.clinica.model.response.SessionSummaryResponse;
import com.clinica.service.GeminiService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class ChatController {

    private final GeminiService geminiService;

    @PostMapping("/chat")
    public ResponseEntity<?> chat(@Valid @RequestBody ChatRequest request) {
        try {
            ChatResponse response = geminiService.chat(request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(502)
                    .body(Map.of("error", "AI service is temporarily unavailable. Please try again."));
        }
    }

    @PostMapping("/chat/summarize")
    public ResponseEntity<SessionSummaryResponse> summarizeSession(@RequestBody SessionSummaryRequest request) {
        SessionSummaryResponse response = geminiService.summarizeSession(request);
        return ResponseEntity.ok(response);
    }
}
