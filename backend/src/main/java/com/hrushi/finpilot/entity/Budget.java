package com.hrushi.finpilot.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "budgets")
@Data
public class Budget {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String category;

    private Double monthlyLimit;

    private int month;

    private int year;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;
}
