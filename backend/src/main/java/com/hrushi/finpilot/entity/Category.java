package com.hrushi.finpilot.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "categories")
@Data
public class Category {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    private String icon;

    private String color;

    private Double budget;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;
}
