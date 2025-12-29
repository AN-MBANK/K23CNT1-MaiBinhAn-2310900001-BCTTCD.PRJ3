// FILE: ViewController.java (Sửa lại lần cuối)

package com.mbaevolution.mba_evolutionAI.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.ui.Model;
import jakarta.servlet.http.HttpServletRequest;

@Controller
public class ViewController {

//    @GetMapping("/login")
//    public String showLoginForm(Model model, HttpServletRequest request) {
//        // DÒNG NÀY RẤT QUAN TRỌNG ĐỂ HEADER KHÔNG BỊ LỖI
//        model.addAttribute("requestURI", request.getRequestURI());
//        return "mba-login"; // Trả về tên view chính xác
//    }
//
//    @GetMapping("/register")
//    public String showRegisterForm(Model model, HttpServletRequest request) {
//        model.addAttribute("requestURI", request.getRequestURI());
//        return "mba-register";
//    }

    // XÓA redirectShop()
    // XÓA showHomePage()
    // XÓA redirectAdmin()

    // Chỉ giữ lại những đường dẫn không có Controller nghiệp vụ (VD: /about)
//    @GetMapping("/about")
//    public String showAboutPage(Model model, HttpServletRequest request) {
//        model.addAttribute("requestURI", request.getRequestURI());
//        return "mba-about";
//    }

    // Giữ lại các redirect nếu cần chuyển hướng các đường dẫn cũ sang đường dẫn mới
    // Tuy nhiên, đối với /shop, /admin, /user-orders, chúng đã có Controller riêng.
    // Nếu các Controller nghiệp vụ đã có @GetMapping, hãy loại bỏ khỏi ViewController.

    // Chúng ta hãy giữ các hàm sau:

    @GetMapping("/admin")
    public String redirectAdmin() {
        return "redirect:/mba-admin";
    }
}