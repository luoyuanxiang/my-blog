package com.myblog.repository;

import com.myblog.entity.Article;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * 文章数据访问层
 */
@Repository
public interface ArticleRepository extends JpaRepository<Article, Long> {

    /**
     * 根据标题查找文章
     */
    Optional<Article> findByTitle(String title);

    /**
     * 根据slug查找文章
     */
    Optional<Article> findBySlug(String slug);

    /**
     * 查找已发布的文章
     */
    Page<Article> findByIsPublishedTrue(Pageable pageable);

    /**
     * 根据分类查找已发布的文章
     */
    Page<Article> findByCategoryIdAndIsPublishedTrue(Long categoryId, Pageable pageable);

    /**
     * 根据标签查找已发布的文章
     */
    @Query("SELECT a FROM Article a JOIN a.tags t WHERE t.id = :tagId AND a.isPublished = true")
    Page<Article> findByTagIdAndIsPublishedTrue(@Param("tagId") Long tagId, Pageable pageable);

    /**
     * 搜索文章
     */
    @Query("SELECT a FROM Article a WHERE (a.title LIKE %:keyword% OR a.summary LIKE %:keyword% OR a.content LIKE %:keyword%) AND a.isPublished = true")
    Page<Article> searchArticles(@Param("keyword") String keyword, Pageable pageable);

    /**
     * 查找置顶文章
     */
    List<Article> findByIsPinnedTrueAndIsPublishedTrueOrderByCreatedAtDesc();

    /**
     * 查找热门文章
     */
    Page<Article> findByIsPublishedTrueOrderByViewCountDesc(Pageable pageable);

    /**
     * 统计文章数量
     */
    long countByIsPublishedTrue();

    /**
     * 根据年份和月份查找文章
     */
    @Query("SELECT a FROM Article a WHERE YEAR(a.publishedAt) = :year AND MONTH(a.publishedAt) = :month AND a.isPublished = true ORDER BY a.publishedAt DESC")
    List<Article> findByYearAndMonth(@Param("year") int year, @Param("month") int month);

    /**
     * 统计已发布文章数量
     */
    long countByIsPublished(Boolean isPublished);

    /**
     * 统计置顶文章数量
     */
    long countByIsPinned(Boolean isPinned);

    /**
     * 统计总浏览量
     */
    @Query("SELECT COALESCE(SUM(a.viewCount), 0) FROM Article a")
    Long sumViewCount();

    /**
     * 统计总点赞数
     */
    @Query("SELECT COALESCE(SUM(a.likeCount), 0) FROM Article a")
    Long sumLikeCount();

    /**
     * 统计指定时间范围内的文章数量
     */
    long countByCreatedAtBetween(LocalDateTime start, LocalDateTime end);
}
