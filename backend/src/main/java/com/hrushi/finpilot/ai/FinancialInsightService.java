package com.hrushi.finpilot.ai;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.hrushi.finpilot.dto.FinancialInsightResponse;
import com.hrushi.finpilot.entity.Budget;
import com.hrushi.finpilot.entity.Expense;
import com.hrushi.finpilot.entity.User;
import com.hrushi.finpilot.repository.BudgetRepository;
import com.hrushi.finpilot.repository.ExpenseRepository;
import com.hrushi.finpilot.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class FinancialInsightService {

    private final ExpenseRepository expenseRepository;
    private final BudgetRepository budgetRepository;
    private final UserRepository userRepository;
    private final OpenRouterService openRouterService;
    private final ObjectMapper objectMapper;

    private static final String SYSTEM_PROMPT = """
            You are FinPilot AI, an elite personal financial advisor and money management coach.
            Analyze the user's spending data, categories, and budgets, and provide actionable, intelligent insights.
            Your response must strictly be a valid JSON object matching the requested schema.
            """;

    public FinancialInsightResponse getInsights(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found: " + email));

        List<Expense> expenses = expenseRepository.findByUser(user);
        List<Budget> budgets = budgetRepository.findByUser(user);

        double totalBudget = budgets.stream()
                .mapToDouble(b -> b.getMonthlyLimit() != null ? b.getMonthlyLimit() : 0.0)
                .sum();

        if (expenses == null || expenses.isEmpty()) {
            return FinancialInsightResponse.builder()
                    .summary("No expense records found yet. Once you add your expenses or scan receipts, AI will analyze your spending patterns and suggest personalized savings tips.")
                    .keyInsights(List.of(
                            "Start logging your daily transactions or scan receipts in the Scanner tab.",
                            "Set monthly budgets for top categories to receive real-time budget warnings.",
                            "Track spending across essentials like Food, Bills, and Transport."
                    ))
                    .recommendations(List.of(
                            "Add your first expense or upload a receipt to generate smart insights.",
                            "Define a budget limit in the Budgets section for the current month.",
                            "Review recurring bills to establish a baseline monthly savings goal."
                    ))
                    .totalSpent(0.0)
                    .totalBudget(totalBudget)
                    .currency("₹")
                    .build();
        }

        double totalSpent = expenses.stream()
                .mapToDouble(e -> e.getAmount() != null ? e.getAmount() : 0.0)
                .sum();

        LocalDate now = LocalDate.now();
        int currentMonth = now.getMonthValue();
        int currentYear = now.getYear();

        double currentMonthSpent = expenses.stream()
                .filter(e -> e.getExpenseDate() != null
                        && e.getExpenseDate().getMonthValue() == currentMonth
                        && e.getExpenseDate().getYear() == currentYear)
                .mapToDouble(e -> e.getAmount() != null ? e.getAmount() : 0.0)
                .sum();

        Map<String, Double> categoryTotals = expenses.stream()
                .filter(e -> e.getCategory() != null && e.getAmount() != null)
                .collect(Collectors.groupingBy(
                        Expense::getCategory,
                        Collectors.summingDouble(Expense::getAmount)
                ));

        // Format recent expenses (up to 10)
        List<Expense> recentExpenses = expenses.stream()
                .filter(e -> e.getExpenseDate() != null)
                .sorted(Comparator.comparing(Expense::getExpenseDate).reversed())
                .limit(10)
                .toList();

        StringBuilder dataSummary = new StringBuilder();
        dataSummary.append("User Financial Overview (Currency: INR / ₹):\n");
        dataSummary.append(String.format("- Total Historical Spending: ₹%.2f across %d transactions\n", totalSpent, expenses.size()));
        dataSummary.append(String.format("- Current Month (%d/%d) Spending: ₹%.2f\n", currentMonth, currentYear, currentMonthSpent));
        dataSummary.append(String.format("- Total Monthly Budget Limits Set: ₹%.2f\n", totalBudget));

        dataSummary.append("\nCategory-wise Spending Breakdown:\n");
        categoryTotals.forEach((cat, amt) ->
                dataSummary.append(String.format("  * %s: ₹%.2f (%.1f%% of total)\n",
                        cat, amt, totalSpent > 0 ? (amt / totalSpent * 100) : 0))
        );

        if (!budgets.isEmpty()) {
            dataSummary.append("\nCategory Budgets:\n");
            for (Budget b : budgets) {
                double catSpentCurrentMonth = expenses.stream()
                        .filter(e -> e.getCategory() != null
                                && e.getCategory().equalsIgnoreCase(b.getCategory())
                                && e.getExpenseDate() != null
                                && e.getExpenseDate().getMonthValue() == b.getMonth()
                                && e.getExpenseDate().getYear() == b.getYear())
                        .mapToDouble(e -> e.getAmount() != null ? e.getAmount() : 0.0)
                        .sum();
                dataSummary.append(String.format("  * %s (Month %d/%d): Limit ₹%.2f | Spent ₹%.2f | Status: %s\n",
                        b.getCategory(), b.getMonth(), b.getYear(), b.getMonthlyLimit(), catSpentCurrentMonth,
                        catSpentCurrentMonth > b.getMonthlyLimit() ? "EXCEEDED" : "Within Limit"));
            }
        }

        dataSummary.append("\nRecent 10 Transactions:\n");
        for (Expense e : recentExpenses) {
            dataSummary.append(String.format("  * %s | %s | ₹%.2f | %s\n",
                    e.getExpenseDate(), e.getTitle(), e.getAmount(), e.getCategory()));
        }

        String userPrompt = String.format("""
                Based on the following real financial data, generate personalized financial insights and recommendations:

                %s

                Return a JSON object strictly following this structure:
                {
                  "summary": "A concise 2-3 sentence overview of the user's spending habits, overall financial discipline, and budget status.",
                  "keyInsights": [
                    "Insight 1 (e.g. top spending category analysis or trend)",
                    "Insight 2 (e.g. budget utilization or overspending alert)",
                    "Insight 3 (e.g. pattern observed in recent purchases or potential savings area)"
                  ],
                  "recommendations": [
                    "Actionable recommendation 1 (practical, specific tip with realistic savings estimate)",
                    "Actionable recommendation 2",
                    "Actionable recommendation 3"
                  ]
                }
                """, dataSummary);

        try {
            String jsonResponse = openRouterService.chat(userPrompt, SYSTEM_PROMPT);
            FinancialInsightResponse response = objectMapper.readValue(jsonResponse, FinancialInsightResponse.class);

            if (response.getKeyInsights() == null) {
                response.setKeyInsights(new ArrayList<>());
            }
            if (response.getRecommendations() == null) {
                response.setRecommendations(new ArrayList<>());
            }
            response.setTotalSpent(totalSpent);
            response.setTotalBudget(totalBudget);
            response.setCurrency("₹");

            return response;

        } catch (Exception e) {
            log.error("Failed to generate AI insights via OpenRouter, building fallback insight", e);
            // Fallback response with calculated metrics so the user always sees value
            return FinancialInsightResponse.builder()
                    .summary(String.format("You have tracked ₹%.2f across %d transactions with a total budget limit of ₹%.2f.",
                            totalSpent, expenses.size(), totalBudget))
                    .keyInsights(List.of(
                            String.format("Top spending category: %s", getTopCategory(categoryTotals)),
                            String.format("Current month spending is ₹%.2f", currentMonthSpent),
                            totalBudget > 0 && currentMonthSpent > totalBudget
                                    ? "Alert: Current month spending has exceeded your total budget limits!"
                                    : "You are currently within your planned overall budget."
                    ))
                    .recommendations(List.of(
                            "Review your highest expenditure category to identify potential subscriptions or cutbacks.",
                            "Keep uploading receipts and logging expenses daily for more granular AI trend analysis.",
                            "Consider setting category-specific budgets if you have not already."
                    ))
                    .totalSpent(totalSpent)
                    .totalBudget(totalBudget)
                    .currency("₹")
                    .build();
        }
    }

    private String getTopCategory(Map<String, Double> categoryTotals) {
        return categoryTotals.entrySet().stream()
                .max(Map.Entry.comparingByValue())
                .map(e -> String.format("%s (₹%.2f)", e.getKey(), e.getValue()))
                .orElse("None");
    }
}
