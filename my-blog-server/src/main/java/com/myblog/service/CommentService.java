package com.myblog.service;

import com.myblog.dto.CommentDTO;
import com.myblog.dto.PageResponse;
import org.springframework.data.domain.Pageable;

import java.util.List;

/**
 * 评论服务接口
 * 定义评论相关的业务逻辑方法
 * 
 * @author MyBlog Team
 * @version 1.0
 * @since 2024-01-01
 */
public interface CommentService {
    
    /**
     * 创建新评论
     * @param commentDTO 评论数据传输对象
     * @return 创建后的评论信息
     */
    CommentDTO createComment(CommentDTO commentDTO);
    
    /**
     * 更新评论信息
     * @param id 评论ID
     * @param commentDTO 评论数据传输对象
     * @return 更新后的评论信息
     */
    CommentDTO updateComment(Long id, CommentDTO commentDTO);
    
    /**
     * 删除评论
     * @param id 评论ID
     */
    void deleteComment(Long id);
    
    /**
     * 根据ID获取评论详情
     * @param id 评论ID
     * @return 评论信息
     */
    CommentDTO getCommentById(Long id);
    
    /**
     * 根据文章ID获取评论列表
     * @param articleId 文章ID
     * @param pageable 分页参数
     * @return 分页评论列表
     */
    PageResponse<CommentDTO> getCommentsByArticleId(Long articleId, Pageable pageable);
    
    /**
     * 获取待审核的评论列表
     * @param pageable 分页参数
     * @return 分页待审核评论列表
     */
    PageResponse<CommentDTO> getPendingComments(Pageable pageable);
    
    /**
     * 审核通过评论
     * @param id 评论ID
     * @return 审核后的评论信息
     */
    CommentDTO approveComment(Long id);
    
    /**
     * 拒绝评论
     * @param id 评论ID
     * @return 拒绝后的评论信息
     */
    CommentDTO rejectComment(Long id);
    
    /**
     * 增加评论点赞数
     * @param id 评论ID
     */
    void incrementLikeCount(Long id);
    
    /**
     * 获取评论的回复列表
     * @param parentId 父评论ID
     * @return 回复列表
     */
    List<CommentDTO> getCommentReplies(Long parentId);
}
