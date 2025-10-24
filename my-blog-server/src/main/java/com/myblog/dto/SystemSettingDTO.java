package com.myblog.dto;

import lombok.Data;
import java.time.LocalDateTime;

/**
 * 系统设置数据传输对象
 */
@Data
public class SystemSettingDTO {
    
    private Long id;
    private String key;
    private String value;
    private String description;
    private String settingType;
    private Boolean isPublic;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
