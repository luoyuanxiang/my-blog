package com.myblog.controller;

import com.myblog.dto.CommentDTO;
import com.myblog.dto.ApiResponse;
import com.myblog.dto.PageResponse;
import com.myblog.service.CommentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 评论控制器
 */
@RestController
@RequestMapping("/comments")
@RequiredArgsConstructor
@Tag(name = "评论管理", description = "评论的增删改查操作")
public class CommentController {

    private final CommentService commentService;

    @PostMapping
    @Operation(summary = "创建评论", description = "创建新的评论")
    public ApiResponse<CommentDTO> createComment(@RequestBody CommentDTO commentDTO) {
        CommentDTO result = commentService.createComment(commentDTO);
        return ApiResponse.success("评论创建成功", result);
    }

    @PutMapping("/{id}")
    @Operation(summary = "更新评论", description = "根据ID更新评论")
    public ApiResponse<CommentDTO> updateComment(@PathVariable Long id, @RequestBody CommentDTO commentDTO) {
        CommentDTO result = commentService.updateComment(id, commentDTO);
        return ApiResponse.success("评论更新成功", result);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "删除评论", description = "根据ID删除评论")
    public ApiResponse<Void> deleteComment(@PathVariable Long id) {
        commentService.deleteComment(id);
        return ApiResponse.success("评论删除成功", null);
    }

    @GetMapping("/{id}")
    @Operation(summary = "获取评论", description = "根据ID获取评论详情")
    public ApiResponse<CommentDTO> getCommentById(@PathVariable Long id) {
        CommentDTO result = commentService.getCommentById(id);
        return ApiResponse.success(result);
    }

    @GetMapping("/article/{articleId}")
    @Operation(summary = "获取文章评论", description = "根据文章ID获取评论列表")
    public ApiResponse<PageResponse<CommentDTO>> getCommentsByArticleId(
            @PathVariable Long articleId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        Pageable pageable = PageRequest.of(page, size);
        PageResponse<CommentDTO> result = commentService.getCommentsByArticleId(articleId, pageable);
        return ApiResponse.success(result);
    }

    @GetMapping("/pending")
    @Operation(summary = "获取待审核评论", description = "获取待审核的评论列表")
    public ApiResponse<PageResponse<CommentDTO>> getPendingComments(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        Pageable pageable = PageRequest.of(page, size);
        PageResponse<CommentDTO> result = commentService.getPendingComments(pageable);
        return ApiResponse.success(result);
    }

    @PostMapping("/{id}/approve")
    @Operation(summary = "审核通过评论", description = "审核通过评论")
    public ApiResponse<CommentDTO> approveComment(@PathVariable Long id) {
        CommentDTO result = commentService.approveComment(id);
        return ApiResponse.success("评论审核通过", result);
    }

    @PostMapping("/{id}/reject")
    @Operation(summary = "拒绝评论", description = "拒绝评论")
    public ApiResponse<CommentDTO> rejectComment(@PathVariable Long id) {
        CommentDTO result = commentService.rejectComment(id);
        return ApiResponse.success("评论已拒绝", result);
    }

    @PostMapping("/{id}/like")
    @Operation(summary = "点赞评论", description = "增加评论点赞数")
    public ApiResponse<Void> incrementLikeCount(@PathVariable Long id) {
        commentService.incrementLikeCount(id);
        return ApiResponse.success("点赞成功", null);
    }

    @GetMapping("/{id}/replies")
    @Operation(summary = "获取评论回复", description = "获取评论的回复列表")
    public ApiResponse<List<CommentDTO>> getCommentReplies(@PathVariable Long id) {
        List<CommentDTO> result = commentService.getCommentReplies(id);
        return ApiResponse.success(result);
    }
}
