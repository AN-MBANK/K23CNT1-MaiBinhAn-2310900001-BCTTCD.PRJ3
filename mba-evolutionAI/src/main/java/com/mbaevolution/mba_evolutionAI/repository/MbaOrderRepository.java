package com.mbaevolution.mba_evolutionAI.repository;

import com.mbaevolution.mba_evolutionAI.entity.MbaOrder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MbaOrderRepository extends JpaRepository<MbaOrder, Long> {

    /**
     * Tìm kiếm tất cả đơn hàng, sắp xếp theo ngày tạo giảm dần (Mới nhất lên đầu)
     */
    List<MbaOrder> findAllByOrderByMbaOrderDateDesc();

    /**
     * Tìm kiếm đơn hàng theo trạng thái (e.g., "SHIPPED", "NEW")
     * và sắp xếp theo ngày tạo giảm dần
     */
    List<MbaOrder> findByMbaStatusOrderByMbaOrderDateDesc(String mbaStatus);

    /**
     * Tìm kiếm tất cả đơn hàng theo trạng thái cụ thể (Dùng cho thống kê tổng quan)
     * Đây là phương thức đã được thêm vào để tính Doanh thu trong MbaAdminController.java
     */
    List<MbaOrder> findByMbaStatus(String mbaStatus);

    /**
     * Tìm kiếm đơn hàng của một người dùng cụ thể dựa trên Username của họ.
     * Phương thức này giải quyết lỗi "cannot find symbol findByUser_MbaUsername"
     */
    List<MbaOrder> findByUser_MbaUsername(String mbaUsername);
    @Query(value = "SELECT new com.mbaevolution.mba_evolutionAI.dto.MbaDailyRevenueDTO(" +
            "FUNCTION('DATE', o.mbaOrderDate), " +
            "SUM(o.mbaTotalAmount)) " +
            "FROM MbaOrder o " + // Dùng Entity Name (JPQL)
            "WHERE o.mbaStatus = 'SHIPPED' " +
            "GROUP BY FUNCTION('DATE', o.mbaOrderDate) " +
            "ORDER BY FUNCTION('DATE', o.mbaOrderDate) ASC")
    List<Object[]> getDailyRevenue();
}