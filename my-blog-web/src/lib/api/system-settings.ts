import { httpClient } from './client';
import { API_ENDPOINTS } from './config';

// 系统设置类型
export interface SystemSetting {
  id: string;
  key: string;
  value: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

// 系统设置创建/更新请求类型
export interface SystemSettingRequest {
  key: string;
  value: string;
  description?: string;
}

// API 响应类型
export interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

// 分页响应类型
export interface PageResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
}

// 系统设置 API 服务
export class SystemSettingApiService {
  // 获取系统设置列表
  async getSettings(params?: { page?: number; size?: number }): Promise<PageResponse<SystemSetting>> {
    const response = await httpClient.get<ApiResponse<PageResponse<SystemSetting>>>(
      API_ENDPOINTS.SYSTEM_SETTINGS.LIST,
      params
    );
    return response.data;
  }

  // 获取所有系统设置
  async getAllSettings(): Promise<SystemSetting[]> {
    const response = await httpClient.get<ApiResponse<SystemSetting[]>>(
      API_ENDPOINTS.SYSTEM_SETTINGS.LIST,
      { size: 1000 }
    );
    return response.data;
  }

  // 根据 key 获取系统设置
  async getSetting(key: string): Promise<SystemSetting> {
    const response = await httpClient.get<ApiResponse<SystemSetting>>(
      API_ENDPOINTS.SYSTEM_SETTINGS.GET(key)
    );
    return response.data;
  }

  // 创建系统设置
  async createSetting(settingData: SystemSettingRequest): Promise<SystemSetting> {
    const response = await httpClient.post<ApiResponse<SystemSetting>>(
      API_ENDPOINTS.SYSTEM_SETTINGS.CREATE,
      settingData
    );
    return response.data;
  }

  // 更新系统设置
  async updateSetting(key: string, settingData: Partial<SystemSettingRequest>): Promise<SystemSetting> {
    const response = await httpClient.put<ApiResponse<SystemSetting>>(
      API_ENDPOINTS.SYSTEM_SETTINGS.UPDATE(key),
      settingData
    );
    return response.data;
  }

  // 删除系统设置
  async deleteSetting(key: string): Promise<void> {
    await httpClient.delete<ApiResponse<void>>(
      API_ENDPOINTS.SYSTEM_SETTINGS.DELETE(key)
    );
  }

  // 批量更新系统设置
  async batchUpdateSettings(settings: SystemSettingRequest[]): Promise<SystemSetting[]> {
    const response = await httpClient.patch<ApiResponse<SystemSetting[]>>(
      `${API_ENDPOINTS.SYSTEM_SETTINGS.LIST}/batch-update`,
      { settings }
    );
    return response.data;
  }

  // 获取网站基本信息
  async getSiteInfo(): Promise<{
    siteName: string;
    siteDescription: string;
    siteKeywords: string;
    siteLogo: string;
    siteFavicon: string;
    siteUrl: string;
  }> {
    const settings = await this.getAllSettings();
    const settingsMap = settings.reduce((acc, setting) => {
      acc[setting.key] = setting.value;
      return acc;
    }, {} as Record<string, string>);

    return {
      siteName: settingsMap['site.name'] || '我的博客',
      siteDescription: settingsMap['site.description'] || '一个优雅的个人博客',
      siteKeywords: settingsMap['site.keywords'] || '博客,个人博客,技术博客',
      siteLogo: settingsMap['site.logo'] || '',
      siteFavicon: settingsMap['site.favicon'] || '',
      siteUrl: settingsMap['site.url'] || '',
    };
  }

  // 获取社交媒体链接
  async getSocialLinks(): Promise<{
    github?: string;
    twitter?: string;
    weibo?: string;
    zhihu?: string;
    email?: string;
  }> {
    const settings = await this.getAllSettings();
    const settingsMap = settings.reduce((acc, setting) => {
      acc[setting.key] = setting.value;
      return acc;
    }, {} as Record<string, string>);

    return {
      github: settingsMap['social.github'],
      twitter: settingsMap['social.twitter'],
      weibo: settingsMap['social.weibo'],
      zhihu: settingsMap['social.zhihu'],
      email: settingsMap['social.email'],
    };
  }

  // 获取主题设置
  async getThemeSettings(): Promise<{
    primaryColor: string;
    secondaryColor: string;
    backgroundColor: string;
    textColor: string;
    fontFamily: string;
  }> {
    const settings = await this.getAllSettings();
    const settingsMap = settings.reduce((acc, setting) => {
      acc[setting.key] = setting.value;
      return acc;
    }, {} as Record<string, string>);

    return {
      primaryColor: settingsMap['theme.primary'] || '#3b82f6',
      secondaryColor: settingsMap['theme.secondary'] || '#64748b',
      backgroundColor: settingsMap['theme.background'] || '#ffffff',
      textColor: settingsMap['theme.text'] || '#1f2937',
      fontFamily: settingsMap['theme.font'] || 'Inter, sans-serif',
    };
  }

  // 获取 SEO 设置
  async getSeoSettings(): Promise<{
    metaTitle: string;
    metaDescription: string;
    metaKeywords: string;
    ogImage: string;
    twitterCard: string;
  }> {
    const settings = await this.getAllSettings();
    const settingsMap = settings.reduce((acc, setting) => {
      acc[setting.key] = setting.value;
      return acc;
    }, {} as Record<string, string>);

    return {
      metaTitle: settingsMap['seo.title'] || '我的博客',
      metaDescription: settingsMap['seo.description'] || '一个优雅的个人博客',
      metaKeywords: settingsMap['seo.keywords'] || '博客,个人博客,技术博客',
      ogImage: settingsMap['seo.og_image'] || '',
      twitterCard: settingsMap['seo.twitter_card'] || 'summary',
    };
  }
}

// 创建系统设置服务实例
export const systemSettingApiService = new SystemSettingApiService();
