package com.hrushi.finpilot.service;

import com.hrushi.finpilot.dto.BudgetRequest;
import com.hrushi.finpilot.dto.BudgetSummaryResponse;
import com.hrushi.finpilot.entity.Budget;
import com.hrushi.finpilot.entity.Expense;
import com.hrushi.finpilot.entity.User;
import com.hrushi.finpilot.exception.ResourceNotFoundException;
import com.hrushi.finpilot.repository.BudgetRepository;
import com.hrushi.finpilot.repository.ExpenseRepository;
import com.hrushi.finpilot.repository.NotificationRepository;
import com.hrushi.finpilot.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class BudgetService {

    private final BudgetRepository budgetRepository;
    private final ExpenseRepository expenseRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;
    private final NotificationRepository notificationRepository;

    // Create Budget
    @Transactional
    public Budget createBudget(BudgetRequest request, String email) {
        User user = getUser(email);

        Budget budget = new Budget();
        budget.setCategory(request.getCategory());
        budget.setMonthlyLimit(request.getMonthlyLimit());
        budget.setMonth(request.getMonth());
        budget.setYear(request.getYear());
        budget.setUser(user);

        Budget saved = budgetRepository.save(budget);

        // Notify user
        notificationService.createNotification(
                user,
                "budget",
                "Budget created",
                "Monthly budget for '" + saved.getCategory() + "' created — ₹" +
                        String.format("%.0f", saved.getMonthlyLimit()) + "/month."
        );

        return saved;
    }

    // Get All Budgets of Logged-in User
    public List<Budget> getAllBudgets(String email) {
        User user = getUser(email);
        return budgetRepository.findByUser(user);
    }

    // Get Budget By Id
    public Budget getBudgetById(Long id, String email) {
        User user = getUser(email);
        return budgetRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new ResourceNotFoundException("Budget not found with id: " + id));
    }

    // Update Budget (Only Owner)
    @Transactional
    public Budget updateBudget(Long id, BudgetRequest request, String email) {
        User user = getUser(email);

        Budget budget = budgetRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new ResourceNotFoundException("Budget not found with id: " + id));

        budget.setCategory(request.getCategory());
        budget.setMonthlyLimit(request.getMonthlyLimit());
        budget.setMonth(request.getMonth());
        budget.setYear(request.getYear());

        Budget updated = budgetRepository.save(budget);

        // Notify user
        notificationService.createNotification(
                user,
                "budget",
                "Budget updated",
                "Budget for '" + updated.getCategory() + "' updated to ₹" +
                        String.format("%.0f", updated.getMonthlyLimit()) + "/month."
        );

        return updated;
    }

    // Delete Budget (Only Owner)
    @Transactional
    public String deleteBudget(Long id, String email) {
        User user = getUser(email);

        Budget budget = budgetRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new ResourceNotFoundException("Budget not found with id: " + id));

        String category = budget.getCategory();
        budgetRepository.delete(budget);

        // Notify user
        notificationService.createNotification(
                user,
                "budget",
                "Budget deleted",
                "Budget for '" + category + "' has been deleted."
        );

        return "Budget Deleted Successfully";
    }

    // Budget Summary: compare limits vs actual spending per category for a month with Smart Alerts
    public List<BudgetSummaryResponse> getBudgetSummary(int year, int month, String email) {
        User user = getUser(email);

        List<Budget> budgets = budgetRepository.findByMonthAndYearAndUser(month, year, user);

        LocalDate startDate = LocalDate.of(year, month, 1);
        LocalDate endDate = startDate.withDayOfMonth(startDate.lengthOfMonth());

        List<Expense> expenses = expenseRepository.findByUserAndExpenseDateBetween(user, startDate, endDate);

        List<BudgetSummaryResponse> summaries = new ArrayList<>();

        for (Budget budget : budgets) {
            double totalSpent = expenses.stream()
                    .filter(e -> !"INCOME".equalsIgnoreCase(e.getType()))
                    .filter(e -> e.getCategory() != null && e.getCategory().equalsIgnoreCase(budget.getCategory()))
                    .mapToDouble(e -> e.getAmount() != null ? e.getAmount() : 0.0)
                    .sum();

            double limit = budget.getMonthlyLimit() != null ? budget.getMonthlyLimit() : 0.0;
            double remaining = Math.max(0, limit - totalSpent);
            boolean isOverBudget = totalSpent > limit;
            double usagePercent = limit > 0 ? (totalSpent / limit) * 100 : 0.0;
            usagePercent = Math.round(usagePercent * 10.0) / 10.0;

            // Determine status based on prompt specifications:
            // Below 80%: Normal
            // 80–89%: Approaching limit
            // 90–99%: Warning
            // 100%+: Over budget
            String statusCode;
            String status;

            if (usagePercent >= 100.0) {
                statusCode = "OVER_BUDGET";
                status = "Over budget";
                triggerBudgetAlertIfNeeded(user, budget.getCategory(), "Budget exceeded",
                        "Your " + budget.getCategory() + " budget has exceeded the monthly limit (₹" +
                                String.format("%.0f", totalSpent) + " spent of ₹" + String.format("%.0f", limit) + ").");
            } else if (usagePercent >= 90.0) {
                statusCode = "WARNING";
                status = "Warning";
                triggerBudgetAlertIfNeeded(user, budget.getCategory(), "Budget warning",
                        "Your " + budget.getCategory() + " budget is " + String.format("%.0f", usagePercent) + "% used.");
            } else if (usagePercent >= 80.0) {
                statusCode = "APPROACHING";
                status = "Approaching limit";
                triggerBudgetAlertIfNeeded(user, budget.getCategory(), "Budget approaching limit",
                        "Your " + budget.getCategory() + " budget is approaching its limit (" +
                                String.format("%.0f", usagePercent) + "% used).");
            } else {
                statusCode = "NORMAL";
                status = "Normal";
            }

            summaries.add(BudgetSummaryResponse.builder()
                    .budgetId(budget.getId())
                    .category(budget.getCategory())
                    .monthlyLimit(limit)
                    .totalSpent(Math.round(totalSpent * 100.0) / 100.0)
                    .remaining(Math.round((limit - totalSpent) * 100.0) / 100.0)
                    .percentageUsed(usagePercent)
                    .statusCode(statusCode)
                    .status(status)
                    .isOverBudget(isOverBudget)
                    .month(budget.getMonth())
                    .year(budget.getYear())
                    .build());
        }

        return summaries;
    }

    /**
     * Sends a budget alert notification if a similar alert was not sent within the last 48 hours
     */
    private void triggerBudgetAlertIfNeeded(User user, String category, String alertTitle, String alertMessage) {
        LocalDateTime cutoff = LocalDateTime.now().minusHours(48);
        String fullTitle = alertTitle + ": " + category;
        boolean alreadyNotified = notificationRepository
                .existsByUserAndTypeAndTitleAndCreatedAtAfter(user, "budget_alert", fullTitle, cutoff);

        if (!alreadyNotified) {
            notificationService.createNotification(
                    user,
                    "budget_alert",
                    fullTitle,
                    alertMessage
            );
        }
    }

    private User getUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found: " + email));
    }
}
