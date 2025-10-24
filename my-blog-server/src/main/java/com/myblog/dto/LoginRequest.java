package com.myblog.dto;

import lombok.Data;
import jakarta.validation.constraints.NotBlank;

/**
 * 登录请求数据传输对象
 */
@Data
public class LoginRequest {
    
    @NotBlank(message = "用户名不能为空")
    private String username;
    
    @NotBlank(message = "密码不能为空")
    private String password;
}
