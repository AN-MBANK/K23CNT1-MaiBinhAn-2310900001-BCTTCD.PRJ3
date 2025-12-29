package com.mbaevolution.mba_evolutionAI.repository;

import com.mbaevolution.mba_evolutionAI.entity.MbaBanner;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface MbaBannerRepository extends JpaRepository<MbaBanner, Long> {
    List<MbaBanner> findByMbaIsActiveTrueOrderByMbaDisplayOrderAsc();
}