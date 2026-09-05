package com.hrushi.finpilot.ai;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.hrushi.finpilot.dto.ReceiptItem;
import com.hrushi.finpilot.dto.ReceiptScanResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Base64;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class ReceiptScanService {

    private final OpenRouterService openRouterService;
    private final ObjectMapper objectMapper;

    private static final String SYSTEM_PROMPT = """
            You are an expert receipt OCR and financial document analysis assistant.
            Your job is to accurately read receipt / invoice / bill images and extract structured financial information.
            Always output ONLY a valid JSON object conforming strictly to the requested schema.
            """;

    private static final String OCR_PROMPT = """
            Analyze this receipt image and extract the following details as a valid JSON object:
            {
              "merchant": "Store or business name",
              "receiptNumber": "Invoice / Bill / Receipt number (null if not found)",
              "date": "Date of transaction in YYYY-MM-DD format (null if not found)",
              "subtotal": 0.0,
              "tax": 0.0,
              "total": 0.0,
              "currency": "INR or currency detected (e.g. ₹, USD, EUR)",
              "paymentMethod": "UPI, Cash, Card, NetBanking, etc. (null if not found)",
              "category": "Best suited from: Food, Travel, Shopping, Entertainment, Bills, Health, Education, Investments, Other",
              "items": [
                {
                  "name": "Item or service name",
                  "quantity": 1,
                  "price": 0.0
                }
              ]
            }

            Important rules:
            1. All monetary values ('subtotal', 'tax', 'total', 'price') must be numbers (e.g. 150.50), not strings.
            2. If 'subtotal' or 'tax' is not listed separately, calculate them or use 0.0, and make sure 'total' reflects the final paid amount.
            3. 'date' should strictly be 'YYYY-MM-DD' if identifiable.
            4. If the category is ambiguous, pick the closest one from [Food, Travel, Shopping, Entertainment, Bills, Health, Education, Investments, Other].
            5. Return valid JSON only.
            """;

    public ReceiptScanResponse scanReceipt(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("No receipt image file provided");
        }

        String contentType = file.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            contentType = "image/jpeg";
        }

        try {
            byte[] bytes = file.getBytes();
            String base64Image = Base64.getEncoder().encodeToString(bytes);

            log.info("Sending receipt image ({} bytes, type {}) to OpenRouter for OCR", bytes.length, contentType);

            String jsonResponse = openRouterService.chatWithImage(
                    base64Image,
                    contentType,
                    OCR_PROMPT,
                    SYSTEM_PROMPT
            );

            log.debug("OpenRouter OCR raw JSON response: {}", jsonResponse);

            ReceiptScanResponse response = objectMapper.readValue(jsonResponse, ReceiptScanResponse.class);

            // Post-process defaults to ensure safe values for frontend
            if (response.getItems() == null) {
                response.setItems(new ArrayList<>());
            }
            if (response.getCategory() == null || response.getCategory().isBlank()) {
                response.setCategory("Other");
            }
            if (response.getCurrency() == null || response.getCurrency().isBlank()) {
                response.setCurrency("₹");
            }
            response.setRawText(jsonResponse);

            return response;

        } catch (IOException e) {
            log.error("Failed to read uploaded receipt file", e);
            throw new RuntimeException("Failed to read uploaded receipt file: " + e.getMessage(), e);
        } catch (Exception e) {
            log.error("Error parsing AI OCR result", e);
            throw new RuntimeException("Failed to extract receipt data: " + e.getMessage(), e);
        }
    }
}
