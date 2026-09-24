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
public class SubscriptionRequest {

    @NotBlank(message = "Service name is required")
    private String serviceName;

    private String category;

    @NotNull(message = "Amount is required")
    @Positive(message = "Amount must be greater than zero")
    private Double amount;

    @NotBlank(message = "Billing cadence is required (MONTHLY, ANNUAL, QUARTERLY, WEEKLY)")
    private String billingCadence;

    private LocalDate nextRenewalDate;

    private String account;

    @Builder.Default
    private boolean active = true;

    private String notes;
}
