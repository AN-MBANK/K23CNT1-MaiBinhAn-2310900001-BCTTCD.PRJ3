// File: MbaDailyRevenueDTO.java (FULL CODE ĐÃ SỬA)

package com.mbaevolution.mba_evolutionAI.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;
import java.sql.Date;
import java.math.BigDecimal; // Thường dùng BigDecimal cho SUM/AVG

@Data
@AllArgsConstructor
@NoArgsConstructor
public class MbaDailyRevenueDTO {
    private LocalDate mbaDate;        // Ngày
    private Double mbaTotalAmount;    // Tổng tiền bán được trong ngày
    private Long mbaOrderCount;       // Tổng số đơn hàng trong ngày

    // 1. Constructor 3 tham số (Bạn đã có, giữ lại)
    public MbaDailyRevenueDTO(Date date, Double totalAmount, Long orderCount) {
        this.mbaDate = (date != null) ? date.toLocalDate() : null;
        this.mbaTotalAmount = (totalAmount != null) ? totalAmount : 0.0;
        this.mbaOrderCount = (orderCount != null) ? orderCount : 0L;
    }

    // 2. CONSTRUCTOR 2 THAM SỐ CẦN THÊM (ĐỂ KHỚP QUERY CỦA BẠN)
    // Query của bạn SELECT (Ngày, SUM), nên DTO phải có constructor (Ngày, Tiền)
    // Lưu ý: Kết quả SUM() thường là Double hoặc BigDecimal trong JPQL
    public MbaDailyRevenueDTO(java.time.LocalDate date, Double totalAmount) {
        this.mbaDate = date;
        this.mbaTotalAmount = totalAmount;
    }

    // THAY THẾ CHO JAVA.TIME.LOCALDATE VÀ DOUBLE
    // Nếu Hibernate trả về String/Date và Double/BigDecimal
    public MbaDailyRevenueDTO(Object date, Number totalAmount) {
        // Xử lý Ngày
        if (date instanceof java.sql.Date) {
            this.mbaDate = ((java.sql.Date) date).toLocalDate();
        } else if (date instanceof java.time.LocalDate) {
            this.mbaDate = (java.time.LocalDate) date;
        } else {
            this.mbaDate = null;
        }
        // Xử lý Tiền
        this.mbaTotalAmount = (totalAmount != null) ? totalAmount.doubleValue() : 0.0;
    }
}