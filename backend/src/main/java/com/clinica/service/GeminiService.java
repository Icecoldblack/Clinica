package com.clinica.service;

import com.clinica.model.domain.ChatMessage;
import com.clinica.model.request.ChatRequest;
import com.clinica.model.request.SessionSummaryRequest;
import com.clinica.model.response.ChatResponse;
import com.clinica.model.response.SessionSummaryResponse;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.*;

@Service
@Slf4j
public class GeminiService {

    private final WebClient geminiWebClient;
    private final ObjectMapper objectMapper;
    private final String apiKey;
    private final String model;

    public GeminiService(
            @Qualifier("geminiWebClient") WebClient geminiWebClient,
            @Value("${gemini.api.key:}") String apiKey,
            @Value("${gemini.model:gemini-3-flash-preview}") String model) {
        this.geminiWebClient = geminiWebClient;
        this.apiKey = apiKey;
        this.model = model;
        this.objectMapper = new ObjectMapper();
    }

    public ChatResponse chat(ChatRequest request) {
        String sessionId = request.getSessionId();
        if (sessionId == null || sessionId.isBlank()) {
            sessionId = UUID.randomUUID().toString();
        }

        String systemPrompt = buildSystemPrompt(request.getLanguage(), request.getSituation());

        // Build contents array from history + current message
        List<Map<String, Object>> contents = new ArrayList<>();

        // Add history
        List<ChatMessage> history = request.getHistory();
        if (history != null) {
            for (ChatMessage msg : history) {
                contents.add(Map.of(
                        "role", msg.getRole(),
                        "parts", List.of(Map.of("text", msg.getContent()))
                ));
            }
        }

        // Add current user message
        contents.add(Map.of(
                "role", "user",
                "parts", List.of(Map.of("text", request.getMessage()))
        ));

        Map<String, Object> chatGenConfig = new java.util.HashMap<>();
        chatGenConfig.put("temperature", 0.7);
        chatGenConfig.put("maxOutputTokens", 4096);
        chatGenConfig.put("thinkingConfig", Map.of("thinkingBudget", 0));

        Map<String, Object> requestBody = Map.of(
                "system_instruction", Map.of(
                        "parts", List.of(Map.of("text", systemPrompt))
                ),
                "contents", contents,
                "generationConfig", chatGenConfig
        );

        try {
            String responseJson = geminiWebClient.post()
                    .uri("/{model}:generateContent?key={key}", model, apiKey)
                    .bodyValue(requestBody)
                    .retrieve()
                    .bodyToMono(String.class)
                    .block();

            String responseText = extractResponseText(responseJson);
            boolean suggestClinics = detectClinicSuggestion(responseText);

            return new ChatResponse(sessionId, responseText, suggestClinics);
        } catch (Exception e) {
            log.error("Gemini API call failed", e);
            throw new RuntimeException("Gemini API call failed: " + e.getMessage(), e);
        }
    }

    public SessionSummaryResponse summarizeSession(SessionSummaryRequest request) {
        String sessionId = request.getSessionId();
        if (sessionId == null || sessionId.isBlank()) {
            sessionId = "unknown";
        }

        // Build a flat transcript for Gemini
        StringBuilder transcript = new StringBuilder();
        List<ChatMessage> history = request.getHistory();
        if (history != null) {
            for (ChatMessage msg : history) {
                String label = "user".equals(msg.getRole()) ? "Patient" : "Clínica AI";
                transcript.append(label).append(": ").append(msg.getContent()).append("\n");
            }
        }

        String lang = "es".equalsIgnoreCase(request.getLanguage()) ? "Spanish" : "English";

        String prompt = """
                You are summarizing a health triage conversation between a patient and the Clínica AI assistant.

                CONVERSATION TRANSCRIPT:
                %s

                Respond with ONLY a JSON object in this exact format (no markdown, no code fences, no explanation):
                {
                  "title": "Short 3-6 word title describing the health concern in %s",
                  "summary": "1-2 sentence plain-language summary of the conversation and any guidance given, in %s",
                  "severity": "low|moderate|high|crisis",
                  "tags": ["tag1", "tag2", "tag3"]
                }

                RULES for severity:
                - "low" = general wellness question, mild symptoms
                - "moderate" = symptoms that warrant a clinic visit
                - "high" = symptoms that may need urgent/emergency care
                - "crisis" = mentions of self-harm, suicidal ideation, or life-threatening emergency

                RULES for tags: 2-4 short tags in %s describing the key health topics discussed (e.g. "Fever", "Cough", "Anxiety", "Urgent Care")
                """.formatted(transcript.toString(), lang, lang, lang);

        List<Map<String, Object>> contents = List.of(
                Map.of("role", "user", "parts", List.of(Map.of("text", prompt)))
        );

        Map<String, Object> summaryGenConfig = new java.util.HashMap<>();
        summaryGenConfig.put("temperature", 0.3);
        summaryGenConfig.put("maxOutputTokens", 2048);
        summaryGenConfig.put("thinkingConfig", Map.of("thinkingBudget", 0));

        Map<String, Object> requestBody = Map.of(
                "contents", contents,
                "generationConfig", summaryGenConfig
        );

        try {
            String responseJson = geminiWebClient.post()
                    .uri("/{model}:generateContent?key={key}", model, apiKey)
                    .bodyValue(requestBody)
                    .retrieve()
                    .bodyToMono(String.class)
                    .block();

            String responseText = extractResponseText(responseJson);

            // Strip markdown code fences if Gemini wraps the JSON
            responseText = responseText.trim();
            if (responseText.startsWith("```")) {
                responseText = responseText.replaceAll("^```[a-zA-Z]*\\n?", "").replaceAll("\\n?```$", "").trim();
            }

            JsonNode parsed = objectMapper.readTree(responseText);

            String title = parsed.path("title").asText("Health Consultation");
            String summary = parsed.path("summary").asText("Discussion about health concerns.");
            String severity = parsed.path("severity").asText("low");
            List<String> tags = new ArrayList<>();
            JsonNode tagsNode = parsed.path("tags");
            if (tagsNode.isArray()) {
                for (JsonNode tag : tagsNode) {
                    tags.add(tag.asText());
                }
            }

            return new SessionSummaryResponse(sessionId, title, summary, severity, tags);
        } catch (Exception e) {
            log.error("Session summary generation failed", e);
            // Return a graceful fallback instead of crashing
            return new SessionSummaryResponse(
                    sessionId,
                    "Health Consultation",
                    "A triage conversation was conducted.",
                    "low",
                    List.of("General")
            );
        }
    }

