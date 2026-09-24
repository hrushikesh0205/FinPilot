package com.hrushi.finpilot.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SavingsGoalResponse {

    private Long id;
    private String name;
    private Double targetAmount;
    private Double currentAmount;
    private Double remainingAmount;
    private Double progressPercentage;
    private LocalDate targetDate;
    private String notes;
    private String category;
    private String color;
    private boolean completed;
    private Long daysRemaining;
}
