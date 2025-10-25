import { httpClient } from './client';
import type { ApiResponse, FriendLink } from '@/types';

/**
 * 友链API服务
 * 处理友链的增删改查操作
 */
class FriendLinkApiService {
  /**
   * 获取友链列表（分页）
   * @param page 页码
   * @param size 每页大小
   * @param sortBy 排序字段
   * @param sortDir 排序方向
   * @returns 分页友链列表
   */
  async getFriendLinks(
    page: number = 0,
    size: number = 10,
    sortBy: string = 'createdAt',
    sortDir: string = 'desc'
  ): Promise<ApiResponse<any>> {
    return httpClient.get<ApiResponse<any>>(
      `/friend-links?page=${page}&size=${size}&sortBy=${sortBy}&sortDir=${sortDir}`
    );
  }

  /**
   * 获取所有友链
   * @returns 所有友链列表
   */
  async getAllFriendLinks(): Promise<ApiResponse<FriendLink[]>> {
    // 使用分页接口获取所有友链，设置较大的size来获取所有数据
    return httpClient.get<ApiResponse<FriendLink[]>>('/friend-links?page=0&size=1000');
  }

  /**
   * 根据ID获取友链
   * @param id 友链ID
   * @returns 友链详情
   */
  async getFriendLinkById(id: string): Promise<ApiResponse<FriendLink>> {
    return httpClient.get<ApiResponse<FriendLink>>(`/friend-links/${id}`);
  }

  /**
   * 创建友链
   * @param friendLinkData 友链数据
   * @returns 创建的友链
   */
  async createFriendLink(friendLinkData: Omit<FriendLink, 'id' | 'createdAt'>): Promise<ApiResponse<FriendLink>> {
    return httpClient.post<ApiResponse<FriendLink>>('/friend-links', friendLinkData);
  }

  /**
   * 更新友链
   * @param id 友链ID
   * @param friendLinkData 友链数据
   * @returns 更新后的友链
   */
  async updateFriendLink(id: string, friendLinkData: Partial<FriendLink>): Promise<ApiResponse<FriendLink>> {
    return httpClient.put<ApiResponse<FriendLink>>(`/friend-links/${id}`, friendLinkData);
  }

  /**
   * 删除友链
   * @param id 友链ID
   * @returns 删除结果
   */
  async deleteFriendLink(id: string): Promise<ApiResponse<void>> {
    return httpClient.delete<ApiResponse<void>>(`/friend-links/${id}`);
  }

  /**
   * 获取已审核的友链
   * @returns 已审核的友链列表
   */
  async getApprovedFriendLinks(): Promise<ApiResponse<FriendLink[]>> {
    return httpClient.get<ApiResponse<FriendLink[]>>('/friend-links/approved');
  }

  /**
   * 获取待审核的友链
   * @param page 页码
   * @param size 每页大小
   * @returns 待审核的友链列表
   */
  async getPendingFriendLinks(page: number = 0, size: number = 10): Promise<ApiResponse<any>> {
    return httpClient.get<ApiResponse<any>>(`/friend-links/pending?page=${page}&size=${size}`);
  }

  /**
   * 审核通过友链
   * @param id 友链ID
   * @returns 审核结果
   */
  async approveFriendLink(id: string): Promise<ApiResponse<FriendLink>> {
    return httpClient.post<ApiResponse<FriendLink>>(`/friend-links/${id}/approve`);
  }

  /**
   * 拒绝友链
   * @param id 友链ID
   * @returns 拒绝结果
   */
  async rejectFriendLink(id: string): Promise<ApiResponse<FriendLink>> {
    return httpClient.post<ApiResponse<FriendLink>>(`/friend-links/${id}/reject`);
  }

  /**
   * 增加点击量
   * @param id 友链ID
   * @returns 操作结果
   */
  async incrementClickCount(id: string): Promise<ApiResponse<void>> {
    return httpClient.post<ApiResponse<void>>(`/friend-links/${id}/click`);
  }
}

// 导出服务实例
export const friendLinkApiService = new FriendLinkApiService();