package com.hrushi.finpilot.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MonthlyReportResponse {

    private String month;   // e.g. "Jan", "Feb"
    private int year;
    private int monthNumber;
    private double expense;
}
