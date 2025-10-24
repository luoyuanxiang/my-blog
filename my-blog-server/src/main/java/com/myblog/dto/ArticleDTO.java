package com.myblog.dto;

import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

/**
 * 文章数据传输对象
 * 用于在API接口中传输文章数据，避免直接暴露实体类
 * 
 * @author MyBlog Team
 * @version 1.0
 * @since 2024-01-01
 */
@Data
public class ArticleDTO {
    
    /** 文章唯一标识符 */
    private Long id;
    
    /** 文章标题 */
    private String title;
    
    /** 文章摘要 */
    private String summary;
    
    /** 文章完整内容 */
    private String content;
    
    /** 文章URL友好的标识符 */
    private String slug;
    
    /** 文章封面图片URL */
    private String coverImage;
    
    /** 文章是否已发布 */
    private Boolean isPublished;
    
    /** 文章是否置顶显示 */
    private Boolean isPinned;
    
    /** 文章浏览次数 */
    private Integer viewCount;
    
    /** 文章点赞次数 */
    private Integer likeCount;
    
    /** 文章评论数量 */
    private Integer commentCount;
    
    /** 文章所属分类信息 */
    private CategoryDTO category;
    
    /** 文章关联的标签列表 */
    private List<TagDTO> tags;
    
    /** 文章创建时间 */
    private LocalDateTime createdAt;
    
    /** 文章最后更新时间 */
    private LocalDateTime updatedAt;
    
    /** 文章发布时间 */
    private LocalDateTime publishedAt;
}
