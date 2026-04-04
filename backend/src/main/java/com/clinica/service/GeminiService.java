package com.clinica.service;

import com.clinica.model.domain.ChatMessage;
import com.clinica.model.domain.Hospital;
import com.clinica.model.request.ChatRequest;
import com.clinica.model.request.HospitalSearchRequest;
import com.clinica.model.request.SessionSummaryRequest;
import com.clinica.model.response.ChatResponse;
import com.clinica.model.response.HospitalListResponse;
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
    private final HospitalService hospitalService;
    private final ObjectMapper objectMapper;
    private final String apiKey;
    private final String model;

    public GeminiService(
            @Qualifier("geminiWebClient") WebClient geminiWebClient,
            HospitalService hospitalService,
            @Value("${gemini.api.key:}") String apiKey,
            @Value("${gemini.model:gemini-3-flash-preview}") String model) {
        this.geminiWebClient = geminiWebClient;
        this.hospitalService = hospitalService;
        this.apiKey = apiKey;
        this.model = model;
        this.objectMapper = new ObjectMapper();
    }

    // ═══════════════════════════════════════════════════════════════════════
    //  MAIN CHAT — context-aware with embedded hospital results
    // ═══════════════════════════════════════════════════════════════════════

    public ChatResponse chat(ChatRequest request) {
        String sessionId = request.getSessionId();
        if (sessionId == null || sessionId.isBlank()) {
            sessionId = UUID.randomUUID().toString();
        }

        // Pass 1: Get the chat response from Gemini (context-aware system prompt)
        String systemPrompt = buildSystemPrompt(request);
        String responseText = callGemini(systemPrompt, request);
        boolean suggestClinics = detectClinicSuggestion(responseText);

        // If AI suggested clinics, do Pass 2: extract condition + overrides, then search hospitals
        List<Hospital> hospitals = null;
        String detectedCondition = null;
        String hospitalSearchContext = null;
        String searchInsurance = null;
        String searchPlan = null;

        if (suggestClinics && hasLocation(request)) {
            try {
                // Pass 2: quick extraction call — detects condition AND what insurance to search with
                ExtractionResult extraction = extractSearchParams(request, responseText);
                detectedCondition = extraction.condition;

                // Build hospital search with extracted insurance
                HospitalSearchRequest searchRequest = new HospitalSearchRequest();
                searchRequest.setLat(request.getLat());
                searchRequest.setLng(request.getLng());
                searchRequest.setZipCode(request.getZipCode());
                searchRequest.setRadiusMiles(15);

                // Determine insurance to search with
                if ("PROFILE".equals(extraction.searchInsurance)) {
                    searchInsurance = request.getInsuranceProvider() != null ? request.getInsuranceProvider() : "Self-pay";
                    searchPlan = request.getPlanName();
                } else {
                    searchInsurance = extraction.searchInsurance != null ? extraction.searchInsurance : "Self-pay";
                    searchPlan = extraction.searchPlan;
                }
                searchRequest.setInsuranceProvider(searchInsurance);
                searchRequest.setPlanName(searchPlan);

                HospitalListResponse result = hospitalService.searchHospitals(searchRequest);
                hospitals = result.getHospitals().stream().limit(5).toList();

                // Build deep-link context string
                String location = request.getZipCode() != null ? request.getZipCode() : "your area";
                hospitalSearchContext = (detectedCondition != null ? detectedCondition + " near " : "care near ") + location;

                log.info("Chat embedded {} hospitals for condition '{}' (searchInsurance={})",
                        hospitals.size(), detectedCondition, searchInsurance);

            } catch (Exception e) {
                log.warn("Hospital embedding failed (chat still returned): {}", e.getMessage());
            }
        }

        return ChatResponse.builder()
                .sessionId(sessionId)
                .response(responseText)
                .suggestClinics(suggestClinics)
                .hospitals(hospitals)
                .detectedCondition(detectedCondition)
                .hospitalSearchContext(hospitalSearchContext)
                .searchInsurance(searchInsurance)
                .searchPlan(searchPlan)
                .build();
    }

    // ═══════════════════════════════════════════════════════════════════════
    //  Pass 1: Chat with Gemini
    // ═══════════════════════════════════════════════════════════════════════

    private String callGemini(String systemPrompt, ChatRequest request) {
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

        Map<String, Object> genConfig = new HashMap<>();
        genConfig.put("temperature", 0.7);
        genConfig.put("maxOutputTokens", 4096);
        genConfig.put("thinkingConfig", Map.of("thinkingBudget", 0));

        Map<String, Object> requestBody = Map.of(
                "system_instruction", Map.of(
                        "parts", List.of(Map.of("text", systemPrompt))
                ),
                "contents", contents,
                "generationConfig", genConfig
        );

        try {
            String responseJson = geminiWebClient.post()
                    .uri("/{model}:generateContent?key={key}", model, apiKey)
                    .bodyValue(requestBody)
                    .retrieve()
                    .bodyToMono(String.class)
                    .block();

            return extractResponseText(responseJson);
        } catch (Exception e) {
            log.error("Gemini API call failed", e);
            throw new RuntimeException("Gemini API call failed: " + e.getMessage(), e);
        }
    }

    // ═══════════════════════════════════════════════════════════════════════
    //  Pass 2: Extract condition + detect overrides from conversation
    // ═══════════════════════════════════════════════════════════════════════

    private record ExtractionResult(String condition, String searchInsurance, String searchPlan) {}

    private ExtractionResult extractSearchParams(ChatRequest request, String aiResponse) {
        try {
            // Build a compact transcript of the last few messages + current
            StringBuilder transcript = new StringBuilder();
            List<ChatMessage> history = request.getHistory();
            if (history != null) {
                int start = Math.max(0, history.size() - 4);
                for (int i = start; i < history.size(); i++) {
                    ChatMessage msg = history.get(i);
                    transcript.append(msg.getRole()).append(": ").append(msg.getContent()).append("\n");
                }
            }
            transcript.append("user: ").append(request.getMessage()).append("\n");
            transcript.append("model: ").append(aiResponse).append("\n");

            String profileInsurance = request.getInsuranceProvider() != null
                    ? request.getInsuranceProvider() : "none on file";

            String prompt = """
                    Given this health conversation, extract the following:

                    1. condition: What health condition or type of care does the person need? \
                    (e.g., "syphilis treatment", "headache evaluation", "prenatal care")

                    2. searchInsurance: What insurance should we use when searching for hospitals? \
                    Think about WHO actually needs care in this conversation:
                    - If the user says someone ELSE (friend, cousin, family member, etc.) needs care \
                      and that person has NO insurance → return "Self-pay"
                    - If the user themselves says they have no insurance → return "Self-pay"
                    - If the conversation mentions a specific insurance for the person needing care, \
                      return that insurance name
                    - If no insurance change is mentioned and the user seems to be asking for themselves, \
                      return "PROFILE" (we'll use their profile insurance: "%s")

                    3. searchPlan: If a specific plan name is mentioned, return it. Otherwise null.

                    Conversation:
                    %s

                    Respond ONLY with JSON, no markdown:
                    {"condition": "...", "searchInsurance": "Self-pay", "searchPlan": null}
                    """.formatted(profileInsurance, transcript);

            Map<String, Object> genConfig = new HashMap<>();
            genConfig.put("temperature", 0.1);
            genConfig.put("maxOutputTokens", 256);
            genConfig.put("thinkingConfig", Map.of("thinkingBudget", 0));

            Map<String, Object> requestBody = Map.of(
                    "contents", List.of(Map.of(
                            "role", "user",
                            "parts", List.of(Map.of("text", prompt))
                    )),
                    "generationConfig", genConfig
            );

            String responseJson = geminiWebClient.post()
                    .uri("/{model}:generateContent?key={key}", model, apiKey)
                    .bodyValue(requestBody)
                    .retrieve()
                    .bodyToMono(String.class)
                    .block();

            String text = extractResponseText(responseJson);
            text = text.replaceAll("```json\\s*", "").replaceAll("```\\s*", "").trim();
            int start = text.indexOf('{');
            int end = text.lastIndexOf('}');
            if (start >= 0 && end > start) {
                JsonNode parsed = objectMapper.readTree(text.substring(start, end + 1));
                String condition = parsed.path("condition").asText(null);
                String insurance = parsed.path("searchInsurance").asText("PROFILE");
                String plan = parsed.has("searchPlan") && !parsed.path("searchPlan").isNull()
                        ? parsed.path("searchPlan").asText(null) : null;
                log.info("Extraction result: condition='{}', searchInsurance='{}', searchPlan='{}'",
                        condition, insurance, plan);
                return new ExtractionResult(condition, insurance, plan);
            }
        } catch (Exception e) {
            log.warn("Extraction pass failed, using defaults: {}", e.getMessage());
        }

        return new ExtractionResult("health concern", "PROFILE", null);
    }

    // ═══════════════════════════════════════════════════════════════════════
    //  Session Summary (unchanged from your additions)
    // ═══════════════════════════════════════════════════════════════════════

    public SessionSummaryResponse summarizeSession(SessionSummaryRequest request) {
        String sessionId = request.getSessionId();
        if (sessionId == null || sessionId.isBlank()) {
            sessionId = "unknown";
        }

        StringBuilder transcript = new StringBuilder();
        List<ChatMessage> history = request.getHistory();
        if (history != null) {
            for (ChatMessage msg : history) {
                String label = "user".equals(msg.getRole()) ? "Patient" : "Cl\u00ednica AI";
                transcript.append(label).append(": ").append(msg.getContent()).append("\n");
            }
        }

        String lang = "es".equalsIgnoreCase(request.getLanguage()) ? "Spanish" : "English";

        String prompt = """
                You are summarizing a health triage conversation between a patient and the Cl\u00ednica AI assistant.

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

                RULES for tags: 2-4 short tags in %s describing the key health topics discussed
                """.formatted(transcript.toString(), lang, lang, lang);

        List<Map<String, Object>> contents = List.of(
                Map.of("role", "user", "parts", List.of(Map.of("text", prompt)))
        );

        Map<String, Object> genConfig = new HashMap<>();
        genConfig.put("temperature", 0.3);
        genConfig.put("maxOutputTokens", 2048);
        genConfig.put("thinkingConfig", Map.of("thinkingBudget", 0));

        Map<String, Object> requestBody = Map.of(
                "contents", contents,
                "generationConfig", genConfig
        );

        try {
            String responseJson = geminiWebClient.post()
                    .uri("/{model}:generateContent?key={key}", model, apiKey)
                    .bodyValue(requestBody)
                    .retrieve()
                    .bodyToMono(String.class)
                    .block();

            String responseText = extractResponseText(responseJson);
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
                for (JsonNode tag : tagsNode) tags.add(tag.asText());
            }

            return new SessionSummaryResponse(sessionId, title, summary, severity, tags);
        } catch (Exception e) {
            log.error("Session summary generation failed", e);
            return new SessionSummaryResponse(sessionId, "Health Consultation",
                    "A triage conversation was conducted.", "low", List.of("General"));
        }
    }

    // ═══════════════════════════════════════════════════════════════════════
    //  Helpers
    // ═══════════════════════════════════════════════════════════════════════

    private String extractResponseText(String responseJson) throws Exception {
        JsonNode root = objectMapper.readTree(responseJson);
        JsonNode candidates = root.path("candidates");
        if (candidates.isEmpty() || !candidates.isArray()) {
            throw new RuntimeException("Gemini returned no candidates");
        }

        String text = candidates.get(0)
                .path("content").path("parts").get(0).path("text").asText(null);
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
                || lower.contains("centro de salud")
                || lower.contains("find a hospital")
                || lower.contains("encontrar un hospital")
                || lower.contains("seek care")
                || lower.contains("buscar atenci\u00f3n");
    }

    private boolean hasLocation(ChatRequest request) {
        return (request.getLat() != null && request.getLng() != null)
                || (request.getZipCode() != null && !request.getZipCode().isBlank());
    }

    // ─── System Prompt (now context-aware) ──────────────────────────────

    private String buildSystemPrompt(ChatRequest request) {
        String languageName = "es".equalsIgnoreCase(request.getLanguage()) ? "Spanish" : "English";
        String situationDescription = getSituationDescription(request.getSituation());
        String situationBlock = getSituationBlock(request.getSituation());
        String profileContext = buildProfileContext(request);

        return """
                You are Cl\u00ednica, a compassionate and culturally competent AI health navigator \
                helping members of the Hispanic/Latino community in the United States.

                LANGUAGE RULE: You MUST respond only in %s. Do not switch languages.

                SITUATION: This user has indicated: %s

                %s

                YOUR ROLE:
                - Provide plain-language, accessible health information. No medical jargon.
                - Never diagnose. Never prescribe medication.
                - Be warm, calm, and non-judgmental at all times.
                - You know the user's profile info (above). Use it naturally — don't ask for info \
                  you already have. For example, don't ask "do you have insurance?" if you already know.
                - If the user contradicts their profile in conversation (e.g., says "I don't have insurance" \
                  but their profile says Aetna), trust what they say in conversation — they may be asking \
                  for a friend or their situation may have changed.

                CONVERSATION FLOW — follow this progression:
                1. First 1-2 exchanges: ask ONE focused clarifying question to understand the concern better.
                2. After 2-3 exchanges, or once you have a reasonable picture of the issue: stop asking \
                questions and shift to giving concrete, actionable guidance.
                3. If in-person care seems appropriate, recommend it in that same response.
                Do NOT keep asking follow-up questions once you have enough context — the user came for \
                help, not an endless intake form.

                SITUATION-SPECIFIC INSTRUCTIONS:
                %s

                HOSPITAL/CLINIC REFERRAL: When you believe the user should seek in-person care, \
                include the exact phrase "find a clinic" (if in English) or \
                "encontrar una cl\u00ednica" (if in Spanish) somewhere in your response. \
                When you do this, our system will automatically show nearby hospitals — you do NOT \
                need to list specific hospitals yourself. Just recommend seeking care and we handle the rest.

                NEVER ask for: name, address, ID, insurance card number, immigration status.\
                """.formatted(languageName, situationDescription, profileContext, situationBlock);
    }

    private String buildProfileContext(ChatRequest request) {
        StringBuilder ctx = new StringBuilder("PATIENT PROFILE (from onboarding — do not ask for this again):\n");

        if (request.getAge() != null) {
            ctx.append("- Age: ").append(request.getAge()).append("\n");
        }

        if (request.getInsuranceProvider() != null && !request.getInsuranceProvider().isBlank()) {
            ctx.append("- Insurance: ").append(request.getInsuranceProvider());
            if (request.getPlanName() != null && !request.getPlanName().isBlank()) {
                ctx.append(" (").append(request.getPlanName()).append(")");
            }
            ctx.append("\n");
        } else {
            ctx.append("- Insurance: None / not provided\n");
        }

        if (request.getZipCode() != null && !request.getZipCode().isBlank()) {
            ctx.append("- Location: ZIP ").append(request.getZipCode()).append("\n");
        }

        return ctx.toString();
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
