package com.myblog.service;

import com.myblog.dto.SystemSettingDTO;

import java.util.List;

/**
 * 系统设置服务接口
 */
public interface SystemSettingService {
    
    /**
     * 创建系统设置
     */
    SystemSettingDTO createSetting(SystemSettingDTO settingDTO);
    
    /**
     * 更新系统设置
     */
    SystemSettingDTO updateSetting(Long id, SystemSettingDTO settingDTO);
    
    /**
     * 删除系统设置
     */
    void deleteSetting(Long id);
    
    /**
     * 根据ID获取系统设置
     */
    SystemSettingDTO getSettingById(Long id);
    
    /**
     * 根据key获取系统设置
     */
    SystemSettingDTO getSettingByKey(String key);
    
    /**
     * 获取所有系统设置
     */
    List<SystemSettingDTO> getAllSettings();
    
    /**
     * 获取公开设置
     */
    List<SystemSettingDTO> getPublicSettings();
    
    /**
     * 根据设置类型获取设置
     */
    List<SystemSettingDTO> getSettingsByType(String settingType);
    
    /**
     * 批量更新设置
     */
    void updateSettings(List<SystemSettingDTO> settings);
}
