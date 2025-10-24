package com.myblog.repository;

import com.myblog.entity.SystemSetting;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * 系统设置数据访问层
 */
@Repository
public interface SystemSettingRepository extends JpaRepository<SystemSetting, Long> {

    /**
     * 根据key查找设置
     */
    Optional<SystemSetting> findByKey(String key);

    /**
     * 查找公开设置
     */
    List<SystemSetting> findByIsPublicTrue();

    /**
     * 根据设置类型查找
     */
    List<SystemSetting> findBySettingType(String settingType);
}
