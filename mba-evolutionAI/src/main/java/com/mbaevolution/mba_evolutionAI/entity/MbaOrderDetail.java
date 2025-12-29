package com.mbaevolution.mba_evolutionAI.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "mba_order_details")
public class MbaOrderDetail {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "mba_detail_id")
    private Long mbaOrderDetailId;

    // PHẦN CẦN ĐẢM BẢO KHỚP TÊN: Tên trường phải là 'mbaOrder'
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "mba_order_id", nullable = false)
    private MbaOrder mbaOrder; // <--- TÊN NÀY PHẢI KHỚP VỚI mappedBy="mbaOrder" TRONG MbaOrder.java

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "mba_product_id")
    private MbaProduct mbaProduct;

    private Integer mbaQuantity;
    private Double mbaPrice;
}