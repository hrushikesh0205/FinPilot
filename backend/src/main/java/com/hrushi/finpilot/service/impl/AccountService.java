package com.hrushi.finpilot.service;

import com.hrushi.finpilot.dto.AccountRequest;
import com.hrushi.finpilot.entity.Account;
import com.hrushi.finpilot.entity.User;
import com.hrushi.finpilot.exception.ResourceNotFoundException;
import com.hrushi.finpilot.repository.AccountRepository;
import com.hrushi.finpilot.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class AccountService {

    @Autowired
    private AccountRepository accountRepository;

    @Autowired
    private UserRepository userRepository;

    // ── Create Account ────────────────────────────────────────────────────
    @Transactional
    public Account createAccount(AccountRequest request, String email) {
        User user = getUser(email);

        // If this account should be default, clear all others first
        if (request.isDefault()) {
            accountRepository.clearDefaultForUser(user);
        }

        Account account = new Account();
        account.setName(request.getName());
        account.setType(request.getType());
        account.setBalance(request.getBalance() != null ? request.getBalance() : 0.0);
        account.setDefault(request.isDefault());
        account.setUser(user);

        return accountRepository.save(account);
    }

    // ── Get All Accounts ──────────────────────────────────────────────────
    public List<Account> getAllAccounts(String email) {
        User user = getUser(email);
        return accountRepository.findByUser(user);
    }

    // ── Get Account By Id ─────────────────────────────────────────────────
    public Account getAccountById(Long id, String email) {
        User user = getUser(email);
        return accountRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new ResourceNotFoundException("Account not found with id: " + id));
    }

    // ── Update Account ────────────────────────────────────────────────────
    @Transactional
    public Account updateAccount(Long id, AccountRequest request, String email) {
        User user = getUser(email);

        Account account = accountRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new ResourceNotFoundException("Account not found with id: " + id));

        // If setting this account as default, clear all others first
        if (request.isDefault()) {
            accountRepository.clearDefaultForUser(user);
        }

        account.setName(request.getName());
        account.setType(request.getType());
        account.setBalance(request.getBalance() != null ? request.getBalance() : account.getBalance());
        account.setDefault(request.isDefault());

        return accountRepository.save(account);
    }

    // ── Set Default Account ───────────────────────────────────────────────
    @Transactional
    public Account setDefault(Long id, String email) {
        User user = getUser(email);

        Account account = accountRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new ResourceNotFoundException("Account not found with id: " + id));

        accountRepository.clearDefaultForUser(user);
        account.setDefault(true);
        return accountRepository.save(account);
    }

    // ── Delete Account (permanent, with default reassignment) ─────────────
    @Transactional
    public String deleteAccount(Long id, String email) {
        User user = getUser(email);

        Account account = accountRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new ResourceNotFoundException("Account not found with id: " + id));

        boolean wasDefault = account.isDefault();
        String name = account.getName();

        accountRepository.delete(account);

        // If the deleted account was the default, promote the next available account
        if (wasDefault) {
            List<Account> remaining = accountRepository.findByUser(user);
            if (!remaining.isEmpty()) {
                Account next = remaining.get(0);
                next.setDefault(true);
                accountRepository.save(next);
            }
        }

        return "Account '" + name + "' deleted successfully";
    }

    // ── Private helper ────────────────────────────────────────────────────
    private User getUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
}
