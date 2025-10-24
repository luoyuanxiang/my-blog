package com.myblog.controller;

import com.myblog.dto.ArticleDTO;
import com.myblog.dto.ApiResponse;
import com.myblog.dto.PageResponse;
import com.myblog.service.ArticleService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 文章控制器
 */
@RestController
@RequestMapping("/articles")
@RequiredArgsConstructor
@Tag(name = "文章管理", description = "文章的增删改查操作")
public class ArticleController {

    private final ArticleService articleService;

    @PostMapping
    @Operation(summary = "创建文章", description = "创建新的文章")
    public ApiResponse<ArticleDTO> createArticle(@RequestBody ArticleDTO articleDTO) {
        ArticleDTO result = articleService.createArticle(articleDTO);
        return ApiResponse.success("文章创建成功", result);
    }

    @PutMapping("/{id}")
    @Operation(summary = "更新文章", description = "根据ID更新文章")
    public ApiResponse<ArticleDTO> updateArticle(@PathVariable Long id, @RequestBody ArticleDTO articleDTO) {
        ArticleDTO result = articleService.updateArticle(id, articleDTO);
        return ApiResponse.success("文章更新成功", result);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "删除文章", description = "根据ID删除文章")
    public ApiResponse<Void> deleteArticle(@PathVariable Long id) {
        articleService.deleteArticle(id);
        return ApiResponse.success("文章删除成功", null);
    }

    @GetMapping("/{id}")
    @Operation(summary = "获取文章", description = "根据ID获取文章详情")
    public ApiResponse<ArticleDTO> getArticleById(@PathVariable Long id) {
        ArticleDTO result = articleService.getArticleById(id);
        return ApiResponse.success(result);
    }

    @GetMapping("/slug/{slug}")
    @Operation(summary = "根据slug获取文章", description = "根据slug获取文章详情")
    public ApiResponse<ArticleDTO> getArticleBySlug(@PathVariable String slug) {
        ArticleDTO result = articleService.getArticleBySlug(slug);
        return ApiResponse.success(result);
    }

    @GetMapping
    @Operation(summary = "获取文章列表", description = "分页获取文章列表")
    public ApiResponse<PageResponse<ArticleDTO>> getArticles(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {
        
        Sort sort = Sort.by(Sort.Direction.fromString(sortDir), sortBy);
        Pageable pageable = PageRequest.of(page, size, sort);
        PageResponse<ArticleDTO> result = articleService.getArticles(pageable);
        return ApiResponse.success(result);
    }

    @GetMapping("/published")
    @Operation(summary = "获取已发布文章列表", description = "分页获取已发布的文章列表")
    public ApiResponse<PageResponse<ArticleDTO>> getPublishedArticles(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "publishedAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {
        
        Sort sort = Sort.by(Sort.Direction.fromString(sortDir), sortBy);
        Pageable pageable = PageRequest.of(page, size, sort);
        PageResponse<ArticleDTO> result = articleService.getPublishedArticles(pageable);
        return ApiResponse.success(result);
    }

    @GetMapping("/category/{categoryId}")
    @Operation(summary = "根据分类获取文章", description = "根据分类ID获取文章列表")
    public ApiResponse<PageResponse<ArticleDTO>> getArticlesByCategory(
            @PathVariable Long categoryId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        Pageable pageable = PageRequest.of(page, size);
        PageResponse<ArticleDTO> result = articleService.getArticlesByCategory(categoryId, pageable);
        return ApiResponse.success(result);
    }

    @GetMapping("/tag/{tagId}")
    @Operation(summary = "根据标签获取文章", description = "根据标签ID获取文章列表")
    public ApiResponse<PageResponse<ArticleDTO>> getArticlesByTag(
            @PathVariable Long tagId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        Pageable pageable = PageRequest.of(page, size);
        PageResponse<ArticleDTO> result = articleService.getArticlesByTag(tagId, pageable);
        return ApiResponse.success(result);
    }

    @GetMapping("/search")
    @Operation(summary = "搜索文章", description = "根据关键词搜索文章")
    public ApiResponse<PageResponse<ArticleDTO>> searchArticles(
            @RequestParam String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        Pageable pageable = PageRequest.of(page, size);
        PageResponse<ArticleDTO> result = articleService.searchArticles(keyword, pageable);
        return ApiResponse.success(result);
    }

    @GetMapping("/pinned")
    @Operation(summary = "获取置顶文章", description = "获取置顶的文章列表")
    public ApiResponse<List<ArticleDTO>> getPinnedArticles() {
        List<ArticleDTO> result = articleService.getPinnedArticles();
        return ApiResponse.success(result);
    }

    @GetMapping("/popular")
    @Operation(summary = "获取热门文章", description = "获取热门文章列表")
    public ApiResponse<PageResponse<ArticleDTO>> getPopularArticles(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        Pageable pageable = PageRequest.of(page, size);
        PageResponse<ArticleDTO> result = articleService.getPopularArticles(pageable);
        return ApiResponse.success(result);
    }

    @PostMapping("/{id}/view")
    @Operation(summary = "增加浏览量", description = "增加文章浏览量")
    public ApiResponse<Void> incrementViewCount(@PathVariable Long id) {
        articleService.incrementViewCount(id);
        return ApiResponse.success("浏览量增加成功", null);
    }

    @PostMapping("/{id}/like")
    @Operation(summary = "增加点赞数", description = "增加文章点赞数")
    public ApiResponse<Void> incrementLikeCount(@PathVariable Long id) {
        articleService.incrementLikeCount(id);
        return ApiResponse.success("点赞成功", null);
    }

    @PostMapping("/{id}/publish")
    @Operation(summary = "发布文章", description = "发布文章")
    public ApiResponse<ArticleDTO> publishArticle(@PathVariable Long id) {
        ArticleDTO result = articleService.publishArticle(id);
        return ApiResponse.success("文章发布成功", result);
    }

    @PostMapping("/{id}/unpublish")
    @Operation(summary = "取消发布文章", description = "取消发布文章")
    public ApiResponse<ArticleDTO> unpublishArticle(@PathVariable Long id) {
        ArticleDTO result = articleService.unpublishArticle(id);
        return ApiResponse.success("文章取消发布成功", result);
    }

    @PostMapping("/{id}/pin")
    @Operation(summary = "置顶文章", description = "置顶文章")
    public ApiResponse<ArticleDTO> pinArticle(@PathVariable Long id) {
        ArticleDTO result = articleService.pinArticle(id);
        return ApiResponse.success("文章置顶成功", result);
    }

    @PostMapping("/{id}/unpin")
    @Operation(summary = "取消置顶文章", description = "取消置顶文章")
    public ApiResponse<ArticleDTO> unpinArticle(@PathVariable Long id) {
        ArticleDTO result = articleService.unpinArticle(id);
        return ApiResponse.success("文章取消置顶成功", result);
    }
}
