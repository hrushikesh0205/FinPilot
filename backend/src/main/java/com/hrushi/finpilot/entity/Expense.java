package com.hrushi.finpilot.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "expenses")
@Data
public class Expense {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    private Double amount;

    private String category;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;
}