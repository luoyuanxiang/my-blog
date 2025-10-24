package com.myblog.dto;

import lombok.Data;
import java.time.LocalDateTime;

/**
 * 用户数据传输对象
 */
@Data
public class UserDTO {
    
    private Long id;
    private String username;
    private String password;
    private String email;
    private String nickname;
    private String avatar;
    private String bio;
    private Boolean isEnabled;
    private LocalDateTime lastLoginAt;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
