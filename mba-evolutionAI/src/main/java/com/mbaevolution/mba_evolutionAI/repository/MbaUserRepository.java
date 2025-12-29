// File: MbaUserRepository.java

package com.mbaevolution.mba_evolutionAI.repository;

import com.mbaevolution.mba_evolutionAI.entity.MbaUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface MbaUserRepository extends JpaRepository<MbaUser, Long> {

    // Phương thức tìm kiếm bằng Username
    Optional<MbaUser> findByMbaUsername(String mbaUsername);

    // <<< PHẢI THÊM CHÍNH XÁC PHƯƠNG THỨC NÀY VÀO >>>
    /**
     * Dùng để xác thực đăng nhập: Tìm kiếm User dựa trên cả Username và Password
     */
    MbaUser findByMbaUsernameAndMbaUserPassword(String mbaUsername, String mbaUserPassword);
}