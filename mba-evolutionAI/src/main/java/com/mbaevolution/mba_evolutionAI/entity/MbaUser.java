package com.mbaevolution.mba_evolutionAI.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "mba_users")
public class MbaUser {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    // Map vào cột mba_user_id (đã đúng vì Hibernate tự chuyển camelCase -> snake_case)
    // Nhưng để chắc chắn, nên khai báo rõ:
    @Column(name = "mba_user_id")
    private Long mbaUserId;

    @Column(name = "mba_username", unique = true, nullable = false)
    private String mbaUsername;

    // QUAN TRỌNG: Map biến này vào cột 'mba_password' (cột có dữ liệu)
    @Column(name = "mba_password", nullable = false)
    private String mbaUserPassword;

    // QUAN TRỌNG: Map biến này vào cột 'mba_full_name'
    @Column(name = "mba_full_name")
    private String mbaUserFullName;

    // QUAN TRỌNG: Map biến này vào cột 'mba_email'
    @Column(name = "mba_user_email", unique = true, nullable = false)
    private String mbaUserEmail;

    @Column(name = "mba_role")
    private String mbaRole = "USER";

    @Column(name="mba_user_avatar")
    private String mbaUserAvatar;
}