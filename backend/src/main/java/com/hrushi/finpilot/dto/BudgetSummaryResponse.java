package com.hrushi.finpilot.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BudgetSummaryResponse {

    private String category;

    private Double monthlyLimit;

    private Double totalSpent;

    private Double remaining;

    private boolean isOverBudget;
}
