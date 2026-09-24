package com.hrushi.finpilot.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.Locale;

@Entity
@Table(name = "expenses", indexes = {
    @Index(name = "idx_expense_user_fingerprint", columnList = "user_id, fingerprint")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Expense {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Title is required")
    @Column(nullable = false)
    private String title;

    @NotNull(message = "Amount is required")
    @Positive(message = "Amount must be greater than zero")
    @Column(nullable = false)
    private Double amount;

    private String category;

    private LocalDate expenseDate;

    /**
     * EXPENSE or INCOME
     */
    @Column(name = "transaction_type")
    @Builder.Default
    private String type = "EXPENSE";

    @Column(name = "account_name")
    @Builder.Default
    private String account = "Cash";

    @Column(length = 500)
    private String notes;

    @Column(name = "fingerprint", length = 512)
    private String fingerprint;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @PrePersist
    @PreUpdate
    public void generateFingerprint() {
        if (this.type == null || this.type.isBlank()) {
            this.type = "EXPENSE";
        }
        if (this.account == null || this.account.isBlank()) {
            this.account = "Cash";
        }
        this.fingerprint = buildFingerprint(this.expenseDate, this.title, this.amount, this.account);
    }

    public static String buildFingerprint(LocalDate date, String merchant, Double amount, String account) {
        String d = date != null ? date.toString() : "nodate";
        String m = merchant != null ? merchant.toLowerCase().trim() : "unknown";
        String a = amount != null ? String.format(Locale.US, "%.2f", Math.abs(amount)) : "0.00";
        String acc = account != null ? account.toLowerCase().trim() : "cash";
        return d + "|" + m + "|" + a + "|" + acc;
    }
}