package com.mbaevolution.mba_evolutionAI.repository;

import com.mbaevolution.mba_evolutionAI.entity.MbaOrder;
import com.mbaevolution.mba_evolutionAI.entity.MbaOrderDetail;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MbaOrderDetailRepository extends JpaRepository<MbaOrderDetail, Long> {
    List<MbaOrderDetail> findByMbaOrder(MbaOrder mbaOrder);
}