package com.mbaevolution.mba_evolutionAI.controller;

import com.mbaevolution.mba_evolutionAI.entity.MbaProduct;
import com.mbaevolution.mba_evolutionAI.entity.MbaUser;
import com.mbaevolution.mba_evolutionAI.entity.MbaWishlist;
import com.mbaevolution.mba_evolutionAI.repository.MbaProductRepository;
import com.mbaevolution.mba_evolutionAI.repository.MbaWishlistRepository;
import jakarta.servlet.http.HttpSession;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import jakarta.servlet.http.HttpServletRequest;
import java.util.List;

@Controller
@RequestMapping("/wishlist")
public class MbaWishlistController {

    @Autowired
    private MbaWishlistRepository wishlistRepository;

    @Autowired
    private MbaProductRepository productRepository;

    // 1. Xem danh sách yêu thích
    @GetMapping
    public String viewWishlist(HttpSession session, Model model) {
        MbaUser user = (MbaUser) session.getAttribute("currentUser");
        if (user == null) return "redirect:/login"; // Chưa đăng nhập thì đá về login

        List<MbaWishlist> wishlist = wishlistRepository.findByUser_MbaUserId(user.getMbaUserId());
        model.addAttribute("wishlist", wishlist);
        return "mba-wishlist";
    }

    // 2. Thả tim / Bỏ tim (Toggle)
    @GetMapping("/toggle/{productId}")
    @Transactional // Để xóa được dữ liệu
    public String toggleWishlist(@PathVariable Long productId, HttpSession session, HttpServletRequest request) {
        MbaUser user = (MbaUser) session.getAttribute("currentUser");
        if (user == null) return "redirect:/login";

        boolean exists = wishlistRepository.existsByUser_MbaUserIdAndProduct_MbaProductId(user.getMbaUserId(), productId);

        if (exists) {
            // Đã thích rồi -> Xóa đi (Bỏ thích)
            wishlistRepository.deleteByUser_MbaUserIdAndProduct_MbaProductId(user.getMbaUserId(), productId);
        } else {
            // Chưa thích -> Thêm vào
            MbaProduct product = productRepository.findById(productId).orElse(null);
            if (product != null) {
                MbaWishlist item = new MbaWishlist();
                item.setUser(user);
                item.setProduct(product);
                wishlistRepository.save(item);
            }
        }

        // Quay lại trang cũ
        String referer = request.getHeader("Referer");
        return "redirect:" + (referer != null ? referer : "/shop");
    }
}