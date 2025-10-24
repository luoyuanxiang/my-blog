package com.myblog.dto;

import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

/**
 * 评论数据传输对象
 * 用于在API接口中传输评论数据，避免直接暴露实体类
 * 
 * @author MyBlog Team
 * @version 1.0
 * @since 2024-01-01
 */
@Data
public class CommentDTO {
    
    /** 评论唯一标识符 */
    private Long id;
    
    /** 评论所属文章ID */
    private Long articleId;
    
    /** 评论作者姓名 */
    private String author;
    
    /** 评论作者邮箱 */
    private String email;
    
    /** 评论作者网站 */
    private String website;
    
    /** 评论内容 */
    private String content;
    
    /** 父评论ID（用于嵌套回复） */
    private Long parentId;
    
    /** 评论是否已审核通过 */
    private Boolean isApproved;
    
    /** 评论点赞次数 */
    private Integer likeCount;
    
    /** 评论者IP地址 */
    private String ipAddress;
    
    /** 评论者浏览器信息 */
    private String userAgent;
    
    /** 评论创建时间 */
    private LocalDateTime createdAt;
    
    /** 评论最后更新时间 */
    private LocalDateTime updatedAt;
    
    /** 评论的回复列表 */
    private List<CommentDTO> replies;
}
