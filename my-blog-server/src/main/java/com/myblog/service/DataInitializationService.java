package com.myblog.service;

import com.myblog.entity.*;
import com.myblog.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

/**
 * 数据初始化服务
 * 在应用启动时检查并初始化基础数据
 * 
 * @author MyBlog Team
 * @version 1.0
 * @since 2024-01-01
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class DataInitializationService implements CommandLineRunner {

    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    private final TagRepository tagRepository;
    private final ArticleRepository articleRepository;
    private final SystemSettingRepository systemSettingRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        log.info("开始检查数据初始化...");

        initializeData();
    }

    /**
     * 初始化基础数据
     */
    private void initializeData() {
        if (systemSettingRepository.count() == 0) {
            // 1. 初始化系统设置
            initializeSystemSettings();
        }

        if (userRepository.count() == 0) {
            // 2. 初始化用户
            initializeUsers();
        }

        if (categoryRepository.count() == 0) {
            // 3. 初始化分类
            initializeCategories();
        }

        if (tagRepository.count() == 0) {
            // 4. 初始化标签
            initializeTags();
        }

        if (articleRepository.count() == 0) {
            // 5. 初始化文章
            initializeArticles();
        }
    }

    /**
     * 初始化系统设置
     */
    private void initializeSystemSettings() {
        log.info("初始化系统设置...");
        
        List<SystemSetting> settings = Arrays.asList(
            createSystemSetting("site.title", "我的个人博客", "网站标题", "string", true),
            createSystemSetting("site.description", "分享技术文章，记录学习心得", "网站描述", "string", true),
            createSystemSetting("site.keywords", "博客,技术,编程,学习", "网站关键词", "string", true),
            createSystemSetting("site.author", "博主", "网站作者", "string", true),
            createSystemSetting("site.email", "admin@example.com", "联系邮箱", "string", true),
            createSystemSetting("site.github", "https://github.com/username", "GitHub链接", "string", true),
            createSystemSetting("site.twitter", "https://twitter.com/username", "Twitter链接", "string", true),
            createSystemSetting("comment.enabled", "true", "是否启用评论", "boolean", true),
            createSystemSetting("comment.auto_approve", "false", "评论是否自动审核", "boolean", false),
            createSystemSetting("guestbook.enabled", "true", "是否启用留言板", "boolean", true),
            createSystemSetting("guestbook.auto_approve", "false", "留言是否自动审核", "boolean", false),
            createSystemSetting("friendlink.enabled", "true", "是否启用友情链接", "boolean", true),
            createSystemSetting("friendlink.auto_approve", "false", "友链是否自动审核", "boolean", false)
        );
        
        systemSettingRepository.saveAll(settings);
        log.info("系统设置初始化完成，共 {} 条记录", settings.size());
    }

    /**
     * 初始化用户数据
     */
    private void initializeUsers() {
        log.info("初始化用户数据...");
        
        User admin = new User();
        admin.setUsername("admin");
        admin.setPassword(passwordEncoder.encode("admin123"));
        admin.setEmail("admin@example.com");
        admin.setNickname("管理员");
        admin.setBio("系统管理员");
        admin.setIsEnabled(true);
        admin.setLastLoginAt(LocalDateTime.now());
        
        userRepository.save(admin);
        log.info("用户数据初始化完成，创建管理员用户: {}", admin.getUsername());
    }

    /**
     * 初始化分类数据
     */
    private void initializeCategories() {
        log.info("初始化分类数据...");
        
        List<Category> categories = Arrays.asList(
            createCategory("前端开发", "frontend", "前端技术相关文章", "#3B82F6", 0),
            createCategory("后端开发", "backend", "后端技术相关文章", "#10B981", 0),
            createCategory("数据库", "database", "数据库相关文章", "#F59E0B", 0),
            createCategory("DevOps", "devops", "DevOps相关文章", "#EF4444", 0),
            createCategory("编程语言", "programming", "编程语言相关文章", "#8B5CF6", 0),
            createCategory("工具与框架", "tools", "开发工具和框架", "#06B6D4", 0),
            createCategory("算法与数据结构", "algorithms", "算法和数据结构", "#84CC16", 0),
            createCategory("生活随笔", "life", "生活感悟和随笔", "#F97316", 0)
        );
        
        categoryRepository.saveAll(categories);
        log.info("分类数据初始化完成，共 {} 个分类", categories.size());
    }

    /**
     * 初始化标签数据
     */
    private void initializeTags() {
        log.info("初始化标签数据...");
        
        List<Tag> tags = Arrays.asList(
            createTag("React", "react", "#61DAFB", 0),
            createTag("Vue.js", "vue", "#4FC08D", 0),
            createTag("Angular", "angular", "#DD0031", 0),
            createTag("Next.js", "nextjs", "#000000", 0),
            createTag("Nuxt.js", "nuxtjs", "#00DC82", 0),
            createTag("JavaScript", "javascript", "#F7DF1E", 0),
            createTag("TypeScript", "typescript", "#3178C6", 0),
            createTag("Node.js", "nodejs", "#339933", 0),
            createTag("Express", "express", "#000000", 0),
            createTag("Koa", "koa", "#33333D", 0),
            createTag("Java", "java", "#ED8B00", 0),
            createTag("Spring Boot", "springboot", "#6DB33F", 0),
            createTag("Spring Cloud", "springcloud", "#6DB33F", 0),
            createTag("MySQL", "mysql", "#4479A1", 0),
            createTag("PostgreSQL", "postgresql", "#336791", 0),
            createTag("MongoDB", "mongodb", "#47A248", 0),
            createTag("Redis", "redis", "#DC382D", 0),
            createTag("Docker", "docker", "#2496ED", 0),
            createTag("Kubernetes", "kubernetes", "#326CE5", 0),
            createTag("AWS", "aws", "#FF9900", 0),
            createTag("阿里云", "aliyun", "#FF6A00", 0),
            createTag("CSS", "css", "#1572B6", 0),
            createTag("HTML", "html", "#E34F26", 0),
            createTag("Sass", "sass", "#CF649A", 0),
            createTag("Less", "less", "#1D365D", 0),
            createTag("Webpack", "webpack", "#8DD6F9", 0),
            createTag("Vite", "vite", "#646CFF", 0),
            createTag("Git", "git", "#F05032", 0),
            createTag("Linux", "linux", "#FCC624", 0),
            createTag("MacOS", "macos", "#000000", 0),
            createTag("Windows", "windows", "#0078D4", 0)
        );
        
        tagRepository.saveAll(tags);
        log.info("标签数据初始化完成，共 {} 个标签", tags.size());
    }

    /**
     * 初始化文章数据
     */
    private void initializeArticles() {
        log.info("初始化文章数据...");
        
        // 获取分类和标签
        Category frontendCategory = categoryRepository.findBySlug("frontend").orElse(null);
        Category backendCategory = categoryRepository.findBySlug("backend").orElse(null);
        Category programmingCategory = categoryRepository.findBySlug("programming").orElse(null);
        
        Tag reactTag = tagRepository.findBySlug("react").orElse(null);
        Tag nextjsTag = tagRepository.findBySlug("nextjs").orElse(null);
        Tag javascriptTag = tagRepository.findBySlug("javascript").orElse(null);
        Tag typescriptTag = tagRepository.findBySlug("typescript").orElse(null);
        Tag springbootTag = tagRepository.findBySlug("springboot").orElse(null);
        Tag javaTag = tagRepository.findBySlug("java").orElse(null);
        
        List<Article> articles = Arrays.asList(
            createArticle(
                "欢迎来到我的个人博客",
                "welcome-to-my-blog",
                "欢迎来到我的个人博客！这里是我分享技术文章、记录学习心得的地方。",
                "# 欢迎来到我的个人博客\n\n欢迎来到我的个人博客！这里是我分享技术文章、记录学习心得的地方。\n\n## 关于我\n\n我是一名全栈开发工程师，热爱技术分享，专注于前端开发和用户体验设计。\n\n## 技术栈\n\n- **前端**: React, Next.js, TypeScript, Tailwind CSS\n- **后端**: Spring Boot, Node.js, Express\n- **数据库**: MySQL, MongoDB, Redis\n- **DevOps**: Docker, Kubernetes, AWS\n\n## 联系方式\n\n- 邮箱: admin@example.com\n- GitHub: https://github.com/username\n- Twitter: https://twitter.com/username\n\n感谢您的访问！",
                "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=400&fit=crop",
                frontendCategory,
                Arrays.asList(nextjsTag, javascriptTag),
                true,
                true
            ),
            createArticle(
                "Next.js 14 新特性详解",
                "nextjs-14-features",
                "Next.js 14 带来了许多令人兴奋的新特性，包括改进的 App Router、更好的性能优化和增强的开发体验。",
                "# Next.js 14 新特性详解\n\nNext.js 14 是一个重要的版本更新，带来了许多令人兴奋的新特性。\n\n## 主要新特性\n\n### 1. 改进的 App Router\n\nApp Router 在 Next.js 14 中得到了显著改进，提供了更好的性能和开发体验。\n\n### 2. 性能优化\n\n- 更快的构建速度\n- 更小的包体积\n- 更好的缓存策略\n\n### 3. 开发体验提升\n\n- 更好的错误提示\n- 更快的热重载\n- 改进的调试工具\n\n## 总结\n\nNext.js 14 是一个值得升级的版本，为开发者提供了更好的开发体验和性能。",
                "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800&h=400&fit=crop",
                frontendCategory,
                Arrays.asList(nextjsTag, typescriptTag),
                true,
                false
            ),
            createArticle(
                "Spring Boot 3 新特性介绍",
                "spring-boot-3-features",
                "Spring Boot 3 基于 Spring Framework 6 和 Java 17+，带来了许多新特性和改进。",
                "# Spring Boot 3 新特性介绍\n\nSpring Boot 3 是一个重要的版本更新，基于 Spring Framework 6 和 Java 17+。\n\n## 主要新特性\n\n### 1. 基于 Java 17+\n\nSpring Boot 3 要求 Java 17 或更高版本，充分利用了现代 Java 的特性。\n\n### 2. 原生镜像支持\n\n- GraalVM 原生镜像支持\n- 更快的启动时间\n- 更小的内存占用\n\n### 3. 改进的配置属性\n\n- 更好的类型安全\n- 改进的验证\n- 更好的文档\n\n## 总结\n\nSpring Boot 3 为现代 Java 应用开发提供了更好的支持。",
                "https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800&h=400&fit=crop",
                backendCategory,
                Arrays.asList(springbootTag, javaTag),
                true,
                false
            )
        );
        
        articleRepository.saveAll(articles);
        log.info("文章数据初始化完成，共 {} 篇文章", articles.size());
    }

    /**
     * 创建系统设置
     */
    private SystemSetting createSystemSetting(String key, String value, String description, String type, boolean isPublic) {
        SystemSetting setting = new SystemSetting();
        setting.setKey(key);
        setting.setValue(value);
        setting.setDescription(description);
        setting.setSettingType(type);
        setting.setIsPublic(isPublic);
        return setting;
    }

    /**
     * 创建分类
     */
    private Category createCategory(String name, String slug, String description, String color, int articleCount) {
        Category category = new Category();
        category.setName(name);
        category.setSlug(slug);
        category.setDescription(description);
        category.setColor(color);
        category.setArticleCount(articleCount);
        return category;
    }

    /**
     * 创建标签
     */
    private Tag createTag(String name, String slug, String color, int articleCount) {
        Tag tag = new Tag();
        tag.setName(name);
        tag.setSlug(slug);
        tag.setColor(color);
        tag.setArticleCount(articleCount);
        return tag;
    }

    /**
     * 创建文章
     */
    private Article createArticle(String title, String slug, String summary, String content, 
                                String coverImage, Category category, List<Tag> tags, 
                                boolean isPublished, boolean isPinned) {
        Article article = new Article();
        article.setTitle(title);
        article.setSlug(slug);
        article.setSummary(summary);
        article.setContent(content);
        article.setCoverImage(coverImage);
        article.setCategory(category);
        article.setTags(tags);
        article.setIsPublished(isPublished);
        article.setIsPinned(isPinned);
        article.setViewCount(0);
        article.setLikeCount(0);
        article.setCommentCount(0);
        article.setPublishedAt(isPublished ? LocalDateTime.now() : null);
        return article;
    }
}
