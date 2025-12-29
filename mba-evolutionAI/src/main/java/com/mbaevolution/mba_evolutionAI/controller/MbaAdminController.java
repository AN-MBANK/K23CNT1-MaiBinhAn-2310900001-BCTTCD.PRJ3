package com.mbaevolution.mba_evolutionAI.controller;

import com.mbaevolution.mba_evolutionAI.repository.MbaContactMessageRepository; // <-- DÒNG BẮT BUỘC CẦN THÊM
import com.mbaevolution.mba_evolutionAI.entity.MbaContactMessage;
import com.mbaevolution.mba_evolutionAI.entity.MbaOrder;
import com.mbaevolution.mba_evolutionAI.entity.MbaProduct;
import com.mbaevolution.mba_evolutionAI.entity.MbaUser;
import com.mbaevolution.mba_evolutionAI.repository.MbaOrderRepository;
import com.mbaevolution.mba_evolutionAI.repository.MbaProductRepository;
import com.mbaevolution.mba_evolutionAI.repository.MbaUserRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.util.List;
import java.util.Optional;

@Controller
@RequestMapping("/mba-admin")
public class MbaAdminController {

    @Autowired private MbaProductRepository productRepository;
    @Autowired private MbaOrderRepository orderRepository;
    @Autowired private MbaUserRepository userRepository;
    @Autowired
    private MbaContactMessageRepository contactMessageRepository;
    @GetMapping
    public String showAdminDashboard(HttpSession session, Model model, HttpServletRequest request) {
        model.addAttribute("requestURI", request.getRequestURI());

        // 1. KIỂM TRA QUYỀN TRUY CẬP (Cho phép ADMIN và STAFF)
        MbaUser currentUser = (MbaUser) session.getAttribute("currentUser");
        if (currentUser == null || (!"ADMIN".equals(currentUser.getMbaRole()) && !"STAFF".equals(currentUser.getMbaRole()))) {
            return "redirect:/mba-login";
        }

        // 2. THỐNG KÊ (Chỉ tính toán nếu là ADMIN, nếu không thì dùng số ảo để Staff thấy)
        long totalOrders = 0;
        double totalRevenue = 0.0;
        long totalUsers = 0;

        // Chỉ ADMIN mới thấy và tính toán số liệu nhạy cảm
        if ("ADMIN".equals(currentUser.getMbaRole())) {
            totalOrders = orderRepository.count();
            totalUsers = userRepository.count();

            // Tính tổng doanh thu từ các đơn đã giao thành công (SHIPPED)
            List<MbaOrder> completedOrders = orderRepository.findByMbaStatus("SHIPPED");
            totalRevenue = completedOrders.stream()
                    .mapToDouble(MbaOrder::getMbaTotalAmount)
                    .sum();
        }
        // STAFF sẽ thấy các số liệu cơ bản
        else {
            totalOrders = orderRepository.count(); // Vẫn cho Staff thấy số đơn
            totalUsers = userRepository.count();   // Vẫn cho Staff thấy số user
            totalRevenue = 0.0; // Không hiển thị doanh thu cho Staff
        }

        List<MbaProduct> allProducts = productRepository.findAll();

        model.addAttribute("totalOrders", totalOrders);
        model.addAttribute("totalProducts", allProducts.size());
        model.addAttribute("totalUsers", totalUsers);
        model.addAttribute("totalRevenue", totalRevenue);

        return "mba-admin";
    }
    @GetMapping("/feedbacks") // <--- Giả định đây là URL Admin Dashboard
    public String showAdminInbox(Model model) {
        // 1. Lấy tất cả tin nhắn từ Database, sắp xếp theo ngày gửi mới nhất
        List<MbaContactMessage> messages = contactMessageRepository.findAll(Sort.by(Sort.Direction.DESC, "mbaSentAt"));

        // 2. Gửi danh sách tin nhắn sang View
        model.addAttribute("messages", messages);

        // 3. Trả về View HTML
        // View này sẽ render nội dung cho "Hộp thư Khách hàng"
        return "mba-admin-inbox";
    }
    @GetMapping("/feedbacks/{id}") // URL: /mba-admin/feedbacks/1
    public String showFeedbackDetail(@PathVariable Long id, Model model) {

        // 1. Tải tin nhắn từ Database theo ID
        Optional<MbaContactMessage> messageOptional = contactMessageRepository.findById(id);

        if (messageOptional.isEmpty()) {
            // Nếu không tìm thấy, trả về lỗi 404 (Not Found)
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Feedback message not found");
        }

        MbaContactMessage message = messageOptional.get();

        // 2. Cập nhật trạng thái thành 'Read' nếu hiện tại là 'New'
        if ("New".equals(message.getMbaStatus())) {
            message.setMbaStatus("Read");
            contactMessageRepository.save(message);
        }

        // 3. Gửi tin nhắn và ID sang View
        model.addAttribute("message", message);
        model.addAttribute("messageId", id);

        // Trả về View HTML chi tiết
        return "mba-admin-feedback-detail";
    }
    @PostMapping("/feedbacks/resolve/{id}")
    public String resolveFeedback(@PathVariable Long id, RedirectAttributes redirectAttributes) {

        Optional<MbaContactMessage> messageOptional = contactMessageRepository.findById(id);

        if (messageOptional.isPresent()) {
            MbaContactMessage message = messageOptional.get();

            // 1. Cập nhật trạng thái
            message.setMbaStatus("Resolved");
            contactMessageRepository.save(message);

            // 2. Gửi thông báo
            redirectAttributes.addFlashAttribute("successMessage", "Tin nhắn #" + id + " đã được đánh dấu là Đã giải quyết.");
        } else {
            redirectAttributes.addFlashAttribute("errorMessage", "Không tìm thấy tin nhắn #" + id);
        }

        // 3. Chuyển hướng trở lại trang chi tiết
        return "redirect:/mba-admin/feedbacks/" + id;
    }
    @PostMapping("/feedbacks/delete/{id}")
    public String deleteFeedback(@PathVariable Long id, RedirectAttributes redirectAttributes) {

        // Kiểm tra xem tin nhắn có tồn tại không trước khi xóa (tùy chọn)
        if (contactMessageRepository.existsById(id)) {
            contactMessageRepository.deleteById(id);
            redirectAttributes.addFlashAttribute("successMessage", "Tin nhắn #" + id + " đã được xóa thành công.");

            // Chuyển hướng về trang danh sách sau khi xóa
            return "redirect:/mba-admin/feedbacks";
        } else {
            redirectAttributes.addFlashAttribute("errorMessage", "Không tìm thấy tin nhắn #" + id + " để xóa.");
            // Chuyển hướng về trang danh sách
            return "redirect:/mba-admin/feedbacks";
        }
}}