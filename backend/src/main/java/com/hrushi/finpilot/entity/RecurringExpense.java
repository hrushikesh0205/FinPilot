package com.hrushi.finpilot.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "recurring_expenses")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RecurringExpense {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private Double amount;

    private String category;

    /**
     * WEEKLY, BIWEEKLY, MONTHLY, QUARTERLY, ANNUAL
     */
    @Column(nullable = false)
    private String cadence;

    private LocalDate startDate;

    private LocalDate nextDueDate;

    /**
     * ACTIVE, IGNORED
     */
    @Column(nullable = false)
    @Builder.Default
    private String status = "ACTIVE";

    /**
     * High confidence, Likely
     */
    private String confidence;

    private Integer occurrences;

    @Builder.Default
    private Boolean autoDetected = false;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        if (this.status == null) {
            this.status = "ACTIVE";
        }
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
