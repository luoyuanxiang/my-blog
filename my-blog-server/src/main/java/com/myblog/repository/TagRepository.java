package com.myblog.repository;

import com.myblog.entity.Tag;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * 标签数据访问层
 */
@Repository
public interface TagRepository extends JpaRepository<Tag, Long> {

    /**
     * 根据名称查找标签
     */
    Optional<Tag> findByName(String name);

    /**
     * 根据slug查找标签
     */
    Optional<Tag> findBySlug(String slug);

    /**
     * 查找有文章的标签
     */
    @Query("SELECT t FROM Tag t WHERE t.articleCount > 0 ORDER BY t.articleCount DESC")
    List<Tag> findTagsWithArticles();

    /**
     * 查找热门标签
     */
    @Query("SELECT t FROM Tag t WHERE t.articleCount > 0 ORDER BY t.articleCount DESC")
    List<Tag> findPopularTags();

    /**
     * 统计标签数量
     */
    long count();
}
