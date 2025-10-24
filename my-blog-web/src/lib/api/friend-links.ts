import { httpClient } from './client';
import { API_ENDPOINTS } from './config';
import type { FriendLink, PaginationParams } from '@/types';

// 友链创建/更新请求类型
export interface FriendLinkRequest {
  name: string;
  url: string;
  description?: string;
  logo?: string;
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

// 友链 API 服务
export class FriendLinkApiService {
  // 获取友链列表
  async getFriendLinks(params?: PaginationParams): Promise<PageResponse<FriendLink>> {
    const response = await httpClient.get<ApiResponse<PageResponse<FriendLink>>>(
      API_ENDPOINTS.FRIEND_LINKS.LIST,
      params
    );
    return response.data;
  }

  // 获取已审核的友链列表
  async getApprovedFriendLinks(): Promise<FriendLink[]> {
    const response = await httpClient.get<ApiResponse<FriendLink[]>>(
      API_ENDPOINTS.FRIEND_LINKS.LIST,
      { approved: true, size: 1000 }
    );
    return response.data;
  }

  // 获取友链详情
  async getFriendLink(id: string): Promise<FriendLink> {
    const response = await httpClient.get<ApiResponse<FriendLink>>(
      API_ENDPOINTS.FRIEND_LINKS.GET(id)
    );
    return response.data;
  }

  // 创建友链
  async createFriendLink(friendLinkData: FriendLinkRequest): Promise<FriendLink> {
    const response = await httpClient.post<ApiResponse<FriendLink>>(
      API_ENDPOINTS.FRIEND_LINKS.CREATE,
      friendLinkData
    );
    return response.data;
  }

  // 更新友链
  async updateFriendLink(id: string, friendLinkData: Partial<FriendLinkRequest>): Promise<FriendLink> {
    const response = await httpClient.put<ApiResponse<FriendLink>>(
      API_ENDPOINTS.FRIEND_LINKS.UPDATE(id),
      friendLinkData
    );
    return response.data;
  }

  // 删除友链
  async deleteFriendLink(id: string): Promise<void> {
    await httpClient.delete<ApiResponse<void>>(
      API_ENDPOINTS.FRIEND_LINKS.DELETE(id)
    );
  }

  // 审核通过友链
  async approveFriendLink(id: string): Promise<FriendLink> {
    const response = await httpClient.patch<ApiResponse<FriendLink>>(
      API_ENDPOINTS.FRIEND_LINKS.APPROVE(id)
    );
    return response.data;
  }

  // 审核拒绝友链
  async disapproveFriendLink(id: string): Promise<FriendLink> {
    const response = await httpClient.patch<ApiResponse<FriendLink>>(
      API_ENDPOINTS.FRIEND_LINKS.DISAPPROVE(id)
    );
    return response.data;
  }

  // 获取待审核友链
  async getPendingFriendLinks(params?: PaginationParams): Promise<PageResponse<FriendLink>> {
    const response = await httpClient.get<ApiResponse<PageResponse<FriendLink>>>(
      API_ENDPOINTS.FRIEND_LINKS.LIST,
      { ...params, approved: false }
    );
    return response.data;
  }

  // 搜索友链
  async searchFriendLinks(query: string, params?: PaginationParams): Promise<PageResponse<FriendLink>> {
    const searchParams = {
      ...params,
      search: query,
    };
    
    const response = await httpClient.get<ApiResponse<PageResponse<FriendLink>>>(
      API_ENDPOINTS.FRIEND_LINKS.LIST,
      searchParams
    );
    return response.data;
  }

  // 批量审核友链
  async batchApproveFriendLinks(friendLinkIds: string[]): Promise<void> {
    await httpClient.patch<ApiResponse<void>>(
      `${API_ENDPOINTS.FRIEND_LINKS.LIST}/batch-approve`,
      { friendLinkIds }
    );
  }

  // 批量删除友链
  async batchDeleteFriendLinks(friendLinkIds: string[]): Promise<void> {
    await httpClient.patch<ApiResponse<void>>(
      `${API_ENDPOINTS.FRIEND_LINKS.LIST}/batch-delete`,
      { friendLinkIds }
    );
  }

  // 获取友链统计信息
  async getFriendLinkStats(): Promise<{
    total: number;
    approved: number;
    pending: number;
  }> {
    const response = await httpClient.get<ApiResponse<{
      total: number;
      approved: number;
      pending: number;
    }>>(
      `${API_ENDPOINTS.FRIEND_LINKS.LIST}/stats`
    );
    return response.data;
  }

  // 申请友链（公开接口）
  async applyFriendLink(friendLinkData: FriendLinkRequest): Promise<FriendLink> {
    const response = await httpClient.post<ApiResponse<FriendLink>>(
      `${API_ENDPOINTS.FRIEND_LINKS.LIST}/apply`,
      friendLinkData
    );
    return response.data;
  }
}

// 创建友链服务实例
export const friendLinkApiService = new FriendLinkApiService();
