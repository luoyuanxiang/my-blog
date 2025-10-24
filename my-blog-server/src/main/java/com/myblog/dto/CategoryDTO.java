package com.myblog.dto;

import lombok.Data;
import java.time.LocalDateTime;

/**
 * 分类数据传输对象
 * 用于在API接口中传输分类数据，避免直接暴露实体类
 * 
 * @author MyBlog Team
 * @version 1.0
 * @since 2024-01-01
 */
@Data
public class CategoryDTO {
    
    /** 分类唯一标识符 */
    private Long id;
    
    /** 分类名称 */
    private String name;
    
    /** 分类URL友好的标识符 */
    private String slug;
    
    /** 分类描述 */
    private String description;
    
    /** 分类显示颜色（十六进制颜色值） */
    private String color;
    
    /** 该分类下的文章数量 */
    private Integer articleCount;
    
    /** 分类创建时间 */
    private LocalDateTime createdAt;
    
    /** 分类最后更新时间 */
    private LocalDateTime updatedAt;
}
