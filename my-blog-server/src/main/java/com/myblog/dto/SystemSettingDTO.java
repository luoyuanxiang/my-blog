package com.myblog.dto;

import lombok.Data;
import java.time.LocalDateTime;

/**
 * 系统设置数据传输对象
 * 用于在API接口中传输系统设置数据，避免直接暴露实体类
 * 
 * @author MyBlog Team
 * @version 1.0
 * @since 2024-01-01
 */
@Data
public class SystemSettingDTO {
    
    /** 设置项唯一标识符 */
    private Long id;
    
    /** 设置项键名 */
    private String key;
    
    /** 设置项值 */
    private String value;
    
    /** 设置项描述 */
    private String description;
    
    /** 设置项数据类型 */
    private String settingType;
    
    /** 设置项是否公开（前端可访问） */
    private Boolean isPublic;
    
    /** 设置项创建时间 */
    private LocalDateTime createdAt;
    
    /** 设置项最后更新时间 */
    private LocalDateTime updatedAt;
}
