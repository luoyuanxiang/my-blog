import { httpClient } from './client';
import { API_ENDPOINTS } from './config';
import type { GuestbookMessage, PaginationParams } from '@/types';

// 留言创建请求类型
export interface GuestbookMessageRequest {
  author: string;
  email: string;
  content: string;
  website?: string;
  parentId?: string;
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

// 留言板 API 服务
export class GuestbookApiService {
  // 获取留言列表
  async getMessages(params?: PaginationParams): Promise<PageResponse<GuestbookMessage>> {
    const response = await httpClient.get<ApiResponse<PageResponse<GuestbookMessage>>>(
      API_ENDPOINTS.GUESTBOOK.LIST,
      params
    );
    return response.data;
  }

  // 获取已审核的留言列表
  async getApprovedMessages(params?: PaginationParams): Promise<PageResponse<GuestbookMessage>> {
    const response = await httpClient.get<ApiResponse<PageResponse<GuestbookMessage>>>(
      API_ENDPOINTS.GUESTBOOK.LIST,
      { ...params, approved: true }
    );
    return response.data;
  }

  // 获取留言详情
  async getMessage(id: string): Promise<GuestbookMessage> {
    const response = await httpClient.get<ApiResponse<GuestbookMessage>>(
      API_ENDPOINTS.GUESTBOOK.GET(id)
    );
    return response.data;
  }

  // 创建留言
  async createMessage(messageData: GuestbookMessageRequest): Promise<GuestbookMessage> {
    const response = await httpClient.post<ApiResponse<GuestbookMessage>>(
      API_ENDPOINTS.GUESTBOOK.CREATE,
      messageData
    );
    return response.data;
  }

  // 更新留言
  async updateMessage(id: string, messageData: Partial<GuestbookMessageRequest>): Promise<GuestbookMessage> {
    const response = await httpClient.put<ApiResponse<GuestbookMessage>>(
      API_ENDPOINTS.GUESTBOOK.UPDATE(id),
      messageData
    );
    return response.data;
  }

  // 删除留言
  async deleteMessage(id: string): Promise<void> {
    await httpClient.delete<ApiResponse<void>>(
      API_ENDPOINTS.GUESTBOOK.DELETE(id)
    );
  }

  // 审核通过留言
  async approveMessage(id: string): Promise<GuestbookMessage> {
    const response = await httpClient.patch<ApiResponse<GuestbookMessage>>(
      API_ENDPOINTS.GUESTBOOK.APPROVE(id)
    );
    return response.data;
  }

  // 审核拒绝留言
  async disapproveMessage(id: string): Promise<GuestbookMessage> {
    const response = await httpClient.patch<ApiResponse<GuestbookMessage>>(
      API_ENDPOINTS.GUESTBOOK.DISAPPROVE(id)
    );
    return response.data;
  }

  // 点赞留言
  async likeMessage(id: string): Promise<GuestbookMessage> {
    const response = await httpClient.patch<ApiResponse<GuestbookMessage>>(
      `${API_ENDPOINTS.GUESTBOOK.GET(id)}/like`
    );
    return response.data;
  }

  // 取消点赞留言
  async unlikeMessage(id: string): Promise<GuestbookMessage> {
    const response = await httpClient.patch<ApiResponse<GuestbookMessage>>(
      `${API_ENDPOINTS.GUESTBOOK.GET(id)}/unlike`
    );
    return response.data;
  }

  // 获取待审核留言
  async getPendingMessages(params?: PaginationParams): Promise<PageResponse<GuestbookMessage>> {
    const response = await httpClient.get<ApiResponse<PageResponse<GuestbookMessage>>>(
      API_ENDPOINTS.GUESTBOOK.LIST,
      { ...params, approved: false }
    );
    return response.data;
  }

  // 获取留言回复
  async getMessageReplies(parentId: string, params?: PaginationParams): Promise<PageResponse<GuestbookMessage>> {
    const response = await httpClient.get<ApiResponse<PageResponse<GuestbookMessage>>>(
      API_ENDPOINTS.GUESTBOOK.LIST,
      { ...params, parentId }
    );
    return response.data;
  }

  // 搜索留言
  async searchMessages(query: string, params?: PaginationParams): Promise<PageResponse<GuestbookMessage>> {
    const searchParams = {
      ...params,
      search: query,
    };
    
    const response = await httpClient.get<ApiResponse<PageResponse<GuestbookMessage>>>(
      API_ENDPOINTS.GUESTBOOK.LIST,
      searchParams
    );
    return response.data;
  }

  // 批量审核留言
  async batchApproveMessages(messageIds: string[]): Promise<void> {
    await httpClient.patch<ApiResponse<void>>(
      `${API_ENDPOINTS.GUESTBOOK.LIST}/batch-approve`,
      { messageIds }
    );
  }

  // 批量删除留言
  async batchDeleteMessages(messageIds: string[]): Promise<void> {
    await httpClient.patch<ApiResponse<void>>(
      `${API_ENDPOINTS.GUESTBOOK.LIST}/batch-delete`,
      { messageIds }
    );
  }

  // 获取留言统计信息
  async getMessageStats(): Promise<{
    total: number;
    approved: number;
    pending: number;
    today: number;
  }> {
    const response = await httpClient.get<ApiResponse<{
      total: number;
      approved: number;
      pending: number;
      today: number;
    }>>(
      `${API_ENDPOINTS.GUESTBOOK.LIST}/stats`
    );
    return response.data;
  }

  // 获取最新留言
  async getLatestMessages(limit: number = 10): Promise<GuestbookMessage[]> {
    const response = await httpClient.get<ApiResponse<GuestbookMessage[]>>(
      API_ENDPOINTS.GUESTBOOK.LIST,
      { 
        size: limit, 
        sort: 'createdAt,desc',
        approved: true 
      }
    );
    return response.data;
  }
}

// 创建留言板服务实例
export const guestbookApiService = new GuestbookApiService();
