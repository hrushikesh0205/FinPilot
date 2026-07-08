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

        return budgetRepository.save(budget);
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

        return budgetRepository.save(budget);
    }

    // Delete Budget (Only Owner)
    public String deleteBudget(Long id, String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Budget budget = budgetRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new ResourceNotFoundException("Budget not found with id: " + id));

        budgetRepository.delete(budget);

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
