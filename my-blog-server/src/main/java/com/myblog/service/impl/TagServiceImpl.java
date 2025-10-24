package com.myblog.service.impl;

import com.myblog.dto.TagDTO;
import com.myblog.dto.PageResponse;
import com.myblog.entity.Tag;
import com.myblog.repository.TagRepository;
import com.myblog.service.TagService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * 标签服务实现类
 */
@Service
@RequiredArgsConstructor
public class TagServiceImpl implements TagService {

    private final TagRepository tagRepository;

    @Override
    @Transactional
    public TagDTO createTag(TagDTO tagDTO) {
        Tag tag = new Tag();
        BeanUtils.copyProperties(tagDTO, tag);
        tag = tagRepository.save(tag);
        return convertToDTO(tag);
    }

    @Override
    @Transactional
    public TagDTO updateTag(Long id, TagDTO tagDTO) {
        Tag tag = tagRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("标签不存在"));
        
        BeanUtils.copyProperties(tagDTO, tag, "id", "createdAt");
        tag = tagRepository.save(tag);
        return convertToDTO(tag);
    }

    @Override
    @Transactional
    public void deleteTag(Long id) {
        if (!tagRepository.existsById(id)) {
            throw new RuntimeException("标签不存在");
        }
        tagRepository.deleteById(id);
    }

    @Override
    public TagDTO getTagById(Long id) {
        Tag tag = tagRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("标签不存在"));
        return convertToDTO(tag);
    }

    @Override
    public TagDTO getTagBySlug(String slug) {
        Tag tag = tagRepository.findBySlug(slug)
            .orElseThrow(() -> new RuntimeException("标签不存在"));
        return convertToDTO(tag);
    }

    @Override
    public PageResponse<TagDTO> getTags(Pageable pageable) {
        Page<Tag> page = tagRepository.findAll(pageable);
        return new PageResponse<>(page.map(this::convertToDTO));
    }

    @Override
    public List<TagDTO> getAllTags() {
        List<Tag> tags = tagRepository.findAll();
        return tags.stream().map(this::convertToDTO).toList();
    }

    @Override
    public List<TagDTO> getTagsWithArticles() {
        List<Tag> tags = tagRepository.findTagsWithArticles();
        return tags.stream().map(this::convertToDTO).toList();
    }

    @Override
    public List<TagDTO> getPopularTags() {
        List<Tag> tags = tagRepository.findPopularTags();
        return tags.stream().map(this::convertToDTO).toList();
    }

    private TagDTO convertToDTO(Tag tag) {
        TagDTO dto = new TagDTO();
        BeanUtils.copyProperties(tag, dto);
        return dto;
    }
}
