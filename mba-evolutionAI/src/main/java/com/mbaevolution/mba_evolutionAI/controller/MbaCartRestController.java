package com.mbaevolution.mba_evolutionAI.controller;

import com.mbaevolution.mba_evolutionAI.repository.MbaProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.Map;

@RestController // <-- Đảm bảo đây là RestController
@RequestMapping("/api/cart") // <-- BASE PATH: /api/cart
@SessionAttributes("cart")
public class MbaCartRestController {

    @Autowired
    private MbaProductRepository productRepository; //

    // Khởi tạo giỏ hàng nếu chưa tồn tại
    @ModelAttribute("cart")
    public Map<Long, Integer> cart() {
        return new HashMap<>();
    }

    // API THÊM SẢN PHẨM VÀO GIỎ HÀNG (POST /api/cart/add)
    @PostMapping("/add")
    public ResponseEntity<String> addToCartApi(@RequestParam Long productId, @RequestParam int quantity, @ModelAttribute("cart") Map<Long, Integer> cart) {

        // 1. Kiểm tra sản phẩm có tồn tại không
        if (!productRepository.existsById(productId)) {
            return ResponseEntity.badRequest().body("Product not found");
        }

        // 2. Thêm hoặc cập nhật giỏ hàng (Logic đã có)
        cart.put(productId, cart.getOrDefault(productId, 0) + quantity);

        // 3. Trả về thành công
        return ResponseEntity.ok("Product added to cart");
    }
}