package com.myblog.dto;

import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

/**
 * 评论数据传输对象
 */
@Data
public class CommentDTO {
    
    private Long id;
    private Long articleId;
    private String author;
    private String email;
    private String website;
    private String content;
    private Long parentId;
    private Boolean isApproved;
    private Integer likeCount;
    private String ipAddress;
    private String userAgent;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private List<CommentDTO> replies;
}
