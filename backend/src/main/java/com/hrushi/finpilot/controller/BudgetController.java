package com.hrushi.finpilot.controller;

import com.hrushi.finpilot.dto.BudgetRequest;
import com.hrushi.finpilot.dto.BudgetSummaryResponse;
import com.hrushi.finpilot.entity.Budget;
import com.hrushi.finpilot.service.BudgetService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/budgets")
@Tag(name = "Budget", description = "Budget management APIs")
public class BudgetController {

    @Autowired
    private BudgetService budgetService;

    // Create Budget
    @PostMapping
    @Operation(summary = "Create a new budget for a category")
    public Budget createBudget(@Valid @RequestBody BudgetRequest request,
                               Authentication authentication) {

        String email = authentication.getName();

        return budgetService.createBudget(request, email);
    }

    // Get All Budgets of Logged-in User
    @GetMapping
    @Operation(summary = "Get all budgets of the logged-in user")
    public List<Budget> getAllBudgets(Authentication authentication) {

        String email = authentication.getName();

        return budgetService.getAllBudgets(email);
    }

    // Get Budget By Id
    @GetMapping("/{id}")
    @Operation(summary = "Get a specific budget by ID")
    public Budget getBudgetById(@PathVariable Long id,
                                Authentication authentication) {

        String email = authentication.getName();

        return budgetService.getBudgetById(id, email);
    }

    // Update Budget (Only Owner)
    @PutMapping("/{id}")
    @Operation(summary = "Update an existing budget")
    public Budget updateBudget(@PathVariable Long id,
                               @Valid @RequestBody BudgetRequest request,
                               Authentication authentication) {

        String email = authentication.getName();

        return budgetService.updateBudget(id, request, email);
    }

    // Delete Budget (Only Owner)
    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a budget")
    public String deleteBudget(@PathVariable Long id,
                               Authentication authentication) {

        String email = authentication.getName();

        return budgetService.deleteBudget(id, email);
    }

    // Budget Summary for a Specific Month and Year
    @GetMapping("/summary/{year}/{month}")
    @Operation(summary = "Get budget summary with actual spending per category for a month")
    public List<BudgetSummaryResponse> getBudgetSummary(
            @PathVariable int year,
            @PathVariable int month,
            Authentication authentication) {

        String email = authentication.getName();

        return budgetService.getBudgetSummary(year, month, email);
    }
}
