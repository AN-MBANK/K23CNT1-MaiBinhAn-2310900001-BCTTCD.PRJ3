package com.mbaevolution.mba_evolutionAI.controller;

import com.mbaevolution.mba_evolutionAI.entity.MbaOrder;
import com.mbaevolution.mba_evolutionAI.entity.MbaOrderDetail;
import com.mbaevolution.mba_evolutionAI.entity.MbaProduct;
import com.mbaevolution.mba_evolutionAI.entity.MbaUser;
import com.mbaevolution.mba_evolutionAI.repository.MbaOrderDetailRepository;
import com.mbaevolution.mba_evolutionAI.repository.MbaOrderRepository;
import com.mbaevolution.mba_evolutionAI.repository.MbaProductRepository;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.support.SessionStatus;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Controller
@SessionAttributes("cart")
public class MbaCartController {

    @Autowired private MbaProductRepository productRepository;
    @Autowired private MbaOrderRepository orderRepository;
    @Autowired private MbaOrderDetailRepository orderDetailRepository;

    // Khởi tạo giỏ hàng nếu chưa tồn tại
    @ModelAttribute("cart")
    public Map<Long, Integer> cart() {
        return new HashMap<>();
    }

    // --- 1. XEM GIỎ HÀNG (GET /cart) ---
    @GetMapping("/cart/add/{id}")
    public String addToCart(@PathVariable("id") Long id,
                            @ModelAttribute("cart") Map<Long, Integer> cart) {
        // Thêm ID sản phẩm và tăng số lượng
        cart.put(id, cart.getOrDefault(id, 0) + 1);
        return "redirect:/cart"; // Thêm xong nhảy vào giỏ hàng luôn
    }

    // --- XEM GIỎ HÀNG (GIẢI QUYẾT LỖI TRỐNG) ---
    @GetMapping("/cart")
    public String showCart(Model model, @ModelAttribute("cart") Map<Long, Integer> cart) {
        if (cart.isEmpty()) {
            model.addAttribute("detailedCart", Collections.emptyList());
            model.addAttribute("totalPrice", 0.0);
            return "mba-cart";
        }

        List<MbaProduct> productDetails = productRepository.findAllById(cart.keySet());
        List<Map<String, Object>> detailedCart = productDetails.stream()
                .map(product -> {
                    Integer quantity = cart.get(product.getMbaProductId());
                    Map<String, Object> item = new HashMap<>();
                    item.put("product", product);
                    item.put("quantity", quantity);
                    item.put("subTotal", product.getMbaPrice() * quantity);
                    return item;
                })
                .collect(Collectors.toList());

        Double totalPrice = detailedCart.stream()
                .mapToDouble(item -> (Double) item.get("subTotal"))
                .sum();

        model.addAttribute("detailedCart", detailedCart);
        model.addAttribute("totalPrice", totalPrice);
        return "mba-cart";
    }
    // --- 2. HIỂN THỊ TRANG THANH TOÁN (GET /checkout) ---
    @GetMapping("/checkout")
    public String showCheckoutPage(Model model, @ModelAttribute("cart") Map<Long, Integer> cart, HttpSession session) {
        if (cart.isEmpty()) {
            return "redirect:/cart";
        }

        List<MbaProduct> productDetails = productRepository.findAllById(cart.keySet());
        Double totalPrice = productDetails.stream()
                .mapToDouble(p -> p.getMbaPrice() * cart.get(p.getMbaProductId()))
                .sum();

        MbaUser currentUser = (MbaUser) session.getAttribute("currentUser");
        model.addAttribute("totalPrice", totalPrice);
        model.addAttribute("currentUser", currentUser);
        return "mba-checkout";
    }

