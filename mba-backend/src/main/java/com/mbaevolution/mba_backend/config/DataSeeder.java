package com.mbaevolution.mba_backend.config;

import com.mbaevolution.mba_backend.entity.Product;
import com.mbaevolution.mba_backend.entity.User;
import com.mbaevolution.mba_backend.repository.ProductRepository;
import com.mbaevolution.mba_backend.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.Arrays;

@Component
public class DataSeeder implements CommandLineRunner {

    // KHAI BÁO BIẾN Ở ĐÂY
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    // CONSTRUCTOR ĐỂ TIÊM (INJECT) CÁC BIẾN VÀO
    public DataSeeder(ProductRepository productRepository, UserRepository userRepository) {
        this.productRepository = productRepository;
        this.userRepository = userRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        // 1. Tạo dữ liệu Sản phẩm nếu chưa có
        if (productRepository.count() == 0) {
            Product p1 = new Product();
            p1.setName("Dell XPS 15 9530");
            p1.setPrice(45000000.0);
            p1.setCategory("Laptop");
            p1.setBrand("Dell");
            p1.setImage("https://picsum.photos/seed/dellxps/400/400");
            p1.setDescription("Laptop doanh nhân cao cấp.");
            p1.setCpu("Intel Core i9");
            p1.setRam("32GB");
            p1.setStorage("1TB SSD");

            Product p2 = new Product();
            p2.setName("MacBook Pro 14 M3");
            p2.setPrice(49000000.0);
            p2.setCategory("Laptop");
            p2.setBrand("Apple");
            p2.setImage("https://picsum.photos/seed/macbook/400/400");
            p2.setDescription("Siêu phẩm đồ họa.");
            p2.setCpu("M3 Pro Chip");
            p2.setRam("18GB");
            p2.setStorage("512GB SSD");

            productRepository.saveAll(Arrays.asList(p1, p2));
        }

        // 2. Tạo tài khoản ADMIN mặc định: admin / 123
        if (userRepository.count() == 0) {
            User admin = new User();
            admin.setUsername("admin");
            admin.setPassword("123");
            admin.setFullName("Quản Trị Viên");
            admin.setEmail("admin@mba.com");
            admin.setRole("ADMIN");
            userRepository.save(admin);
            System.out.println("----- ĐÃ TẠO ADMIN: admin / 123 -----");
        }
    }
}