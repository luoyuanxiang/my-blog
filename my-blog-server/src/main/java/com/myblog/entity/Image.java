package com.myblog.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

/**
 * 图片实体类
 */
@Entity
@Table(name = "images")
@Data
@EqualsAndHashCode(callSuper = false)
public class Image {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * 文件名
     */
    @Column(name = "filename", nullable = false, length = 255)
    private String filename;

    /**
     * 原始文件名
     */
    @Column(name = "original_filename", length = 255)
    private String originalFilename;

    /**
     * 文件路径
     */
    @Column(name = "file_path", nullable = false, length = 500)
    private String filePath;

    /**
     * 文件URL
     */
    @Column(name = "url", nullable = false, length = 500)
    private String url;

    /**
     * 文件大小（字节）
     */
    @Column(name = "file_size")
    private Long fileSize;

    /**
     * 文件类型（MIME类型）
     */
    @Column(name = "content_type", length = 100)
    private String contentType;

    /**
     * 文件扩展名
     */
    @Column(name = "extension", length = 10)
    private String extension;

    /**
     * 图片宽度
     */
    @Column(name = "width")
    private Integer width;

    /**
     * 图片高度
     */
    @Column(name = "height")
    private Integer height;

    /**
     * 图片描述
     */
    @Column(name = "description", length = 500)
    private String description;

    /**
     * 存储服务类型（local, oss, cos等）
     */
    @Column(name = "storage_type", length = 50)
    private String storageType;

    /**
     * 存储服务配置
     */
    @Column(name = "storage_config", columnDefinition = "TEXT")
    private String storageConfig;

    /**
     * 上传者ID
     */
    @Column(name = "uploaded_by", length = 50)
    private String uploadedBy;

    /**
     * 是否删除
     */
    @Column(name = "is_deleted", nullable = false)
    private Boolean isDeleted = false;

    /**
     * 创建时间
     */
    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    /**
     * 更新时间
     */
    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;
}
