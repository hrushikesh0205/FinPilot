package com.hrushi.finpilot.service;

import com.hrushi.finpilot.dto.CsvImportConfirmRequest;
import com.hrushi.finpilot.dto.CsvImportResultResponse;
import com.hrushi.finpilot.dto.CsvPreviewResponse;
import com.hrushi.finpilot.entity.Expense;
import com.hrushi.finpilot.entity.User;
import com.hrushi.finpilot.repository.ExpenseRepository;
import com.hrushi.finpilot.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.*;

@Slf4j
@Service
@RequiredArgsConstructor
public class CsvImportService {

    private final ExpenseRepository expenseRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    private static final List<DateTimeFormatter> DATE_FORMATTERS = List.of(
            DateTimeFormatter.ofPattern("yyyy-MM-dd"),
            DateTimeFormatter.ofPattern("dd/MM/yyyy"),
            DateTimeFormatter.ofPattern("dd-MM-yyyy"),
            DateTimeFormatter.ofPattern("MM/dd/yyyy"),
            DateTimeFormatter.ofPattern("yyyy/MM/dd"),
            DateTimeFormatter.ofPattern("dd.MM.yyyy"),
            DateTimeFormatter.ofPattern("d/M/yyyy"),
            DateTimeFormatter.ofPattern("d-M-yyyy"),
            DateTimeFormatter.ofPattern("dd-MMM-yyyy", Locale.ENGLISH),
            DateTimeFormatter.ofPattern("dd MMM yyyy", Locale.ENGLISH),
            DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"),
            DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm:ss")
    );

    // ── Preview CSV: Parse headers, sample rows, and auto-detect columns ────────
    public CsvPreviewResponse previewCsv(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("No CSV file provided or file is empty");
        }

        List<List<String>> allRows = parseCsvFile(file);
        if (allRows.isEmpty()) {
            throw new IllegalArgumentException("CSV file contains no data rows");
        }

        List<String> headers = allRows.get(0).stream().map(String::trim).toList();
        List<Map<String, String>> sampleRows = new ArrayList<>();
        int totalDataRows = allRows.size() - 1;

        List<Map<String, String>> allDataRows = new ArrayList<>();
        for (int i = 1; i <= totalDataRows; i++) {
            List<String> rowValues = allRows.get(i);
            Map<String, String> rowMap = new LinkedHashMap<>();
            for (int h = 0; h < headers.size(); h++) {
                String val = h < rowValues.size() ? rowValues.get(h).trim() : "";
                rowMap.put(headers.get(h), val);
            }
            allDataRows.add(rowMap);
            if (sampleRows.size() < 5) {
                sampleRows.add(rowMap);
            }
        }

        Map<String, String> suggested = detectColumnMappings(headers);

