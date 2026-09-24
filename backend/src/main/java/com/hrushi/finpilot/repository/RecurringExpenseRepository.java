package com.hrushi.finpilot.repository;

import com.hrushi.finpilot.entity.RecurringExpense;
import com.hrushi.finpilot.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RecurringExpenseRepository extends JpaRepository<RecurringExpense, Long> {

    List<RecurringExpense> findByUser(User user);

    List<RecurringExpense> findByUserAndStatus(User user, String status);

    Optional<RecurringExpense> findByIdAndUser(Long id, User user);

    Optional<RecurringExpense> findByUserAndTitleIgnoreCaseAndStatus(User user, String title, String status);

    boolean existsByUserAndTitleIgnoreCaseAndStatus(User user, String title, String status);
}
