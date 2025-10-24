package com.myblog.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

/**
 * 留言板消息实体类
 * 用于表示留言板消息的基本信息和审核状态
 * 
 * @author MyBlog Team
 * @version 1.0
 * @since 2024-01-01
 */
@Entity
@Table(name = "guestbook_messages")
@Data
@EqualsAndHashCode(callSuper = false)
@EntityListeners(AuditingEntityListener.class)
public class GuestbookMessage {

    /** 留言唯一标识符，主键，自增长 */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** 留言作者姓名，最大长度100字符 */
    @Column(length = 100)
    private String author;

    /** 留言作者邮箱，最大长度100字符 */
    @Column(length = 100)
    private String email;

    /** 留言作者网站，最大长度200字符 */
    @Column(length = 200)
    private String website;

    /** 留言内容，使用TEXT类型存储长文本，必填 */
    @Column(columnDefinition = "TEXT", nullable = false)
    private String content;

    /** 父留言ID，用于嵌套回复功能 */
    @Column(name = "parent_id")
    private Long parentId;

    /** 留言是否已审核通过，默认false */
    @Column(name = "is_approved")
    private Boolean isApproved = false;

    /** 留言点赞次数，默认0 */
    @Column(name = "like_count")
    private Integer likeCount = 0;

    /** 留言者IP地址，最大长度45字符（支持IPv6） */
    @Column(name = "ip_address", length = 45)
    private String ipAddress;

    /** 留言者浏览器信息，最大长度500字符 */
    @Column(name = "user_agent", length = 500)
    private String userAgent;

    /** 留言创建时间，自动填充，不可更新 */
    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    /** 留言最后更新时间，自动填充 */
    @LastModifiedDate
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
