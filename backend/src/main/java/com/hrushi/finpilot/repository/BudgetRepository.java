package com.hrushi.finpilot.repository;

import com.hrushi.finpilot.entity.Budget;
import com.hrushi.finpilot.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BudgetRepository extends JpaRepository<Budget, Long> {

    // Get all budgets of logged-in user
    List<Budget> findByUser(User user);

    // Find budget by id and logged-in user
    Optional<Budget> findByIdAndUser(Long id, User user);

    // Find specific budget for a category, month and year
    Optional<Budget> findByCategoryAndMonthAndYearAndUser(String category, int month, int year, User user);

    // Get all budgets for a specific month and year
    List<Budget> findByMonthAndYearAndUser(int month, int year, User user);
}
