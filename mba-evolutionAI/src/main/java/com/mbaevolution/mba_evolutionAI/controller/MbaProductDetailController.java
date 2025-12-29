package com.mbaevolution.mba_evolutionAI.controller;

import com.mbaevolution.mba_evolutionAI.entity.MbaProduct;
import com.mbaevolution.mba_evolutionAI.entity.MbaReview; // Import mới
import com.mbaevolution.mba_evolutionAI.repository.MbaProductRepository;
import com.mbaevolution.mba_evolutionAI.repository.MbaReviewRepository; // Import mới
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

import jakarta.servlet.http.HttpServletRequest;

import java.util.List;
import java.util.stream.Collectors;

@Controller
@RequestMapping("/detail")
public class MbaProductDetailController {

    @Autowired
    private MbaProductRepository productRepository;

    @Autowired
    private MbaReviewRepository reviewRepository; // <-- 1. Inject thêm Repository này

    @GetMapping("/{id}")
    public String showProductDetail(@PathVariable Long id, Model model, HttpServletRequest request) {
        model.addAttribute("requestURI", request.getRequestURI());

        MbaProduct product = productRepository.findById(id).orElse(null);
        if (product == null) return "redirect:/shop";

        // --- 2. Lấy danh sách Review của sản phẩm ---
        List<MbaReview> reviews = reviewRepository.findByProduct_MbaProductIdOrderByMbaCreatedAtDesc(id);

        // --- 3. Lấy sản phẩm liên quan (Giữ nguyên logic cũ) ---
        List<MbaProduct> allProducts = productRepository.findAll();
        List<MbaProduct> relatedProducts = allProducts.stream()
                .filter(p -> p.getMbaCategory().equals(product.getMbaCategory()) && !p.getMbaProductId().equals(product.getMbaProductId()))
                .limit(4)
                .collect(Collectors.toList());

        // --- 4. Gửi dữ liệu sang View ---
        model.addAttribute("product", product);
        model.addAttribute("reviews", reviews);          // Danh sách review
        model.addAttribute("newReview", new MbaReview());// Object rỗng cho form nhập liệu
        model.addAttribute("relatedProducts", relatedProducts);

        return "mba-product-detail";
    }
}