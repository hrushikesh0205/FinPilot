package com.hrushi.finpilot.controller;

import com.hrushi.finpilot.dto.SavingsGoalRequest;
import com.hrushi.finpilot.dto.SavingsGoalResponse;
import com.hrushi.finpilot.service.SavingsGoalService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/goals")
@RequiredArgsConstructor
@Tag(name = "Savings Goals", description = "Target-based savings goals and progress tracking")
public class SavingsGoalController {

    private final SavingsGoalService savingsGoalService;

    @GetMapping
    @Operation(summary = "Get all savings goals with calculated progress")
    public ResponseEntity<List<SavingsGoalResponse>> getAllGoals(Authentication authentication) {
        String email = authentication.getName();
        return ResponseEntity.ok(savingsGoalService.getAllGoals(email));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get a single savings goal by ID")
    public ResponseEntity<SavingsGoalResponse> getGoalById(
            @PathVariable Long id,
            Authentication authentication) {
        String email = authentication.getName();
        return ResponseEntity.ok(savingsGoalService.getGoalById(id, email));
    }

    @PostMapping
    @Operation(summary = "Create a new savings goal")
    public ResponseEntity<SavingsGoalResponse> createGoal(
            @Valid @RequestBody SavingsGoalRequest request,
            Authentication authentication) {
        String email = authentication.getName();
        SavingsGoalResponse created = savingsGoalService.createGoal(request, email);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update an existing savings goal")
    public ResponseEntity<SavingsGoalResponse> updateGoal(
            @PathVariable Long id,
            @Valid @RequestBody SavingsGoalRequest request,
            Authentication authentication) {
        String email = authentication.getName();
        SavingsGoalResponse updated = savingsGoalService.updateGoal(id, request, email);
        return ResponseEntity.ok(updated);
    }

    @PostMapping("/{id}/deposit")
    @Operation(summary = "Add funds towards a savings goal")
    public ResponseEntity<SavingsGoalResponse> depositFunds(
            @PathVariable Long id,
            @RequestBody Map<String, Double> body,
            Authentication authentication) {
        String email = authentication.getName();
        Double amount = body.get("amount");
        SavingsGoalResponse updated = savingsGoalService.depositFunds(id, amount, email);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a savings goal")
    public ResponseEntity<Map<String, String>> deleteGoal(
            @PathVariable Long id,
            Authentication authentication) {
        String email = authentication.getName();
        savingsGoalService.deleteGoal(id, email);
        return ResponseEntity.ok(Map.of("message", "Savings goal deleted successfully"));
    }

    @GetMapping("/summary")
    @Operation(summary = "Get overall savings goals metrics and summary")
    public ResponseEntity<Map<String, Object>> getSummary(Authentication authentication) {
        String email = authentication.getName();
        return ResponseEntity.ok(savingsGoalService.getSummary(email));
    }
}
