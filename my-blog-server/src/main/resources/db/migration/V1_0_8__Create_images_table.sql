-- 创建图片表
CREATE TABLE IF NOT EXISTS images (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '图片ID',
    filename VARCHAR(255) NOT NULL COMMENT '文件名',
    original_filename VARCHAR(255) COMMENT '原始文件名',
    file_path VARCHAR(500) NOT NULL COMMENT '文件路径',
    url VARCHAR(500) NOT NULL COMMENT '文件URL',
    file_size BIGINT COMMENT '文件大小（字节）',
    content_type VARCHAR(100) COMMENT '文件类型（MIME类型）',
    extension VARCHAR(10) COMMENT '文件扩展名',
    width INT COMMENT '图片宽度',
    height INT COMMENT '图片高度',
    description VARCHAR(500) COMMENT '图片描述',
    storage_type VARCHAR(50) COMMENT '存储服务类型',
    storage_config TEXT COMMENT '存储服务配置',
    uploaded_by VARCHAR(50) COMMENT '上传者',
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE COMMENT '是否删除',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    
    INDEX idx_filename (filename),
    INDEX idx_url (url),
    INDEX idx_uploaded_by (uploaded_by),
    INDEX idx_storage_type (storage_type),
    INDEX idx_is_deleted (is_deleted),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='图片表';

-- 插入图片存储配置到系统设置表
INSERT INTO system_settings (setting_key, setting_value, description, setting_type, is_public, created_at, updated_at) VALUES
('image.storage.type', 'local', '图片存储类型（local/aliyun-oss/tencent-cos/qiniu）', 'image', FALSE, NOW(), NOW()),
('image.max.size', '10485760', '图片最大大小（字节），默认10MB', 'image', FALSE, NOW(), NOW()),
('image.allowed.extensions', 'jpg,jpeg,png,gif,webp,bmp,svg', '允许的图片扩展名', 'image', FALSE, NOW(), NOW()),
('image.upload.path', './uploads/images/', '图片上传路径', 'image', FALSE, NOW(), NOW()),
('image.url.prefix', '/api/images/', '图片访问URL前缀', 'image', FALSE, NOW(), NOW())
ON DUPLICATE KEY UPDATE 
    setting_value = VALUES(setting_value),
    description = VALUES(description),
    updated_at = NOW();
