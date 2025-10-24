package com.myblog.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

/**
 * 用户实体类
 * 用于表示博客系统的用户信息和认证数据
 * 
 * @author MyBlog Team
 * @version 1.0
 * @since 2024-01-01
 */
@Entity
@Table(name = "users")
@Data
@EqualsAndHashCode(callSuper = false)
@EntityListeners(AuditingEntityListener.class)
public class User {

    /** 用户唯一标识符，主键，自增长 */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** 用户名，必填，唯一，最大长度50字符 */
    @Column(nullable = false, unique = true, length = 50)
    private String username;

    /** 用户密码，必填，最大长度100字符（加密后） */
    @Column(nullable = false, length = 100)
    private String password;

    /** 用户邮箱，最大长度100字符 */
    @Column(length = 100)
    private String email;

    /** 用户昵称，最大长度100字符 */
    @Column(length = 100)
    private String nickname;

    /** 用户头像图片URL，最大长度500字符 */
    @Column(length = 500)
    private String avatar;

    /** 用户个人简介，最大长度500字符 */
    @Column(length = 500)
    private String bio;

    /** 用户是否启用，默认true */
    @Column(name = "is_enabled")
    private Boolean isEnabled = true;

    /** 用户最后登录时间 */
    @Column(name = "last_login_at")
    private LocalDateTime lastLoginAt;

    /** 用户创建时间，自动填充，不可更新 */
    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    /** 用户最后更新时间，自动填充 */
    @LastModifiedDate
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
