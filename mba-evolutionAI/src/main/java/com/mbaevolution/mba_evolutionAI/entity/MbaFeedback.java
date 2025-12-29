package com.mbaevolution.mba_evolutionAI.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Data
@Table(name = "mba_feedbacks")
public class MbaFeedback {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long mbaFeedbackId;

    private String mbaCustomerName;
    private String mbaEmail;
    private String mbaPhone;

    @Column(columnDefinition = "TEXT")
    private String mbaContent;

    private String mbaStatus = "NEW"; // NEW, RESOLVED
    private LocalDateTime mbaCreatedAt = LocalDateTime.now();
}