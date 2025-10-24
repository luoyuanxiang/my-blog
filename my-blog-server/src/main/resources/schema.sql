-- 创建数据库
CREATE DATABASE IF NOT EXISTS my_blog CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE my_blog;

-- 创建用户表
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(100) NOT NULL,
    email VARCHAR(100),
    nickname VARCHAR(100),
    avatar VARCHAR(500),
    bio VARCHAR(500),
    is_enabled BOOLEAN DEFAULT TRUE,
    last_login_at DATETIME,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 创建分类表
CREATE TABLE IF NOT EXISTS categories (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(200),
    description VARCHAR(500),
    color VARCHAR(7),
    article_count INT DEFAULT 0,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 创建标签表
CREATE TABLE IF NOT EXISTS tags (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    slug VARCHAR(100),
    color VARCHAR(7),
    article_count INT DEFAULT 0,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 创建文章表
CREATE TABLE IF NOT EXISTS articles (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    summary VARCHAR(500),
    content TEXT,
    slug VARCHAR(100),
    cover_image VARCHAR(500),
    is_published BOOLEAN DEFAULT FALSE,
    is_pinned BOOLEAN DEFAULT FALSE,
    view_count INT DEFAULT 0,
    like_count INT DEFAULT 0,
    comment_count INT DEFAULT 0,
    category_id BIGINT,
    published_at DATETIME,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
);

-- 创建文章标签关联表
CREATE TABLE IF NOT EXISTS article_tags (
    article_id BIGINT NOT NULL,
    tag_id BIGINT NOT NULL,
    PRIMARY KEY (article_id, tag_id),
    FOREIGN KEY (article_id) REFERENCES articles(id) ON DELETE CASCADE,
    FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
);

-- 创建评论表
CREATE TABLE IF NOT EXISTS comments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    article_id BIGINT NOT NULL,
    author VARCHAR(100),
    email VARCHAR(100),
    website VARCHAR(200),
    content TEXT NOT NULL,
    parent_id BIGINT,
    is_approved BOOLEAN DEFAULT FALSE,
    like_count INT DEFAULT 0,
    ip_address VARCHAR(45),
    user_agent VARCHAR(500),
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (article_id) REFERENCES articles(id) ON DELETE CASCADE,
    FOREIGN KEY (parent_id) REFERENCES comments(id) ON DELETE CASCADE
);

-- 创建友链表
CREATE TABLE IF NOT EXISTS friend_links (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    url VARCHAR(500) NOT NULL,
    description VARCHAR(200),
    logo VARCHAR(500),
    is_approved BOOLEAN DEFAULT FALSE,
    sort_order INT DEFAULT 0,
    click_count INT DEFAULT 0,
    email VARCHAR(100),
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 创建留言板表
CREATE TABLE IF NOT EXISTS guestbook_messages (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    author VARCHAR(100),
    email VARCHAR(100),
    website VARCHAR(200),
    content TEXT NOT NULL,
    parent_id BIGINT,
    is_approved BOOLEAN DEFAULT FALSE,
    like_count INT DEFAULT 0,
    ip_address VARCHAR(45),
    user_agent VARCHAR(500),
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (parent_id) REFERENCES guestbook_messages(id) ON DELETE CASCADE
);

-- 创建系统设置表
CREATE TABLE IF NOT EXISTS system_settings (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    setting_key VARCHAR(100) NOT NULL UNIQUE,
    setting_value TEXT,
    description VARCHAR(200),
    setting_type VARCHAR(50) DEFAULT 'string',
    is_public BOOLEAN DEFAULT FALSE,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 插入默认管理员用户
INSERT INTO users (username, password, email, nickname, is_enabled) 
VALUES ('admin', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDi', 'admin@example.com', '管理员', TRUE)
ON DUPLICATE KEY UPDATE username = username;

-- 插入默认系统设置
INSERT INTO system_settings (setting_key, setting_value, description, setting_type, is_public) VALUES
('site_title', '我的个人博客', '网站标题', 'string', TRUE),
('site_description', '这是一个个人博客网站', '网站描述', 'string', TRUE),
('site_keywords', '博客,个人博客,技术博客', '网站关键词', 'string', TRUE),
('site_author', '博主', '网站作者', 'string', TRUE),
('site_email', 'admin@example.com', '联系邮箱', 'string', TRUE),
('posts_per_page', '10', '每页文章数量', 'number', TRUE),
('comment_status', 'open', '评论状态', 'string', TRUE),
('guestbook_status', 'open', '留言板状态', 'string', TRUE)
ON DUPLICATE KEY UPDATE setting_key = setting_key;
