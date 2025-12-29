package com.mbaevolution.mba_evolutionAI.controller;

import com.mbaevolution.mba_evolutionAI.entity.MbaUser;
import com.mbaevolution.mba_evolutionAI.repository.MbaUserRepository;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;

@Controller
@RequestMapping("/profile")
public class MbaProfileController {
    @Autowired
    private MbaUserRepository userRepository;
    @GetMapping
    public String showUserProfile(HttpSession session, Model model) {
        MbaUser currentUser = (MbaUser) session.getAttribute("currentUser");

        if (currentUser == null) {
            return "redirect:/mba-login";
        }

        model.addAttribute("user", currentUser);

        return "mba-profile";
    }
    @PostMapping("/profile/update-avatar")
    public String updateAvatar(@RequestParam("avatarFile") MultipartFile file, HttpSession session) {
        MbaUser currentUser = (MbaUser) session.getAttribute("currentUser");

        if (!file.isEmpty() && currentUser != null) {
            try {
                // 1. Tạo tên file duy nhất để không bị trùng (ví dụ: avatar_admin_123.jpg)
                String fileName = "avatar_" + currentUser.getMbaUsername() + "_" + System.currentTimeMillis() + ".jpg";

                // 2. Đường dẫn lưu file (Trỏ vào thư mục static/uploads)
                Path path = Paths.get("src/main/resources/static/uploads/" + fileName);

                // 3. Lưu file vật lý vào ổ đĩa
                Files.copy(file.getInputStream(), path, StandardCopyOption.REPLACE_EXISTING);

                // 4. Lưu đường dẫn vào Database
                currentUser.setMbaUserAvatar("/uploads/" + fileName);
                userRepository.save(currentUser);

                // 5. Cập nhật lại session để Header và Profile nhận ảnh mới ngay lập tức
                session.setAttribute("currentUser", currentUser);

            } catch (IOException e) {
                e.printStackTrace();
            }
        }
        return "redirect:/profile";
    }
}