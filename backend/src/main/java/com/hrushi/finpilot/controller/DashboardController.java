package com.hrushi.finpilot.controller;

import com.hrushi.finpilot.dto.DashboardResponse;
import com.hrushi.finpilot.service.ExpenseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class DashboardController {

    @Autowired
    private ExpenseService expenseService;

    @GetMapping("/dashboard")
    public DashboardResponse getDashboard(Authentication authentication) {

        String email = authentication.getName();

        return expenseService.getDashboardSummary(email);
    }

}