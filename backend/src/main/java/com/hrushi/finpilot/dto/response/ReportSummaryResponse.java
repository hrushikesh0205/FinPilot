package com.hrushi.finpilot.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReportSummaryResponse {

    private double totalExpenses;
    private long totalTransactions;
    private double highestExpense;
    private double averageExpense;
}
