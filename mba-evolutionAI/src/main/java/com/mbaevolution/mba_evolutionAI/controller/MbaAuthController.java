package com.mbaevolution.mba_evolutionAI.controller;

import com.mbaevolution.mba_evolutionAI.entity.MbaUser;
import com.mbaevolution.mba_evolutionAI.repository.MbaUserRepository;
import com.mbaevolution.mba_evolutionAI.services.MbaUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.util.Optional;

@Controller
public class MbaAuthController {

    // Khai báo và tiêm Repository (Dùng biến userRepository)
    @Autowired
    private MbaUserRepository userRepository;

    // Giữ lại Service nếu có ý định sử dụng sau này
    @Autowired
    private MbaUserService userService;

    // --- 1. HIỂN THỊ TRANG LOGIN ---
    @GetMapping("/login")
    public String showLoginForm(Model model, HttpServletRequest request) {
        model.addAttribute("requestURI", request.getRequestURI());
        return "mba-login"; // Trả về view đúng tên: mba-login.html
    }

    // --- 2. XỬ LÝ ĐĂNG NHẬP ---
    @PostMapping("/login")
    public String handleLogin(
            @RequestParam String username,
            @RequestParam String password,
            HttpSession session,
            Model model
    ) {
        // SỬA LỖI GỌI HÀM: Dùng biến đã tiêm (userRepository) thay vì tên Class
        MbaUser user = userRepository.findByMbaUsernameAndMbaUserPassword(username, password);

        if (user != null) {
            session.setAttribute("currentUser", user);

            String role = user.getMbaRole();

            // LOGIC CHUYỂN HƯỚNG THEO ROLE
            if ("ADMIN".equals(role) || "STAFF".equals(role)) {
                // Thành công: Chuyển hướng ADMIN/STAFF tới trang quản trị
                return "redirect:/mba-admin";
            } else {
                // Thành công: Chuyển hướng USER THƯỜNG tới trang chủ
                return "redirect:/";
            }
        } else {
            // Thất bại
            model.addAttribute("errorMessage", "Sai tên đăng nhập hoặc mật khẩu.");
            return "mba-login"; // Quay lại view đúng tên: mba-login.html
        }
    }

    // --- 3. XỬ LÝ LOGOUT ---
    @GetMapping("/logout")
    public String logout(HttpSession session) {
        session.invalidate();
        return "redirect:/";
    }
    @GetMapping("/register")
    public String showRegisterForm(Model model, HttpServletRequest request,
                                   @RequestParam Optional<String> error) {

        model.addAttribute("requestURI", request.getRequestURI());

        // Hiển thị thông báo lỗi nếu có (ví dụ: username_exists)
        if (error.isPresent()) {
            if ("username_exists".equals(error.get())) {
                model.addAttribute("errorMessage", "Tên đăng nhập này đã tồn tại.");
            } else if ("server_error".equals(error.get())) {
                model.addAttribute("errorMessage", "Đăng ký thất bại do lỗi hệ thống. Vui lòng thử lại.");
            }
        }

        return "mba-register"; // <-- Tên file View HTML của bạn
    }
    // --- 4. XỬ LÝ ĐĂNG KÝ ---
    @PostMapping("/register")
    public String register(
            @RequestParam String username,
            @RequestParam String password,
            @RequestParam String fullName,
            @RequestParam String email
    ) {
        // Kiểm tra user đã tồn tại
        if (userRepository.findByMbaUsername(username).isPresent()) {
            return "redirect:/register?error=username_exists";
        }

        try {
            MbaUser newUser = new MbaUser();
            newUser.setMbaUsername(username);

            // SỬA LỖI SETTER: Sử dụng Setter chuẩn theo Entity (ví dụ: mbaPassword, mbaFullName)
            // LƯU Ý: Bạn cần đảm bảo các Setter này KHỚP với Entity MbaUser của bạn.
            newUser.setMbaUserPassword(password);
            newUser.setMbaUserFullName(fullName);
            newUser.setMbaUserEmail(email);      // Giữ nguyên nếu tên biến là mbaUserEmail

            newUser.setMbaRole("USER");

            userRepository.save(newUser);

            return "redirect:/login?success";
        } catch (Exception e) {
            // Log lỗi để debug
            e.printStackTrace();
            return "redirect:/register?error=server_error";
        }
    }
}