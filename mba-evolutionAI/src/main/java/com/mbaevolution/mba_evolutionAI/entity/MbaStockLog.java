package com.mbaevolution.mba_evolutionAI.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Data
@Table(name = "mba_stock_logs")
public class MbaStockLog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long mbaStockLogId; // id -> mbaStockLogId

    @ManyToOne
    @JoinColumn(name = "mba_product_id") // Map với cột trong DB
    private MbaProduct product; // Biến object giữ nguyên tên 'product' cho gọn khi gọi ${log.product.mbaName}

    private int mbaQuantityChange; // quantityChange -> mbaQuantityChange
    private String mbaType;        // type -> mbaType (IMPORT/EXPORT)
    private String mbaNote;        // note -> mbaNote

    private LocalDateTime mbaCreatedAt = LocalDateTime.now(); // createdAt -> mbaCreatedAt
}