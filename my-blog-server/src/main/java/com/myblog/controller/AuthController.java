package com.myblog.controller;

import com.myblog.dto.ApiResponse;
import com.myblog.dto.LoginRequest;
import com.myblog.dto.LoginResponse;
import com.myblog.dto.UserDTO;
import com.myblog.entity.User;
import com.myblog.repository.UserRepository;
import com.myblog.util.JwtUtil;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

/**
 * 认证控制器
 */
@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@Tag(name = "认证管理", description = "用户登录认证相关操作")
public class AuthController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    @PostMapping("/login")
    @Operation(summary = "用户登录", description = "用户登录获取JWT令牌")
    public ApiResponse<LoginResponse> login(@RequestBody LoginRequest loginRequest) {
        User user = userRepository.findByUsername(loginRequest.getUsername())
            .orElseThrow(() -> new RuntimeException("用户名或密码错误"));
        
        if (!passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
            throw new RuntimeException("用户名或密码错误");
        }
        
        if (!user.getIsEnabled()) {
            throw new RuntimeException("账户已被禁用");
        }
        
        // 更新最后登录时间
        user.setLastLoginAt(LocalDateTime.now());
        userRepository.save(user);
        
        // 生成JWT令牌
        String token = jwtUtil.generateToken(user.getUsername());
        
        // 转换用户信息
        UserDTO userDTO = new UserDTO();
        BeanUtils.copyProperties(user, userDTO);
        userDTO.setPassword(null); // 不返回密码
        
        LoginResponse response = new LoginResponse();
        response.setToken(token);
        response.setExpiresIn(jwtUtil.getExpiration());
        response.setUser(userDTO);
        
        return ApiResponse.success("登录成功", response);
    }

    @PostMapping("/logout")
    @Operation(summary = "用户登出", description = "用户登出")
    public ApiResponse<Void> logout() {
        return ApiResponse.success("登出成功", null);
    }
}
