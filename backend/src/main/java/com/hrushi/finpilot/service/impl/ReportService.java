package com.hrushi.finpilot.service;

import com.hrushi.finpilot.dto.CategoryReportResponse;
import com.hrushi.finpilot.dto.MonthlyReportResponse;
import com.hrushi.finpilot.dto.ReportSummaryResponse;
import com.hrushi.finpilot.entity.Expense;
import com.hrushi.finpilot.entity.User;
import com.hrushi.finpilot.repository.ExpenseRepository;
import com.hrushi.finpilot.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.TextStyle;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class ReportService {

    private static final List<String> CHART_COLORS = List.of(
            "#f97316", "#06b6d4", "#ec4899", "#8b5cf6",
            "#ef4444", "#22c55e", "#3b82f6", "#10b981",
            "#f59e0b", "#6366f1", "#14b8a6", "#e11d48"
    );

    @Autowired
    private ExpenseRepository expenseRepository;

    @Autowired
    private UserRepository userRepository;

    // ── Overall summary (all-time) ────────────────────────────────────────
    public ReportSummaryResponse getSummary(String email) {
        User user = getUser(email);
        List<Expense> expenses = expenseRepository.findByUser(user);

        if (expenses.isEmpty()) {
            return new ReportSummaryResponse(0, 0, 0, 0);
        }

        double total = expenses.stream().mapToDouble(Expense::getAmount).sum();
        double highest = expenses.stream().mapToDouble(Expense::getAmount).max().orElse(0);
        double avg = total / expenses.size();

        return new ReportSummaryResponse(total, expenses.size(), highest, avg);
    }

    // ── Last 6 months of expense totals ──────────────────────────────────
    public List<MonthlyReportResponse> getMonthlyReport(String email) {
        User user = getUser(email);

        LocalDate now = LocalDate.now();
        List<MonthlyReportResponse> result = new ArrayList<>();

        for (int i = 5; i >= 0; i--) {
            LocalDate targetMonth = now.minusMonths(i);
            LocalDate startDate = targetMonth.withDayOfMonth(1);
            LocalDate endDate = targetMonth.withDayOfMonth(targetMonth.lengthOfMonth());

            List<Expense> monthExpenses = expenseRepository
                    .findByUserAndExpenseDateBetween(user, startDate, endDate);

            double totalExpense = monthExpenses.stream()
                    .mapToDouble(Expense::getAmount)
                    .sum();

            String monthLabel = targetMonth.getMonth()
                    .getDisplayName(TextStyle.SHORT, Locale.ENGLISH);

            result.add(new MonthlyReportResponse(
                    monthLabel,
                    targetMonth.getYear(),
                    targetMonth.getMonthValue(),
                    totalExpense
            ));
        }

        return result;
    }

    // ── Expense by category (all-time) ────────────────────────────────────
    public List<CategoryReportResponse> getCategoryReport(String email) {
        User user = getUser(email);
        List<Expense> expenses = expenseRepository.findByUser(user);

        if (expenses.isEmpty()) {
            return Collections.emptyList();
        }

        // Sum by category
        Map<String, Double> categoryMap = new LinkedHashMap<>();
        for (Expense e : expenses) {
            String cat = e.getCategory() != null ? e.getCategory() : "Other";
            categoryMap.merge(cat, e.getAmount(), Double::sum);
        }

        double totalExpense = categoryMap.values().stream().mapToDouble(Double::doubleValue).sum();

        // Sort descending by amount
        List<Map.Entry<String, Double>> sorted = categoryMap.entrySet().stream()
                .sorted(Map.Entry.<String, Double>comparingByValue().reversed())
                .collect(Collectors.toList());

        List<CategoryReportResponse> result = new ArrayList<>();
        int colorIdx = 0;
        for (Map.Entry<String, Double> entry : sorted) {
            double percent = totalExpense > 0
                    ? Math.round((entry.getValue() / totalExpense) * 100.0 * 10.0) / 10.0
                    : 0;
            result.add(new CategoryReportResponse(
                    entry.getKey(),
                    entry.getValue(),
                    percent,
                    CHART_COLORS.get(colorIdx % CHART_COLORS.size())
            ));
            colorIdx++;
        }

        return result;
    }

    private User getUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
}
