package com.myblog.service;

import com.myblog.dto.TagDTO;
import com.myblog.dto.PageResponse;
import org.springframework.data.domain.Pageable;

import java.util.List;

/**
 * 标签服务接口
 */
public interface TagService {
    
    /**
     * 创建标签
     */
    TagDTO createTag(TagDTO tagDTO);
    
    /**
     * 更新标签
     */
    TagDTO updateTag(Long id, TagDTO tagDTO);
    
    /**
     * 删除标签
     */
    void deleteTag(Long id);
    
    /**
     * 根据ID获取标签
     */
    TagDTO getTagById(Long id);
    
    /**
     * 根据slug获取标签
     */
    TagDTO getTagBySlug(String slug);
    
    /**
     * 分页获取标签列表
     */
    PageResponse<TagDTO> getTags(Pageable pageable);
    
    /**
     * 获取所有标签
     */
    List<TagDTO> getAllTags();
    
    /**
     * 获取有文章的标签
     */
    List<TagDTO> getTagsWithArticles();
    
    /**
     * 获取热门标签
     */
    List<TagDTO> getPopularTags();
}
