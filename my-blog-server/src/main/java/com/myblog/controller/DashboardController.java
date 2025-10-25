package com.myblog.controller;

import com.myblog.dto.ApiResponse;
import com.myblog.dto.DashboardStats;
import com.myblog.service.DashboardService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * 仪表盘控制器
 * 提供管理端仪表盘数据统计接口
 */
@RestController
@RequestMapping("/dashboard")
@RequiredArgsConstructor
@Tag(name = "仪表盘管理", description = "管理端仪表盘数据统计相关操作")
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping("/stats")
    @Operation(summary = "获取仪表盘统计数据", description = "获取文章、分类、标签、评论等统计数据")
    public ApiResponse<DashboardStats> getDashboardStats() {
        DashboardStats stats = dashboardService.getDashboardStats();
        return ApiResponse.success("获取统计数据成功", stats);
    }

    @GetMapping("/recent-articles")
    @Operation(summary = "获取最近文章", description = "获取最近发布的文章列表")
    public ApiResponse<Object> getRecentArticles() {
        // TODO: 实现获取最近文章的逻辑
        return ApiResponse.success("获取最近文章成功", null);
    }

    @GetMapping("/recent-comments")
    @Operation(summary = "获取最近评论", description = "获取最近的评论列表")
    public ApiResponse<Object> getRecentComments() {
        // TODO: 实现获取最近评论的逻辑
        return ApiResponse.success("获取最近评论成功", null);
    }

    @GetMapping("/system-info")
    @Operation(summary = "获取系统信息", description = "获取系统运行状态和基本信息")
    public ApiResponse<Object> getSystemInfo() {
        // TODO: 实现获取系统信息的逻辑
        return ApiResponse.success("获取系统信息成功", null);
    }
}
