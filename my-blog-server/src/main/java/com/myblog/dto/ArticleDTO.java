package com.myblog.dto;

import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

/**
 * 文章数据传输对象
 */
@Data
public class ArticleDTO {
    
    private Long id;
    private String title;
    private String summary;
    private String content;
    private String slug;
    private String coverImage;
    private Boolean isPublished;
    private Boolean isPinned;
    private Integer viewCount;
    private Integer likeCount;
    private Integer commentCount;
    private CategoryDTO category;
    private List<TagDTO> tags;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime publishedAt;
}
