package com.myblog.controller;

import com.myblog.dto.FriendLinkDTO;
import com.myblog.dto.ApiResponse;
import com.myblog.dto.PageResponse;
import com.myblog.service.FriendLinkService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 友链控制器
 */
@RestController
@RequestMapping("/friend-links")
@RequiredArgsConstructor
@Tag(name = "友链管理", description = "友链的增删改查操作")
public class FriendLinkController {

    private final FriendLinkService friendLinkService;

    @PostMapping
    @Operation(summary = "创建友链", description = "创建新的友链")
    public ApiResponse<FriendLinkDTO> createFriendLink(@RequestBody FriendLinkDTO friendLinkDTO) {
        FriendLinkDTO result = friendLinkService.createFriendLink(friendLinkDTO);
        return ApiResponse.success("友链创建成功", result);
    }

    @PutMapping("/{id}")
    @Operation(summary = "更新友链", description = "根据ID更新友链")
    public ApiResponse<FriendLinkDTO> updateFriendLink(@PathVariable Long id, @RequestBody FriendLinkDTO friendLinkDTO) {
        FriendLinkDTO result = friendLinkService.updateFriendLink(id, friendLinkDTO);
        return ApiResponse.success("友链更新成功", result);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "删除友链", description = "根据ID删除友链")
    public ApiResponse<Void> deleteFriendLink(@PathVariable Long id) {
        friendLinkService.deleteFriendLink(id);
        return ApiResponse.success("友链删除成功", null);
    }

    @GetMapping("/{id}")
    @Operation(summary = "获取友链", description = "根据ID获取友链详情")
    public ApiResponse<FriendLinkDTO> getFriendLinkById(@PathVariable Long id) {
        FriendLinkDTO result = friendLinkService.getFriendLinkById(id);
        return ApiResponse.success(result);
    }

    @GetMapping
    @Operation(summary = "获取友链列表", description = "分页获取友链列表")
    public ApiResponse<PageResponse<FriendLinkDTO>> getFriendLinks(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {
        
        Sort sort = Sort.by(Sort.Direction.fromString(sortDir), sortBy);
        Pageable pageable = PageRequest.of(page, size, sort);
        PageResponse<FriendLinkDTO> result = friendLinkService.getFriendLinks(pageable);
        return ApiResponse.success(result);
    }

    @GetMapping("/approved")
    @Operation(summary = "获取已审核友链", description = "获取已审核的友链列表")
    public ApiResponse<List<FriendLinkDTO>> getApprovedFriendLinks() {
        List<FriendLinkDTO> result = friendLinkService.getApprovedFriendLinks();
        return ApiResponse.success(result);
    }

    @GetMapping("/pending")
    @Operation(summary = "获取待审核友链", description = "获取待审核的友链列表")
    public ApiResponse<PageResponse<FriendLinkDTO>> getPendingFriendLinks(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        Pageable pageable = PageRequest.of(page, size);
        PageResponse<FriendLinkDTO> result = friendLinkService.getPendingFriendLinks(pageable);
        return ApiResponse.success(result);
    }

    @PostMapping("/{id}/approve")
    @Operation(summary = "审核通过友链", description = "审核通过友链")
    public ApiResponse<FriendLinkDTO> approveFriendLink(@PathVariable Long id) {
        FriendLinkDTO result = friendLinkService.approveFriendLink(id);
        return ApiResponse.success("友链审核通过", result);
    }

    @PostMapping("/{id}/reject")
    @Operation(summary = "拒绝友链", description = "拒绝友链")
    public ApiResponse<FriendLinkDTO> rejectFriendLink(@PathVariable Long id) {
        FriendLinkDTO result = friendLinkService.rejectFriendLink(id);
        return ApiResponse.success("友链已拒绝", result);
    }

    @PostMapping("/{id}/click")
    @Operation(summary = "增加点击量", description = "增加友链点击量")
    public ApiResponse<Void> incrementClickCount(@PathVariable Long id) {
        friendLinkService.incrementClickCount(id);
        return ApiResponse.success("点击量增加成功", null);
    }
}
