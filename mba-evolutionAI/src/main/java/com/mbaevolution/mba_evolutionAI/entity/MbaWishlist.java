package com.mbaevolution.mba_evolutionAI.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Data
@Table(name = "mba_wishlist")
public class MbaWishlist {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long mbaWishlistId;

    // Ai thích?
    @ManyToOne
    @JoinColumn(name = "mba_user_id")
    private MbaUser user;

    // Thích cái gì?
    @ManyToOne
    @JoinColumn(name = "mba_product_id")
    private MbaProduct product;

    private LocalDateTime mbaCreatedAt = LocalDateTime.now();
}