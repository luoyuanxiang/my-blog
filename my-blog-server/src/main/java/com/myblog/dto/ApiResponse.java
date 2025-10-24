package com.myblog.dto;

import lombok.Data;

/**
 * 统一API响应格式
 * 用于标准化所有API接口的响应数据结构
 * 
 * @param <T> 响应数据的泛型类型
 * @author MyBlog Team
 * @version 1.0
 * @since 2024-01-01
 */
@Data
public class ApiResponse<T> {
    
    /** HTTP状态码 */
    private Integer code;
    
    /** 响应消息 */
    private String message;
    
    /** 响应数据 */
    private T data;
    
    /** 响应时间戳 */
    private Long timestamp;

    /** 默认构造函数，自动设置时间戳 */
    public ApiResponse() {
        this.timestamp = System.currentTimeMillis();
    }

    /**
     * 创建成功响应
     * @param data 响应数据
     * @return 成功响应对象
     */
    public static <T> ApiResponse<T> success(T data) {
        ApiResponse<T> response = new ApiResponse<>();
        response.setCode(200);
        response.setMessage("操作成功");
        response.setData(data);
        return response;
    }

    /**
     * 创建带自定义消息的成功响应
     * @param message 自定义消息
     * @param data 响应数据
     * @return 成功响应对象
     */
    public static <T> ApiResponse<T> success(String message, T data) {
        ApiResponse<T> response = new ApiResponse<>();
        response.setCode(200);
        response.setMessage(message);
        response.setData(data);
        return response;
    }

    /**
     * 创建错误响应
     * @param message 错误消息
     * @return 错误响应对象
     */
    public static <T> ApiResponse<T> error(String message) {
        ApiResponse<T> response = new ApiResponse<>();
        response.setCode(500);
        response.setMessage(message);
        return response;
    }

    /**
     * 创建带自定义状态码的错误响应
     * @param code 状态码
     * @param message 错误消息
     * @return 错误响应对象
     */
    public static <T> ApiResponse<T> error(Integer code, String message) {
        ApiResponse<T> response = new ApiResponse<>();
        response.setCode(code);
        response.setMessage(message);
        return response;
    }

    /**
     * 创建带自定义状态码和数据的错误响应
     * @param code 状态码
     * @param message 错误消息
     * @param data 错误数据
     * @return 错误响应对象
     */
    public static <T> ApiResponse<T> error(Integer code, String message, T data) {
        ApiResponse<T> response = new ApiResponse<>();
        response.setCode(code);
        response.setMessage(message);
        response.setData(data);
        return response;
    }
}
