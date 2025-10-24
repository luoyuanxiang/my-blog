package com.myblog.controller;

import com.myblog.dto.GuestbookMessageDTO;
import com.myblog.dto.ApiResponse;
import com.myblog.dto.PageResponse;
import com.myblog.service.GuestbookService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 留言板控制器
 */
@RestController
@RequestMapping("/guestbook")
@RequiredArgsConstructor
@Tag(name = "留言板管理", description = "留言板的增删改查操作")
public class GuestbookController {

    private final GuestbookService guestbookService;

    @PostMapping
    @Operation(summary = "创建留言", description = "创建新的留言")
    public ApiResponse<GuestbookMessageDTO> createMessage(@RequestBody GuestbookMessageDTO messageDTO) {
        GuestbookMessageDTO result = guestbookService.createMessage(messageDTO);
        return ApiResponse.success("留言创建成功", result);
    }

    @PutMapping("/{id}")
    @Operation(summary = "更新留言", description = "根据ID更新留言")
    public ApiResponse<GuestbookMessageDTO> updateMessage(@PathVariable Long id, @RequestBody GuestbookMessageDTO messageDTO) {
        GuestbookMessageDTO result = guestbookService.updateMessage(id, messageDTO);
        return ApiResponse.success("留言更新成功", result);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "删除留言", description = "根据ID删除留言")
    public ApiResponse<Void> deleteMessage(@PathVariable Long id) {
        guestbookService.deleteMessage(id);
        return ApiResponse.success("留言删除成功", null);
    }

    @GetMapping("/{id}")
    @Operation(summary = "获取留言", description = "根据ID获取留言详情")
    public ApiResponse<GuestbookMessageDTO> getMessageById(@PathVariable Long id) {
        GuestbookMessageDTO result = guestbookService.getMessageById(id);
        return ApiResponse.success(result);
    }

    @GetMapping
    @Operation(summary = "获取留言列表", description = "分页获取留言列表")
    public ApiResponse<PageResponse<GuestbookMessageDTO>> getMessages(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {
        
        Sort sort = Sort.by(Sort.Direction.fromString(sortDir), sortBy);
        Pageable pageable = PageRequest.of(page, size, sort);
        PageResponse<GuestbookMessageDTO> result = guestbookService.getMessages(pageable);
        return ApiResponse.success(result);
    }

    @GetMapping("/approved")
    @Operation(summary = "获取已审核留言", description = "获取已审核的留言列表")
    public ApiResponse<PageResponse<GuestbookMessageDTO>> getApprovedMessages(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        Pageable pageable = PageRequest.of(page, size);
        PageResponse<GuestbookMessageDTO> result = guestbookService.getApprovedMessages(pageable);
        return ApiResponse.success(result);
    }

    @GetMapping("/pending")
    @Operation(summary = "获取待审核留言", description = "获取待审核的留言列表")
    public ApiResponse<PageResponse<GuestbookMessageDTO>> getPendingMessages(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        Pageable pageable = PageRequest.of(page, size);
        PageResponse<GuestbookMessageDTO> result = guestbookService.getPendingMessages(pageable);
        return ApiResponse.success(result);
    }

    @PostMapping("/{id}/approve")
    @Operation(summary = "审核通过留言", description = "审核通过留言")
    public ApiResponse<GuestbookMessageDTO> approveMessage(@PathVariable Long id) {
        GuestbookMessageDTO result = guestbookService.approveMessage(id);
        return ApiResponse.success("留言审核通过", result);
    }

    @PostMapping("/{id}/reject")
    @Operation(summary = "拒绝留言", description = "拒绝留言")
    public ApiResponse<GuestbookMessageDTO> rejectMessage(@PathVariable Long id) {
        GuestbookMessageDTO result = guestbookService.rejectMessage(id);
        return ApiResponse.success("留言已拒绝", result);
    }

    @PostMapping("/{id}/like")
    @Operation(summary = "点赞留言", description = "增加留言点赞数")
    public ApiResponse<Void> incrementLikeCount(@PathVariable Long id) {
        guestbookService.incrementLikeCount(id);
        return ApiResponse.success("点赞成功", null);
    }

    @GetMapping("/{id}/replies")
    @Operation(summary = "获取留言回复", description = "获取留言的回复列表")
    public ApiResponse<List<GuestbookMessageDTO>> getMessageReplies(@PathVariable Long id) {
        List<GuestbookMessageDTO> result = guestbookService.getMessageReplies(id);
        return ApiResponse.success(result);
    }
}
