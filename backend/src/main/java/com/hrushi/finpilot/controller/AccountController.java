package com.hrushi.finpilot.controller;

import com.hrushi.finpilot.dto.AccountRequest;
import com.hrushi.finpilot.entity.Account;
import com.hrushi.finpilot.service.AccountService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/accounts")
@Tag(name = "Account", description = "Account management APIs")
public class AccountController {

    @Autowired
    private AccountService accountService;

    // POST /api/accounts — create a new account
    @PostMapping
    @Operation(summary = "Create a new account")
    public ResponseEntity<Account> createAccount(
            @Valid @RequestBody AccountRequest request,
            Authentication authentication) {

        String email = authentication.getName();
        Account created = accountService.createAccount(request, email);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    // GET /api/accounts — get all accounts for the logged-in user
    @GetMapping
    @Operation(summary = "Get all accounts of the logged-in user")
    public ResponseEntity<List<Account>> getAllAccounts(Authentication authentication) {

        String email = authentication.getName();
        return ResponseEntity.ok(accountService.getAllAccounts(email));
    }

    // GET /api/accounts/{id} — get a specific account by ID
    @GetMapping("/{id}")
    @Operation(summary = "Get a specific account by ID")
    public ResponseEntity<Account> getAccountById(
            @PathVariable Long id,
            Authentication authentication) {

        String email = authentication.getName();
        return ResponseEntity.ok(accountService.getAccountById(id, email));
    }

    // PUT /api/accounts/{id} — update an account
    @PutMapping("/{id}")
    @Operation(summary = "Update an existing account")
    public ResponseEntity<Account> updateAccount(
            @PathVariable Long id,
            @Valid @RequestBody AccountRequest request,
            Authentication authentication) {

        String email = authentication.getName();
        Account updated = accountService.updateAccount(id, request, email);
        return ResponseEntity.ok(updated);
    }

    // PATCH /api/accounts/{id}/default — set as default account
    @PatchMapping("/{id}/default")
    @Operation(summary = "Set an account as the default")
    public ResponseEntity<Account> setDefault(
            @PathVariable Long id,
            Authentication authentication) {

        String email = authentication.getName();
        Account updated = accountService.setDefault(id, email);
        return ResponseEntity.ok(updated);
    }

    // DELETE /api/accounts/{id} — permanently delete from database
    @DeleteMapping("/{id}")
    @Operation(summary = "Permanently delete an account")
    public ResponseEntity<String> deleteAccount(
            @PathVariable Long id,
            Authentication authentication) {

        String email = authentication.getName();
        String result = accountService.deleteAccount(id, email);
        return ResponseEntity.ok(result);
    }
}
