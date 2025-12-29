package com.mbaevolution.mba_evolutionAI.controller;

// Bạn có thể giữ lại hoặc xóa MbaDailyRevenueDTO nếu nó không được dùng
// import com.mbaevolution.mba_evolutionAI.dto.MbaDailyRevenueDTO;

import com.mbaevolution.mba_evolutionAI.repository.MbaOrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.List;

@Controller
@RequestMapping("/mba-admin/reports")
public class MbaReportController {

    @Autowired
    private MbaOrderRepository orderRepository;

    @GetMapping
    public String showRevenueReport(Model model) {

        // 1. Lấy danh sách doanh thu theo ngày từ Database (Trả về List<Object[]>)
        // data[0] = Ngày, data[1] = Tổng tiền SUM
        List<Object[]> rawRevenueList = orderRepository.getDailyRevenue();

        // 2. Tính tổng doanh thu toàn thời gian (Grand Total)
        double grandTotal = rawRevenueList.stream()
                // Chỉ mục 1 (data[1]) chứa tổng tiền
                .mapToDouble(data -> {
                    // Xử lý an toàn: Kiểm tra NULL
                    if (data[1] == null) return 0.0;

                    // Ép kiểu Object thành Double
                    if (data[1] instanceof Number) {
                        return ((Number) data[1]).doubleValue();
                    }
                    // Trường hợp xấu: Ép từ String/Object sang Double
                    try {
                        return Double.parseDouble(data[1].toString());
                    }
                    catch (Exception e) {
                        return 0.0;
                    }
                })
                .sum();

        // 3. Gửi dữ liệu sang HTML
        // Trong View (mba-admin-reports.html), bạn sẽ truy cập:
        // - Ngày: ${revenue[0]}
        // - Doanh thu: ${revenue[1]}
        model.addAttribute("revenueList", rawRevenueList);
        model.addAttribute("grandTotal", grandTotal);

        return "mba-admin-reports";
    }
}