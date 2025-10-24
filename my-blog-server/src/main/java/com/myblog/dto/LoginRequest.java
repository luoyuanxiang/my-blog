package com.myblog.dto;

import lombok.Data;
import jakarta.validation.constraints.NotBlank;

/**
 * 登录请求数据传输对象
 * 用于接收用户登录请求的参数
 * 
 * @author MyBlog Team
 * @version 1.0
 * @since 2024-01-01
 */
@Data
public class LoginRequest {
    
    /** 用户名，必填字段 */
    @NotBlank(message = "用户名不能为空")
    private String username;
    
    /** 用户密码，必填字段 */
    @NotBlank(message = "密码不能为空")
    private String password;
}
