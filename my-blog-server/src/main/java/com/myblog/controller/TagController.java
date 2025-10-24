package com.myblog.controller;

import com.myblog.dto.TagDTO;
import com.myblog.dto.ApiResponse;
import com.myblog.dto.PageResponse;
import com.myblog.service.TagService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 标签控制器
 */
@RestController
@RequestMapping("/tags")
@RequiredArgsConstructor
@Tag(name = "标签管理", description = "标签的增删改查操作")
public class TagController {

    private final TagService tagService;

    @PostMapping
    @Operation(summary = "创建标签", description = "创建新的标签")
    public ApiResponse<TagDTO> createTag(@RequestBody TagDTO tagDTO) {
        TagDTO result = tagService.createTag(tagDTO);
        return ApiResponse.success("标签创建成功", result);
    }

    @PutMapping("/{id}")
    @Operation(summary = "更新标签", description = "根据ID更新标签")
    public ApiResponse<TagDTO> updateTag(@PathVariable Long id, @RequestBody TagDTO tagDTO) {
        TagDTO result = tagService.updateTag(id, tagDTO);
        return ApiResponse.success("标签更新成功", result);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "删除标签", description = "根据ID删除标签")
    public ApiResponse<Void> deleteTag(@PathVariable Long id) {
        tagService.deleteTag(id);
        return ApiResponse.success("标签删除成功", null);
    }

    @GetMapping("/{id}")
    @Operation(summary = "获取标签", description = "根据ID获取标签详情")
    public ApiResponse<TagDTO> getTagById(@PathVariable Long id) {
        TagDTO result = tagService.getTagById(id);
        return ApiResponse.success(result);
    }

    @GetMapping("/slug/{slug}")
    @Operation(summary = "根据slug获取标签", description = "根据slug获取标签详情")
    public ApiResponse<TagDTO> getTagBySlug(@PathVariable String slug) {
        TagDTO result = tagService.getTagBySlug(slug);
        return ApiResponse.success(result);
    }

    @GetMapping
    @Operation(summary = "获取标签列表", description = "分页获取标签列表")
    public ApiResponse<PageResponse<TagDTO>> getTags(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {
        
        Sort sort = Sort.by(Sort.Direction.fromString(sortDir), sortBy);
        Pageable pageable = PageRequest.of(page, size, sort);
        PageResponse<TagDTO> result = tagService.getTags(pageable);
        return ApiResponse.success(result);
    }

    @GetMapping("/all")
    @Operation(summary = "获取所有标签", description = "获取所有标签列表")
    public ApiResponse<List<TagDTO>> getAllTags() {
        List<TagDTO> result = tagService.getAllTags();
        return ApiResponse.success(result);
    }

    @GetMapping("/with-articles")
    @Operation(summary = "获取有文章的标签", description = "获取有文章的标签列表")
    public ApiResponse<List<TagDTO>> getTagsWithArticles() {
        List<TagDTO> result = tagService.getTagsWithArticles();
        return ApiResponse.success(result);
    }

    @GetMapping("/popular")
    @Operation(summary = "获取热门标签", description = "获取热门标签列表")
    public ApiResponse<List<TagDTO>> getPopularTags() {
        List<TagDTO> result = tagService.getPopularTags();
        return ApiResponse.success(result);
    }
}
