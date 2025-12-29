package com.mbaevolution.mba_backend.controller;

import com.mbaevolution.mba_backend.entity.User;
import com.mbaevolution.mba_backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/register")
    public User register(@RequestBody User user) {
        // Mặc định tạo user mới là role USER
        if (user.getRole() == null) {
            user.setRole("USER");
        }
        return userRepository.save(user);
    }

    @PostMapping("/login")
    public User login(@RequestBody User loginRequest) {
        User user = userRepository.findByUsername(loginRequest.getUsername())
                .orElse(null);

        if (user != null && user.getPassword().equals(loginRequest.getPassword())) {
            return user; // Đăng nhập thành công trả về thông tin user
        }
        return null; // Đăng nhập thất bại
    }
}