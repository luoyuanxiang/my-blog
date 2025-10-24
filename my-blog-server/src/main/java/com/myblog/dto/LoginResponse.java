package com.myblog.dto;

import lombok.Data;

/**
 * 登录响应数据传输对象
 * 用于返回用户登录成功后的认证信息
 * 
 * @author MyBlog Team
 * @version 1.0
 * @since 2024-01-01
 */
@Data
public class LoginResponse {
    
    /** JWT访问令牌 */
    private String token;
    
    /** 令牌类型，默认为Bearer */
    private String tokenType = "Bearer";
    
    /** 令牌过期时间（秒） */
    private Long expiresIn;
    
    /** 用户基本信息 */
    private UserDTO user;
}
