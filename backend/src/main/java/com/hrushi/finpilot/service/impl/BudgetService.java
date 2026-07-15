package com.hrushi.finpilot.service;

import com.hrushi.finpilot.dto.BudgetRequest;
import com.hrushi.finpilot.dto.BudgetSummaryResponse;
import com.hrushi.finpilot.entity.Budget;
import com.hrushi.finpilot.entity.Expense;
import com.hrushi.finpilot.entity.User;
import com.hrushi.finpilot.exception.ResourceNotFoundException;
import com.hrushi.finpilot.repository.BudgetRepository;
import com.hrushi.finpilot.repository.ExpenseRepository;
import com.hrushi.finpilot.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
public class BudgetService {

    @Autowired
    private BudgetRepository budgetRepository;

    @Autowired
    private ExpenseRepository expenseRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private NotificationService notificationService;

    // Create Budget
    public Budget createBudget(BudgetRequest request, String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

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

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return budgetRepository.findByUser(user);
    }

    // Get Budget By Id
    public Budget getBudgetById(Long id, String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return budgetRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new ResourceNotFoundException("Budget not found with id: " + id));
    }

    // Update Budget (Only Owner)
    public Budget updateBudget(Long id, BudgetRequest request, String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

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
    public String deleteBudget(Long id, String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

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

    // Budget Summary: compare limits vs actual spending per category for a month
    public List<BudgetSummaryResponse> getBudgetSummary(int year, int month, String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<Budget> budgets = budgetRepository.findByMonthAndYearAndUser(month, year, user);

        LocalDate startDate = LocalDate.of(year, month, 1);
        LocalDate endDate = startDate.withDayOfMonth(startDate.lengthOfMonth());

        List<Expense> expenses = expenseRepository.findByUserAndExpenseDateBetween(user, startDate, endDate);

        List<BudgetSummaryResponse> summaries = new ArrayList<>();

        for (Budget budget : budgets) {

            double totalSpent = expenses.stream()
                    .filter(e -> e.getCategory().equalsIgnoreCase(budget.getCategory()))
                    .mapToDouble(Expense::getAmount)
                    .sum();

            double remaining = budget.getMonthlyLimit() - totalSpent;
            boolean isOverBudget = totalSpent > budget.getMonthlyLimit();
            double usagePercent = budget.getMonthlyLimit() > 0
                    ? (totalSpent / budget.getMonthlyLimit()) * 100 : 0;

            // Fire alert notifications based on spending thresholds
            if (isOverBudget) {
                notificationService.createNotification(
                        user,
                        "budget_alert",
                        "Budget exceeded",
                        "You have exceeded your " + budget.getCategory() + " budget. Spent ₹" +
                                String.format("%.0f", totalSpent) + " of ₹" +
                                String.format("%.0f", budget.getMonthlyLimit()) + "."
                );
            } else if (usagePercent >= 80) {
                notificationService.createNotification(
                        user,
                        "budget_alert",
                        "Budget limit approaching",
                        "You have used " + String.format("%.0f", usagePercent) +
                                "% of your " + budget.getCategory() + " budget."
                );
            }

            summaries.add(new BudgetSummaryResponse(
                    budget.getCategory(),
                    budget.getMonthlyLimit(),
                    totalSpent,
                    remaining,
                    isOverBudget
            ));
        }

        return summaries;
    }
}
