import { httpClient } from './client';
import type { LoginRequest, LoginResponse, ApiResponse } from '@/types';

/**
 * 管理端认证API服务
 * 处理管理员登录、登出等认证相关操作
 */
export class AdminAuthApiService {
  /**
   * 管理员登录
   * @param credentials 登录凭据
   * @returns 登录响应
   */
  async login(credentials: LoginRequest): Promise<ApiResponse<LoginResponse>> {
    return httpClient.post<ApiResponse<LoginResponse>>('/auth/login', credentials);
  }

  /**
   * 管理员登出
   * @returns 登出响应
   */
  async logout(): Promise<ApiResponse<void>> {
    return httpClient.post<ApiResponse<void>>('/auth/logout');
  }

  /**
   * 刷新令牌
   * @returns 新的令牌
   */
  async refreshToken(): Promise<ApiResponse<LoginResponse>> {
    return httpClient.post<ApiResponse<LoginResponse>>('/auth/refresh');
  }

  /**
   * 获取当前管理员信息
   * @returns 管理员信息
   */
  async getCurrentUser(): Promise<ApiResponse<LoginResponse>> {
    return httpClient.get<ApiResponse<LoginResponse>>('/auth/me');
  }

  /**
   * 验证令牌是否有效
   * @param token JWT令牌
   * @returns 验证结果
   */
  async validateToken(token: string): Promise<ApiResponse<boolean>> {
    return httpClient.post<ApiResponse<boolean>>('/auth/validate', { token });
  }
}

// 导出服务实例
export const adminAuthApiService = new AdminAuthApiService();
