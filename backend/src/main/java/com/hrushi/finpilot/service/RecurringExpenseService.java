package com.hrushi.finpilot.service;

import com.hrushi.finpilot.dto.RecurringExpenseRequest;
import com.hrushi.finpilot.dto.RecurringSuggestionDto;
import com.hrushi.finpilot.dto.RecurringSummaryResponse;
import com.hrushi.finpilot.entity.Expense;
import com.hrushi.finpilot.entity.RecurringExpense;
import com.hrushi.finpilot.entity.User;
import com.hrushi.finpilot.exception.ResourceNotFoundException;
import com.hrushi.finpilot.repository.ExpenseRepository;
import com.hrushi.finpilot.repository.RecurringExpenseRepository;
import com.hrushi.finpilot.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class RecurringExpenseService {

    private final RecurringExpenseRepository recurringExpenseRepository;
    private final ExpenseRepository expenseRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    // ── Get Suggestions via Pattern Recognition ──────────────────────────────
    public List<RecurringSuggestionDto> getSuggestions(String email) {
        User user = getUser(email);

        List<Expense> expenses = expenseRepository.findByUser(user);
        if (expenses == null || expenses.size() < 2) {
            return Collections.emptyList();
        }

        // Existing recurring records (active or ignored)
        List<RecurringExpense> existing = recurringExpenseRepository.findByUser(user);
        Set<String> processedTitles = existing.stream()
                .map(r -> normalizeMerchant(r.getTitle()))
                .collect(Collectors.toSet());

        // Group expenses by normalized title
        Map<String, List<Expense>> grouped = new HashMap<>();
        for (Expense exp : expenses) {
            if (exp.getTitle() == null || exp.getTitle().isBlank()) continue;
            // Only consider expense items if type is tracked
            String normalized = normalizeMerchant(exp.getTitle());
            grouped.computeIfAbsent(normalized, k -> new ArrayList<>()).add(exp);
        }

        List<RecurringSuggestionDto> suggestions = new ArrayList<>();

        for (Map.Entry<String, List<Expense>> entry : grouped.entrySet()) {
            String normTitle = entry.getKey();
            if (processedTitles.contains(normTitle)) {
                continue; // Already confirmed or dismissed
            }

            List<Expense> list = entry.getValue();
            if (list.size() < 2) {
                continue; // At least 2 occurrences required
            }

            // Sort by date ascending
            list.sort(Comparator.comparing(Expense::getExpenseDate, Comparator.nullsLast(Comparator.naturalOrder())));

            // Calculate intervals between consecutive occurrences
            List<Long> intervals = new ArrayList<>();
            for (int i = 1; i < list.size(); i++) {
                LocalDate d1 = list.get(i - 1).getExpenseDate();
                LocalDate d2 = list.get(i).getExpenseDate();
                if (d1 != null && d2 != null) {
                    long days = ChronoUnit.DAYS.between(d1, d2);
                    if (days > 0) {
                        intervals.add(days);
                    }
                }
            }

            if (intervals.isEmpty()) {
                continue;
            }

            double avgInterval = intervals.stream().mapToLong(Long::longValue).average().orElse(0.0);

            // Determine Cadence based on cadence ranges
            String cadence = detectCadence(avgInterval, intervals);
            if (cadence == null) {
                continue; // Doesn't match cadence ranges
            }

            // Amount statistics
            double minAmount = list.stream().mapToDouble(e -> e.getAmount() != null ? e.getAmount() : 0.0).min().orElse(0.0);
            double maxAmount = list.stream().mapToDouble(e -> e.getAmount() != null ? e.getAmount() : 0.0).max().orElse(0.0);
            double avgAmount = list.stream().mapToDouble(e -> e.getAmount() != null ? e.getAmount() : 0.0).average().orElse(0.0);

            double amountVariation = avgAmount > 0 ? ((maxAmount - minAmount) / avgAmount) : 0.0;
            if (amountVariation > 0.30) {
                // Amounts vary by more than 30%, not a recurring expense
                continue;
            }

            // Calculate interval consistency (standard deviation)
            double intervalVariance = 0;
            for (long interval : intervals) {
                intervalVariance += Math.pow(interval - avgInterval, 2);
            }
            double intervalStdDev = Math.sqrt(intervalVariance / intervals.size());

            // Confidence Level
            String confidence = (intervalStdDev <= 4.0 && amountVariation <= 0.08 && list.size() >= 3)
                    ? "High confidence"
                    : "Likely";

            // Next expected date
            LocalDate lastDate = list.get(list.size() - 1).getExpenseDate();
            LocalDate nextExpected = lastDate != null ? lastDate.plusDays((long) Math.round(avgInterval)) : LocalDate.now();

            // Most representative title and category
            String displayTitle = list.get(list.size() - 1).getTitle();
            String displayCategory = list.get(list.size() - 1).getCategory();

            suggestions.add(RecurringSuggestionDto.builder()
                    .title(displayTitle)
                    .amount(Math.round(avgAmount * 100.0) / 100.0)
                    .category(displayCategory != null ? displayCategory : "Bills")
                    .cadence(cadence)
                    .occurrences(list.size())
                    .confidence(confidence)
                    .nextExpectedDate(nextExpected)
                    .lastOccurrenceDate(lastDate)
                    .amountVariation(Math.round(amountVariation * 1000.0) / 10.0)
                    .averageIntervalDays((int) Math.round(avgInterval))
                    .build());
        }

        // Sort suggestions by confidence and occurrences
        suggestions.sort((a, b) -> {
            int confComp = b.getConfidence().compareTo(a.getConfidence());
            return confComp != 0 ? confComp : Integer.compare(b.getOccurrences(), a.getOccurrences());
        });

        return suggestions;
    }

    // ── Get Confirmed Recurring Expenses ─────────────────────────────────────
    public List<RecurringExpense> getConfirmedRecurring(String email) {
        User user = getUser(email);
        return recurringExpenseRepository.findByUserAndStatus(user, "ACTIVE");
    }

    // ── Keep / Confirm a Suggestion ──────────────────────────────────────────
    @Transactional
    public RecurringExpense keepSuggestion(RecurringExpenseRequest request, String email) {
        User user = getUser(email);

        RecurringExpense recurring = RecurringExpense.builder()
                .user(user)
                .title(request.getTitle())
                .amount(request.getAmount())
                .category(request.getCategory() != null ? request.getCategory() : "Bills")
                .cadence(request.getCadence())
                .startDate(request.getStartDate() != null ? request.getStartDate() : LocalDate.now())
                .nextDueDate(request.getNextDueDate() != null ? request.getNextDueDate() : calculateNextDueDate(LocalDate.now(), request.getCadence()))
                .status("ACTIVE")
                .confidence(request.getConfidence() != null ? request.getConfidence() : "High confidence")
                .occurrences(request.getOccurrences() != null ? request.getOccurrences() : 2)
                .autoDetected(true)
                .build();

        RecurringExpense saved = recurringExpenseRepository.save(recurring);

        notificationService.createNotification(
                user,
                "recurring",
                "Recurring expense tracked",
                "Confirmed recurring expense for '" + saved.getTitle() + "' (₹" +
                        String.format("%.0f", saved.getAmount()) + ", " + saved.getCadence() + ")."
        );

        return saved;
    }

    // ── Ignore / Dismiss a Suggestion ────────────────────────────────────────
    @Transactional
    public void ignoreSuggestion(String title, String email) {
        User user = getUser(email);

        // Save pattern as IGNORED so it won't be suggested again
        Optional<RecurringExpense> existing = recurringExpenseRepository
                .findByUserAndTitleIgnoreCaseAndStatus(user, title, "IGNORED");

        if (existing.isEmpty()) {
            RecurringExpense ignored = RecurringExpense.builder()
                    .user(user)
                    .title(title)
                    .amount(0.0)
                    .cadence("MONTHLY")
                    .status("IGNORED")
                    .autoDetected(true)
                    .build();
            recurringExpenseRepository.save(ignored);
        }
    }

    // ── Manual Create ────────────────────────────────────────────────────────
    @Transactional
    public RecurringExpense createRecurring(RecurringExpenseRequest request, String email) {
        User user = getUser(email);

        RecurringExpense recurring = RecurringExpense.builder()
                .user(user)
                .title(request.getTitle())
                .amount(request.getAmount())
                .category(request.getCategory() != null ? request.getCategory() : "Bills")
                .cadence(request.getCadence())
                .startDate(request.getStartDate() != null ? request.getStartDate() : LocalDate.now())
                .nextDueDate(request.getNextDueDate() != null ? request.getNextDueDate() : calculateNextDueDate(LocalDate.now(), request.getCadence()))
                .status("ACTIVE")
                .confidence("High confidence")
                .occurrences(1)
                .autoDetected(false)
                .build();

        return recurringExpenseRepository.save(recurring);
    }

    // ── Update ───────────────────────────────────────────────────────────────
    @Transactional
    public RecurringExpense updateRecurring(Long id, RecurringExpenseRequest request, String email) {
        User user = getUser(email);

        RecurringExpense existing = recurringExpenseRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new ResourceNotFoundException("Recurring expense not found with id: " + id));

        existing.setTitle(request.getTitle());
        existing.setAmount(request.getAmount());
        existing.setCategory(request.getCategory());
        existing.setCadence(request.getCadence());
        if (request.getNextDueDate() != null) {
            existing.setNextDueDate(request.getNextDueDate());
        }
        if (request.getStartDate() != null) {
            existing.setStartDate(request.getStartDate());
        }

        return recurringExpenseRepository.save(existing);
    }

    // ── Delete ───────────────────────────────────────────────────────────────
    @Transactional
    public void deleteRecurring(Long id, String email) {
        User user = getUser(email);
        RecurringExpense existing = recurringExpenseRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new ResourceNotFoundException("Recurring expense not found with id: " + id));
        recurringExpenseRepository.delete(existing);
    }

    // ── Summary Stats ────────────────────────────────────────────────────────
    public RecurringSummaryResponse getSummary(String email) {
        User user = getUser(email);
        List<RecurringExpense> activeList = recurringExpenseRepository.findByUserAndStatus(user, "ACTIVE");
        List<RecurringSuggestionDto> suggestions = getSuggestions(email);

        double monthlyTotal = 0.0;
        LocalDate nextUpcomingDate = null;
        String nextUpcomingTitle = null;

        for (RecurringExpense r : activeList) {
            double amt = r.getAmount() != null ? r.getAmount() : 0.0;
            switch (r.getCadence().toUpperCase()) {
                case "WEEKLY" -> monthlyTotal += amt * 4.33;
                case "BIWEEKLY" -> monthlyTotal += amt * 2.16;
                case "MONTHLY" -> monthlyTotal += amt;
                case "QUARTERLY" -> monthlyTotal += amt / 3.0;
                case "ANNUAL" -> monthlyTotal += amt / 12.0;
                default -> monthlyTotal += amt;
            }

            if (r.getNextDueDate() != null) {
                if (nextUpcomingDate == null || r.getNextDueDate().isBefore(nextUpcomingDate)) {
                    if (!r.getNextDueDate().isBefore(LocalDate.now())) {
                        nextUpcomingDate = r.getNextDueDate();
                        nextUpcomingTitle = r.getTitle();
                    }
                }
            }
        }

        return RecurringSummaryResponse.builder()
                .monthlyTotal(Math.round(monthlyTotal * 100.0) / 100.0)
                .annualTotal(Math.round(monthlyTotal * 12.0 * 100.0) / 100.0)
                .activeCount(activeList.size())
                .suggestionsCount(suggestions.size())
                .nextUpcomingDate(nextUpcomingDate)
                .nextUpcomingTitle(nextUpcomingTitle)
                .build();
    }

    // ── Helper: Normalized Merchant ──────────────────────────────────────────
    public static String normalizeMerchant(String raw) {
        if (raw == null) return "";
        return raw.toLowerCase()
                .replaceAll("(?i)\\b(pvt|ltd|limited|inc|corp|co|bill|payment|sub|subscription|store|online|india)\\b", "")
                .replaceAll("[^a-z0-9]", " ")
                .replaceAll("\\s+", " ")
                .trim();
    }

    // ── Helper: Detect Cadence from Average Days ──────────────────────────────
    private String detectCadence(double avgInterval, List<Long> intervals) {
        if (avgInterval >= 5 && avgInterval <= 9) {
            return "Weekly";
        }
        if (avgInterval >= 12 && avgInterval <= 17) {
            return "Biweekly";
        }
        if (avgInterval >= 24 && avgInterval <= 40) {
            return "Monthly";
        }
        if (avgInterval >= 75 && avgInterval <= 110) {
            return "Quarterly";
        }
        if (avgInterval >= 330 && avgInterval <= 400) {
            return "Annual";
        }
        return null;
    }

    private LocalDate calculateNextDueDate(LocalDate baseDate, String cadence) {
        return switch (cadence.toUpperCase()) {
            case "WEEKLY" -> baseDate.plusWeeks(1);
            case "BIWEEKLY" -> baseDate.plusWeeks(2);
            case "MONTHLY" -> baseDate.plusMonths(1);
            case "QUARTERLY" -> baseDate.plusMonths(3);
            case "ANNUAL" -> baseDate.plusYears(1);
            default -> baseDate.plusMonths(1);
        };
    }

    private User getUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found: " + email));
    }
}
