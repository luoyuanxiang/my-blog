import { httpClient } from './client';
import { API_ENDPOINTS } from './config';

// 登录请求类型
export interface LoginRequest {
  username: string;
  password: string;
}

// 登录响应类型
export interface LoginResponse {
  token: string;
  user: {
    id: string;
    username: string;
    email: string;
    nickname: string;
    avatar?: string;
    bio?: string;
  };
  expiresIn: number;
}

// 注册请求类型
export interface RegisterRequest {
  username: string;
  password: string;
  email: string;
  nickname?: string;
}

// 用户信息类型
export interface UserInfo {
  id: string;
  username: string;
  email: string;
  nickname: string;
  avatar?: string;
  bio?: string;
  isEnabled: boolean;
  lastLoginAt?: string;
  createdAt: string;
  updatedAt: string;
}

// 认证 API 服务
export class AuthApiService {
  // 用户登录
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await httpClient.post<LoginResponse>(
      API_ENDPOINTS.AUTH.LOGIN,
      credentials
    );
    
    // 保存 token 到本地存储
    if (response.token) {
      httpClient.setAuthToken(response.token);
    }
    
    return response;
  }

  // 用户注册
  async register(userData: RegisterRequest): Promise<LoginResponse> {
    const response = await httpClient.post<LoginResponse>(
      API_ENDPOINTS.AUTH.REGISTER,
      userData
    );
    
    // 保存 token 到本地存储
    if (response.token) {
      httpClient.setAuthToken(response.token);
    }
    
    return response;
  }

  // 刷新 token
  async refreshToken(): Promise<LoginResponse> {
    const response = await httpClient.post<LoginResponse>(
      API_ENDPOINTS.AUTH.REFRESH
    );
    
    // 更新 token
    if (response.token) {
      httpClient.setAuthToken(response.token);
    }
    
    return response;
  }

  // 用户登出
  async logout(): Promise<void> {
    try {
      await httpClient.post(API_ENDPOINTS.AUTH.LOGOUT);
    } finally {
      // 无论请求是否成功，都清除本地 token
      httpClient.clearAuthToken();
    }
  }

  // 获取当前用户信息
  async getCurrentUser(): Promise<UserInfo> {
    return httpClient.get<UserInfo>(API_ENDPOINTS.USERS.PROFILE);
  }

  // 检查是否已登录
  isAuthenticated(): boolean {
    return !!httpClient.getAuthToken();
  }

  // 获取当前 token
  getToken(): string | null {
    return httpClient.getAuthToken();
  }
}

// 创建认证服务实例
export const authApiService = new AuthApiService();
