package com.mbaevolution.mba_evolutionAI.repository;

import com.mbaevolution.mba_evolutionAI.entity.MbaReview;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface MbaReviewRepository extends JpaRepository<MbaReview, Long> {
    // Lấy danh sách review của 1 sản phẩm, sắp xếp mới nhất lên đầu
    List<MbaReview> findByProduct_MbaProductIdOrderByMbaCreatedAtDesc(Long productId);
}