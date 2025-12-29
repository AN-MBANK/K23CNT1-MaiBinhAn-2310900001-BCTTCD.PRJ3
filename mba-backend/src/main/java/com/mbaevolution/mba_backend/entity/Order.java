package com.mbaevolution.mba_backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Data
@Table(name = "orders")
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String customerName;
    private String customerPhone;
    private String address;
    private Double totalPrice;
    private String username;
    private LocalDateTime orderDate = LocalDateTime.now();
    private String status = "PENDING"; // PENDING, CONFIRMED, SHIPPED
}