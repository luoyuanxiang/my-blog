package com.myblog.dto;

import lombok.Data;
import java.time.LocalDateTime;

/**
 * 用户数据传输对象
 * 用于在API接口中传输用户数据，避免直接暴露实体类
 * 
 * @author MyBlog Team
 * @version 1.0
 * @since 2024-01-01
 */
@Data
public class UserDTO {
    
    /** 用户唯一标识符 */
    private Long id;
    
    /** 用户名 */
    private String username;
    
    /** 用户密码（加密后） */
    private String password;
    
    /** 用户邮箱 */
    private String email;
    
    /** 用户昵称 */
    private String nickname;
    
    /** 用户头像图片URL */
    private String avatar;
    
    /** 用户个人简介 */
    private String bio;
    
    /** 用户是否启用 */
    private Boolean isEnabled;
    
    /** 用户最后登录时间 */
    private LocalDateTime lastLoginAt;
    
    /** 用户创建时间 */
    private LocalDateTime createdAt;
    
    /** 用户最后更新时间 */
    private LocalDateTime updatedAt;
}
