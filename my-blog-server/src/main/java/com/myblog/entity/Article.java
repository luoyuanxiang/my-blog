package com.myblog.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;
import java.util.List;

/**
 * 文章实体类
 * 用于表示博客文章的基本信息和关联关系
 * 
 * @author MyBlog Team
 * @version 1.0
 * @since 2024-01-01
 */
@Entity
@Table(name = "articles")
@Data
@EqualsAndHashCode(callSuper = false)
@EntityListeners(AuditingEntityListener.class)
public class Article {

    /** 文章唯一标识符，主键，自增长 */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** 文章标题，必填，最大长度200字符 */
    @Column(nullable = false, length = 200)
    private String title;

    /** 文章摘要，最大长度500字符 */
    @Column(length = 500)
    private String summary;

    /** 文章完整内容，使用TEXT类型存储长文本 */
    @Column(columnDefinition = "TEXT")
    private String content;

    /** 文章URL友好的标识符，最大长度100字符 */
    @Column(length = 100)
    private String slug;

    /** 文章封面图片URL */
    @Column(name = "cover_image")
    private String coverImage;

    /** 文章是否已发布，默认false */
    @Column(name = "is_published")
    private Boolean isPublished = false;

    /** 文章是否置顶显示，默认false */
    @Column(name = "is_pinned")
    private Boolean isPinned = false;

    /** 文章浏览次数，默认0 */
    @Column(name = "view_count")
    private Integer viewCount = 0;

    /** 文章点赞次数，默认0 */
    @Column(name = "like_count")
    private Integer likeCount = 0;

    /** 文章评论数量，默认0 */
    @Column(name = "comment_count")
    private Integer commentCount = 0;

    /** 文章所属分类，多对一关系，懒加载 */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id")
    private Category category;

    /** 文章关联的标签列表，多对多关系，懒加载 */
    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "article_tags",
        joinColumns = @JoinColumn(name = "article_id"),
        inverseJoinColumns = @JoinColumn(name = "tag_id")
    )
    private List<Tag> tags;

    /** 文章创建时间，自动填充，不可更新 */
    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    /** 文章最后更新时间，自动填充 */
    @LastModifiedDate
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    /** 文章发布时间 */
    @Column(name = "published_at")
    private LocalDateTime publishedAt;
}
