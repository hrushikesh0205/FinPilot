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
public class CsvImportConfirmRequest {

    private String dateColumn;
    private String titleColumn;
    private String amountColumn;
    private String debitColumn;
    private String creditColumn;
    private String categoryColumn;
    private String accountColumn;
    private String typeColumn;

    @Builder.Default
    private String defaultCategory = "Other";

    @Builder.Default
    private String defaultAccount = "Bank Account";

    // Raw rows passed from frontend preview if file is not re-uploaded
    private List<Map<String, String>> rows;
}
