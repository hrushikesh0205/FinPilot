package com.hrushi.finpilot.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FinancialInsightResponse {

    private String summary;

    @Builder.Default
    private List<String> keyInsights = new ArrayList<>();

    @Builder.Default
    private List<String> recommendations = new ArrayList<>();

    private Double totalSpent;
    private Double totalBudget;
    private String currency;
}
