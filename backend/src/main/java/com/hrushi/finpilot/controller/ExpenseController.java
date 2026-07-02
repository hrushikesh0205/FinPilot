package com.hrushi.finpilot.controller;

import com.hrushi.finpilot.entity.Expense;
import com.hrushi.finpilot.service.ExpenseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;

import java.util.List;

@RestController
@RequestMapping("/expenses")
public class ExpenseController {

    @Autowired
    private ExpenseService expenseService;

    // Add Expense
    @PostMapping
    public Expense addExpense(@RequestBody Expense expense,
                              Authentication authentication) {

        String email = authentication.getName();

        return expenseService.saveExpense(expense, email);
    }

    // Get All Expenses of Logged-in User
    @GetMapping
    public List<Expense> getAllExpenses(Authentication authentication) {

        String email = authentication.getName();

        return expenseService.getAllExpenses(email);
    }

    // Get Expense By Id
    @GetMapping("/{id}")
    public Expense getExpenseById(@PathVariable Long id) {

        return expenseService.getExpenseById(id);
    }

    // Update Expense (Only Owner)
    @PutMapping("/{id}")
    public Expense updateExpense(@PathVariable Long id,
                                 @RequestBody Expense expense,
                                 Authentication authentication) {

        String email = authentication.getName();

        return expenseService.updateExpense(id, expense, email);
    }

    // Delete Expense (Only Owner)
    @DeleteMapping("/{id}")
    public String deleteExpense(@PathVariable Long id,
                                Authentication authentication) {

        String email = authentication.getName();

        return expenseService.deleteExpense(id, email);
    }
    // Get Expenses By Category
    @GetMapping("/category/{category}")
    public List<Expense> getExpensesByCategory(
            @PathVariable String category,
            Authentication authentication) {

        String email = authentication.getName();

        return expenseService.getExpensesByCategory(category, email);
    }
    // Get Expenses By Date
    @GetMapping("/date/{expenseDate}")
    public List<Expense> getExpensesByDate(
            @PathVariable LocalDate expenseDate,
            Authentication authentication) {

        String email = authentication.getName();

        return expenseService.getExpensesByDate(expenseDate, email);
    }
}