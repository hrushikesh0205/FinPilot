package com.hrushi.finpilot.ai;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.hrushi.finpilot.dto.ReceiptItem;
import com.hrushi.finpilot.dto.ReceiptScanResponse;
import com.hrushi.finpilot.entity.Expense;
import com.hrushi.finpilot.entity.User;
import com.hrushi.finpilot.repository.ExpenseRepository;
import com.hrushi.finpilot.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Base64;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class ReceiptScanService {

    private final OpenRouterService openRouterService;
    private final ObjectMapper objectMapper;
    private final ExpenseRepository expenseRepository;
    private final UserRepository userRepository;

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

    public ReceiptScanResponse scanReceipt(MultipartFile file, String email) {
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

            // Pre-check for duplicate transaction in database
            if (email != null && !email.isBlank() && response.getMerchant() != null && response.getTotal() != null && response.getTotal() > 0) {
                try {
                    Optional<User> userOpt = userRepository.findByEmail(email);
                    if (userOpt.isPresent()) {
                        LocalDate date = null;
                        if (response.getDate() != null && !response.getDate().isBlank()) {
                            try {
                                date = LocalDate.parse(response.getDate().trim());
                            } catch (Exception ignored) {
                            }
                        }
                        if (date == null) {
                            date = LocalDate.now();
                        }

                        String fp = Expense.buildFingerprint(date, response.getMerchant(), response.getTotal(), "Cash");
                        if (expenseRepository.existsByUserAndFingerprint(userOpt.get(), fp)) {
                            response.setPotentialDuplicate(true);
                            response.setDuplicateWarning("A transaction with this merchant, amount, and date already exists in your records.");
                        }
                    }
                } catch (Exception e) {
                    log.warn("Failed to check duplicate for receipt: {}", e.getMessage());
                }
            }

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
