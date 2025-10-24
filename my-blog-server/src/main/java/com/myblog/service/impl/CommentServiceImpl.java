package com.myblog.service.impl;

import com.myblog.dto.CommentDTO;
import com.myblog.dto.PageResponse;
import com.myblog.entity.Comment;
import com.myblog.repository.CommentRepository;
import com.myblog.service.CommentService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * 评论服务实现类
 */
@Service
@RequiredArgsConstructor
public class CommentServiceImpl implements CommentService {

    private final CommentRepository commentRepository;

    @Override
    @Transactional
    public CommentDTO createComment(CommentDTO commentDTO) {
        Comment comment = new Comment();
        BeanUtils.copyProperties(commentDTO, comment);
        comment = commentRepository.save(comment);
        return convertToDTO(comment);
    }

    @Override
    @Transactional
    public CommentDTO updateComment(Long id, CommentDTO commentDTO) {
        Comment comment = commentRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("评论不存在"));
        
        BeanUtils.copyProperties(commentDTO, comment, "id", "createdAt");
        comment = commentRepository.save(comment);
        return convertToDTO(comment);
    }

    @Override
    @Transactional
    public void deleteComment(Long id) {
        if (!commentRepository.existsById(id)) {
            throw new RuntimeException("评论不存在");
        }
        commentRepository.deleteById(id);
    }

    @Override
    public CommentDTO getCommentById(Long id) {
        Comment comment = commentRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("评论不存在"));
        return convertToDTO(comment);
    }

    @Override
    public PageResponse<CommentDTO> getCommentsByArticleId(Long articleId, Pageable pageable) {
        Page<Comment> page = commentRepository.findByArticleIdAndIsApprovedTrueOrderByCreatedAtDesc(articleId, pageable);
        return new PageResponse<>(page.map(this::convertToDTO));
    }

    @Override
    public PageResponse<CommentDTO> getPendingComments(Pageable pageable) {
        Page<Comment> page = commentRepository.findByIsApprovedFalseOrderByCreatedAtDesc(pageable);
        return new PageResponse<>(page.map(this::convertToDTO));
    }

    @Override
    @Transactional
    public CommentDTO approveComment(Long id) {
        Comment comment = commentRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("评论不存在"));
        comment.setIsApproved(true);
        comment = commentRepository.save(comment);
        return convertToDTO(comment);
    }

    @Override
    @Transactional
    public CommentDTO rejectComment(Long id) {
        Comment comment = commentRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("评论不存在"));
        comment.setIsApproved(false);
        comment = commentRepository.save(comment);
        return convertToDTO(comment);
    }

    @Override
    @Transactional
    public void incrementLikeCount(Long id) {
        Comment comment = commentRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("评论不存在"));
        comment.setLikeCount(comment.getLikeCount() + 1);
        commentRepository.save(comment);
    }

    @Override
    public List<CommentDTO> getCommentReplies(Long parentId) {
        List<Comment> replies = commentRepository.findByParentIdOrderByCreatedAtAsc(parentId);
        return replies.stream().map(this::convertToDTO).toList();
    }

    private CommentDTO convertToDTO(Comment comment) {
        CommentDTO dto = new CommentDTO();
        BeanUtils.copyProperties(comment, dto);
        return dto;
    }
}