    // --- 3. XỬ LÝ THANH TOÁN (POST /checkout/confirm) ---
    @PostMapping("/checkout/confirm")
    public String confirmCheckout(
            @RequestParam String name,
            @RequestParam String phone,
            @RequestParam String address,
            @RequestParam String paymentMethod,
            @RequestParam(required = false) String note,
            HttpSession session,
            @ModelAttribute("cart") Map<Long, Integer> cart,
            RedirectAttributes redirectAttributes,
            SessionStatus sessionStatus // Thêm cái này để xóa session cart sạch sẽ hơn
    ) {
        if (cart.isEmpty()) {
            redirectAttributes.addFlashAttribute("errorMessage", "Giỏ hàng trống.");
            return "redirect:/cart";
        }

        MbaUser currentUser = (MbaUser) session.getAttribute("currentUser");
        List<MbaProduct> productDetails = productRepository.findAllById(cart.keySet());

        // Tính tổng tiền
        Double actualTotalPrice = productDetails.stream()
                .mapToDouble(p -> p.getMbaPrice() * cart.get(p.getMbaProductId()))
                .sum();

        try {
            // A. Tạo Order
            MbaOrder newOrder = new MbaOrder();
            newOrder.setMbaCustomerName(name);
            newOrder.setMbaPhone(phone);
            newOrder.setMbaAddress(address);
            newOrder.setMbaNote(note);
            newOrder.setMbaTotalAmount(actualTotalPrice);
            newOrder.setMbaOrderDate(LocalDateTime.now());
            newOrder.setMbaPaymentMethod(paymentMethod);

            // Set trạng thái
            if ("BANK_TRANSFER".equals(paymentMethod)) {
                newOrder.setMbaStatus("AWAITING_PAYMENT");
            } else {
                newOrder.setMbaStatus("PENDING");
            }

            if (currentUser != null) {
                newOrder.setUser(currentUser);
            }

            MbaOrder savedOrder = orderRepository.save(newOrder);

            // B. Tạo Order Details
            for (MbaProduct product : productDetails) {
                MbaOrderDetail detail = new MbaOrderDetail();
                detail.setMbaOrder(savedOrder);
                detail.setMbaProduct(product);
                detail.setMbaQuantity(cart.get(product.getMbaProductId()));
                detail.setMbaPrice(product.getMbaPrice());
                orderDetailRepository.save(detail);
            }

            // C. Xóa giỏ hàng
            cart.clear(); // Xóa dữ liệu trong map
            // sessionStatus.setComplete(); // Nếu muốn xóa hoàn toàn session attribute (cẩn thận nếu dùng chung session)

            // D. CHUYỂN HƯỚNG SANG TRANG CẢM ƠN (Đã sửa URL chuẩn)
            return "redirect:/thankyou/" + savedOrder.getMbaOrderId();

        } catch (Exception e) {
            e.printStackTrace();
            redirectAttributes.addFlashAttribute("errorMessage", "Lỗi: " + e.getMessage());
            return "redirect:/checkout";
        }
    }

    // --- 4. HIỂN THỊ TRANG CẢM ƠN (MỚI THÊM) ---
    // Đây là hàm còn thiếu khiến bạn bị lỗi trước đó
    @GetMapping("/thankyou/{orderId}")
    public String showThankYouPage(@PathVariable Long orderId, Model model) {
        // 1. Tìm đơn hàng theo ID
        MbaOrder order = orderRepository.findById(orderId).orElse(null);

        // Nếu không tìm thấy đơn hàng, đá về trang chủ
        if (order == null) {
            return "redirect:/";
        }

        // 2. Lấy danh sách chi tiết đơn hàng (để hiển thị bảng sản phẩm)
        List<MbaOrderDetail> orderDetails = orderDetailRepository.findByMbaOrder(order);
        // Lưu ý: Bạn cần đảm bảo trong MbaOrderDetailRepository có hàm findByMbaOrder
        // Nếu chưa có, bạn có thể dùng order.getOrderDetails() nếu đã map quan hệ OneToMany trong Entity Order

        // 3. Đẩy dữ liệu sang View
        model.addAttribute("order", order);
        model.addAttribute("orderDetails", orderDetails);

        return "mba-thank-you"; // Tên file HTML trong thư mục templates
    }

    // --- 5. CẬP NHẬT GIỎ HÀNG ---
    @PostMapping("/cart/update")
    public String updateCart(
            @RequestParam Long productId,
            @RequestParam(required = false) Integer quantity,
            @RequestParam(required = false) String action,
            @ModelAttribute("cart") Map<Long, Integer> cart,
            RedirectAttributes redirectAttributes
    ) {
        if ("remove".equals(action)) {
            cart.remove(productId);
        } else if (quantity != null) {
            if (quantity <= 0) {
                cart.remove(productId);
            } else {
                cart.put(productId, quantity);
            }
        }
        return "redirect:/cart";
    }
}