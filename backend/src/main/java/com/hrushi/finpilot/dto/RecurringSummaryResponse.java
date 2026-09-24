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
public class RecurringSummaryResponse {

    private double monthlyTotal;
    private double annualTotal;
    private int activeCount;
    private int suggestionsCount;
    private LocalDate nextUpcomingDate;
    private String nextUpcomingTitle;
}
