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
public class RecurringSuggestionDto {

    private String title;
    private Double amount;
    private String category;
    private String cadence; // Weekly, Biweekly, Monthly, Quarterly, Annual
    private int occurrences;
    private String confidence; // High confidence, Likely
    private LocalDate nextExpectedDate;
    private LocalDate lastOccurrenceDate;
    private double amountVariation; // percentage variation
    private int averageIntervalDays;
}
