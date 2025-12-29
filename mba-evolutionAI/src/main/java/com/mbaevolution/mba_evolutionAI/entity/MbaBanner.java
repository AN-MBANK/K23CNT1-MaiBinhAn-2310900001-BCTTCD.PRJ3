package com.mbaevolution.mba_evolutionAI.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "mba_banners")
public class MbaBanner {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long mbaBannerId; // id -> mbaBannerId

    private String mbaTitle;       // title -> mbaTitle
    private String mbaImageUrl;    // imageUrl -> mbaImageUrl
    private String mbaLinkUrl;     // linkUrl -> mbaLinkUrl

    private boolean mbaIsActive = true; // isActive -> mbaIsActive
    private int mbaDisplayOrder;   // displayOrder -> mbaDisplayOrder
}