package com.myblog.dto;

import lombok.Data;
import java.time.LocalDateTime;

/**
 * 标签数据传输对象
 */
@Data
public class TagDTO {
    
    private Long id;
    private String name;
    private String slug;
    private String color;
    private Integer articleCount;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
