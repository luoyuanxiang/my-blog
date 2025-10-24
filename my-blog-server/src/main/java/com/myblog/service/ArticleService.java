package com.myblog.service;

import com.myblog.dto.ArticleDTO;
import com.myblog.dto.PageResponse;
import com.myblog.entity.Article;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

/**
 * 文章服务接口
 */
public interface ArticleService {
    
    /**
     * 创建文章
     */
    ArticleDTO createArticle(ArticleDTO articleDTO);
    
    /**
     * 更新文章
     */
    ArticleDTO updateArticle(Long id, ArticleDTO articleDTO);
    
    /**
     * 删除文章
     */
    void deleteArticle(Long id);
    
    /**
     * 根据ID获取文章
     */
    ArticleDTO getArticleById(Long id);
    
    /**
     * 根据slug获取文章
     */
    ArticleDTO getArticleBySlug(String slug);
    
    /**
     * 分页获取文章列表
     */
    PageResponse<ArticleDTO> getArticles(Pageable pageable);
    
    /**
     * 分页获取已发布文章列表
     */
    PageResponse<ArticleDTO> getPublishedArticles(Pageable pageable);
    
    /**
     * 根据分类获取文章
     */
    PageResponse<ArticleDTO> getArticlesByCategory(Long categoryId, Pageable pageable);
    
    /**
     * 根据标签获取文章
     */
    PageResponse<ArticleDTO> getArticlesByTag(Long tagId, Pageable pageable);
    
    /**
     * 搜索文章
     */
    PageResponse<ArticleDTO> searchArticles(String keyword, Pageable pageable);
    
    /**
     * 获取置顶文章
     */
    List<ArticleDTO> getPinnedArticles();
    
    /**
     * 获取热门文章
     */
    PageResponse<ArticleDTO> getPopularArticles(Pageable pageable);
    
    /**
     * 增加文章浏览量
     */
    void incrementViewCount(Long id);
    
    /**
     * 增加文章点赞数
     */
    void incrementLikeCount(Long id);
    
    /**
     * 发布文章
     */
    ArticleDTO publishArticle(Long id);
    
    /**
     * 取消发布文章
     */
    ArticleDTO unpublishArticle(Long id);
    
    /**
     * 置顶文章
     */
    ArticleDTO pinArticle(Long id);
    
    /**
     * 取消置顶文章
     */
    ArticleDTO unpinArticle(Long id);
}
