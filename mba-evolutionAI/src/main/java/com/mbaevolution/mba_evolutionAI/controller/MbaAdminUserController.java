package com.mbaevolution.mba_evolutionAI.controller;

import com.mbaevolution.mba_evolutionAI.entity.MbaUser;
import com.mbaevolution.mba_evolutionAI.repository.MbaUserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.List;

@Controller
@RequestMapping("/mba-admin/users")
public class MbaAdminUserController {

    @Autowired
    private MbaUserRepository userRepository;

    // 1. Hiển thị danh sách người dùng
    @GetMapping
    public String listUsers(Model model) {
        List<MbaUser> users = userRepository.findAll();
        model.addAttribute("users", users);
        return "mba-admin-users";
    }

    // 2. Xóa người dùng (Cẩn thận: Xóa user sẽ mất luôn đơn hàng của họ)
    @GetMapping("/delete/{id}")
    public String deleteUser(@PathVariable Long id) {
        userRepository.deleteById(id);
        return "redirect:/mba-admin/users";
    }
}