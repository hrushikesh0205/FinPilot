package com.hrushi.finpilot.ai;

import com.hrushi.finpilot.dto.FinancialInsightResponse;
import com.hrushi.finpilot.dto.ReceiptScanResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@Slf4j
@RestController
@RequestMapping("/api/ai")
@RequiredArgsConstructor
@Tag(name = "AI", description = "AI Receipt OCR and Financial Insights APIs")
public class AiController {

    private final ReceiptScanService receiptScanService;
    private final FinancialInsightService financialInsightService;

    /**
     * Scan a receipt image via AI multimodal OCR
     */
    @PostMapping(value = "/receipt/scan", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "Scan a receipt image and extract structured data using AI vision")
    public ResponseEntity<ReceiptScanResponse> scanReceipt(
            @RequestParam("file") MultipartFile file,
            Authentication authentication) {

        log.info("Receipt scan requested by user: {}, filename: {}",
                authentication != null ? authentication.getName() : "anonymous",
                file != null ? file.getOriginalFilename() : "null");

        ReceiptScanResponse response = receiptScanService.scanReceipt(file);
        return ResponseEntity.ok(response);
    }

    /**
     * Generate financial insights for the authenticated user
     */
    @GetMapping("/insights")
    @Operation(summary = "Generate personal financial insights and recommendations based on real expenses")
    public ResponseEntity<FinancialInsightResponse> getInsights(Authentication authentication) {
        String email = authentication.getName();
        log.info("Financial insights requested by user: {}", email);

        FinancialInsightResponse response = financialInsightService.getInsights(email);
        return ResponseEntity.ok(response);
    }
}
