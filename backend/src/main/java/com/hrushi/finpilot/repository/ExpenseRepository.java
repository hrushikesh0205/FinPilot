package com.hrushi.finpilot.repository;

import com.hrushi.finpilot.entity.Expense;
import com.hrushi.finpilot.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ExpenseRepository extends JpaRepository<Expense, Long> {

    List<Expense> findByUser(User user);

}