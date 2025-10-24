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
 * 分类实体类
 * 用于表示文章分类的基本信息和关联关系
 * 
 * @author MyBlog Team
 * @version 1.0
 * @since 2024-01-01
 */
@Entity
@Table(name = "categories")
@Data
@EqualsAndHashCode(callSuper = false)
@EntityListeners(AuditingEntityListener.class)
public class Category {

    /** 分类唯一标识符，主键，自增长 */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** 分类名称，必填，最大长度100字符 */
    @Column(nullable = false, length = 100)
    private String name;

    /** 分类URL友好的标识符，最大长度200字符 */
    @Column(length = 200)
    private String slug;

    /** 分类描述，最大长度500字符 */
    @Column(length = 500)
    private String description;

    /** 分类显示颜色，十六进制颜色值，最大长度7字符（如#FF0000） */
    @Column(length = 7)
    private String color;

    /** 该分类下的文章数量，默认0 */
    @Column(name = "article_count")
    private Integer articleCount = 0;

    /** 该分类下的文章列表，一对多关系，懒加载 */
    @OneToMany(mappedBy = "category", fetch = FetchType.LAZY)
    private List<Article> articles;

    /** 分类创建时间，自动填充，不可更新 */
    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    /** 分类最后更新时间，自动填充 */
    @LastModifiedDate
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
