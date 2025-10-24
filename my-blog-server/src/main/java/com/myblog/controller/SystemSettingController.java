package com.myblog.controller;

import com.myblog.dto.SystemSettingDTO;
import com.myblog.dto.ApiResponse;
import com.myblog.service.SystemSettingService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 系统设置控制器
 */
@RestController
@RequestMapping("/system-settings")
@RequiredArgsConstructor
@Tag(name = "系统设置管理", description = "系统设置的增删改查操作")
public class SystemSettingController {

    private final SystemSettingService systemSettingService;

    @PostMapping
    @Operation(summary = "创建系统设置", description = "创建新的系统设置")
    public ApiResponse<SystemSettingDTO> createSetting(@RequestBody SystemSettingDTO settingDTO) {
        SystemSettingDTO result = systemSettingService.createSetting(settingDTO);
        return ApiResponse.success("系统设置创建成功", result);
    }

    @PutMapping("/{id}")
    @Operation(summary = "更新系统设置", description = "根据ID更新系统设置")
    public ApiResponse<SystemSettingDTO> updateSetting(@PathVariable Long id, @RequestBody SystemSettingDTO settingDTO) {
        SystemSettingDTO result = systemSettingService.updateSetting(id, settingDTO);
        return ApiResponse.success("系统设置更新成功", result);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "删除系统设置", description = "根据ID删除系统设置")
    public ApiResponse<Void> deleteSetting(@PathVariable Long id) {
        systemSettingService.deleteSetting(id);
        return ApiResponse.success("系统设置删除成功", null);
    }

    @GetMapping("/{id}")
    @Operation(summary = "获取系统设置", description = "根据ID获取系统设置详情")
    public ApiResponse<SystemSettingDTO> getSettingById(@PathVariable Long id) {
        SystemSettingDTO result = systemSettingService.getSettingById(id);
        return ApiResponse.success(result);
    }

    @GetMapping("/key/{key}")
    @Operation(summary = "根据key获取系统设置", description = "根据key获取系统设置详情")
    public ApiResponse<SystemSettingDTO> getSettingByKey(@PathVariable String key) {
        SystemSettingDTO result = systemSettingService.getSettingByKey(key);
        return ApiResponse.success(result);
    }

    @GetMapping
    @Operation(summary = "获取所有系统设置", description = "获取所有系统设置列表")
    public ApiResponse<List<SystemSettingDTO>> getAllSettings() {
        List<SystemSettingDTO> result = systemSettingService.getAllSettings();
        return ApiResponse.success(result);
    }

    @GetMapping("/public")
    @Operation(summary = "获取公开设置", description = "获取公开的系统设置列表")
    public ApiResponse<List<SystemSettingDTO>> getPublicSettings() {
        List<SystemSettingDTO> result = systemSettingService.getPublicSettings();
        return ApiResponse.success(result);
    }

    @GetMapping("/type/{settingType}")
    @Operation(summary = "根据类型获取设置", description = "根据设置类型获取系统设置列表")
    public ApiResponse<List<SystemSettingDTO>> getSettingsByType(@PathVariable String settingType) {
        List<SystemSettingDTO> result = systemSettingService.getSettingsByType(settingType);
        return ApiResponse.success(result);
    }

    @PutMapping("/batch")
    @Operation(summary = "批量更新设置", description = "批量更新系统设置")
    public ApiResponse<Void> updateSettings(@RequestBody List<SystemSettingDTO> settings) {
        systemSettingService.updateSettings(settings);
        return ApiResponse.success("批量更新成功", null);
    }
}
