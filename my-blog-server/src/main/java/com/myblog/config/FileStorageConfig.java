package com.myblog.config;

import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Configuration;
import org.springframework.lang.NonNull;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.io.File;

/**
 * 文件存储配置
 */
@Configuration
@Slf4j
public class FileStorageConfig implements WebMvcConfigurer {

    /**
     * 配置静态资源访问
     */
    @Override
    public void addResourceHandlers(@NonNull ResourceHandlerRegistry registry) {
        // 创建上传目录
        String uploadPath = "./uploads/images/";
        File uploadDir = new File(uploadPath);
        if (!uploadDir.exists()) {
            boolean created = uploadDir.mkdirs();
            if (created) {
                log.info("创建上传目录: {}", uploadPath);
            } else {
                log.warn("创建上传目录失败: {}", uploadPath);
            }
        }

        // 配置静态资源访问路径
        registry.addResourceHandler("/api/images/**")
                .addResourceLocations("file:" + uploadPath)
                .setCachePeriod(3600); // 缓存1小时

        log.info("配置图片静态资源访问: /api/images/** -> {}", uploadPath);
    }
}
