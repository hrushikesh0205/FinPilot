package com.hrushi.finpilot.service;

import com.hrushi.finpilot.entity.Expense;
import com.hrushi.finpilot.entity.User;
import com.hrushi.finpilot.repository.ExpenseRepository;
import com.hrushi.finpilot.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.hrushi.finpilot.dto.DashboardResponse;
import java.time.LocalDate;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

@Service
public class ExpenseService {

    @Autowired
    private ExpenseRepository expenseRepository;

    @Autowired
    private UserRepository userRepository;

    // Save Expense
    public Expense saveExpense(Expense expense, String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        expense.setUser(user);

        return expenseRepository.save(expense);
    }

    // Get All Expenses of Logged-in User
    public List<Expense> getAllExpenses(String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return expenseRepository.findByUser(user);
    }

    // Get Expense By Id
    public Expense getExpenseById(Long id) {

        return expenseRepository.findById(id)
                .orElse(null);
    }

    // Update Expense (Only Owner)
    public Expense updateExpense(Long id, Expense expenseDetails, String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Expense expense = expenseRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new RuntimeException("Expense not found"));

        expense.setTitle(expenseDetails.getTitle());
        expense.setAmount(expenseDetails.getAmount());
        expense.setCategory(expenseDetails.getCategory());

        return expenseRepository.save(expense);
    }

    // Delete Expense (Only Owner)
    public String deleteExpense(Long id, String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Expense expense = expenseRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new RuntimeException("Expense not found"));

        expenseRepository.delete(expense);

        return "Expense Deleted Successfully";
    }
    // Dashboard Summary
    public DashboardResponse getDashboardSummary(String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<Expense> expenses = expenseRepository.findByUser(user);

        double totalExpenses = expenses.stream()
                .mapToDouble(Expense::getAmount)
                .sum();

        long totalTransactions = expenses.size();

        double highestExpense = expenses.stream()
                .mapToDouble(Expense::getAmount)
                .max()
                .orElse(0.0);

        return new DashboardResponse(
                totalExpenses,
                totalTransactions,
                highestExpense
        );
    }
    // Get Expenses By Category
    public List<Expense> getExpensesByCategory(String category, String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return expenseRepository.findByCategoryAndUser(category, user);
    }
    // Get Expenses By Date
    public List<Expense> getExpensesByDate(LocalDate expenseDate, String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return expenseRepository.findByUserAndExpenseDate(user, expenseDate);
    }

    // Monthly Analytics
    public DashboardResponse getMonthlySummary(int year, int month, String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        LocalDate startDate = LocalDate.of(year, month, 1);
        LocalDate endDate = startDate.withDayOfMonth(startDate.lengthOfMonth());

        List<Expense> expenses = expenseRepository
                .findByUserAndExpenseDateBetween(user, startDate, endDate);

        double totalExpenses = expenses.stream()
                .mapToDouble(Expense::getAmount)
                .sum();

        long totalTransactions = expenses.size();

        double highestExpense = expenses.stream()
                .mapToDouble(Expense::getAmount)
                .max()
                .orElse(0.0);

        return new DashboardResponse(
                totalExpenses,
                totalTransactions,
                highestExpense
        );
    }
    // Search Expenses By Title
    public List<Expense> searchExpenses(String keyword, String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return expenseRepository.findByTitleContainingIgnoreCaseAndUser(keyword, user);
    }
    // Get Expenses with Pagination
    public Page<Expense> getExpensesWithPagination(String email, int page, int size) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Pageable pageable = PageRequest.of(page, size);

        return expenseRepository.findByUser(user, pageable);
    }
}