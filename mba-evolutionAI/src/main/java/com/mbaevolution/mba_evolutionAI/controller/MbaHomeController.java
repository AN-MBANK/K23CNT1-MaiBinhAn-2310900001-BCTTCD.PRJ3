package com.mbaevolution.mba_evolutionAI.controller;

import com.mbaevolution.mba_evolutionAI.entity.*;
import com.mbaevolution.mba_evolutionAI.repository.MbaBannerRepository;
import com.mbaevolution.mba_evolutionAI.repository.MbaContactMessageRepository;
import com.mbaevolution.mba_evolutionAI.repository.MbaProductRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.util.List;
import java.util.stream.Collectors;

@Controller
public class MbaHomeController {
    @Autowired
    private MbaContactMessageRepository contactMessageRepository; // <-- THÊM DÒNG NÀY
    @Autowired
    private MbaProductRepository productRepository;

    @Autowired
    private MbaBannerRepository bannerRepository;

    @GetMapping({"/", "/home"})
    public String home(Model model) {
        // 1. Lấy tất cả sản phẩm từ DB
        List<MbaProduct> allProducts = productRepository.findAll();

        // 2. Lấy 8 sản phẩm đầu tiên để làm "Nổi bật" (Sau này có thể lọc theo tiêu chí khác)
        // Sử dụng stream để giới hạn số lượng an toàn, tránh lỗi nếu DB ít hơn 8 sp
        List<MbaProduct> featuredProducts = allProducts.stream()
                .limit(8)
                .collect(Collectors.toList());

        // 3. Đưa dữ liệu ra View
        model.addAttribute("featuredProducts", featuredProducts);
        model.addAttribute("currentUri", "/");

        return "index";
    }
    @GetMapping("/product/{id}")
    public String productDetail(@PathVariable("id") Long id, Model model) {
        // 1. Tìm sản phẩm (Code cũ của ông)
        MbaProduct product = productRepository.findById(id).orElse(null);
        if (product == null) return "redirect:/shop";

        model.addAttribute("product", product);

        // 2. [QUAN TRỌNG] Thêm dòng này để fix lỗi "newReview"
        model.addAttribute("newReview", new MbaReview());

        // 3. Lấy đánh giá cũ (Nếu ông đã làm tính năng hiển thị list review)
        // List<MbaReview> reviews = reviewRepository.findByProduct(product);
        // model.addAttribute("reviews", reviews);

        // 4. Sản phẩm liên quan (Code cũ)
        List<MbaProduct> relatedProducts = productRepository.findAll().stream()
                .filter(p -> !p.getMbaProductId().equals(id))
                .limit(4)
                .toList();
        model.addAttribute("relatedProducts", relatedProducts);

        return "mba-product-detail";
    }
    @GetMapping("/about")
    public String showAboutPage() {
        // Trả về file HTML tĩnh: src/main/resources/templates/mba-about.html
        return "mba-about";
    }

    @GetMapping("/contact")
    public String showContactPage() {
        // Trả về file HTML tĩnh: src/main/resources/templates/mba-contact.html
        return "mba-contact";
    }
    @PostMapping("/contact")
    public String handleContactForm(
            @RequestParam String name,
            @RequestParam String email,
            @RequestParam String message,
            RedirectAttributes redirectAttributes
    ) {
        // 1. Tạo Entity mới
        MbaContactMessage contactMessage = new MbaContactMessage();
        contactMessage.setMbaName(name);
        contactMessage.setMbaEmail(email);
        contactMessage.setMbaMessage(message);
        // mbaSentAt và mbaStatus đã được set mặc định trong Entity (tại thời điểm tạo)

        // 2. Lưu vào Database
        try {
            contactMessageRepository.save(contactMessage);
            redirectAttributes.addFlashAttribute("contactSuccess", "Cảm ơn bạn. Tin nhắn của bạn đã được gửi thành công!");
        } catch (Exception e) {
            // Xử lý lỗi nếu việc lưu thất bại
            redirectAttributes.addFlashAttribute("contactError", "Gửi tin nhắn thất bại. Vui lòng thử lại.");
            e.printStackTrace();
        }

        return "redirect:/contact";
    }

}