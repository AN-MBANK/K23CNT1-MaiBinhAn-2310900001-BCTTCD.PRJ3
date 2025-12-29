package com.mbaevolution.mba_backend.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data // Lombok tự sinh Getter/Setter
@Table(name = "products")
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private Double price;
    private Double originalPrice;
    private String category; // Laptop, PC, etc.
    private String brand;

    @Column(columnDefinition = "TEXT")
    private String image; // Link ảnh

    private Double rating;
    private Integer reviewsCount;

    @Column(columnDefinition = "TEXT")
    private String description;

    // Để đơn giản, specs có thể lưu dạng chuỗi JSON hoặc tách bảng riêng
    // Ở đây mình ví dụ lưu dạng chuỗi cho nhanh
    private String cpu;
    private String ram;
    private String storage;
    private String gpu;
    private String screen;
}