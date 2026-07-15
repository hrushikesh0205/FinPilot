package com.hrushi.finpilot.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CategoryReportResponse {

    private String name;
    private double value;       // total amount spent in this category
    private double percent;     // percentage of total expenses
    private String color;       // color for chart rendering (assigned by service)
}
