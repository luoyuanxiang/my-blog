package com.myblog.service.impl;

import com.myblog.dto.CategoryDTO;
import com.myblog.dto.PageResponse;
import com.myblog.entity.Category;
import com.myblog.repository.CategoryRepository;
import com.myblog.service.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * 分类服务实现类
 */
@Service
@RequiredArgsConstructor
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository categoryRepository;

    @Override
    @Transactional
    public CategoryDTO createCategory(CategoryDTO categoryDTO) {
        Category category = new Category();
        BeanUtils.copyProperties(categoryDTO, category);
        category = categoryRepository.save(category);
        return convertToDTO(category);
    }

    @Override
    @Transactional
    public CategoryDTO updateCategory(Long id, CategoryDTO categoryDTO) {
        Category category = categoryRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("分类不存在"));
        
        BeanUtils.copyProperties(categoryDTO, category, "id", "createdAt");
        category = categoryRepository.save(category);
        return convertToDTO(category);
    }

    @Override
    @Transactional
    public void deleteCategory(Long id) {
        if (!categoryRepository.existsById(id)) {
            throw new RuntimeException("分类不存在");
        }
        categoryRepository.deleteById(id);
    }

    @Override
    public CategoryDTO getCategoryById(Long id) {
        Category category = categoryRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("分类不存在"));
        return convertToDTO(category);
    }

    @Override
    public CategoryDTO getCategoryBySlug(String slug) {
        Category category = categoryRepository.findBySlug(slug)
            .orElseThrow(() -> new RuntimeException("分类不存在"));
        return convertToDTO(category);
    }

    @Override
    public PageResponse<CategoryDTO> getCategories(Pageable pageable) {
        Page<Category> page = categoryRepository.findAll(pageable);
        return new PageResponse<>(page.map(this::convertToDTO));
    }

    @Override
    public List<CategoryDTO> getAllCategories() {
        List<Category> categories = categoryRepository.findAll();
        return categories.stream().map(this::convertToDTO).toList();
    }

    @Override
    public List<CategoryDTO> getCategoriesWithArticles() {
        List<Category> categories = categoryRepository.findCategoriesWithArticles();
        return categories.stream().map(this::convertToDTO).toList();
    }

    private CategoryDTO convertToDTO(Category category) {
        CategoryDTO dto = new CategoryDTO();
        BeanUtils.copyProperties(category, dto);
        return dto;
    }
}
