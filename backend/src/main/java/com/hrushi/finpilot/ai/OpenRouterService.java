package com.hrushi.finpilot.ai;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientResponseException;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@Service
public class OpenRouterService {

    private static final int DEFAULT_OCR_MAX_TOKENS = 2048;
    private static final int DEFAULT_INSIGHTS_MAX_TOKENS = 2048;

    private final String apiKey;
    private final String baseUrl;
    private final String model;
    private final int ocrMaxTokens;
    private final int insightsMaxTokens;
    private final RestClient restClient;
    private final ObjectMapper objectMapper;

    public OpenRouterService(
            @Value("${openrouter.api.key:}") String apiKey,
            @Value("${openrouter.base-url:https://openrouter.ai/api/v1}") String baseUrl,
            @Value("${openrouter.model:google/gemini-2.5-flash}") String model,
            @Value("${openrouter.max-tokens.ocr:2048}") int ocrMaxTokens,
            @Value("${openrouter.max-tokens.insights:2048}") int insightsMaxTokens,
            ObjectMapper objectMapper) {
        this.apiKey = apiKey != null ? apiKey.trim() : "";
        this.baseUrl = (baseUrl != null && !baseUrl.isBlank()) ? baseUrl.trim() : "https://openrouter.ai/api/v1";
        this.model = (model != null && !model.isBlank()) ? model.trim() : "google/gemini-2.5-flash";
        this.ocrMaxTokens = ocrMaxTokens > 0 ? ocrMaxTokens : DEFAULT_OCR_MAX_TOKENS;
        this.insightsMaxTokens = insightsMaxTokens > 0 ? insightsMaxTokens : DEFAULT_INSIGHTS_MAX_TOKENS;
        this.objectMapper = objectMapper;
        this.restClient = RestClient.builder()
                .baseUrl(this.baseUrl)
                .defaultHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                .defaultHeader("HTTP-Referer", "https://finpilot.local")
                .defaultHeader("X-Title", "FinPilot")
                .build();
    }

    /**
     * Send a text-only prompt to OpenRouter (default financial insights token limit: 2048)
     */
    public String chat(String prompt, String systemPrompt) {
        return chat(prompt, systemPrompt, this.insightsMaxTokens);
    }

    /**
     * Send a text-only prompt to OpenRouter with an explicit output token limit
     */
    public String chat(String prompt, String systemPrompt, int maxTokens) {
        validateApiKey();

        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("model", model);
        requestBody.put("max_tokens", maxTokens);

        List<Map<String, Object>> messages = new ArrayList<>();
        if (systemPrompt != null && !systemPrompt.isBlank()) {
            messages.add(Map.of("role", "system", "content", systemPrompt));
        }
        messages.add(Map.of("role", "user", "content", prompt));
        requestBody.put("messages", messages);
        requestBody.put("response_format", Map.of("type", "json_object"));

        return executeRequest(requestBody);
    }

    /**
     * Send a vision prompt (image + text) to OpenRouter (default receipt OCR token limit: 2048)
     */
    public String chatWithImage(String imageBase64, String mimeType, String prompt, String systemPrompt) {
        return chatWithImage(imageBase64, mimeType, prompt, systemPrompt, this.ocrMaxTokens);
    }

    /**
     * Send a vision prompt (image + text) to OpenRouter with an explicit output token limit
     */
    public String chatWithImage(String imageBase64, String mimeType, String prompt, String systemPrompt, int maxTokens) {
        validateApiKey();

        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("model", model);
        requestBody.put("max_tokens", maxTokens);

        List<Map<String, Object>> messages = new ArrayList<>();
        if (systemPrompt != null && !systemPrompt.isBlank()) {
            messages.add(Map.of("role", "system", "content", systemPrompt));
        }

        // Multimodal user message
        List<Map<String, Object>> userContent = new ArrayList<>();
        userContent.add(Map.of("type", "text", "text", prompt));

        String dataUrl = "data:" + (mimeType != null ? mimeType : "image/jpeg") + ";base64," + imageBase64;
        userContent.add(Map.of("type", "image_url", "image_url", Map.of("url", dataUrl)));

        messages.add(Map.of("role", "user", "content", userContent));
        requestBody.put("messages", messages);
        requestBody.put("response_format", Map.of("type", "json_object"));

        return executeRequest(requestBody);
    }

    private void validateApiKey() {
        if (apiKey.isBlank() || apiKey.startsWith("YOUR_") || apiKey.equals("placeholder")) {
            throw new IllegalStateException(
                    "OpenRouter API key is not configured or is a placeholder. " +
                    "Please set 'openrouter.api.key' in backend/src/main/resources/application.properties"
            );
        }
    }

    private String executeRequest(Map<String, Object> requestBody) {
        try {
            log.info("Calling OpenRouter with model: {}, max_tokens: {}", model, requestBody.get("max_tokens"));

            String responseString = restClient.post()
                    .uri("/chat/completions")
                    .header(HttpHeaders.AUTHORIZATION, "Bearer " + apiKey)
                    .body(requestBody)
                    .retrieve()
                    .body(String.class);

            if (responseString == null || responseString.isBlank()) {
                throw new RuntimeException("Empty response received from OpenRouter");
            }

            JsonNode root = objectMapper.readTree(responseString);
            JsonNode choices = root.path("choices");
            if (!choices.isArray() || choices.isEmpty()) {
                throw new RuntimeException("No completion choices returned by OpenRouter: " + responseString);
            }

            JsonNode message = choices.get(0).path("message");
            String content = message.path("content").asText("");

            return cleanJsonContent(content);

        } catch (RestClientResponseException ex) {
            log.error("OpenRouter API error: Status {} - {}", ex.getStatusCode(), ex.getResponseBodyAsString(), ex);
            throw new RuntimeException("OpenRouter API error (" + ex.getStatusCode() + "): " + ex.getResponseBodyAsString(), ex);
        } catch (IllegalStateException e) {
            throw e;
        } catch (Exception e) {
            log.error("Failed to execute OpenRouter request", e);
            throw new RuntimeException("AI processing failed: " + e.getMessage(), e);
        }
    }

    /**
     * Cleans markdown JSON fences if present
     */
    public static String cleanJsonContent(String content) {
        if (content == null) return "{}";
        String trimmed = content.trim();
        if (trimmed.startsWith("```json")) {
            trimmed = trimmed.substring(7);
        } else if (trimmed.startsWith("```")) {
            trimmed = trimmed.substring(3);
        }
        if (trimmed.endsWith("```")) {
            trimmed = trimmed.substring(0, trimmed.length() - 3);
        }
        return trimmed.trim();
    }
}
