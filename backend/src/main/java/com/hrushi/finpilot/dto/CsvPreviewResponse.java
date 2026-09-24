package com.hrushi.finpilot.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CsvPreviewResponse {

    private List<String> headers;

    private List<Map<String, String>> sampleRows;

    private List<Map<String, String>> allRows;

    private int totalRows;

    /**
     * Auto-detected suggestions for:
     * dateColumn, titleColumn, amountColumn, debitColumn, creditColumn, categoryColumn, accountColumn, typeColumn
     */
    private Map<String, String> suggestedMappings;
}
