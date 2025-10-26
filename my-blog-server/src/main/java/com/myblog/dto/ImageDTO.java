package com.myblog.dto;

import lombok.Data;

import java.time.LocalDateTime;

/**
 * 图片数据传输对象
 */
@Data
public class ImageDTO {

    private Long id;

    /**
     * 文件名
     */
    private String filename;

    /**
     * 原始文件名
     */
    private String originalFilename;

    /**
     * 文件路径
     */
    private String filePath;

    /**
     * 文件URL
     */
    private String url;

    /**
     * 文件大小（字节）
     */
    private Long fileSize;

    /**
     * 文件类型（MIME类型）
     */
    private String contentType;

    /**
     * 文件扩展名
     */
    private String extension;

    /**
     * 图片宽度
     */
    private Integer width;

    /**
     * 图片高度
     */
    private Integer height;

    /**
     * 图片描述
     */
    private String description;

    /**
     * 存储服务类型
     */
    private String storageType;

    /**
     * 上传者
     */
    private String uploadedBy;

    /**
     * 创建时间
     */
    private LocalDateTime createdAt;

    /**
     * 更新时间
     */
    private LocalDateTime updatedAt;

    /**
     * 文件大小格式化显示
     */
    public String getFormattedFileSize() {
        if (fileSize == null) return "0 B";
        
        long size = fileSize;
        String[] units = {"B", "KB", "MB", "GB", "TB"};
        int unitIndex = 0;
        
        while (size >= 1024 && unitIndex < units.length - 1) {
            size /= 1024;
            unitIndex++;
        }
        
        return String.format("%.1f %s", (double) size, units[unitIndex]);
    }

    /**
     * 图片尺寸格式化显示
     */
    public String getFormattedDimensions() {
        if (width == null || height == null) return "未知";
        return width + " × " + height;
    }
}
