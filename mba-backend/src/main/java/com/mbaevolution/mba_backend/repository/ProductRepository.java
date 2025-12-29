package com.mbaevolution.mba_backend.repository;

import com.mbaevolution.mba_backend.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    // Có thể thêm hàm tìm kiếm tùy chỉnh tại đây nếu cần
}