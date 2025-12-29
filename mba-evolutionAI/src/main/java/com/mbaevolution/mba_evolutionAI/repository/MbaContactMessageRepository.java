package com.mbaevolution.mba_evolutionAI.repository;

import com.mbaevolution.mba_evolutionAI.entity.MbaContactMessage;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MbaContactMessageRepository extends JpaRepository<MbaContactMessage, Long> {
    // Không cần thêm gì, JpaRepository đã cung cấp các hàm save/findAll
}