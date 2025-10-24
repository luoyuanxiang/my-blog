package com.myblog.repository;

import com.myblog.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * 分类数据访问层
 */
@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {

    /**
     * 根据名称查找分类
     */
    Optional<Category> findByName(String name);

    /**
     * 根据slug查找分类
     */
    Optional<Category> findBySlug(String slug);

    /**
     * 查找有文章的分类
     */
    @Query("SELECT c FROM Category c WHERE c.articleCount > 0 ORDER BY c.articleCount DESC")
    List<Category> findCategoriesWithArticles();

    /**
     * 统计分类数量
     */
    long count();
}
