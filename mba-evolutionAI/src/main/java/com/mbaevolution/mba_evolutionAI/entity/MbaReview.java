package com.mbaevolution.mba_evolutionAI.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Data
@Table(name = "mba_reviews")
public class MbaReview {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long mbaReviewId;

    // Ai đánh giá?
    @ManyToOne
    @JoinColumn(name = "mba_user_id")
    private MbaUser user;

    // Đánh giá sản phẩm nào?
    @ManyToOne
    @JoinColumn(name = "mba_product_id")
    private MbaProduct product;

    // Số sao (1-5)
    private Integer mbaRating;

    // Nội dung bình luận
    @Column(columnDefinition = "TEXT")
    private String mbaComment;

    private LocalDateTime mbaCreatedAt = LocalDateTime.now();
}