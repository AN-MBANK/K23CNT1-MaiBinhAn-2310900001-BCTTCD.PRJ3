package com.mbaevolution.mba_evolutionAI.controller;

import com.mbaevolution.mba_evolutionAI.entity.MbaProduct;
import com.mbaevolution.mba_evolutionAI.entity.MbaUser;
import com.mbaevolution.mba_evolutionAI.repository.MbaProductRepository;
import com.mbaevolution.mba_evolutionAI.services.MbaProductService;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.util.Optional;

@Controller
@RequestMapping("/mba-admin")
public class MbaAdminProductController {
    @Autowired
    private MbaProductService productService; // Đảm bảo tên biến viết đúng
    @Autowired
    private MbaProductRepository productRepository;

    // **********************************************
    // 1. HIỂN THỊ DANH SÁCH SẢN PHẨM (FIX LỖI 404 & TÊN VIEW)
    // URL: /mba-admin/products
    // **********************************************
    @GetMapping("/products")
    public String listProducts(
            @RequestParam(name = "keyword", required = false) String keyword,
            HttpSession session,
            Model model) {

        // 1. KIỂM TRA PHÂN QUYỀN (Giữ nguyên logic của bạn)
        MbaUser currentUser = (MbaUser) session.getAttribute("currentUser");
        if (currentUser == null || (!"ADMIN".equals(currentUser.getMbaRole()) && !"STAFF".equals(currentUser.getMbaRole()))) {
            return "redirect:/login";
        }
        model.addAttribute("productForm", new MbaProduct());

        // 2. LOGIC TÌM KIẾM
        // Sử dụng Pageable ảo (lấy 1000 sản phẩm đầu tiên) để khớp với hàm searchProducts trong Repo
        org.springframework.data.domain.Page<MbaProduct> productPage =
                productRepository.searchProducts(keyword, "All", org.springframework.data.domain.PageRequest.of(0, 1000));

        model.addAttribute("products", productPage.getContent());
        model.addAttribute("keyword", keyword); // Gửi lại từ khóa để hiển thị trên ô input

        return "fragments/admin/mba-products-list";
    }

    // **********************************************
    // 2. API LẤY DỮ LIỆU SẢN PHẨM BẰNG ID (Hỗ trợ Modal Edit)
    // URL: /mba-admin/products/get/{id}
    // **********************************************
    @GetMapping("/products/get/{id}")
    @ResponseBody
    public MbaProduct getProductData(@PathVariable Long id) {
        return productRepository.findById(id).orElse(null);
    }

    // **********************************************
    // 3. XỬ LÝ LƯU (THÊM MỚI / CHỈNH SỬA)
    // URL: /mba-admin/products/save
    // **********************************************
    @PostMapping("/products/save")
    public String saveOrUpdateProduct(
            @ModelAttribute("productForm") MbaProduct product,
            @RequestParam(value = "imageFile", required = false) org.springframework.web.multipart.MultipartFile imageFile,
            RedirectAttributes ra) {

        try {
            // Nếu là cập nhật (đã có ID)
            if (product.getMbaProductId() != null) {
                MbaProduct existingProduct = productRepository.findById(product.getMbaProductId()).orElse(null);

                if (existingProduct != null) {
                    // KIỂM TRA: Nếu người dùng KHÔNG chọn file mới
                    if (imageFile == null || imageFile.isEmpty()) {
                        // Giữ lại đường dẫn ảnh cũ từ database
                        product.setMbaImage(existingProduct.getMbaImage());
                    } else {
                        // Nếu CÓ chọn file mới, tiến hành lưu file và cập nhật đường dẫn mới
                        String newImageUrl = productService.storeFile(imageFile);
                        product.setMbaImage(newImageUrl);
                    }
                }
            } else {
                // Trường hợp thêm mới hoàn toàn
                if (imageFile != null && !imageFile.isEmpty()) {
                    String imageUrl = productService.storeFile(imageFile);
                    product.setMbaImage(imageUrl);
                }
            }

            productRepository.save(product);
            ra.addFlashAttribute("successMessage", "Lưu sản phẩm thành công!");
        } catch (Exception e) {
            ra.addFlashAttribute("errorMessage", "Lỗi: " + e.getMessage());
        }

        return "redirect:/mba-admin/products";
    }

    // **********************************************
    // 4. XÓA SẢN PHẨM
    // URL: /mba-admin/products/delete
    // **********************************************
    @PostMapping("/products/delete")
    public String deleteProduct(@RequestParam("productId") Long id, RedirectAttributes ra) {
        if (productRepository.existsById(id)) {
            productRepository.deleteById(id);
            ra.addFlashAttribute("successMessage", "Xóa sản phẩm thành công!");
        } else {
            ra.addFlashAttribute("errorMessage", "Không tìm thấy sản phẩm!");
        }
        return "fragments/admin/mba-products-list";
    }
}