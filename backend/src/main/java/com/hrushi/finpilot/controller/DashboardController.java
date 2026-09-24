package com.hrushi.finpilot.controller;

import com.hrushi.finpilot.dto.DashboardAnalyticsResponse;
import com.hrushi.finpilot.dto.DashboardResponse;
import com.hrushi.finpilot.service.DashboardService;
import com.hrushi.finpilot.service.ExpenseService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@Tag(name = "Dashboard", description = "Financial dashboard overview and analytics")
public class DashboardController {

    private final ExpenseService expenseService;
    private final DashboardService dashboardService;

    // Advanced dynamic analytics with period filters
    @GetMapping("/dashboard/analytics")
    @Operation(summary = "Get rich dynamic dashboard analytics with period filtering")
    public ResponseEntity<DashboardAnalyticsResponse> getAnalytics(
            @RequestParam(defaultValue = "THIS_MONTH") String period,
            Authentication authentication) {
        String email = authentication.getName();
        return ResponseEntity.ok(dashboardService.getAnalytics(period, email));
    }

    // Legacy / simple summary
    @GetMapping("/dashboard")
    @Operation(summary = "Get basic dashboard totals")
    public DashboardResponse getDashboard(Authentication authentication) {
        String email = authentication.getName();
        return expenseService.getDashboardSummary(email);
    }

    // Monthly Dashboard Summary
    @GetMapping("/dashboard/{year}/{month}")
    @Operation(summary = "Get monthly dashboard totals")
    public DashboardResponse getMonthlySummary(
            @PathVariable int year,
            @PathVariable int month,
            Authentication authentication) {
        String email = authentication.getName();
        return expenseService.getMonthlySummary(year, month, email);
    }
}