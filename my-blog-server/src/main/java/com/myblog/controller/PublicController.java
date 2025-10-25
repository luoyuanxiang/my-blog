package com.myblog.controller;

import com.myblog.dto.ApiResponse;
import com.myblog.service.BlogStatsService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

/**
 * 公共博客统计控制器
 * 提供前端首页所需的统计数据
 */
@RestController
@RequestMapping("/api/public")
@RequiredArgsConstructor
@Tag(name = "公共API", description = "前端公开访问的API接口")
public class PublicController {

    private final BlogStatsService blogStatsService;

    @GetMapping("/stats")
    @Operation(summary = "获取博客统计", description = "获取博客的公开统计数据")
    public ApiResponse<Map<String, Object>> getBlogStats() {
        Map<String, Object> stats = blogStatsService.getPublicBlogStats();
        return ApiResponse.success("获取博客统计成功", stats);
    }
}
