package com.myblog.service;

import com.myblog.dto.TagDTO;
import com.myblog.dto.PageResponse;
import org.springframework.data.domain.Pageable;

import java.util.List;

/**
 * 标签服务接口
 * 定义标签相关的业务逻辑方法
 * 
 * @author MyBlog Team
 * @version 1.0
 * @since 2024-01-01
 */
public interface TagService {
    
    /**
     * 创建新标签
     * @param tagDTO 标签数据传输对象
     * @return 创建后的标签信息
     */
    TagDTO createTag(TagDTO tagDTO);
    
    /**
     * 更新标签信息
     * @param id 标签ID
     * @param tagDTO 标签数据传输对象
     * @return 更新后的标签信息
     */
    TagDTO updateTag(Long id, TagDTO tagDTO);
    
    /**
     * 删除标签
     * @param id 标签ID
     */
    void deleteTag(Long id);
    
    /**
     * 根据ID获取标签详情
     * @param id 标签ID
     * @return 标签信息
     */
    TagDTO getTagById(Long id);
    
    /**
     * 根据slug获取标签详情
     * @param slug 标签URL标识符
     * @return 标签信息
     */
    TagDTO getTagBySlug(String slug);
    
    /**
     * 分页获取标签列表
     * @param pageable 分页参数
     * @return 分页标签列表
     */
    PageResponse<TagDTO> getTags(Pageable pageable);
    
    /**
     * 获取所有标签列表
     * @return 所有标签列表
     */
    List<TagDTO> getAllTags();
    
    /**
     * 获取有文章的标签列表
     * @return 有文章的标签列表
     */
    List<TagDTO> getTagsWithArticles();
    
    /**
     * 获取热门标签列表（按使用次数排序）
     * @return 热门标签列表
     */
    List<TagDTO> getPopularTags();
}
