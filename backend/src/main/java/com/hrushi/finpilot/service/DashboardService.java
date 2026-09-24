package com.hrushi.finpilot.service;

import com.hrushi.finpilot.dto.*;
import com.hrushi.finpilot.entity.Expense;
import com.hrushi.finpilot.entity.SavingsGoal;
import com.hrushi.finpilot.entity.User;
import com.hrushi.finpilot.repository.ExpenseRepository;
import com.hrushi.finpilot.repository.SavingsGoalRepository;
import com.hrushi.finpilot.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.TextStyle;
import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class DashboardService {

    private final ExpenseRepository expenseRepository;
    private final SavingsGoalRepository savingsGoalRepository;
    private final BudgetService budgetService;
    private final RecurringExpenseService recurringExpenseService;
    private final UserRepository userRepository;

    private static final List<String> PALETTE = List.of(
            "#10b981", "#3b82f6", "#8b5cf6", "#ec4899",
            "#f59e0b", "#06b6d4", "#ef4444", "#14b8a6",
            "#6366f1", "#f97316", "#84cc16", "#a855f7"
    );

    public DashboardAnalyticsResponse getAnalytics(String period, String email) {
        User user = getUser(email);
        LocalDate now = LocalDate.now();

        String normPeriod = (period != null && !period.isBlank()) ? period.toUpperCase().trim() : "THIS_MONTH";

        LocalDate startDate;
        LocalDate endDate = now.withDayOfMonth(now.lengthOfMonth());
        String periodLabel;

        switch (normPeriod) {
            case "LAST_MONTH" -> {
                LocalDate lastMonth = now.minusMonths(1);
                startDate = lastMonth.withDayOfMonth(1);
                endDate = lastMonth.withDayOfMonth(lastMonth.lengthOfMonth());
                periodLabel = lastMonth.getMonth().getDisplayName(TextStyle.FULL, Locale.ENGLISH) + " " + lastMonth.getYear();
            }
            case "LAST_3_MONTHS" -> {
                startDate = now.minusMonths(2).withDayOfMonth(1);
                periodLabel = "Last 3 Months";
            }
            case "LAST_6_MONTHS" -> {
                startDate = now.minusMonths(5).withDayOfMonth(1);
                periodLabel = "Last 6 Months";
            }
            case "THIS_YEAR" -> {
                startDate = LocalDate.of(now.getYear(), 1, 1);
                endDate = LocalDate.of(now.getYear(), 12, 31);
                periodLabel = String.valueOf(now.getYear());
            }
            case "ALL_TIME" -> {
                startDate = LocalDate.of(2000, 1, 1);
                endDate = LocalDate.of(2099, 12, 31);
                periodLabel = "All Time";
            }
            default -> { // THIS_MONTH
                normPeriod = "THIS_MONTH";
                startDate = now.withDayOfMonth(1);
                periodLabel = now.getMonth().getDisplayName(TextStyle.FULL, Locale.ENGLISH) + " " + now.getYear();
            }
        }

        final LocalDate finalStart = startDate;
        final LocalDate finalEnd = endDate;

        // Fetch user expenses within period
        List<Expense> allUserExpenses = expenseRepository.findByUser(user);
        List<Expense> periodExpenses = allUserExpenses.stream()
                .filter(e -> e.getExpenseDate() != null
                        && !e.getExpenseDate().isBefore(finalStart)
                        && !e.getExpenseDate().isAfter(finalEnd))
                .toList();

        // 1. Total Income & Total Spending
        double totalIncome = periodExpenses.stream()
                .filter(e -> "INCOME".equalsIgnoreCase(e.getType()))
                .mapToDouble(e -> e.getAmount() != null ? e.getAmount() : 0.0)
                .sum();

        double totalSpending = periodExpenses.stream()
                .filter(e -> !"INCOME".equalsIgnoreCase(e.getType()))
                .mapToDouble(e -> e.getAmount() != null ? e.getAmount() : 0.0)
                .sum();

        double netSavings = totalIncome - totalSpending;
        double savingsRate = totalIncome > 0
                ? Math.round(((totalIncome - totalSpending) / totalIncome) * 1000.0) / 10.0
                : 0.0;

        // 2. Spending by Category Breakdown
        Map<String, Double> categoryTotals = new LinkedHashMap<>();
        for (Expense exp : periodExpenses) {
            if ("INCOME".equalsIgnoreCase(exp.getType())) continue;
            if (exp.getAmount() == null) continue;
            String cat = exp.getCategory() != null && !exp.getCategory().isBlank() ? exp.getCategory() : "Other";
            categoryTotals.merge(cat, exp.getAmount(), Double::sum);
        }

        List<Map.Entry<String, Double>> sortedCategories = categoryTotals.entrySet().stream()
                .sorted(Map.Entry.<String, Double>comparingByValue().reversed())
                .toList();

        List<CategoryReportResponse> categoryBreakdown = new ArrayList<>();
        int colorIdx = 0;
        String topCategoryName = "None";
        double topCategoryAmount = 0.0;
        double topCategoryPercentage = 0.0;

        for (Map.Entry<String, Double> entry : sortedCategories) {
            double percent = totalSpending > 0
                    ? Math.round((entry.getValue() / totalSpending) * 1000.0) / 10.0
                    : 0.0;

            if (colorIdx == 0) {
                topCategoryName = entry.getKey();
                topCategoryAmount = entry.getValue();
                topCategoryPercentage = percent;
            }

            categoryBreakdown.add(new CategoryReportResponse(
                    entry.getKey(),
                    Math.round(entry.getValue() * 100.0) / 100.0,
                    percent,
                    PALETTE.get(colorIdx % PALETTE.size())
            ));
            colorIdx++;
        }

        // 3. Recent Transactions (sorted newest first, max 7)
        List<Expense> recentTransactions = periodExpenses.stream()
                .sorted(Comparator.comparing(Expense::getExpenseDate, Comparator.nullsLast(Comparator.reverseOrder())))
                .limit(7)
                .toList();

        // 4. Monthly Spending Trend (last 6 months)
        List<DashboardAnalyticsResponse.MonthlyTrendPoint> monthlyTrend = new ArrayList<>();
        for (int i = 5; i >= 0; i--) {
            LocalDate mTarget = now.minusMonths(i);
            LocalDate mStart = mTarget.withDayOfMonth(1);
            LocalDate mEnd = mTarget.withDayOfMonth(mTarget.lengthOfMonth());

            List<Expense> mExpenses = allUserExpenses.stream()
                    .filter(e -> e.getExpenseDate() != null
                            && !e.getExpenseDate().isBefore(mStart)
                            && !e.getExpenseDate().isAfter(mEnd))
                    .toList();

            double mExp = mExpenses.stream()
                    .filter(e -> !"INCOME".equalsIgnoreCase(e.getType()))
                    .mapToDouble(e -> e.getAmount() != null ? e.getAmount() : 0.0)
                    .sum();

            double mInc = mExpenses.stream()
                    .filter(e -> "INCOME".equalsIgnoreCase(e.getType()))
                    .mapToDouble(e -> e.getAmount() != null ? e.getAmount() : 0.0)
                    .sum();

            monthlyTrend.add(DashboardAnalyticsResponse.MonthlyTrendPoint.builder()
                    .monthLabel(mTarget.getMonth().getDisplayName(TextStyle.SHORT, Locale.ENGLISH))
                    .year(mTarget.getYear())
                    .month(mTarget.getMonthValue())
                    .expenses(Math.round(mExp * 100.0) / 100.0)
                    .income(Math.round(mInc * 100.0) / 100.0)
                    .netSavings(Math.round((mInc - mExp) * 100.0) / 100.0)
                    .build());
        }

        // 5. Smart Budget Alerts & Budget Usage
        List<BudgetSummaryResponse> allBudgets = budgetService.getBudgetSummary(now.getYear(), now.getMonthValue(), email);
        double totalBudgetLimit = allBudgets.stream().mapToDouble(BudgetSummaryResponse::getMonthlyLimit).sum();
        double totalBudgetSpent = allBudgets.stream().mapToDouble(BudgetSummaryResponse::getTotalSpent).sum();
        double budgetUsage = totalBudgetLimit > 0
                ? Math.round((totalBudgetSpent / totalBudgetLimit) * 1000.0) / 10.0
                : 0.0;

        List<BudgetSummaryResponse> budgetAlerts = allBudgets.stream()
                .filter(b -> !"NORMAL".equalsIgnoreCase(b.getStatusCode()))
                .toList();

        // 6. Recurring Payment Summary
        RecurringSummaryResponse recurringSummary = recurringExpenseService.getSummary(email);

        // 7. Savings Goal Progress
        List<SavingsGoal> goals = savingsGoalRepository.findByUser(user);
        double totalTarget = goals.stream().mapToDouble(SavingsGoal::getTargetAmount).sum();
        double totalSaved = goals.stream().mapToDouble(SavingsGoal::getCurrentAmount).sum();
        double goalProgress = totalTarget > 0
                ? Math.round((totalSaved / totalTarget) * 1000.0) / 10.0
                : 0.0;
        int completedGoals = (int) goals.stream().filter(g -> g.getCurrentAmount() >= g.getTargetAmount()).count();

        DashboardAnalyticsResponse.GoalSummarySnippet goalsSummary = DashboardAnalyticsResponse.GoalSummarySnippet.builder()
                .totalGoals(goals.size())
                .completedGoals(completedGoals)
                .totalTarget(Math.round(totalTarget * 100.0) / 100.0)
                .totalSaved(Math.round(totalSaved * 100.0) / 100.0)
                .progressPercentage(goalProgress)
                .build();

        return DashboardAnalyticsResponse.builder()
                .period(normPeriod)
                .periodLabel(periodLabel)
                .totalIncome(Math.round(totalIncome * 100.0) / 100.0)
                .totalSpending(Math.round(totalSpending * 100.0) / 100.0)
                .netSavings(Math.round(netSavings * 100.0) / 100.0)
                .savingsRate(savingsRate)
                .budgetUsagePercentage(budgetUsage)
                .totalBudgetLimit(Math.round(totalBudgetLimit * 100.0) / 100.0)
                .totalBudgetSpent(Math.round(totalBudgetSpent * 100.0) / 100.0)
                .topSpendingCategory(topCategoryName)
                .topCategoryAmount(Math.round(topCategoryAmount * 100.0) / 100.0)
                .topCategoryPercentage(topCategoryPercentage)
                .recentTransactions(recentTransactions)
                .categoryBreakdown(categoryBreakdown)
                .monthlyTrend(monthlyTrend)
                .budgetAlerts(budgetAlerts)
                .recurringSummary(recurringSummary)
                .goalsSummary(goalsSummary)
                .totalTransactionsCount(periodExpenses.size())
                .build();
    }

    private User getUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found: " + email));
    }
}