        return CsvPreviewResponse.builder()
                .headers(headers)
                .sampleRows(sampleRows)
                .allRows(allDataRows)
                .totalRows(totalDataRows)
                .suggestedMappings(suggested)
                .build();
    }

    // ── Confirm Import ────────────────────────────────────────────────────────
    @Transactional
    public CsvImportResultResponse confirmImport(CsvImportConfirmRequest request, String email) {
        User user = getUser(email);

        List<Map<String, String>> rows = request.getRows();
        if (rows == null || rows.isEmpty()) {
            throw new IllegalArgumentException("No rows provided for import");
        }

        int importedCount = 0;
        int duplicateCount = 0;
        int skippedCount = 0;
        int needsReviewCount = 0;
        List<String> errorMessages = new ArrayList<>();
        List<String> duplicateDetails = new ArrayList<>();
        Set<String> batchFingerprints = new HashSet<>();

        String defaultAcc = (request.getDefaultAccount() != null && !request.getDefaultAccount().isBlank())
                ? request.getDefaultAccount().trim() : "Bank Account";
        String defaultCat = (request.getDefaultCategory() != null && !request.getDefaultCategory().isBlank())
                ? request.getDefaultCategory().trim() : "Other";

        for (int idx = 0; idx < rows.size(); idx++) {
            Map<String, String> row = rows.get(idx);
            int rowNum = idx + 1;

            // 1. Title / Description
            String title = getMappedValue(row, request.getTitleColumn());
            if (title == null || title.isBlank()) {
                needsReviewCount++;
                errorMessages.add("Row " + rowNum + ": Skipped due to missing merchant/description");
                continue;
            }

            // 2. Date
            String rawDate = getMappedValue(row, request.getDateColumn());
            LocalDate date = parseDate(rawDate);
            if (date == null) {
                needsReviewCount++;
                errorMessages.add("Row " + rowNum + ": Could not parse date '" + rawDate + "' for '" + title + "'");
                continue;
            }

            // 3. Amount & Type
            Double amount = null;
            String type = "EXPENSE";

            String debitVal = getMappedValue(row, request.getDebitColumn());
            String creditVal = getMappedValue(row, request.getCreditColumn());
            String amtVal = getMappedValue(row, request.getAmountColumn());

            Double debit = parseAmount(debitVal);
            Double credit = parseAmount(creditVal);
            Double rawAmount = parseAmount(amtVal);

            if (debit != null && debit > 0) {
                amount = debit;
                type = "EXPENSE";
            } else if (credit != null && credit > 0) {
                amount = credit;
                type = "INCOME";
            } else if (rawAmount != null) {
                if (rawAmount < 0) {
                    amount = Math.abs(rawAmount);
                    type = "EXPENSE";
                } else {
                    amount = rawAmount;
                    // Check if explicit type column is provided
                    String rowType = getMappedValue(row, request.getTypeColumn());
                    if (rowType != null && rowType.toUpperCase().contains("INCOME")) {
                        type = "INCOME";
                    } else if (rowType != null && rowType.toUpperCase().contains("CREDIT")) {
                        type = "INCOME";
                    } else {
                        type = "EXPENSE";
                    }
                }
            }

            if (amount == null || amount <= 0) {
                skippedCount++;
                errorMessages.add("Row " + rowNum + ": Skipped zero or invalid amount for '" + title + "'");
                continue;
            }

            // 4. Account & Category
            String account = getMappedValue(row, request.getAccountColumn());
            if (account == null || account.isBlank()) {
                account = defaultAcc;
            }

            String category = getMappedValue(row, request.getCategoryColumn());
            if (category == null || category.isBlank()) {
                category = defaultCat;
            }

            // 5. Duplicate Check via Fingerprint
            String fingerprint = Expense.buildFingerprint(date, title, amount, account);

            if (batchFingerprints.contains(fingerprint) || expenseRepository.existsByUserAndFingerprint(user, fingerprint)) {
                duplicateCount++;
                duplicateDetails.add("Duplicate skipped: " + date + " | " + title + " | ₹" + String.format("%.2f", amount));
                continue;
            }

            // Track within batch
            batchFingerprints.add(fingerprint);

            Expense expense = Expense.builder()
                    .user(user)
                    .title(title.trim())
                    .amount(amount)
                    .category(category)
                    .expenseDate(date)
                    .type(type)
                    .account(account.trim())
                    .fingerprint(fingerprint)
                    .notes("Imported via CSV Bank Statement")
                    .build();

            expenseRepository.save(expense);
            importedCount++;
        }

        // Send summary notification
        if (importedCount > 0 || duplicateCount > 0) {
            notificationService.createNotification(
                    user,
                    "import",
                    "CSV Statement Imported",
                    String.format("Statement import complete: %d imported, %d duplicates skipped, %d need review.",
                            importedCount, duplicateCount, needsReviewCount)
            );
        }

        return CsvImportResultResponse.builder()
                .totalRows(rows.size())
                .importedCount(importedCount)
                .duplicateCount(duplicateCount)
                .skippedCount(skippedCount)
                .needsReviewCount(needsReviewCount)
                .errorMessages(errorMessages)
                .duplicateDetails(duplicateDetails)
                .build();
    }

    // ── Helper: Parse CSV File ───────────────────────────────────────────────
    public List<List<String>> parseCsvFile(MultipartFile file) {
        List<List<String>> rows = new ArrayList<>();
        try (BufferedReader reader = new BufferedReader(
                new InputStreamReader(file.getInputStream(), StandardCharsets.UTF_8))) {

            String line;
            boolean firstLine = true;
            while ((line = reader.readLine()) != null) {
                // Remove UTF-8 BOM if present on first line
                if (firstLine) {
                    if (line.startsWith("\uFEFF")) {
                        line = line.substring(1);
                    }
                    firstLine = false;
                }

                if (line.trim().isEmpty()) continue;

                List<String> parsedRow = parseCsvLine(line);
                if (!parsedRow.isEmpty()) {
                    rows.add(parsedRow);
                }
            }
        } catch (Exception e) {
            log.error("Failed to parse CSV file", e);
            throw new RuntimeException("Failed to read CSV file: " + e.getMessage(), e);
        }
        return rows;
    }

    // ── RFC-4180 Compliant CSV Line Parser ───────────────────────────────────
    private List<String> parseCsvLine(String line) {
        List<String> values = new ArrayList<>();
        StringBuilder cur = new StringBuilder();
        boolean inQuotes = false;

        for (int i = 0; i < line.length(); i++) {
            char c = line.charAt(i);

            if (c == '"') {
                if (inQuotes && i + 1 < line.length() && line.charAt(i + 1) == '"') {
                    // Escaped quote
                    cur.append('"');
                    i++;
                } else {
                    inQuotes = !inQuotes;
                }
            } else if (c == ',' && !inQuotes) {
                values.add(cur.toString().trim());
                cur.setLength(0);
            } else {
                cur.append(c);
            }
        }
        values.add(cur.toString().trim());
        return values;
    }

    // ── Smart Column Detector ────────────────────────────────────────────────
    private Map<String, String> detectColumnMappings(List<String> headers) {
        Map<String, String> mappings = new HashMap<>();

        for (String h : headers) {
            String lower = h.toLowerCase().trim();

            if (mappings.get("dateColumn") == null && (
                    lower.contains("date") || lower.contains("txn_dt") || lower.contains("time")
            )) {
                mappings.put("dateColumn", h);
            } else if (mappings.get("titleColumn") == null && (
                    lower.contains("desc") || lower.contains("narr") || lower.contains("particular")
                            || lower.contains("merchant") || lower.contains("payee") || lower.contains("detail")
                            || lower.contains("title") || lower.contains("remark")
            )) {
                mappings.put("titleColumn", h);
            } else if (mappings.get("debitColumn") == null && (
                    lower.equals("debit") || lower.contains("withdrawal") || lower.contains("dr")
            )) {
                mappings.put("debitColumn", h);
            } else if (mappings.get("creditColumn") == null && (
                    lower.equals("credit") || lower.contains("deposit") || lower.contains("cr")
            )) {
                mappings.put("creditColumn", h);
            } else if (mappings.get("amountColumn") == null && (
                    lower.contains("amount") || lower.equals("amt") || lower.contains("total")
            )) {
                mappings.put("amountColumn", h);
            } else if (mappings.get("categoryColumn") == null && (
                    lower.contains("category") || lower.contains("tag")
            )) {
                mappings.put("categoryColumn", h);
            } else if (mappings.get("accountColumn") == null && (
                    lower.contains("account") || lower.contains("mode") || lower.contains("payment")
            )) {
                mappings.put("accountColumn", h);
            } else if (mappings.get("typeColumn") == null && (
                    lower.equals("type") || lower.contains("txn type") || lower.contains("dr/cr")
            )) {
                mappings.put("typeColumn", h);
            }
        }

        return mappings;
    }

    private String getMappedValue(Map<String, String> row, String column) {
        if (column == null || column.isBlank()) return null;
        return row.get(column);
    }

    private LocalDate parseDate(String val) {
        if (val == null || val.isBlank()) return null;
        String clean = val.trim();

        // If contains time portion with space or 'T', split
        if (clean.contains("T")) {
            clean = clean.split("T")[0];
        }

        for (DateTimeFormatter fmt : DATE_FORMATTERS) {
            try {
                return LocalDate.parse(clean, fmt);
            } catch (DateTimeParseException ignored) {
            }
        }
        return null;
    }

    private Double parseAmount(String val) {
        if (val == null || val.isBlank()) return null;
        try {
            // Remove currency symbols, commas, quotes, spaces
            String clean = val.replaceAll("[^0-9.\\-+]", "").trim();
            if (clean.isEmpty() || clean.equals("-") || clean.equals("+")) return null;
            return Double.parseDouble(clean);
        } catch (NumberFormatException e) {
            return null;
        }
    }

    private User getUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found: " + email));
    }
}
