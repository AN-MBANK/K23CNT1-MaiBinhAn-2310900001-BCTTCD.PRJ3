package com.mbaevolution.mba_evolutionAI.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "mba_products")
public class MbaProduct {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "mba_product_id") // Map chính xác ID
    private Long mbaProductId;

    @Column(name = "mba_name")
    private String mbaName;

    @Column(name = "mba_description", columnDefinition = "TEXT")
    private String mbaDescription;

    @Column(name = "mba_price")
    private Double mbaPrice;

    @Column(name = "mba_original_price")
    private Double mbaOriginalPrice;

    @Column(name = "mba_image", columnDefinition = "TEXT")
    private String mbaImage;

    @Column(name = "mba_stock")
    private Integer mbaStock;

    @Column(name = "mba_brand")
    private String mbaBrand;

    @Column(name = "mba_category")
    private String mbaCategory;

    @Column(name = "mba_rating")
    private Double mbaRating;

    @Column(name = "mba_reviews_count")
    private Integer mbaReviewsCount;

    // THÔNG SỐ KỸ THUẬT
    @Column(name = "mba_cpu")
    private String mbaCpu;

    @Column(name = "mba_ram")
    private String mbaRam; // Lưu ý: check lại tên cột DB xem là mba_ram hay mba_cpu_ram

    @Column(name = "mba_storage")
    private String mbaStorage;

    @Column(name = "mba_gpu")
    private String mbaGpu;

    @Column(name = "mba_screen")
    private String mbaScreen;
}