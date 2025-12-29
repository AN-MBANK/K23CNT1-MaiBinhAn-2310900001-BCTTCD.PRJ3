package com.mbaevolution.mba_evolutionAI.repository;

import com.mbaevolution.mba_evolutionAI.entity.MbaStockLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface MbaStockLogRepository extends JpaRepository<MbaStockLog, Long> {
    List<MbaStockLog> findByProduct_MbaProductIdOrderByMbaCreatedAtDesc(Long productId);
}