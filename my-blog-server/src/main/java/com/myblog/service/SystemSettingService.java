package com.myblog.service;

import com.myblog.dto.SystemSettingDTO;

import java.util.List;

/**
 * 系统设置服务接口
 * 定义系统设置相关的业务逻辑方法
 * 
 * @author MyBlog Team
 * @version 1.0
 * @since 2024-01-01
 */
public interface SystemSettingService {
    
    /**
     * 创建新系统设置
     * @param settingDTO 系统设置数据传输对象
     * @return 创建后的设置信息
     */
    SystemSettingDTO createSetting(SystemSettingDTO settingDTO);
    
    /**
     * 更新系统设置信息
     * @param id 设置ID
     * @param settingDTO 系统设置数据传输对象
     * @return 更新后的设置信息
     */
    SystemSettingDTO updateSetting(Long id, SystemSettingDTO settingDTO);
    
    /**
     * 删除系统设置
     * @param id 设置ID
     */
    void deleteSetting(Long id);
    
    /**
     * 根据ID获取系统设置详情
     * @param id 设置ID
     * @return 设置信息
     */
    SystemSettingDTO getSettingById(Long id);
    
    /**
     * 根据键名获取系统设置
     * @param key 设置键名
     * @return 设置信息
     */
    SystemSettingDTO getSettingByKey(String key);
    
    /**
     * 获取所有系统设置列表
     * @return 所有设置列表
     */
    List<SystemSettingDTO> getAllSettings();
    
    /**
     * 获取公开的系统设置列表（前端可访问）
     * @return 公开设置列表
     */
    List<SystemSettingDTO> getPublicSettings();
    
    /**
     * 根据设置类型获取设置列表
     * @param settingType 设置类型
     * @return 指定类型的设置列表
     */
    List<SystemSettingDTO> getSettingsByType(String settingType);
    
    /**
     * 批量更新系统设置
     * @param settings 设置列表
     */
    void updateSettings(List<SystemSettingDTO> settings);
}
