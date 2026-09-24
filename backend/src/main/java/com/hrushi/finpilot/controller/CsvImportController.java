package com.hrushi.finpilot.controller;

import com.hrushi.finpilot.dto.CsvImportConfirmRequest;
import com.hrushi.finpilot.dto.CsvImportResultResponse;
import com.hrushi.finpilot.dto.CsvPreviewResponse;
import com.hrushi.finpilot.service.CsvImportService;
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
@RequestMapping("/api/import/csv")
@RequiredArgsConstructor
@Tag(name = "CSV Bank Statement Import", description = "Import transactions from CSV bank statements with auto column detection and duplicate filtering")
public class CsvImportController {

    private final CsvImportService csvImportService;

    @PostMapping(value = "/preview", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "Upload CSV statement to preview headers, sample rows, and auto-detected column mappings")
    public ResponseEntity<CsvPreviewResponse> previewCsv(
            @RequestParam("file") MultipartFile file,
            Authentication authentication) {
        log.info("CSV preview requested by user: {}, filename: {}",
                authentication != null ? authentication.getName() : "anonymous",
                file.getOriginalFilename());
        return ResponseEntity.ok(csvImportService.previewCsv(file));
    }

    @PostMapping("/confirm")
    @Operation(summary = "Confirm CSV import with configured column mappings and duplicate transaction filtering")
    public ResponseEntity<CsvImportResultResponse> confirmImport(
            @RequestBody CsvImportConfirmRequest request,
            Authentication authentication) {
        String email = authentication.getName();
        log.info("CSV import confirm requested by user: {} for {} rows", email,
                request.getRows() != null ? request.getRows().size() : 0);
        return ResponseEntity.ok(csvImportService.confirmImport(request, email));
    }
}
