package com.mbaevolution.mba_evolutionAI.controller;

import com.mbaevolution.mba_evolutionAI.entity.MbaProduct;
import com.mbaevolution.mba_evolutionAI.entity.MbaReview;
import com.mbaevolution.mba_evolutionAI.entity.MbaUser;
import com.mbaevolution.mba_evolutionAI.repository.MbaProductRepository;
import com.mbaevolution.mba_evolutionAI.repository.MbaReviewRepository;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import java.time.LocalDateTime;
import java.util.List;

@Controller
@RequestMapping("/review")
public class MbaReviewController {

    @Autowired
    private MbaReviewRepository reviewRepository;

    @Autowired
    private MbaProductRepository productRepository;

    @PostMapping("/add/{productId}")
    public String addReview(
            @PathVariable Long productId,
            @ModelAttribute MbaReview review,
            HttpSession session
    ) {
        MbaUser currentUser = (MbaUser) session.getAttribute("currentUser");
        if (currentUser == null) {
            return "redirect:/login";
        }

        MbaProduct product = productRepository.findById(productId).orElse(null);
        if (product != null) {
            // 1. Lưu review
            review.setUser(currentUser);
            review.setProduct(product);
            review.setMbaCreatedAt(LocalDateTime.now());
            reviewRepository.save(review);

            // 2. Tính điểm trung bình
            List<MbaReview> reviews = reviewRepository.findByProduct_MbaProductIdOrderByMbaCreatedAtDesc(productId);
            double average = reviews.stream().mapToInt(MbaReview::getMbaRating).average().orElse(0.0);

            product.setMbaRating(Math.round(average * 10.0) / 10.0);
            product.setMbaReviewsCount(reviews.size());
            productRepository.save(product);
        }

        // --- SỬA DÒNG NÀY ---
        return "redirect:/detail/" + productId;
    }
}