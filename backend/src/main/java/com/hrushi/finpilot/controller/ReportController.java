package com.hrushi.finpilot.controller;

import com.hrushi.finpilot.dto.CategoryReportResponse;
import com.hrushi.finpilot.dto.MonthlyReportResponse;
import com.hrushi.finpilot.dto.ReportSummaryResponse;
import com.hrushi.finpilot.service.ReportService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reports")
@Tag(name = "Reports", description = "Financial report APIs calculated from real data")
public class ReportController {

    @Autowired
    private ReportService reportService;

    // GET /api/reports/summary — all-time summary stats
    @GetMapping("/summary")
    @Operation(summary = "Get all-time expense summary")
    public ResponseEntity<ReportSummaryResponse> getSummary(Authentication authentication) {
        String email = authentication.getName();
        return ResponseEntity.ok(reportService.getSummary(email));
    }

    // GET /api/reports/monthly — last 6 months expense totals
    @GetMapping("/monthly")
    @Operation(summary = "Get expense totals for the last 6 months")
    public ResponseEntity<List<MonthlyReportResponse>> getMonthlyReport(Authentication authentication) {
        String email = authentication.getName();
        return ResponseEntity.ok(reportService.getMonthlyReport(email));
    }

    // GET /api/reports/category — expense breakdown by category
    @GetMapping("/category")
    @Operation(summary = "Get expense totals grouped by category")
    public ResponseEntity<List<CategoryReportResponse>> getCategoryReport(Authentication authentication) {
        String email = authentication.getName();
        return ResponseEntity.ok(reportService.getCategoryReport(email));
    }
}
