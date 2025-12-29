package com.mbaevolution.mba_evolutionAI.controller;

import com.mbaevolution.mba_evolutionAI.entity.MbaProduct;
import com.mbaevolution.mba_evolutionAI.repository.MbaProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import jakarta.servlet.http.HttpServletRequest; // Cần import

import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Controller
public class MbaShopController {

    @Autowired
    private MbaProductRepository productRepository;

    @GetMapping("/shop")
    public String showShopPage(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "mbaName") String sortField,
            @RequestParam(defaultValue = "asc") String sortDir,
            @RequestParam(required = false) String query,
            @RequestParam(required = false) String category,
            @RequestParam(defaultValue = "100000000") Double maxPrice,
            Model model) {

        // 1. Cấu hình phân trang: 15 sản phẩm/trang
        int pageSize = 15;
        Sort sort = sortDir.equalsIgnoreCase("asc") ?
                Sort.by(sortField).ascending() : Sort.by(sortField).descending();
        Pageable pageable = PageRequest.of(page, pageSize, sort);

        // 2. Gọi hàm search từ Repository (hàm searchProducts ông đã viết rất chuẩn rồi)
        Page<MbaProduct> productPage = productRepository.searchProducts(query, category, pageable);

        // 3. Đổ dữ liệu ra View
        model.addAttribute("products", productPage.getContent());
        model.addAttribute("currentPage", page);
        model.addAttribute("totalPages", productPage.getTotalPages());
        model.addAttribute("totalItems", productPage.getTotalElements());

        // Gửi lại các tham số để giữ trạng thái bộ lọc trên giao diện
        model.addAttribute("sortField", sortField);
        model.addAttribute("sortDir", sortDir);
        model.addAttribute("searchQuery", query);
        model.addAttribute("selectedCategory", category);
        model.addAttribute("priceRange", maxPrice);

        // Danh sách danh mục để hiện ở sidebar
        model.addAttribute("categories", List.of("Laptop", "PC Gaming", "Smartphone", "Monitor", "Accessory", "CPU", "MAINBOARD", "RAM", "VGA", "SSD", "PSU", "CASE"));

        return "mba-shop";
    }
}