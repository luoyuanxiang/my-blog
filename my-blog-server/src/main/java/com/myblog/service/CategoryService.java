package com.myblog.service;

import com.myblog.dto.CategoryDTO;
import com.myblog.dto.PageResponse;
import org.springframework.data.domain.Pageable;

import java.util.List;

/**
 * 分类服务接口
 * 定义分类相关的业务逻辑方法
 * 
 * @author MyBlog Team
 * @version 1.0
 * @since 2024-01-01
 */
public interface CategoryService {
    
    /**
     * 创建新分类
     * @param categoryDTO 分类数据传输对象
     * @return 创建后的分类信息
     */
    CategoryDTO createCategory(CategoryDTO categoryDTO);
    
    /**
     * 更新分类信息
     * @param id 分类ID
     * @param categoryDTO 分类数据传输对象
     * @return 更新后的分类信息
     */
    CategoryDTO updateCategory(Long id, CategoryDTO categoryDTO);
    
    /**
     * 删除分类
     * @param id 分类ID
     */
    void deleteCategory(Long id);
    
    /**
     * 根据ID获取分类详情
     * @param id 分类ID
     * @return 分类信息
     */
    CategoryDTO getCategoryById(Long id);
    
    /**
     * 根据slug获取分类详情
     * @param slug 分类URL标识符
     * @return 分类信息
     */
    CategoryDTO getCategoryBySlug(String slug);
    
    /**
     * 分页获取分类列表
     * @param pageable 分页参数
     * @return 分页分类列表
     */
    PageResponse<CategoryDTO> getCategories(Pageable pageable);
    
    /**
     * 获取所有分类列表
     * @return 所有分类列表
     */
    List<CategoryDTO> getAllCategories();
    
    /**
     * 获取有文章的分类列表
     * @return 有文章的分类列表
     */
    List<CategoryDTO> getCategoriesWithArticles();
}
