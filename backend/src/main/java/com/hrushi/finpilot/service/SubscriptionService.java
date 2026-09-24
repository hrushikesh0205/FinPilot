package com.hrushi.finpilot.service;

import com.hrushi.finpilot.dto.SubscriptionRequest;
import com.hrushi.finpilot.dto.SubscriptionSummaryResponse;
import com.hrushi.finpilot.entity.Expense;
import com.hrushi.finpilot.entity.Subscription;
import com.hrushi.finpilot.entity.User;
import com.hrushi.finpilot.exception.ResourceNotFoundException;
import com.hrushi.finpilot.repository.ExpenseRepository;
import com.hrushi.finpilot.repository.SubscriptionRepository;
import com.hrushi.finpilot.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.*;

@Slf4j
@Service
@RequiredArgsConstructor
public class SubscriptionService {

    private final SubscriptionRepository subscriptionRepository;
    private final ExpenseRepository expenseRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    private static final Set<String> COMMON_SERVICES = Set.of(
            "netflix", "spotify", "youtube", "amazon prime", "prime video",
            "github", "canva", "chatgpt", "openai", "adobe", "apple",
            "google one", "disney", "hotstar", "notion", "linkedin",
            "slack", "zoom", "microsoft 365", "dropbox", "audible", "playstation", "xbox"
    );

    // ── Get All Subscriptions ────────────────────────────────────────────────
    public List<Subscription> getAllSubscriptions(String email) {
        User user = getUser(email);
        return subscriptionRepository.findByUser(user);
    }

