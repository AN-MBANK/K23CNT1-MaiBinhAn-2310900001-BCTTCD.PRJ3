package com.mbaevolution.mba_evolutionAI.controller;

import com.mbaevolution.mba_evolutionAI.repository.MbaProductRepository;
import com.mbaevolution.mba_evolutionAI.entity.MbaProduct;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Controller
public class MbaBuildPcController {

    @Autowired
    private MbaProductRepository productRepo;

    @GetMapping("/build-pc")
    public String showBuildPage(Model model) {
        // Đổ dữ liệu linh kiện ra giao diện (Dùng đúng tên biến mbaCategory trong Entity)
        model.addAttribute("cpus", productRepo.findByMbaCategory("CPU"));
        model.addAttribute("mains", productRepo.findByMbaCategory("MAINBOARD"));
        model.addAttribute("rams", productRepo.findByMbaCategory("RAM"));
        model.addAttribute("vgas", productRepo.findByMbaCategory("VGA"));
        model.addAttribute("ssds", productRepo.findByMbaCategory("SSD"));
        model.addAttribute("psus", productRepo.findByMbaCategory("PSU"));
        model.addAttribute("cases", productRepo.findByMbaCategory("CASE"));

        return "mba-build-pc";
    }

    @PostMapping("/build-pc/add-to-cart")
    public String addBuildToCart(@RequestParam Map<String, String> allParams, HttpSession session) {

        // 1. Lấy giỏ hàng kiểu Map (Giống trang Shop của ông đang dùng)
        Map<Long, Integer> cart = (Map<Long, Integer>) session.getAttribute("cart");
        if (cart == null) {
            cart = new HashMap<>();
        }

        // 2. Duyệt các linh kiện build PC gửi lên
        for (String key : allParams.keySet()) {
            String idStr = allParams.get(key);
            if (idStr != null && !idStr.trim().isEmpty()) {
                try {
                    Long productId = Long.parseLong(idStr);
                    // Thêm sản phẩm vào Map, số lượng là 1
                    cart.put(productId, cart.getOrDefault(productId, 0) + 1);
                } catch (NumberFormatException e) {
                    // Bỏ qua tham số lỗi
                }
            }
        }

        // 3. Lưu lại vào session
        session.setAttribute("cart", cart);

        return "redirect:/cart";
    }
}