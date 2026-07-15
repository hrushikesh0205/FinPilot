package com.hrushi.finpilot.dto;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CategoryRequest {

    @NotBlank(message = "Category name is required")
    private String name;

    private String icon;

    private String color;

    @NotNull(message = "Budget is required")
    @PositiveOrZero(message = "Budget must be zero or positive")
    private Double budget;
}
