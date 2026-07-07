package com.hrushi.finpilot.repository;

import com.hrushi.finpilot.entity.Expense;
import com.hrushi.finpilot.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.time.LocalDate;

@Repository
public interface ExpenseRepository extends JpaRepository<Expense, Long> {

    // Get all expenses of logged-in user
    List<Expense> findByUser(User user);

    // Find expense by id and logged-in user
    Optional<Expense> findByIdAndUser(Long id, User user);

    // Get expenses by category of logged-in user
    List<Expense> findByCategoryAndUser(String category, User user);

    List<Expense> findByUserAndExpenseDate(User user, LocalDate expenseDate);

    List<Expense> findByUserAndExpenseDateBetween(
            User user,
            LocalDate startDate,
            LocalDate endDate
    );
}