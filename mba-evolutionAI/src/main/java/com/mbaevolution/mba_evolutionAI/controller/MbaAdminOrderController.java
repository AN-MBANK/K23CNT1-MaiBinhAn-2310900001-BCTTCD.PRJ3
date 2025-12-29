package com.mbaevolution.mba_evolutionAI.controller;

import com.mbaevolution.mba_evolutionAI.entity.MbaOrder;
import com.mbaevolution.mba_evolutionAI.repository.MbaOrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Controller
@RequestMapping("/mba-admin/orders")
public class MbaAdminOrderController {

    @Autowired
    private MbaOrderRepository orderRepository;

    // --- 1. HIỂN THỊ DANH SÁCH ĐƠN HÀNG (Có lọc) ---
    @GetMapping
    public String listOrders(@RequestParam(name = "status", required = false) String status, Model model) {
        List<MbaOrder> orders;

        // Logic lọc: Nếu không chọn gì hoặc chọn ALL thì lấy hết
        if (status == null || "ALL".equals(status) || status.isEmpty()) {
            orders = orderRepository.findAllByOrderByMbaOrderDateDesc();
        } else {
            // Ngược lại thì lọc theo trạng thái
            orders = orderRepository.findByMbaStatus(status);
        }

        model.addAttribute("orders", orders);
        model.addAttribute("currentStatus", status); // Để giữ lại lựa chọn trên dropdown
        return "fragments/admin/mba-orders-list";
    }

    // --- 2. XỬ LÝ CẬP NHẬT TRẠNG THÁI ---
    @PostMapping("/update-status")
    public String updateOrderStatus(@RequestParam("orderId") Long orderId,
                                    @RequestParam("newStatus") String newStatus) {
        // Tìm đơn hàng
        MbaOrder order = orderRepository.findById(orderId).orElse(null);

        if (order != null) {
            // Cập nhật trạng thái mới
            order.setMbaStatus(newStatus);
            orderRepository.save(order);
        }

        // Load lại trang danh sách
        return "redirect:/mba-admin/orders";
    }

    // --- 3. XEM CHI TIẾT ĐƠN HÀNG (Nếu bạn cần) ---
    @GetMapping("/detail/{id}")
    public String orderDetail(@PathVariable("id") Long id, Model model) {
        MbaOrder order = orderRepository.findById(id).orElse(null);
        if(order == null) return "redirect:/mba-admin/orders";

        model.addAttribute("order", order);
        return "mba-admin-orders-detail"; // Tạo file detail.html nếu muốn xem chi tiết
    }
}