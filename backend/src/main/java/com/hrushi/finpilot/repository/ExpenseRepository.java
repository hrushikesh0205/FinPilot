package com.hrushi.finpilot.repository;

import com.hrushi.finpilot.entity.Expense;
import com.hrushi.finpilot.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface ExpenseRepository extends JpaRepository<Expense, Long> {

    // Get all expenses of logged-in user
    List<Expense> findByUser(User user);

    // Find expense by id and logged-in user (ownership check)
    Optional<Expense> findByIdAndUser(Long id, User user);

    // Get expenses by category of logged-in user
    List<Expense> findByCategoryAndUser(String category, User user);

    List<Expense> findByUserAndExpenseDate(User user, LocalDate expenseDate);

    List<Expense> findByTitleContainingIgnoreCaseAndUser(String title, User user);

    List<Expense> findByUserAndExpenseDateBetween(
            User user,
            LocalDate startDate,
            LocalDate endDate
    );

    Page<Expense> findByUser(User user, Pageable pageable);

    List<Expense> findByUser(User user, Sort sort);

    // Fingerprint duplicate detection
    boolean existsByUserAndFingerprint(User user, String fingerprint);

    Optional<Expense> findByUserAndFingerprint(User user, String fingerprint);

    // Filter by type (EXPENSE vs INCOME)
    List<Expense> findByUserAndType(User user, String type);

    List<Expense> findByUserAndTypeAndExpenseDateBetween(User user, String type, LocalDate startDate, LocalDate endDate);
}