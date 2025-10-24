package com.myblog.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

/**
 * 友情链接实体类
 * 用于表示网站友情链接的基本信息和审核状态
 * 
 * @author MyBlog Team
 * @version 1.0
 * @since 2024-01-01
 */
@Entity
@Table(name = "friend_links")
@Data
@EqualsAndHashCode(callSuper = false)
@EntityListeners(AuditingEntityListener.class)
public class FriendLink {

    /** 友链唯一标识符，主键，自增长 */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** 友链网站名称，必填，最大长度100字符 */
    @Column(nullable = false, length = 100)
    private String name;

    /** 友链网站URL，必填，最大长度500字符 */
    @Column(nullable = false, length = 500)
    private String url;

    /** 友链网站描述，最大长度200字符 */
    @Column(length = 200)
    private String description;

    /** 友链网站Logo图片URL，最大长度500字符 */
    @Column(length = 500)
    private String logo;

    /** 友链是否已审核通过，默认false */
    @Column(name = "is_approved")
    private Boolean isApproved = false;

    /** 友链排序顺序，数字越小越靠前，默认0 */
    @Column(name = "sort_order")
    private Integer sortOrder = 0;

    /** 友链点击次数，默认0 */
    @Column(name = "click_count")
    private Integer clickCount = 0;

    /** 友链申请者邮箱，最大长度100字符 */
    @Column(length = 100)
    private String email;

    /** 友链创建时间，自动填充，不可更新 */
    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    /** 友链最后更新时间，自动填充 */
    @LastModifiedDate
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
