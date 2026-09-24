package com.hrushi.finpilot.controller;

import com.hrushi.finpilot.dto.SubscriptionRequest;
import com.hrushi.finpilot.dto.SubscriptionSummaryResponse;
import com.hrushi.finpilot.entity.Subscription;
import com.hrushi.finpilot.service.SubscriptionService;
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
@RequestMapping("/api/subscriptions")
@RequiredArgsConstructor
@Tag(name = "Subscriptions", description = "Subscription tracking and recurring services management")
public class SubscriptionController {

    private final SubscriptionService subscriptionService;

    @GetMapping
    @Operation(summary = "Get all subscriptions of authenticated user")
    public ResponseEntity<List<Subscription>> getAll(Authentication authentication) {
        String email = authentication.getName();
        return ResponseEntity.ok(subscriptionService.getAllSubscriptions(email));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get subscription by ID")
    public ResponseEntity<Subscription> getById(
            @PathVariable Long id,
            Authentication authentication) {
        String email = authentication.getName();
        return ResponseEntity.ok(subscriptionService.getSubscriptionById(id, email));
    }

    @PostMapping
    @Operation(summary = "Create a new subscription")
    public ResponseEntity<Subscription> create(
            @Valid @RequestBody SubscriptionRequest request,
            Authentication authentication) {
        String email = authentication.getName();
        Subscription created = subscriptionService.createSubscription(request, email);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update an existing subscription")
    public ResponseEntity<Subscription> update(
            @PathVariable Long id,
            @Valid @RequestBody SubscriptionRequest request,
            Authentication authentication) {
        String email = authentication.getName();
        Subscription updated = subscriptionService.updateSubscription(id, request, email);
        return ResponseEntity.ok(updated);
    }

    @PatchMapping("/{id}/status")
    @Operation(summary = "Toggle active/inactive status of subscription")
    public ResponseEntity<Subscription> toggleStatus(
            @PathVariable Long id,
            Authentication authentication) {
        String email = authentication.getName();
        Subscription toggled = subscriptionService.toggleStatus(id, email);
        return ResponseEntity.ok(toggled);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a subscription")
    public ResponseEntity<Map<String, String>> delete(
            @PathVariable Long id,
            Authentication authentication) {
        String email = authentication.getName();
        subscriptionService.deleteSubscription(id, email);
        return ResponseEntity.ok(Map.of("message", "Subscription deleted successfully"));
    }

    @GetMapping("/summary")
    @Operation(summary = "Get subscription spending overview and metrics")
    public ResponseEntity<SubscriptionSummaryResponse> getSummary(Authentication authentication) {
        String email = authentication.getName();
        return ResponseEntity.ok(subscriptionService.getSummary(email));
    }

    @GetMapping("/candidates")
    @Operation(summary = "Detect potential subscriptions from expense history")
    public ResponseEntity<List<Map<String, Object>>> getCandidates(Authentication authentication) {
        String email = authentication.getName();
        return ResponseEntity.ok(subscriptionService.detectSubscriptionCandidates(email));
    }
}
