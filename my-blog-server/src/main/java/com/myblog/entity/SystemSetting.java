package com.myblog.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

/**
 * 系统设置实体类
 * 用于表示博客系统的配置参数和设置项
 * 
 * @author MyBlog Team
 * @version 1.0
 * @since 2024-01-01
 */
@Entity
@Table(name = "system_settings")
@Data
@EqualsAndHashCode(callSuper = false)
@EntityListeners(AuditingEntityListener.class)
public class SystemSetting {

    /** 设置项唯一标识符，主键，自增长 */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** 设置项键名，必填，唯一，最大长度100字符 */
    @Column(nullable = false, unique = true, length = 100)
    private String key;

    /** 设置项值，使用TEXT类型存储长文本 */
    @Column(columnDefinition = "TEXT")
    private String value;

    /** 设置项描述，最大长度200字符 */
    @Column(length = 200)
    private String description;

    /** 设置项数据类型，默认string，最大长度50字符 */
    @Column(name = "setting_type", length = 50)
    private String settingType = "string";

    /** 设置项是否公开（前端可访问），默认false */
    @Column(name = "is_public")
    private Boolean isPublic = false;

    /** 设置项创建时间，自动填充，不可更新 */
    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    /** 设置项最后更新时间，自动填充 */
    @LastModifiedDate
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
