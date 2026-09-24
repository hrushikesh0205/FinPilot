package com.hrushi.finpilot.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CsvImportResultResponse {

    private int totalRows;

    private int importedCount;

    private int duplicateCount;

    private int skippedCount;

    private int needsReviewCount;

    @Builder.Default
    private List<String> errorMessages = new ArrayList<>();

    @Builder.Default
    private List<String> duplicateDetails = new ArrayList<>();
}
