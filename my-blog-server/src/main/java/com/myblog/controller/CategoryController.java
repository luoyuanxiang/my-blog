package com.myblog.controller;

import com.myblog.dto.CategoryDTO;
import com.myblog.dto.ApiResponse;
import com.myblog.dto.PageResponse;
import com.myblog.service.CategoryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 分类控制器
 */
@RestController
@RequestMapping("/categories")
@RequiredArgsConstructor
@Tag(name = "分类管理", description = "分类的增删改查操作")
public class CategoryController {

    private final CategoryService categoryService;

    @PostMapping
    @Operation(summary = "创建分类", description = "创建新的分类")
    public ApiResponse<CategoryDTO> createCategory(@RequestBody CategoryDTO categoryDTO) {
        CategoryDTO result = categoryService.createCategory(categoryDTO);
        return ApiResponse.success("分类创建成功", result);
    }

    @PutMapping("/{id}")
    @Operation(summary = "更新分类", description = "根据ID更新分类")
    public ApiResponse<CategoryDTO> updateCategory(@PathVariable Long id, @RequestBody CategoryDTO categoryDTO) {
        CategoryDTO result = categoryService.updateCategory(id, categoryDTO);
        return ApiResponse.success("分类更新成功", result);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "删除分类", description = "根据ID删除分类")
    public ApiResponse<Void> deleteCategory(@PathVariable Long id) {
        categoryService.deleteCategory(id);
        return ApiResponse.success("分类删除成功", null);
    }

    @GetMapping("/{id}")
    @Operation(summary = "获取分类", description = "根据ID获取分类详情")
    public ApiResponse<CategoryDTO> getCategoryById(@PathVariable Long id) {
        CategoryDTO result = categoryService.getCategoryById(id);
        return ApiResponse.success(result);
    }

    @GetMapping("/slug/{slug}")
    @Operation(summary = "根据slug获取分类", description = "根据slug获取分类详情")
    public ApiResponse<CategoryDTO> getCategoryBySlug(@PathVariable String slug) {
        CategoryDTO result = categoryService.getCategoryBySlug(slug);
        return ApiResponse.success(result);
    }

    @GetMapping
    @Operation(summary = "获取分类列表", description = "分页获取分类列表")
    public ApiResponse<PageResponse<CategoryDTO>> getCategories(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {
        
        Sort sort = Sort.by(Sort.Direction.fromString(sortDir), sortBy);
        Pageable pageable = PageRequest.of(page, size, sort);
        PageResponse<CategoryDTO> result = categoryService.getCategories(pageable);
        return ApiResponse.success(result);
    }

    @GetMapping("/all")
    @Operation(summary = "获取所有分类", description = "获取所有分类列表")
    public ApiResponse<List<CategoryDTO>> getAllCategories() {
        List<CategoryDTO> result = categoryService.getAllCategories();
        return ApiResponse.success(result);
    }

    @GetMapping("/with-articles")
    @Operation(summary = "获取有文章的分类", description = "获取有文章的分类列表")
    public ApiResponse<List<CategoryDTO>> getCategoriesWithArticles() {
        List<CategoryDTO> result = categoryService.getCategoriesWithArticles();
        return ApiResponse.success(result);
    }
}
