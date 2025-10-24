import { httpClient } from './client';
import { API_ENDPOINTS } from './config';
import type { Comment, PaginationParams } from '@/types';

// 评论创建请求类型
export interface CommentRequest {
  articleId?: string;
  parentId?: string;
  author: string;
  email: string;
  content: string;
  website?: string;
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

// 评论 API 服务
export class CommentApiService {
  // 获取评论列表
  async getComments(params?: PaginationParams): Promise<PageResponse<Comment>> {
    const response = await httpClient.get<ApiResponse<PageResponse<Comment>>>(
      API_ENDPOINTS.COMMENTS.LIST,
      params
    );
    return response.data;
  }

  // 获取文章评论
  async getArticleComments(articleId: string, params?: PaginationParams): Promise<PageResponse<Comment>> {
    const response = await httpClient.get<ApiResponse<PageResponse<Comment>>>(
      API_ENDPOINTS.COMMENTS.BY_ARTICLE(articleId),
      params
    );
    return response.data;
  }

  // 获取评论详情
  async getComment(id: string): Promise<Comment> {
    const response = await httpClient.get<ApiResponse<Comment>>(
      API_ENDPOINTS.COMMENTS.GET(id)
    );
    return response.data;
  }

  // 创建评论
  async createComment(commentData: CommentRequest): Promise<Comment> {
    const response = await httpClient.post<ApiResponse<Comment>>(
      API_ENDPOINTS.COMMENTS.CREATE,
      commentData
    );
    return response.data;
  }

  // 更新评论
  async updateComment(id: string, commentData: Partial<CommentRequest>): Promise<Comment> {
    const response = await httpClient.put<ApiResponse<Comment>>(
      API_ENDPOINTS.COMMENTS.UPDATE(id),
      commentData
    );
    return response.data;
  }

  // 删除评论
  async deleteComment(id: string): Promise<void> {
    await httpClient.delete<ApiResponse<void>>(
      API_ENDPOINTS.COMMENTS.DELETE(id)
    );
  }

  // 审核通过评论
  async approveComment(id: string): Promise<Comment> {
    const response = await httpClient.patch<ApiResponse<Comment>>(
      API_ENDPOINTS.COMMENTS.APPROVE(id)
    );
    return response.data;
  }

  // 审核拒绝评论
  async disapproveComment(id: string): Promise<Comment> {
    const response = await httpClient.patch<ApiResponse<Comment>>(
      API_ENDPOINTS.COMMENTS.DISAPPROVE(id)
    );
    return response.data;
  }

  // 点赞评论
  async likeComment(id: string): Promise<Comment> {
    const response = await httpClient.patch<ApiResponse<Comment>>(
      `${API_ENDPOINTS.COMMENTS.GET(id)}/like`
    );
    return response.data;
  }

  // 取消点赞评论
  async unlikeComment(id: string): Promise<Comment> {
    const response = await httpClient.patch<ApiResponse<Comment>>(
      `${API_ENDPOINTS.COMMENTS.GET(id)}/unlike`
    );
    return response.data;
  }

  // 获取待审核评论
  async getPendingComments(params?: PaginationParams): Promise<PageResponse<Comment>> {
    const response = await httpClient.get<ApiResponse<PageResponse<Comment>>>(
      API_ENDPOINTS.COMMENTS.LIST,
      { ...params, approved: false }
    );
    return response.data;
  }

  // 获取已审核评论
  async getApprovedComments(params?: PaginationParams): Promise<PageResponse<Comment>> {
    const response = await httpClient.get<ApiResponse<PageResponse<Comment>>>(
      API_ENDPOINTS.COMMENTS.LIST,
      { ...params, approved: true }
    );
    return response.data;
  }

  // 批量审核评论
  async batchApproveComments(commentIds: string[]): Promise<void> {
    await httpClient.patch<ApiResponse<void>>(
      `${API_ENDPOINTS.COMMENTS.LIST}/batch-approve`,
      { commentIds }
    );
  }

  // 批量删除评论
  async batchDeleteComments(commentIds: string[]): Promise<void> {
    await httpClient.patch<ApiResponse<void>>(
      `${API_ENDPOINTS.COMMENTS.LIST}/batch-delete`,
      { commentIds }
    );
  }

  // 获取评论统计信息
  async getCommentStats(): Promise<{
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
      `${API_ENDPOINTS.COMMENTS.LIST}/stats`
    );
    return response.data;
  }
}

// 创建评论服务实例
export const commentApiService = new CommentApiService();
