package com.myblog.service;

import com.myblog.dto.CommentDTO;
import com.myblog.dto.PageResponse;
import org.springframework.data.domain.Pageable;

import java.util.List;

/**
 * 评论服务接口
 */
public interface CommentService {
    
    /**
     * 创建评论
     */
    CommentDTO createComment(CommentDTO commentDTO);
    
    /**
     * 更新评论
     */
    CommentDTO updateComment(Long id, CommentDTO commentDTO);
    
    /**
     * 删除评论
     */
    void deleteComment(Long id);
    
    /**
     * 根据ID获取评论
     */
    CommentDTO getCommentById(Long id);
    
    /**
     * 根据文章ID获取评论
     */
    PageResponse<CommentDTO> getCommentsByArticleId(Long articleId, Pageable pageable);
    
    /**
     * 获取待审核的评论
     */
    PageResponse<CommentDTO> getPendingComments(Pageable pageable);
    
    /**
     * 审核评论
     */
    CommentDTO approveComment(Long id);
    
    /**
     * 拒绝评论
     */
    CommentDTO rejectComment(Long id);
    
    /**
     * 增加点赞数
     */
    void incrementLikeCount(Long id);
    
    /**
     * 获取评论的回复
     */
    List<CommentDTO> getCommentReplies(Long parentId);
}
