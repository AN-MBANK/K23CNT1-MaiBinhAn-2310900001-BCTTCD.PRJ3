package com.mbaevolution.mba_evolutionAI.services;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption; // Import thêm cái này
import java.util.UUID;

@Service
public class MbaProductService {

    // Thư mục lưu trữ vật lý (Nằm ngoài source code để không bị mất khi Rebuild)
    private final Path rootLocation = Paths.get("uploads/products");

    public MbaProductService() {
        try {
            Files.createDirectories(rootLocation);
        } catch (IOException e) {
            throw new RuntimeException("Could not initialize storage location", e);
        }
    }

    public String storeFile(MultipartFile file) {
        try {
            if (file.isEmpty()) {
                throw new RuntimeException("Failed to store empty file.");
            }

            // Giữ nguyên logic tạo tên file
            String originalFilename = file.getOriginalFilename();
            String extension = "";
            if (originalFilename != null && originalFilename.contains(".")) {
                extension = originalFilename.substring(originalFilename.lastIndexOf("."));
            }
            String uniqueFilename = UUID.randomUUID().toString() + extension;

            // Lưu file vào ổ cứng
            Path destinationFile = this.rootLocation.resolve(uniqueFilename);

            // Dùng REPLACE_EXISTING để tránh lỗi nếu file trùng tên (dù có UUID rồi nhưng cứ chắc ăn)
            Files.copy(file.getInputStream(), destinationFile, StandardCopyOption.REPLACE_EXISTING);

            // Trả về đường dẫn URL để lưu vào Database (Khớp với ResourceHandler ở bước 1)
            return "/images/products/" + uniqueFilename;

        } catch (IOException e) {
            throw new RuntimeException("Failed to store file: " + e.getMessage(), e);
        }
    }
}