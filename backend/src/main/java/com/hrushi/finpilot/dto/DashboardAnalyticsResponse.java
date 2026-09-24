package com.hrushi.finpilot.dto;

import com.hrushi.finpilot.entity.Expense;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DashboardAnalyticsResponse {

    private String period; // THIS_MONTH, LAST_MONTH, LAST_3_MONTHS, LAST_6_MONTHS, THIS_YEAR, ALL_TIME
    private String periodLabel;

    // 1. Total Income
    private double totalIncome;

    // 2. Total Spending
    private double totalSpending;

    // 3. Savings Rate (%): (totalIncome - totalSpending) / totalIncome * 100
    private double savingsRate;
    private double netSavings;

    // 4. Budget Usage
    private double budgetUsagePercentage;
    private double totalBudgetLimit;
    private double totalBudgetSpent;

    // 5. Top Spending Category
    private String topSpendingCategory;
    private double topCategoryAmount;
    private double topCategoryPercentage;

    // 6. Recent Transactions
    private List<Expense> recentTransactions;

    // 7. Spending by Category
    private List<CategoryReportResponse> categoryBreakdown;

    // 8. Monthly Spending Trend
    private List<MonthlyTrendPoint> monthlyTrend;

    // 9. Active Budget Alerts
    private List<BudgetSummaryResponse> budgetAlerts;

    // 10. Recurring Payment Summary
    private RecurringSummaryResponse recurringSummary;

    // 11. Savings Goal Progress
    private GoalSummarySnippet goalsSummary;

    // 12. AI Financial Insight
    private FinancialInsightResponse aiInsight;

    private int totalTransactionsCount;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class MonthlyTrendPoint {
        private String monthLabel;
        private int year;
        private int month;
        private double expenses;
        private double income;
        private double netSavings;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class GoalSummarySnippet {
        private int totalGoals;
        private int completedGoals;
        private double totalTarget;
        private double totalSaved;
        private double progressPercentage;
    }
}
