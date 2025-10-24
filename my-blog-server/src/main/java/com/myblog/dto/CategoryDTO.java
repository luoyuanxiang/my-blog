package com.myblog.dto;

import lombok.Data;
import java.time.LocalDateTime;

/**
 * 分类数据传输对象
 */
@Data
public class CategoryDTO {
    
    private Long id;
    private String name;
    private String slug;
    private String description;
    private String color;
    private Integer articleCount;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
