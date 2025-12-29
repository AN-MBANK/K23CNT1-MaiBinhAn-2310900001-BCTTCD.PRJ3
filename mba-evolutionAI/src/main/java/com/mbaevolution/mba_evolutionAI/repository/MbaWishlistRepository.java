package com.mbaevolution.mba_evolutionAI.repository;

import com.mbaevolution.mba_evolutionAI.entity.MbaWishlist;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface MbaWishlistRepository extends JpaRepository<MbaWishlist, Long> {
    // Tìm tất cả món đồ mà user này đã thích
    List<MbaWishlist> findByUser_MbaUserId(Long userId);

    // Kiểm tra xem user đã thích món này chưa (để hiện tim đỏ)
    boolean existsByUser_MbaUserIdAndProduct_MbaProductId(Long userId, Long productId);

    // Xóa món đồ khỏi danh sách thích
    void deleteByUser_MbaUserIdAndProduct_MbaProductId(Long userId, Long productId);
}