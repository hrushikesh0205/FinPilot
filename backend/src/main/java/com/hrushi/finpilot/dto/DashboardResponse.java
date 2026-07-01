package com.hrushi.finpilot.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DashboardResponse {

    private Double totalExpenses;

    private Long totalTransactions;

    private Double highestExpense;
}