package com.hrushi.finpilot.controller;

import com.hrushi.finpilot.dto.RecurringExpenseRequest;
import com.hrushi.finpilot.dto.RecurringSuggestionDto;
import com.hrushi.finpilot.dto.RecurringSummaryResponse;
import com.hrushi.finpilot.entity.RecurringExpense;
import com.hrushi.finpilot.service.RecurringExpenseService;
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
@RequestMapping("/api/recurring")
@RequiredArgsConstructor
@Tag(name = "Recurring Expenses", description = "Pattern-detected recurring expense management")
public class RecurringExpenseController {

    private final RecurringExpenseService recurringExpenseService;

    @GetMapping("/suggestions")
    @Operation(summary = "Get detected recurring expense candidates from transaction history")
    public ResponseEntity<List<RecurringSuggestionDto>> getSuggestions(Authentication authentication) {
        String email = authentication.getName();
        return ResponseEntity.ok(recurringExpenseService.getSuggestions(email));
    }

    @GetMapping
    @Operation(summary = "Get all confirmed recurring expenses")
    public ResponseEntity<List<RecurringExpense>> getConfirmed(Authentication authentication) {
        String email = authentication.getName();
        return ResponseEntity.ok(recurringExpenseService.getConfirmedRecurring(email));
    }

    @PostMapping("/keep")
    @Operation(summary = "Confirm/Keep a detected recurring expense suggestion")
    public ResponseEntity<RecurringExpense> keepSuggestion(
            @Valid @RequestBody RecurringExpenseRequest request,
            Authentication authentication) {
        String email = authentication.getName();
        RecurringExpense saved = recurringExpenseService.keepSuggestion(request, email);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @PostMapping("/ignore")
    @Operation(summary = "Ignore/Dismiss a recurring expense suggestion pattern")
    public ResponseEntity<Map<String, String>> ignoreSuggestion(
            @RequestBody Map<String, String> body,
            Authentication authentication) {
        String email = authentication.getName();
        String title = body.get("title");
        if (title != null && !title.isBlank()) {
            recurringExpenseService.ignoreSuggestion(title, email);
        }
        return ResponseEntity.ok(Map.of("message", "Pattern dismissed successfully"));
    }

    @PostMapping
    @Operation(summary = "Manually create a new recurring expense")
    public ResponseEntity<RecurringExpense> createRecurring(
            @Valid @RequestBody RecurringExpenseRequest request,
            Authentication authentication) {
        String email = authentication.getName();
        RecurringExpense created = recurringExpenseService.createRecurring(request, email);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update an existing recurring expense")
    public ResponseEntity<RecurringExpense> updateRecurring(
            @PathVariable Long id,
            @Valid @RequestBody RecurringExpenseRequest request,
            Authentication authentication) {
        String email = authentication.getName();
        RecurringExpense updated = recurringExpenseService.updateRecurring(id, request, email);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a recurring expense")
    public ResponseEntity<Map<String, String>> deleteRecurring(
            @PathVariable Long id,
            Authentication authentication) {
        String email = authentication.getName();
        recurringExpenseService.deleteRecurring(id, email);
        return ResponseEntity.ok(Map.of("message", "Recurring expense deleted successfully"));
    }

    @GetMapping("/summary")
    @Operation(summary = "Get recurring expenses metrics summary")
    public ResponseEntity<RecurringSummaryResponse> getSummary(Authentication authentication) {
        String email = authentication.getName();
        return ResponseEntity.ok(recurringExpenseService.getSummary(email));
    }
}
