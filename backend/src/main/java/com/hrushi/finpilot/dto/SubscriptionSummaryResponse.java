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
public class SubscriptionSummaryResponse {

    private double monthlyTotal;
    private double annualEstimate;
    private int activeSubscriptions;
    private int totalSubscriptions;
    private LocalDate nextRenewalDate;
    private String nextRenewalService;
}