    private String extractResponseText(String responseJson) throws Exception {
        JsonNode root = objectMapper.readTree(responseJson);
        JsonNode candidates = root.path("candidates");
        if (candidates.isEmpty() || !candidates.isArray()) {
            throw new RuntimeException("Gemini returned no candidates");
        }

        String text = candidates.get(0)
                .path("content")
                .path("parts")
                .get(0)
                .path("text")
                .asText(null);

        if (text == null) {
            throw new RuntimeException("Gemini response text was null");
        }

        return text;
    }

    private boolean detectClinicSuggestion(String responseText) {
        String lower = responseText.toLowerCase();
        return lower.contains("find a clinic")
                || lower.contains("encontrar una cl\u00ednica")
                || lower.contains("health center")
                || lower.contains("centro de salud");
    }

    private String buildSystemPrompt(String language, String situation) {
        String languageName = "es".equalsIgnoreCase(language) ? "Spanish" : "English";
        String situationDescription = getSituationDescription(situation);
        String situationBlock = getSituationBlock(situation);

        return """
                You are Cl\u00ednica, a compassionate and culturally competent AI health navigator \
                helping members of the Hispanic/Latino community in the United States.

                LANGUAGE RULE: You MUST respond only in %s. Do not switch languages.

                SITUATION: This user has indicated: %s

                YOUR ROLE:
                - Provide plain-language, accessible health information. No medical jargon.
                - Never diagnose. Never prescribe medication.
                - Be warm, calm, and non-judgmental at all times.

                CONVERSATION FLOW — follow this progression:
                1. First 1-2 exchanges: ask ONE focused clarifying question to understand the concern better.
                2. After 2-3 exchanges, or once you have a reasonable picture of the issue: stop asking \
                questions and shift to giving concrete, actionable guidance.
                3. If in-person care seems appropriate, recommend finding a clinic in that same response.
                Do NOT keep asking follow-up questions once you have enough context — the user came for \
                help, not an endless intake form.

                SITUATION-SPECIFIC INSTRUCTIONS:
                %s

                CLINIC REFERRAL: When you believe the user should seek in-person care, \
                include the exact phrase "encontrar una cl\u00ednica" (if in Spanish) or \
                "find a clinic" (if in English) somewhere in your response.

                NEVER ask for: name, address, ID, insurance card number, immigration status.\
                """.formatted(languageName, situationDescription, situationBlock);
    }

    private String getSituationDescription(String situation) {
        return switch (situation) {
            case "no_insurance" -> "They do not have health insurance and need affordable care.";
            case "undocumented" -> "They are worried about their immigration status affecting their care.";
            case "mental_health" -> "They are seeking mental health support.";
            case "insured" -> "They have health insurance but need guidance navigating the system.";
            default -> "They need general health guidance.";
        };
    }

    private String getSituationBlock(String situation) {
        return switch (situation) {
            case "no_insurance" ->
                    "Reassure them early that there are free and sliding-scale clinics available. Focus on guiding them toward community health resources.";
            case "undocumented" ->
                    "In your FIRST response only, include one brief reassurance that federally funded health centers (FQHCs) serve all patients regardless of immigration status and will not report them. After that, do NOT mention immigration status again unless the user explicitly raises it themselves.";
            case "mental_health" ->
                    "Use trauma-informed, non-stigmatizing language. Normalize seeking help. If they express crisis or self-harm, gently direct them to the 988 Suicide and Crisis Lifeline.";
            case "insured" ->
                    "Help them understand how to use their coverage, what is typically covered, and how to find in-network providers.";
            default -> "Provide general health guidance and direct them to appropriate resources.";
        };
    }
}
