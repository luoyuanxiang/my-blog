package com.myblog.dto;

import lombok.Data;
import java.time.LocalDateTime;

/**
 * 标签数据传输对象
 * 用于在API接口中传输标签数据，避免直接暴露实体类
 * 
 * @author MyBlog Team
 * @version 1.0
 * @since 2024-01-01
 */
@Data
public class TagDTO {
    
    /** 标签唯一标识符 */
    private Long id;
    
    /** 标签名称 */
    private String name;
    
    /** 标签URL友好的标识符 */
    private String slug;
    
    /** 标签显示颜色（十六进制颜色值） */
    private String color;
    
    /** 使用该标签的文章数量 */
    private Integer articleCount;
    
    /** 标签创建时间 */
    private LocalDateTime createdAt;
    
    /** 标签最后更新时间 */
    private LocalDateTime updatedAt;
}
