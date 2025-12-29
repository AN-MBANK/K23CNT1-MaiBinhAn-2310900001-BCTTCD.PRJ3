package com.mbaevolution.mba_evolutionAI.controller;

import com.mbaevolution.mba_evolutionAI.entity.*;
import com.mbaevolution.mba_evolutionAI.repository.*;
import com.mbaevolution.mba_evolutionAI.services.MbaProductService;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.transaction.annotation.Transactional;

import jakarta.servlet.http.HttpServletRequest;

@Controller
@RequestMapping("/mba-admin")
public class MbaAdminExtraController {

    @Autowired private MbaBannerRepository bannerRepo;
    @Autowired private MbaFeedbackRepository feedbackRepo;
    @Autowired private MbaProductRepository productRepo;
    @Autowired private MbaStockLogRepository stockLogRepo;
    @Autowired private MbaProductService productService;

    // --- 1. QUẢN LÝ BANNER ---
    @GetMapping("/banners")
    public String listBanners(Model model, HttpSession session, HttpServletRequest request) {
        // KIỂM TRA QUYỀN (CHỈ ADMIN)
        MbaUser currentUser = (MbaUser) session.getAttribute("currentUser");
        if (currentUser == null || (!"ADMIN".equals(currentUser.getMbaRole()))) {
            return "redirect:/login";
        }

        model.addAttribute("requestURI", request.getRequestURI());
        model.addAttribute("banners", bannerRepo.findAll());
        model.addAttribute("newBanner", new MbaBanner());
        return "mba-admin-banners";
    }

    @PostMapping("/banners/save")
    public String saveBanner(@ModelAttribute MbaBanner banner, @RequestParam("imageFile") MultipartFile file) {
        if (!file.isEmpty()) {
            String url = productService.storeFile(file);
            banner.setMbaImageUrl(url);
        }
        bannerRepo.save(banner);
        return "redirect:/mba-admin/banners";
    }

    @GetMapping("/banners/delete/{id}")
    public String deleteBanner(@PathVariable Long id) {
        bannerRepo.deleteById(id);
        return "redirect:/mba-admin/banners";
    }

    // --- 2. QUẢN LÝ KHO HÀNG ---
    @GetMapping("/warehouse")
    public String warehousePage(Model model, HttpSession session, HttpServletRequest request) {
        // KIỂM TRA QUYỀN (ADMIN và STAFF)
        MbaUser currentUser = (MbaUser) session.getAttribute("currentUser");
        if (currentUser == null || (!"ADMIN".equals(currentUser.getMbaRole()) && !"STAFF".equals(currentUser.getMbaRole()))) {
            return "redirect:/login";
        }

        model.addAttribute("requestURI", request.getRequestURI());
        model.addAttribute("products", productRepo.findAll());
        model.addAttribute("logs", stockLogRepo.findAll());
        return "mba-admin-warehouse";
    }

    @PostMapping("/warehouse/import")
    @Transactional
    public String importGoods(@RequestParam Long productId, @RequestParam int quantity, @RequestParam String note) {
        MbaProduct product = productRepo.findById(productId).orElseThrow();

        // Cộng dồn tồn kho
        int currentStock = product.getMbaStock() == null ? 0 : product.getMbaStock();
        product.setMbaStock(currentStock + quantity);
        productRepo.save(product);

        // Ghi lịch sử
        MbaStockLog log = new MbaStockLog();
        log.setProduct(product);
        log.setMbaQuantityChange(quantity);
        log.setMbaType("IMPORT");
        log.setMbaNote(note);
        stockLogRepo.save(log);

        return "redirect:/mba-admin/warehouse?success";
    }

    // --- 3. QUẢN LÝ KHIẾU NẠI ---


    @GetMapping("/feedbacks/resolve/{id}")
    public String resolveFeedback(@PathVariable Long id) {
        MbaFeedback fb = feedbackRepo.findById(id).orElse(null);
        if (fb != null) {
            fb.setMbaStatus("RESOLVED");
            feedbackRepo.save(fb);
        }
        return "redirect:/mba-admin/feedbacks";
    }
}