package com.myblog.service.impl;

import com.myblog.dto.ArticleDTO;
import com.myblog.dto.CategoryDTO;
import com.myblog.dto.TagDTO;
import com.myblog.dto.PageResponse;
import com.myblog.entity.Article;
import com.myblog.entity.Category;
import com.myblog.entity.Tag;
import com.myblog.repository.ArticleRepository;
import com.myblog.repository.CategoryRepository;
import com.myblog.repository.TagRepository;
import com.myblog.service.ArticleService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

/**
 * 文章服务实现类
 */
@Service
@RequiredArgsConstructor
public class ArticleServiceImpl implements ArticleService {

    private final ArticleRepository articleRepository;
    private final CategoryRepository categoryRepository;
    private final TagRepository tagRepository;

    @Override
    @Transactional
    public ArticleDTO createArticle(ArticleDTO articleDTO) {
        Article article = new Article();
        BeanUtils.copyProperties(articleDTO, article);
        
        // 设置分类
        if (articleDTO.getCategory() != null && articleDTO.getCategory().getId() != null) {
            Category category = categoryRepository.findById(articleDTO.getCategory().getId())
                .orElseThrow(() -> new RuntimeException("分类不存在"));
            article.setCategory(category);
        }
        
        // 设置标签
        if (articleDTO.getTags() != null && !articleDTO.getTags().isEmpty()) {
            List<Long> tagIds = articleDTO.getTags().stream()
                .map(tag -> tag.getId())
                .collect(Collectors.toList());
            List<Tag> tags = tagRepository.findAllById(tagIds);
            article.setTags(tags);
        }
        
        article = articleRepository.save(article);
        return convertToDTO(article);
    }

    @Override
    @Transactional
    public ArticleDTO updateArticle(Long id, ArticleDTO articleDTO) {
        Article article = articleRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("文章不存在"));
        
        BeanUtils.copyProperties(articleDTO, article, "id", "createdAt");
        
        // 设置分类
        if (articleDTO.getCategory() != null && articleDTO.getCategory().getId() != null) {
            Category category = categoryRepository.findById(articleDTO.getCategory().getId())
                .orElseThrow(() -> new RuntimeException("分类不存在"));
            article.setCategory(category);
        }
        
        // 设置标签
        if (articleDTO.getTags() != null && !articleDTO.getTags().isEmpty()) {
            List<Long> tagIds = articleDTO.getTags().stream()
                .map(tag -> tag.getId())
                .collect(Collectors.toList());
            List<Tag> tags = tagRepository.findAllById(tagIds);
            article.setTags(tags);
        }
        
        article = articleRepository.save(article);
        return convertToDTO(article);
    }

    @Override
    @Transactional
    public void deleteArticle(Long id) {
        if (!articleRepository.existsById(id)) {
            throw new RuntimeException("文章不存在");
        }
        articleRepository.deleteById(id);
    }

    @Override
    public ArticleDTO getArticleById(Long id) {
        Article article = articleRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("文章不存在"));
        return convertToDTO(article);
    }

    @Override
    public ArticleDTO getArticleBySlug(String slug) {
        Article article = articleRepository.findBySlug(slug)
            .orElseThrow(() -> new RuntimeException("文章不存在"));
        return convertToDTO(article);
    }

    @Override
    public PageResponse<ArticleDTO> getArticles(Pageable pageable) {
        Page<Article> page = articleRepository.findAll(pageable);
        return new PageResponse<>(page.map(this::convertToDTO));
    }

    @Override
    public PageResponse<ArticleDTO> getPublishedArticles(Pageable pageable) {
        Page<Article> page = articleRepository.findByIsPublishedTrue(pageable);
        return new PageResponse<>(page.map(this::convertToDTO));
    }

    @Override
    public PageResponse<ArticleDTO> getArticlesByCategory(Long categoryId, Pageable pageable) {
        Page<Article> page = articleRepository.findByCategoryIdAndIsPublishedTrue(categoryId, pageable);
        return new PageResponse<>(page.map(this::convertToDTO));
    }

    @Override
    public PageResponse<ArticleDTO> getArticlesByTag(Long tagId, Pageable pageable) {
        Page<Article> page = articleRepository.findByTagIdAndIsPublishedTrue(tagId, pageable);
        return new PageResponse<>(page.map(this::convertToDTO));
    }

    @Override
    public PageResponse<ArticleDTO> searchArticles(String keyword, Pageable pageable) {
        Page<Article> page = articleRepository.searchArticles(keyword, pageable);
        return new PageResponse<>(page.map(this::convertToDTO));
    }

    @Override
    public List<ArticleDTO> getPinnedArticles() {
        List<Article> articles = articleRepository.findByIsPinnedTrueAndIsPublishedTrueOrderByCreatedAtDesc();
        return articles.stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    @Override
    public PageResponse<ArticleDTO> getPopularArticles(Pageable pageable) {
        Page<Article> page = articleRepository.findByIsPublishedTrueOrderByViewCountDesc(pageable);
        return new PageResponse<>(page.map(this::convertToDTO));
    }

    @Override
    @Transactional
    public void incrementViewCount(Long id) {
        Article article = articleRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("文章不存在"));
        article.setViewCount(article.getViewCount() + 1);
        articleRepository.save(article);
    }

    @Override
    @Transactional
    public void incrementLikeCount(Long id) {
        Article article = articleRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("文章不存在"));
        article.setLikeCount(article.getLikeCount() + 1);
        articleRepository.save(article);
    }

    @Override
    @Transactional
    public ArticleDTO publishArticle(Long id) {
        Article article = articleRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("文章不存在"));
        article.setIsPublished(true);
        article.setPublishedAt(LocalDateTime.now());
        article = articleRepository.save(article);
        return convertToDTO(article);
    }

    @Override
    @Transactional
    public ArticleDTO unpublishArticle(Long id) {
        Article article = articleRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("文章不存在"));
        article.setIsPublished(false);
        article = articleRepository.save(article);
        return convertToDTO(article);
    }

    @Override
    @Transactional
    public ArticleDTO pinArticle(Long id) {
        Article article = articleRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("文章不存在"));
        article.setIsPinned(true);
        article = articleRepository.save(article);
        return convertToDTO(article);
    }

    @Override
    @Transactional
    public ArticleDTO unpinArticle(Long id) {
        Article article = articleRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("文章不存在"));
        article.setIsPinned(false);
        article = articleRepository.save(article);
        return convertToDTO(article);
    }

    private ArticleDTO convertToDTO(Article article) {
        ArticleDTO dto = new ArticleDTO();
        BeanUtils.copyProperties(article, dto);
        
        // 转换分类
        if (article.getCategory() != null) {
            CategoryDTO categoryDTO = new CategoryDTO();
            BeanUtils.copyProperties(article.getCategory(), categoryDTO);
            dto.setCategory(categoryDTO);
        }
        
        // 转换标签
        if (article.getTags() != null) {
            List<TagDTO> tagDTOs = article.getTags().stream()
                .map(tag -> {
                    TagDTO tagDTO = new TagDTO();
                    BeanUtils.copyProperties(tag, tagDTO);
                    return tagDTO;
                })
                .collect(Collectors.toList());
            dto.setTags(tagDTOs);
        }
        
        return dto;
    }
}
