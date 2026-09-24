package com.hrushi.finpilot.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BudgetSummaryResponse {

    private Long budgetId;

    private String category;

    private Double monthlyLimit;

    private Double totalSpent;

    private Double remaining;

    private Double percentageUsed;

    /**
     * NORMAL (< 80%), APPROACHING (80-89%), WARNING (90-99%), OVER_BUDGET (100%+)
     */
    private String statusCode;

    /**
     * Human-readable label: "Normal", "Approaching limit", "Warning", "Over budget"
     */
    private String status;

    private boolean isOverBudget;

    private Integer month;

    private Integer year;
}
