package com.hrushi.finpilot.service;

import com.hrushi.finpilot.dto.SavingsGoalRequest;
import com.hrushi.finpilot.dto.SavingsGoalResponse;
import com.hrushi.finpilot.entity.SavingsGoal;
import com.hrushi.finpilot.entity.User;
import com.hrushi.finpilot.exception.ResourceNotFoundException;
import com.hrushi.finpilot.repository.SavingsGoalRepository;
import com.hrushi.finpilot.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.*;

@Slf4j
@Service
@RequiredArgsConstructor
public class SavingsGoalService {

    private final SavingsGoalRepository savingsGoalRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    public List<SavingsGoalResponse> getAllGoals(String email) {
        User user = getUser(email);
        List<SavingsGoal> goals = savingsGoalRepository.findByUser(user);
        return goals.stream().map(this::mapToResponse).toList();
    }

    public SavingsGoalResponse getGoalById(Long id, String email) {
        User user = getUser(email);
        SavingsGoal goal = savingsGoalRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new ResourceNotFoundException("Savings goal not found with id: " + id));
        return mapToResponse(goal);
    }

    @Transactional
    public SavingsGoalResponse createGoal(SavingsGoalRequest request, String email) {
        User user = getUser(email);

        SavingsGoal goal = SavingsGoal.builder()
                .user(user)
                .name(request.getName().trim())
                .targetAmount(request.getTargetAmount())
                .currentAmount(request.getCurrentAmount() != null ? Math.max(0, request.getCurrentAmount()) : 0.0)
                .targetDate(request.getTargetDate())
                .notes(request.getNotes())
                .category(request.getCategory() != null ? request.getCategory() : "General")
                .color(request.getColor() != null ? request.getColor() : "#10b981")
                .build();

        SavingsGoal saved = savingsGoalRepository.save(goal);

        notificationService.createNotification(
                user,
                "goal",
                "Savings goal created",
                "New goal '" + saved.getName() + "' created — Target: ₹" +
                        String.format("%.0f", saved.getTargetAmount()) + "."
        );

        return mapToResponse(saved);
    }

    @Transactional
    public SavingsGoalResponse updateGoal(Long id, SavingsGoalRequest request, String email) {
        User user = getUser(email);
        SavingsGoal goal = savingsGoalRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new ResourceNotFoundException("Savings goal not found with id: " + id));

        goal.setName(request.getName().trim());
        goal.setTargetAmount(request.getTargetAmount());
        if (request.getCurrentAmount() != null) {
            goal.setCurrentAmount(Math.max(0, request.getCurrentAmount()));
        }
        goal.setTargetDate(request.getTargetDate());
        goal.setNotes(request.getNotes());
        if (request.getCategory() != null) goal.setCategory(request.getCategory());
        if (request.getColor() != null) goal.setColor(request.getColor());

        SavingsGoal updated = savingsGoalRepository.save(goal);
        return mapToResponse(updated);
    }

    @Transactional
    public SavingsGoalResponse depositFunds(Long id, Double amount, String email) {
        if (amount == null || amount <= 0) {
            throw new IllegalArgumentException("Deposit amount must be greater than zero");
        }

        User user = getUser(email);
        SavingsGoal goal = savingsGoalRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new ResourceNotFoundException("Savings goal not found with id: " + id));

        double newAmount = goal.getCurrentAmount() + amount;
        goal.setCurrentAmount(newAmount);
        SavingsGoal updated = savingsGoalRepository.save(goal);

        if (newAmount >= goal.getTargetAmount()) {
            notificationService.createNotification(
                    user,
                    "goal_completed",
                    "Goal Achieved! 🎉",
                    "Congratulations! You have reached your savings goal '" + goal.getName() +
                            "' of ₹" + String.format("%.0f", goal.getTargetAmount()) + "!"
            );
        } else {
            double percent = (newAmount / goal.getTargetAmount()) * 100;
            notificationService.createNotification(
                    user,
                    "goal",
                    "Funds added to goal",
                    "Added ₹" + String.format("%.0f", amount) + " to '" + goal.getName() +
                            "'. Progress: " + String.format("%.1f", percent) + "%."
            );
        }

        return mapToResponse(updated);
    }

    @Transactional
    public void deleteGoal(Long id, String email) {
        User user = getUser(email);
        SavingsGoal goal = savingsGoalRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new ResourceNotFoundException("Savings goal not found with id: " + id));
        savingsGoalRepository.delete(goal);
    }

    public Map<String, Object> getSummary(String email) {
        User user = getUser(email);
        List<SavingsGoal> goals = savingsGoalRepository.findByUser(user);

        double totalTarget = goals.stream().mapToDouble(SavingsGoal::getTargetAmount).sum();
        double totalSaved = goals.stream().mapToDouble(SavingsGoal::getCurrentAmount).sum();
        double remaining = Math.max(0, totalTarget - totalSaved);
        double progress = totalTarget > 0 ? (totalSaved / totalTarget) * 100 : 0;
        long completedCount = goals.stream().filter(g -> g.getCurrentAmount() >= g.getTargetAmount()).count();

        Map<String, Object> summary = new HashMap<>();
        summary.put("totalGoals", goals.size());
        summary.put("completedGoals", completedCount);
        summary.put("inProgressGoals", goals.size() - completedCount);
        summary.put("totalTargetAmount", Math.round(totalTarget * 100.0) / 100.0);
        summary.put("totalSavedAmount", Math.round(totalSaved * 100.0) / 100.0);
        summary.put("remainingAmount", Math.round(remaining * 100.0) / 100.0);
        summary.put("overallProgressPercentage", Math.round(progress * 10.0) / 10.0);

        return summary;
    }

    private SavingsGoalResponse mapToResponse(SavingsGoal goal) {
        double current = goal.getCurrentAmount() != null ? goal.getCurrentAmount() : 0.0;
        double target = goal.getTargetAmount() != null ? goal.getTargetAmount() : 0.0;
        double remaining = Math.max(0, target - current);
        double progress = target > 0 ? Math.min(100.0, (current / target) * 100.0) : 0.0;
        boolean completed = current >= target && target > 0;

        Long daysRemaining = null;
        if (goal.getTargetDate() != null) {
            daysRemaining = ChronoUnit.DAYS.between(LocalDate.now(), goal.getTargetDate());
        }

        return SavingsGoalResponse.builder()
                .id(goal.getId())
                .name(goal.getName())
                .targetAmount(target)
                .currentAmount(current)
                .remainingAmount(Math.round(remaining * 100.0) / 100.0)
                .progressPercentage(Math.round(progress * 100.0) / 100.0)
                .targetDate(goal.getTargetDate())
                .notes(goal.getNotes())
                .category(goal.getCategory())
                .color(goal.getColor())
                .completed(completed)
                .daysRemaining(daysRemaining)
                .build();
    }

    private User getUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found: " + email));
    }
}