    // ── Get Subscription By Id ───────────────────────────────────────────────
    public Subscription getSubscriptionById(Long id, String email) {
        User user = getUser(email);
        return subscriptionRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new ResourceNotFoundException("Subscription not found with id: " + id));
    }

    // ── Create Subscription ──────────────────────────────────────────────────
    @Transactional
    public Subscription createSubscription(SubscriptionRequest request, String email) {
        User user = getUser(email);

        Subscription sub = Subscription.builder()
                .user(user)
                .serviceName(request.getServiceName())
                .category(request.getCategory() != null ? request.getCategory() : "Entertainment")
                .amount(request.getAmount())
                .billingCadence(request.getBillingCadence() != null ? request.getBillingCadence().toUpperCase() : "MONTHLY")
                .nextRenewalDate(request.getNextRenewalDate() != null ? request.getNextRenewalDate() : LocalDate.now().plusMonths(1))
                .account(request.getAccount())
                .active(request.isActive())
                .notes(request.getNotes())
                .build();

        Subscription saved = subscriptionRepository.save(sub);

        notificationService.createNotification(
                user,
                "subscription",
                "Subscription added",
                "Tracking subscription for '" + saved.getServiceName() + "' (₹" +
                        String.format("%.0f", saved.getAmount()) + "/" + saved.getBillingCadence().toLowerCase() + ")."
        );

        return saved;
    }

    // ── Update Subscription ──────────────────────────────────────────────────
    @Transactional
    public Subscription updateSubscription(Long id, SubscriptionRequest request, String email) {
        User user = getUser(email);

        Subscription sub = subscriptionRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new ResourceNotFoundException("Subscription not found with id: " + id));

        sub.setServiceName(request.getServiceName());
        sub.setCategory(request.getCategory());
        sub.setAmount(request.getAmount());
        sub.setBillingCadence(request.getBillingCadence().toUpperCase());
        sub.setNextRenewalDate(request.getNextRenewalDate());
        sub.setAccount(request.getAccount());
        sub.setActive(request.isActive());
        sub.setNotes(request.getNotes());

        return subscriptionRepository.save(sub);
    }

    // ── Toggle Active / Inactive Status ───────────────────────────────────────
    @Transactional
    public Subscription toggleStatus(Long id, String email) {
        User user = getUser(email);

        Subscription sub = subscriptionRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new ResourceNotFoundException("Subscription not found with id: " + id));

        sub.setActive(!sub.isActive());
        return subscriptionRepository.save(sub);
    }

    // ── Delete Subscription ──────────────────────────────────────────────────
    @Transactional
    public void deleteSubscription(Long id, String email) {
        User user = getUser(email);

        Subscription sub = subscriptionRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new ResourceNotFoundException("Subscription not found with id: " + id));

        subscriptionRepository.delete(sub);
    }

    // ── Summary Metrics ──────────────────────────────────────────────────────
    public SubscriptionSummaryResponse getSummary(String email) {
        User user = getUser(email);
        List<Subscription> list = subscriptionRepository.findByUser(user);

        double monthlyTotal = 0.0;
        int activeCount = 0;
        LocalDate nextRenewal = null;
        String nextService = null;

        for (Subscription sub : list) {
            if (sub.isActive()) {
                activeCount++;
                double amt = sub.getAmount() != null ? sub.getAmount() : 0.0;
                switch (sub.getBillingCadence().toUpperCase()) {
                    case "WEEKLY" -> monthlyTotal += amt * 4.33;
                    case "MONTHLY" -> monthlyTotal += amt;
                    case "QUARTERLY" -> monthlyTotal += amt / 3.0;
                    case "ANNUAL" -> monthlyTotal += amt / 12.0;
                    default -> monthlyTotal += amt;
                }

                if (sub.getNextRenewalDate() != null) {
                    if (nextRenewal == null || sub.getNextRenewalDate().isBefore(nextRenewal)) {
                        if (!sub.getNextRenewalDate().isBefore(LocalDate.now())) {
                            nextRenewal = sub.getNextRenewalDate();
                            nextService = sub.getServiceName();
                        }
                    }
                }
            }
        }

        return SubscriptionSummaryResponse.builder()
                .monthlyTotal(Math.round(monthlyTotal * 100.0) / 100.0)
                .annualEstimate(Math.round(monthlyTotal * 12.0 * 100.0) / 100.0)
                .activeSubscriptions(activeCount)
                .totalSubscriptions(list.size())
                .nextRenewalDate(nextRenewal)
                .nextRenewalService(nextService)
                .build();
    }

    // ── Detect Candidates from Transaction History ───────────────────────────
    public List<Map<String, Object>> detectSubscriptionCandidates(String email) {
        User user = getUser(email);
        List<Expense> expenses = expenseRepository.findByUser(user);
        List<Subscription> existingSubs = subscriptionRepository.findByUser(user);

        Set<String> existingNames = new HashSet<>();
        for (Subscription s : existingSubs) {
            existingNames.add(s.getServiceName().toLowerCase().trim());
        }

        Map<String, List<Expense>> matched = new HashMap<>();

        for (Expense exp : expenses) {
            if (exp.getTitle() == null) continue;
            String lower = exp.getTitle().toLowerCase().trim();

            for (String svc : COMMON_SERVICES) {
                if (lower.contains(svc) && !existingNames.contains(svc)) {
                    matched.computeIfAbsent(svc, k -> new ArrayList<>()).add(exp);
                    break;
                }
            }
        }

        List<Map<String, Object>> results = new ArrayList<>();
        for (Map.Entry<String, List<Expense>> entry : matched.entrySet()) {
            List<Expense> list = entry.getValue();
            Expense latest = list.get(list.size() - 1);

            Map<String, Object> candidate = new HashMap<>();
            candidate.put("serviceName", capitalize(entry.getKey()));
            candidate.put("category", latest.getCategory() != null ? latest.getCategory() : "Entertainment");
            candidate.put("amount", latest.getAmount());
            candidate.put("billingCadence", "MONTHLY");
            candidate.put("detectedFromTitle", latest.getTitle());
            candidate.put("occurrences", list.size());
            candidate.put("lastPaidDate", latest.getExpenseDate());

            results.add(candidate);
        }

        return results;
    }

    private String capitalize(String str) {
        if (str == null || str.isEmpty()) return str;
        String[] parts = str.split(" ");
        StringBuilder sb = new StringBuilder();
        for (String part : parts) {
            if (!part.isEmpty()) {
                sb.append(Character.toUpperCase(part.charAt(0)))
                  .append(part.substring(1).toLowerCase())
                  .append(" ");
            }
        }
        return sb.toString().trim();
    }

    private User getUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found: " + email));
    }
}
