package com.mbaevolution.mba_evolutionAI.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Data // Dùng Lombok để tạo getter/setter
@Table(name = "mba_contact_messages")
public class MbaContactMessage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long mbaMessageId;

    @Column(nullable = false)
    private String mbaName;

    @Column(nullable = false)
    private String mbaEmail;

    @Column(columnDefinition = "TEXT")
    private String mbaMessage;

    private LocalDateTime mbaSentAt = LocalDateTime.now();

    @Column(nullable = false)
    private String mbaStatus = "New"; // Trạng thái: New, Read, Resolved
}