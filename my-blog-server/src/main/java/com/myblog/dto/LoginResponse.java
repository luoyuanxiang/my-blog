package com.myblog.dto;

import lombok.Data;

/**
 * 登录响应数据传输对象
 */
@Data
public class LoginResponse {
    
    private String token;
    private String tokenType = "Bearer";
    private Long expiresIn;
    private UserDTO user;
}
