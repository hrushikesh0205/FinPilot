package com.hrushi.finpilot.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "notifications")
@Data
@NoArgsConstructor
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Renamed from 'type' → 'notification_type' to avoid MySQL reserved word conflict
    @Column(name = "notification_type")
    private String type;

    private String title;

    @Column(length = 512)
    private String message;

    // Renamed from 'read' → 'is_read' — READ is a reserved keyword in MySQL 8
    @Column(name = "is_read")
    private boolean read = false;

    // Explicit column name to avoid any Hibernate naming ambiguity
    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    public Notification(String type, String title, String message, User user) {
        this.type = type;
        this.title = title;
        this.message = message;
        this.user = user;
        this.read = false;
        this.createdAt = LocalDateTime.now();
    }
}
