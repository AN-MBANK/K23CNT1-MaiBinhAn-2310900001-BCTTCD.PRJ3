package com.mbaevolution.mba_evolutionAI.repository;

import com.mbaevolution.mba_evolutionAI.entity.MbaFeedback;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface MbaFeedbackRepository extends JpaRepository<MbaFeedback, Long> {
    List<MbaFeedback> findAllByOrderByMbaCreatedAtDesc();
}