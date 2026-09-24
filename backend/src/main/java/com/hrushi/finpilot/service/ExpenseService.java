package com.hrushi.finpilot.service;

import com.hrushi.finpilot.dto.DashboardResponse;
import com.hrushi.finpilot.entity.Expense;
import com.hrushi.finpilot.entity.User;
import com.hrushi.finpilot.exception.DuplicateTransactionException;
import com.hrushi.finpilot.exception.ResourceNotFoundException;
import com.hrushi.finpilot.repository.ExpenseRepository;
import com.hrushi.finpilot.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class ExpenseService {

    private final ExpenseRepository expenseRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    // Save Expense with Duplicate Detection
    @Transactional
    public Expense saveExpense(Expense expense, String email) {
        User user = getUser(email);

        if (expense.getTitle() == null || expense.getTitle().trim().isEmpty()) {
            throw new IllegalArgumentException("Title is required and cannot be blank");
        }
        if (expense.getAmount() == null || expense.getAmount() <= 0) {
            throw new IllegalArgumentException("Amount is required and must be greater than zero");
        }

        if (expense.getType() == null || expense.getType().isBlank()) {
            expense.setType("EXPENSE");
        }
        if (expense.getAccount() == null || expense.getAccount().isBlank()) {
            expense.setAccount("Cash");
        }
        if (expense.getExpenseDate() == null) {
            expense.setExpenseDate(LocalDate.now());
        }

        // Generate and verify fingerprint
        String fingerprint = Expense.buildFingerprint(
                expense.getExpenseDate(),
                expense.getTitle(),
                expense.getAmount(),
                expense.getAccount()
        );
        expense.setFingerprint(fingerprint);

        // Application-level pre-check for duplicate transaction
        if (expenseRepository.existsByUserAndFingerprint(user, fingerprint)) {
            throw new DuplicateTransactionException(
                    "Duplicate transaction detected: A transaction on " + expense.getExpenseDate() +
                    " for '" + expense.getTitle() + "' (₹" + String.format("%.2f", expense.getAmount()) +
                    ") under account '" + expense.getAccount() + "' already exists."
            );
        }

        expense.setUser(user);
        Expense saved = expenseRepository.save(expense);

        // Notify user
        String action = "INCOME".equalsIgnoreCase(saved.getType()) ? "Income" : "Expense";
        notificationService.createNotification(
                user,
                action.toLowerCase(),
                action + " added",
                action + " '" + saved.getTitle() + "' of ₹" +
                        String.format("%.0f", saved.getAmount()) + " added successfully."
        );

        return saved;
    }

    // Get All Expenses of Logged-in User
    public List<Expense> getAllExpenses(String email) {
        User user = getUser(email);
        return expenseRepository.findByUser(user);
    }

    // Get Expense By Id (Secured by user)
    public Expense getExpenseById(Long id, String email) {
        User user = getUser(email);
        return expenseRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new ResourceNotFoundException("Expense not found with id: " + id));
    }

    // Update Expense (Only Owner)
    @Transactional
    public Expense updateExpense(Long id, Expense expenseDetails, String email) {
        User user = getUser(email);

        Expense expense = expenseRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new ResourceNotFoundException("Expense not found with id: " + id));

        expense.setTitle(expenseDetails.getTitle());
        expense.setAmount(expenseDetails.getAmount());
        expense.setCategory(expenseDetails.getCategory());
        if (expenseDetails.getExpenseDate() != null) {
            expense.setExpenseDate(expenseDetails.getExpenseDate());
        }
        if (expenseDetails.getType() != null) {
            expense.setType(expenseDetails.getType());
        }
        if (expenseDetails.getAccount() != null) {
            expense.setAccount(expenseDetails.getAccount());
        }
        if (expenseDetails.getNotes() != null) {
            expense.setNotes(expenseDetails.getNotes());
        }

        // Recompute fingerprint
        expense.setFingerprint(Expense.buildFingerprint(
                expense.getExpenseDate(),
                expense.getTitle(),
                expense.getAmount(),
                expense.getAccount()
        ));

        Expense updated = expenseRepository.save(expense);

        notificationService.createNotification(
                user,
                "expense",
                "Transaction updated",
                "Transaction '" + updated.getTitle() + "' updated to ₹" +
                        String.format("%.0f", updated.getAmount()) + "."
        );

        return updated;
    }

    // Delete Expense (Only Owner)
    @Transactional
    public String deleteExpense(Long id, String email) {
        User user = getUser(email);

        Expense expense = expenseRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new ResourceNotFoundException("Expense not found with id: " + id));

        String title = expense.getTitle();
        expenseRepository.delete(expense);

        notificationService.createNotification(
                user,
                "expense",
                "Transaction deleted",
                "Transaction '" + title + "' has been deleted."
        );

        return "Expense Deleted Successfully";
    }

    // Dashboard Summary
    public DashboardResponse getDashboardSummary(String email) {
        User user = getUser(email);

        List<Expense> expenses = expenseRepository.findByUser(user);

        double totalExpenses = expenses.stream()
                .filter(e -> !"INCOME".equalsIgnoreCase(e.getType()))
                .mapToDouble(e -> e.getAmount() != null ? e.getAmount() : 0.0)
                .sum();

        long totalTransactions = expenses.size();

        double highestExpense = expenses.stream()
                .filter(e -> !"INCOME".equalsIgnoreCase(e.getType()))
                .mapToDouble(e -> e.getAmount() != null ? e.getAmount() : 0.0)
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
        User user = getUser(email);
        return expenseRepository.findByCategoryAndUser(category, user);
    }

    // Get Expenses By Date
    public List<Expense> getExpensesByDate(LocalDate expenseDate, String email) {
        User user = getUser(email);
        return expenseRepository.findByUserAndExpenseDate(user, expenseDate);
    }

    // Monthly Analytics
    public DashboardResponse getMonthlySummary(int year, int month, String email) {
        User user = getUser(email);

        LocalDate startDate = LocalDate.of(year, month, 1);
        LocalDate endDate = startDate.withDayOfMonth(startDate.lengthOfMonth());

        List<Expense> expenses = expenseRepository
                .findByUserAndExpenseDateBetween(user, startDate, endDate);

        double totalExpenses = expenses.stream()
                .filter(e -> !"INCOME".equalsIgnoreCase(e.getType()))
                .mapToDouble(e -> e.getAmount() != null ? e.getAmount() : 0.0)
                .sum();

        long totalTransactions = expenses.size();

        double highestExpense = expenses.stream()
                .filter(e -> !"INCOME".equalsIgnoreCase(e.getType()))
                .mapToDouble(e -> e.getAmount() != null ? e.getAmount() : 0.0)
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
        User user = getUser(email);
        return expenseRepository.findByTitleContainingIgnoreCaseAndUser(keyword, user);
    }

    // Get Expenses with Pagination
    public Page<Expense> getExpensesWithPagination(String email, int page, int size) {
        User user = getUser(email);
        Pageable pageable = PageRequest.of(page, size);
        return expenseRepository.findByUser(user, pageable);
    }

    // Get Expenses with Sorting
    public List<Expense> getSortedExpenses(String email, String field, String direction) {
        User user = getUser(email);
        Sort sort = direction.equalsIgnoreCase("desc")
                ? Sort.by(field).descending()
                : Sort.by(field).ascending();
        return expenseRepository.findByUser(user, sort);
    }

    // Centralized check for duplicate existence
    public boolean isDuplicate(LocalDate date, String title, Double amount, String account, String email) {
        User user = getUser(email);
        String fp = Expense.buildFingerprint(date, title, amount, account);
        return expenseRepository.existsByUserAndFingerprint(user, fp);
    }

    private User getUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found: " + email));
    }
}