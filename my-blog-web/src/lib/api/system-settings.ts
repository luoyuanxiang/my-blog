import { HttpClient } from './client';
import { ApiResponse, SystemSetting } from '@/types';

/**
 * 系统设置API服务
 * 提供系统设置相关的API调用方法
 */
class SystemSettingApiService {
  private httpClient = new HttpClient();

  /**
   * 创建系统设置
   * @param setting 系统设置数据
   * @returns 创建结果
   */
  async createSetting(setting: Omit<SystemSetting, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<SystemSetting>> {
    return this.httpClient.post<ApiResponse<SystemSetting>>('/system-settings', setting);
  }

  /**
   * 更新系统设置
   * @param id 设置ID
   * @param setting 系统设置数据
   * @returns 更新结果
   */
  async updateSetting(id: number, setting: Partial<SystemSetting>): Promise<ApiResponse<SystemSetting>> {
    return this.httpClient.put<ApiResponse<SystemSetting>>(`/system-settings/${id}`, setting);
  }

  /**
   * 删除系统设置
   * @param id 设置ID
   * @returns 删除结果
   */
  async deleteSetting(id: number): Promise<ApiResponse<void>> {
    return this.httpClient.delete<ApiResponse<void>>(`/system-settings/${id}`);
  }

  /**
   * 根据ID获取系统设置
   * @param id 设置ID
   * @returns 系统设置详情
   */
  async getSettingById(id: number): Promise<ApiResponse<SystemSetting>> {
    return this.httpClient.get<ApiResponse<SystemSetting>>(`/system-settings/${id}`);
  }

  /**
   * 根据key获取系统设置
   * @param key 设置键名
   * @returns 系统设置详情
   */
  async getSettingByKey(key: string): Promise<ApiResponse<SystemSetting>> {
    return this.httpClient.get<ApiResponse<SystemSetting>>(`/system-settings/key/${key}`);
  }

  /**
   * 获取所有系统设置
   * @returns 所有系统设置列表
   */
  async getAllSettings(): Promise<ApiResponse<SystemSetting[]>> {
    return this.httpClient.get<ApiResponse<SystemSetting[]>>('/system-settings');
  }

  /**
   * 获取公开的系统设置
   * @returns 公开的系统设置列表
   */
  async getPublicSettings(): Promise<ApiResponse<SystemSetting[]>> {
    return this.httpClient.get<ApiResponse<SystemSetting[]>>('/system-settings/public');
  }

  /**
   * 根据类型获取系统设置
   * @param settingType 设置类型
   * @returns 指定类型的系统设置列表
   */
  async getSettingsByType(settingType: string): Promise<ApiResponse<SystemSetting[]>> {
    return this.httpClient.get<ApiResponse<SystemSetting[]>>(`/system-settings/type/${settingType}`);
  }

  /**
   * 批量更新系统设置
   * @param settings 系统设置列表
   * @returns 批量更新结果
   */
  async updateSettings(settings: SystemSetting[]): Promise<ApiResponse<void>> {
    return this.httpClient.put<ApiResponse<void>>('/system-settings/batch', settings);
  }
}

export const systemSettingApiService = new SystemSettingApiService();