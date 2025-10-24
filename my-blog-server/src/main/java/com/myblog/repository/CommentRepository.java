package com.myblog.repository;

import com.myblog.entity.Comment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * 评论数据访问层
 */
@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {

    /**
     * 根据文章ID查找评论
     */
    Page<Comment> findByArticleIdAndIsApprovedTrueOrderByCreatedAtDesc(Long articleId, Pageable pageable);

    /**
     * 根据文章ID查找所有评论
     */
    List<Comment> findByArticleIdOrderByCreatedAtDesc(Long articleId);

    /**
     * 根据父评论ID查找子评论
     */
    List<Comment> findByParentIdOrderByCreatedAtAsc(Long parentId);

    /**
     * 查找待审核的评论
     */
    Page<Comment> findByIsApprovedFalseOrderByCreatedAtDesc(Pageable pageable);

    /**
     * 统计文章评论数
     */
    long countByArticleIdAndIsApprovedTrue(Long articleId);

    /**
     * 统计待审核评论数
     */
    long countByIsApprovedFalse();
}
