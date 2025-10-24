package com.myblog.dto;

import lombok.Data;
import java.time.LocalDateTime;

/**
 * 友链数据传输对象
 */
@Data
public class FriendLinkDTO {
    
    private Long id;
    private String name;
    private String url;
    private String description;
    private String logo;
    private Boolean isApproved;
    private Integer sortOrder;
    private Integer clickCount;
    private String email;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
