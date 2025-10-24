package com.myblog.service;

import com.myblog.dto.ArticleDTO;
import com.myblog.dto.PageResponse;
import com.myblog.entity.Article;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

/**
 * 文章服务接口
 * 定义文章相关的业务逻辑方法
 * 
 * @author MyBlog Team
 * @version 1.0
 * @since 2024-01-01
 */
public interface ArticleService {
    
    /**
     * 创建新文章
     * @param articleDTO 文章数据传输对象
     * @return 创建后的文章信息
     */
    ArticleDTO createArticle(ArticleDTO articleDTO);
    
    /**
     * 更新文章信息
     * @param id 文章ID
     * @param articleDTO 文章数据传输对象
     * @return 更新后的文章信息
     */
    ArticleDTO updateArticle(Long id, ArticleDTO articleDTO);
    
    /**
     * 删除文章
     * @param id 文章ID
     */
    void deleteArticle(Long id);
    
    /**
     * 根据ID获取文章详情
     * @param id 文章ID
     * @return 文章信息
     */
    ArticleDTO getArticleById(Long id);
    
    /**
     * 根据slug获取文章详情
     * @param slug 文章URL标识符
     * @return 文章信息
     */
    ArticleDTO getArticleBySlug(String slug);
    
    /**
     * 分页获取所有文章列表（包括未发布）
     * @param pageable 分页参数
     * @return 分页文章列表
     */
    PageResponse<ArticleDTO> getArticles(Pageable pageable);
    
    /**
     * 分页获取已发布文章列表
     * @param pageable 分页参数
     * @return 分页已发布文章列表
     */
    PageResponse<ArticleDTO> getPublishedArticles(Pageable pageable);
    
    /**
     * 根据分类获取文章列表
     * @param categoryId 分类ID
     * @param pageable 分页参数
     * @return 分页文章列表
     */
    PageResponse<ArticleDTO> getArticlesByCategory(Long categoryId, Pageable pageable);
    
    /**
     * 根据标签获取文章列表
     * @param tagId 标签ID
     * @param pageable 分页参数
     * @return 分页文章列表
     */
    PageResponse<ArticleDTO> getArticlesByTag(Long tagId, Pageable pageable);
    
    /**
     * 根据关键词搜索文章
     * @param keyword 搜索关键词
     * @param pageable 分页参数
     * @return 分页搜索结果
     */
    PageResponse<ArticleDTO> searchArticles(String keyword, Pageable pageable);
    
    /**
     * 获取置顶文章列表
     * @return 置顶文章列表
     */
    List<ArticleDTO> getPinnedArticles();
    
    /**
     * 获取热门文章列表（按浏览量排序）
     * @param pageable 分页参数
     * @return 分页热门文章列表
     */
    PageResponse<ArticleDTO> getPopularArticles(Pageable pageable);
    
    /**
     * 增加文章浏览量
     * @param id 文章ID
     */
    void incrementViewCount(Long id);
    
    /**
     * 增加文章点赞数
     * @param id 文章ID
     */
    void incrementLikeCount(Long id);
    
    /**
     * 发布文章
     * @param id 文章ID
     * @return 发布后的文章信息
     */
    ArticleDTO publishArticle(Long id);
    
    /**
     * 取消发布文章
     * @param id 文章ID
     * @return 取消发布后的文章信息
     */
    ArticleDTO unpublishArticle(Long id);
    
    /**
     * 置顶文章
     * @param id 文章ID
     * @return 置顶后的文章信息
     */
    ArticleDTO pinArticle(Long id);
    
    /**
     * 取消置顶文章
     * @param id 文章ID
     * @return 取消置顶后的文章信息
     */
    ArticleDTO unpinArticle(Long id);
}
