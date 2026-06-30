package com.hrushi.finpilot.service;

import com.hrushi.finpilot.entity.Expense;
import com.hrushi.finpilot.entity.User;
import com.hrushi.finpilot.repository.ExpenseRepository;
import com.hrushi.finpilot.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

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

        return expenseRepository.findById(id).orElse(null);
    }

    // Update Expense
    public Expense updateExpense(Long id, Expense expenseDetails) {

        Expense expense = expenseRepository.findById(id).orElse(null);

        if (expense != null) {

            expense.setTitle(expenseDetails.getTitle());
            expense.setAmount(expenseDetails.getAmount());
            expense.setCategory(expenseDetails.getCategory());

            return expenseRepository.save(expense);
        }

        return null;
    }

    // Delete Expense
    public String deleteExpense(Long id) {

        expenseRepository.deleteById(id);

        return "Expense Deleted Successfully";
    }
}