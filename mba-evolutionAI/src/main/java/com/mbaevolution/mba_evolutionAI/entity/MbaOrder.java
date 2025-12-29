package com.mbaevolution.mba_evolutionAI.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.ArrayList; // Cần thiết cho việc khởi tạo danh sách
import java.util.List;

@Entity
@Data
@Table(name = "mba_orders")
public class MbaOrder {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long mbaOrderId;

    @ManyToOne
    @JoinColumn(name = "mba_user_id")
    private MbaUser user;

    // --- THÔNG TIN KHÁCH HÀNG ---
    @Column(name = "mba_customer_name")
    private String mbaCustomerName; // Đổi mbaFullName thành mbaCustomerName cho rõ ràng

    @Column(name = "mba_customer_phone")
    private String mbaPhone;

    @Column(name = "mba_address")
    private String mbaAddress;

    private String mbaNote;

    // --- THÔNG TIN ĐƠN HÀNG ---
    @Column(name = "mba_total_price")
    private Double mbaTotalAmount;

    // 1. [BỔ SUNG] Lưu phương thức thanh toán
    @Column(name = "mba_payment_method")
    private String mbaPaymentMethod;

    // CHỈ DÙNG TRƯỜNG STRING NÀY
    @Column(name = "mba_status")
    private String mbaStatus = "PENDING";

    @Column(name = "mba_order_date")
    private LocalDateTime mbaOrderDate = LocalDateTime.now();

    // 2. [SỬA LỖI ÁNH XẠ] Cần sử dụng tên trường của Entity MbaOrderDetail (order)
    @OneToMany(mappedBy = "mbaOrder", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<MbaOrderDetail> mbaOrderDetails = new ArrayList<>();

    // Lưu ý: Lombok @Data tự động tạo Getter, Setter, toString, equals, và hashCode.

}