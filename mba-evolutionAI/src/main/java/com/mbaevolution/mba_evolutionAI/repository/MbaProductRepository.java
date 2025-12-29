package com.mbaevolution.mba_evolutionAI.repository;

import com.mbaevolution.mba_evolutionAI.entity.MbaProduct;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MbaProductRepository extends JpaRepository<MbaProduct, Long> {

    // Hàm tìm kiếm nâng cao: Tìm theo tên (chứa từ khóa) VÀ lọc theo danh mục (nếu có)
    @Query("SELECT p FROM MbaProduct p WHERE " +
            "(:keyword IS NULL OR :keyword = '' OR LOWER(p.mbaName) LIKE LOWER(CONCAT('%', :keyword, '%'))) " +
            "AND (:category IS NULL OR :category = '' OR :category = 'All' OR p.mbaCategory = :category)")
    Page<MbaProduct> searchProducts(@Param("keyword") String keyword,
                                    @Param("category") String category,
                                    Pageable pageable);

    List<MbaProduct> findByMbaCategory(String category);
}