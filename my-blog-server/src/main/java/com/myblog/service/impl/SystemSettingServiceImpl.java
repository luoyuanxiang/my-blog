package com.myblog.service.impl;

import com.myblog.dto.SystemSettingDTO;
import com.myblog.entity.SystemSetting;
import com.myblog.repository.SystemSettingRepository;
import com.myblog.service.SystemSettingService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * 系统设置服务实现类
 */
@Service
@RequiredArgsConstructor
public class SystemSettingServiceImpl implements SystemSettingService {

    private final SystemSettingRepository systemSettingRepository;

    @Override
    @Transactional
    public SystemSettingDTO createSetting(SystemSettingDTO settingDTO) {
        SystemSetting setting = new SystemSetting();
        BeanUtils.copyProperties(settingDTO, setting);
        setting = systemSettingRepository.save(setting);
        return convertToDTO(setting);
    }

    @Override
    @Transactional
    public SystemSettingDTO updateSetting(Long id, SystemSettingDTO settingDTO) {
        SystemSetting setting = systemSettingRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("系统设置不存在"));
        
        BeanUtils.copyProperties(settingDTO, setting, "id", "createdAt");
        setting = systemSettingRepository.save(setting);
        return convertToDTO(setting);
    }

    @Override
    @Transactional
    public void deleteSetting(Long id) {
        if (!systemSettingRepository.existsById(id)) {
            throw new RuntimeException("系统设置不存在");
        }
        systemSettingRepository.deleteById(id);
    }

    @Override
    public SystemSettingDTO getSettingById(Long id) {
        SystemSetting setting = systemSettingRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("系统设置不存在"));
        return convertToDTO(setting);
    }

    @Override
    public SystemSettingDTO getSettingByKey(String key) {
        SystemSetting setting = systemSettingRepository.findByKey(key)
            .orElseThrow(() -> new RuntimeException("系统设置不存在"));
        return convertToDTO(setting);
    }

    @Override
    public List<SystemSettingDTO> getAllSettings() {
        List<SystemSetting> settings = systemSettingRepository.findAll();
        return settings.stream().map(this::convertToDTO).toList();
    }

    @Override
    public List<SystemSettingDTO> getPublicSettings() {
        List<SystemSetting> settings = systemSettingRepository.findByIsPublicTrue();
        return settings.stream().map(this::convertToDTO).toList();
    }

    @Override
    public List<SystemSettingDTO> getSettingsByType(String settingType) {
        List<SystemSetting> settings = systemSettingRepository.findBySettingType(settingType);
        return settings.stream().map(this::convertToDTO).toList();
    }

    @Override
    @Transactional
    public void updateSettings(List<SystemSettingDTO> settings) {
        for (SystemSettingDTO settingDTO : settings) {
            if (settingDTO.getId() != null) {
                SystemSetting setting = systemSettingRepository.findById(settingDTO.getId())
                    .orElseThrow(() -> new RuntimeException("系统设置不存在"));
                BeanUtils.copyProperties(settingDTO, setting, "id", "createdAt");
                systemSettingRepository.save(setting);
            } else {
                SystemSetting setting = new SystemSetting();
                BeanUtils.copyProperties(settingDTO, setting);
                systemSettingRepository.save(setting);
            }
        }
    }

    @Override
    public String getSettingValue(String key, String defaultValue) {
        return systemSettingRepository.findByKey(key)
            .map(SystemSetting::getValue)
            .orElse(defaultValue);
    }

    private SystemSettingDTO convertToDTO(SystemSetting setting) {
        SystemSettingDTO dto = new SystemSettingDTO();
        BeanUtils.copyProperties(setting, dto);
        return dto;
    }
}
