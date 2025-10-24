package com.myblog;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

/**
 * 个人博客后端服务主启动类
 */
@SpringBootApplication
@EnableJpaAuditing
public class MyBlogServerApplication {

    public static void main(String[] args) {
        SpringApplication.run(MyBlogServerApplication.class, args);
    }
}
