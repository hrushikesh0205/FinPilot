package com.hrushi.finpilot.service;

import com.hrushi.finpilot.entity.Expense;
import com.hrushi.finpilot.repository.ExpenseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ExpenseService {

    @Autowired
    private ExpenseRepository expenseRepository;

    public Expense saveExpense(Expense expense) {
        return expenseRepository.save(expense);
    }

    public List<Expense> getAllExpenses() {
        return expenseRepository.findAll();
    }

    public Expense getExpenseById(Long id) {
        return expenseRepository.findById(id).orElse(null);
    }
    public Expense updateExpense(Long id, Expense expenseDetails) {

        Expense expense = expenseRepository.findById(id).orElse(null);

        if(expense != null) {
            expense.setTitle(expenseDetails.getTitle());
            expense.setAmount(expenseDetails.getAmount());
            expense.setCategory(expenseDetails.getCategory());

            return expenseRepository.save(expense);
        }

        return null;
    }
    public String deleteExpense(Long id) {

        expenseRepository.deleteById(id);

        return "Expense Deleted Successfully";
    }
}