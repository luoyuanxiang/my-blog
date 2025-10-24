package com.myblog.service;

import com.myblog.dto.CategoryDTO;
import com.myblog.dto.PageResponse;
import org.springframework.data.domain.Pageable;

import java.util.List;

/**
 * 分类服务接口
 */
public interface CategoryService {
    
    /**
     * 创建分类
     */
    CategoryDTO createCategory(CategoryDTO categoryDTO);
    
    /**
     * 更新分类
     */
    CategoryDTO updateCategory(Long id, CategoryDTO categoryDTO);
    
    /**
     * 删除分类
     */
    void deleteCategory(Long id);
    
    /**
     * 根据ID获取分类
     */
    CategoryDTO getCategoryById(Long id);
    
    /**
     * 根据slug获取分类
     */
    CategoryDTO getCategoryBySlug(String slug);
    
    /**
     * 分页获取分类列表
     */
    PageResponse<CategoryDTO> getCategories(Pageable pageable);
    
    /**
     * 获取所有分类
     */
    List<CategoryDTO> getAllCategories();
    
    /**
     * 获取有文章的分类
     */
    List<CategoryDTO> getCategoriesWithArticles();
}
