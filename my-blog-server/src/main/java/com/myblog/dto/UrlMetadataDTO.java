package com.myblog.dto;

import lombok.Data;

/**
 * URL元数据DTO
 */
@Data
public class UrlMetadataDTO {
    /**
     * 网站标题
     */
    private String title;
    
    /**
     * 网站描述
     */
    private String description;
    
    /**
     * 网站图标/Logo
     */
    private String logo;
    
    /**
     * 网站域名
     */
    private String domain;
    
    /**
     * 网站URL
     */
    private String url;
    
    /**
     * 是否成功获取
     */
    private boolean success;
    
    /**
     * 错误信息
     */
    private String error;
}
