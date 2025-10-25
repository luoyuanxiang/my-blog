import { httpClient } from './client';
import type { ApiResponse, GuestbookMessage, PageResponse } from '@/types';

/**
 * 留言板API服务
 * 处理留言板的增删改查操作
 */
class GuestbookApiService {
  /**
   * 获取留言列表（分页）
   * @param page 页码
   * @param size 每页大小
   * @param sortBy 排序字段
   * @param sortDir 排序方向
   * @returns 分页留言列表
   */
  async getMessages(
    page: number = 0,
    size: number = 10,
    sortBy: string = 'createdAt',
    sortDir: string = 'desc'
  ): Promise<ApiResponse<PageResponse<GuestbookMessage>>> {
    return httpClient.get<ApiResponse<PageResponse<GuestbookMessage>>>(
      `/guestbook?page=${page}&size=${size}&sortBy=${sortBy}&sortDir=${sortDir}`
    );
  }

  /**
   * 获取所有留言
   * @returns 所有留言列表
   */
  async getAllMessages(): Promise<ApiResponse<GuestbookMessage[]>> {
    // 使用分页接口获取所有留言，设置较大的size来获取所有数据
    const response = await this.getMessages(0, 1000);
    if (response.code === 200 && response.data) {
      return {
        ...response,
        data: response.data.content || []
      };
    }
    return response as ApiResponse<GuestbookMessage[]>;
  }

  /**
   * 根据ID获取留言
   * @param id 留言ID
   * @returns 留言详情
   */
  async getMessageById(id: string): Promise<ApiResponse<GuestbookMessage>> {
    return httpClient.get<ApiResponse<GuestbookMessage>>(`/guestbook/${id}`);
  }

  /**
   * 创建留言
   * @param messageData 留言数据
   * @returns 创建的留言
   */
  async createMessage(messageData: Omit<GuestbookMessage, 'id' | 'createdAt' | 'likes' | 'isApproved'>): Promise<ApiResponse<GuestbookMessage>> {
    return httpClient.post<ApiResponse<GuestbookMessage>>('/guestbook', messageData);
  }

  /**
   * 更新留言
   * @param id 留言ID
   * @param messageData 留言数据
   * @returns 更新后的留言
   */
  async updateMessage(id: string, messageData: Partial<GuestbookMessage>): Promise<ApiResponse<GuestbookMessage>> {
    return httpClient.put<ApiResponse<GuestbookMessage>>(`/guestbook/${id}`, messageData);
  }

  /**
   * 删除留言
   * @param id 留言ID
   * @returns 操作结果
   */
  async deleteMessage(id: string): Promise<ApiResponse<void>> {
    return httpClient.delete<ApiResponse<void>>(`/guestbook/${id}`);
  }

  /**
   * 获取已审核的留言
   * @param page 页码
   * @param size 每页大小
   * @returns 已审核的留言列表
   */
  async getApprovedMessages(page: number = 0, size: number = 10): Promise<ApiResponse<PageResponse<GuestbookMessage>>> {
    return httpClient.get<ApiResponse<PageResponse<GuestbookMessage>>>(
      `/guestbook/approved?page=${page}&size=${size}`
    );
  }

  /**
   * 获取待审核的留言
   * @param page 页码
   * @param size 每页大小
   * @returns 待审核的留言列表
   */
  async getPendingMessages(page: number = 0, size: number = 10): Promise<ApiResponse<PageResponse<GuestbookMessage>>> {
    return httpClient.get<ApiResponse<PageResponse<GuestbookMessage>>>(
      `/guestbook/pending?page=${page}&size=${size}`
    );
  }

  /**
   * 审核通过留言
   * @param id 留言ID
   * @returns 操作结果
   */
  async approveMessage(id: string): Promise<ApiResponse<GuestbookMessage>> {
    return httpClient.post<ApiResponse<GuestbookMessage>>(`/guestbook/${id}/approve`);
  }

  /**
   * 拒绝留言
   * @param id 留言ID
   * @returns 操作结果
   */
  async rejectMessage(id: string): Promise<ApiResponse<GuestbookMessage>> {
    return httpClient.post<ApiResponse<GuestbookMessage>>(`/guestbook/${id}/reject`);
  }

  /**
   * 增加点赞数
   * @param id 留言ID
   * @returns 操作结果
   */
  async incrementLikeCount(id: string): Promise<ApiResponse<void>> {
    return httpClient.post<ApiResponse<void>>(`/guestbook/${id}/like`);
  }

  /**
   * 获取留言回复
   * @param id 留言ID
   * @returns 回复列表
   */
  async getMessageReplies(id: string): Promise<ApiResponse<GuestbookMessage[]>> {
    return httpClient.get<ApiResponse<GuestbookMessage[]>>(`/guestbook/${id}/replies`);
  }
}

// 导出服务实例
export const guestbookApiService = new GuestbookApiService();