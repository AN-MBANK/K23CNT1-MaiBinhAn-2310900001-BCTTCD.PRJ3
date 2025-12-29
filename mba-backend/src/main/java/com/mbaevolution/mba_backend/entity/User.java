package com.mbaevolution.mba_backend.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String username;

    private String password; // Lưu ý: Trong thực tế cần mã hóa, ở đây demo mình để plain text
    private String fullName;
    private String email;
    private String role; // "USER" hoặc "ADMIN"
}