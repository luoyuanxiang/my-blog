import { API_CONFIG, ApiError, HTTP_STATUS } from './config';

// HTTP 客户端类
class HttpClient {
  private baseURL: string;
  private timeout: number;
  private defaultHeaders: Record<string, string>;

  constructor() {
    this.baseURL = API_CONFIG.BASE_URL;
    this.timeout = API_CONFIG.TIMEOUT;
    this.defaultHeaders = { ...API_CONFIG.HEADERS };
  }

  // 获取认证 token
  private getAuthToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('auth_token');
    }
    return null;
  }

  // 设置认证 token
  setAuthToken(token: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', token);
    }
  }

  // 清除认证 token
  clearAuthToken(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
    }
  }

  // 构建请求头
  private buildHeaders(customHeaders?: Record<string, string>): Record<string, string> {
    const headers = { ...this.defaultHeaders, ...customHeaders };
    
    const token = this.getAuthToken();
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    
    return headers;
  }

  // 构建完整 URL
  private buildURL(endpoint: string): string {
    return `${this.baseURL}${endpoint}`;
  }

  // 处理响应
  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      let errorMessage = '请求失败';
      let errorData: any = null;

      try {
        const errorResponse = await response.json();
        errorMessage = errorResponse.message || errorMessage;
        errorData = errorResponse.data;
      } catch {
        // 如果响应不是 JSON 格式，使用默认错误消息
        errorMessage = `HTTP ${response.status}: ${response.statusText}`;
      }

      throw new ApiError(response.status, errorMessage, errorData);
    }

    try {
      const data = await response.json();
      return data;
    } catch {
      throw new ApiError(HTTP_STATUS.INTERNAL_SERVER_ERROR, '响应解析失败');
    }
  }

  // GET 请求
  async get<T>(endpoint: string, params?: Record<string, any>): Promise<T> {
    const url = new URL(this.buildURL(endpoint));
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, String(value));
        }
      });
    }

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: this.buildHeaders(),
      signal: AbortSignal.timeout(this.timeout),
    });

    return this.handleResponse<T>(response);
  }

  // POST 请求
  async post<T>(endpoint: string, data?: any, customHeaders?: Record<string, string>): Promise<T> {
    const response = await fetch(this.buildURL(endpoint), {
      method: 'POST',
      headers: this.buildHeaders(customHeaders),
      body: data ? JSON.stringify(data) : undefined,
      signal: AbortSignal.timeout(this.timeout),
    });

    return this.handleResponse<T>(response);
  }

  // PUT 请求
  async put<T>(endpoint: string, data?: any, customHeaders?: Record<string, string>): Promise<T> {
    const response = await fetch(this.buildURL(endpoint), {
      method: 'PUT',
      headers: this.buildHeaders(customHeaders),
      body: data ? JSON.stringify(data) : undefined,
      signal: AbortSignal.timeout(this.timeout),
    });

    return this.handleResponse<T>(response);
  }

  // PATCH 请求
  async patch<T>(endpoint: string, data?: any, customHeaders?: Record<string, string>): Promise<T> {
    const response = await fetch(this.buildURL(endpoint), {
      method: 'PATCH',
      headers: this.buildHeaders(customHeaders),
      body: data ? JSON.stringify(data) : undefined,
      signal: AbortSignal.timeout(this.timeout),
    });

    return this.handleResponse<T>(response);
  }

  // DELETE 请求
  async delete<T>(endpoint: string): Promise<T> {
    const response = await fetch(this.buildURL(endpoint), {
      method: 'DELETE',
      headers: this.buildHeaders(),
      signal: AbortSignal.timeout(this.timeout),
    });

    return this.handleResponse<T>(response);
  }

  // 文件上传
  async uploadFile<T>(endpoint: string, file: File, additionalData?: Record<string, any>): Promise<T> {
    const formData = new FormData();
    formData.append('file', file);
    
    if (additionalData) {
      Object.entries(additionalData).forEach(([key, value]) => {
        formData.append(key, String(value));
      });
    }

    const response = await fetch(this.buildURL(endpoint), {
      method: 'POST',
      headers: {
        Authorization: this.getAuthToken() ? `Bearer ${this.getAuthToken()}` : '',
      },
      body: formData,
      signal: AbortSignal.timeout(this.timeout * 2), // 文件上传超时时间更长
    });

    return this.handleResponse<T>(response);
  }
}

// 创建全局 HTTP 客户端实例
export const httpClient = new HttpClient();

// 导出类型
export type { ApiError };
