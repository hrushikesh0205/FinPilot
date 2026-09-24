package com.hrushi.finpilot.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RecurringExpenseRequest {

    @NotBlank(message = "Title is required")
    private String title;

    @NotNull(message = "Amount is required")
    @Positive(message = "Amount must be greater than zero")
    private Double amount;

    private String category;

    @NotBlank(message = "Cadence is required (WEEKLY, BIWEEKLY, MONTHLY, QUARTERLY, ANNUAL)")
    private String cadence;

    private LocalDate startDate;

    private LocalDate nextDueDate;

    private String confidence;

    private Integer occurrences;

    private Boolean autoDetected;
}
