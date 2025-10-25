import { HttpClient } from './client';
import { ApiResponse, PageResponse, Comment } from '@/types';

/**
 * 评论API服务
 * 提供评论相关的API调用方法
 */
class CommentApiService {
  private httpClient = new HttpClient();

  /**
   * 创建评论
   * @param comment 评论数据
   * @returns 创建结果
   */
  async createComment(comment: Omit<Comment, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<Comment>> {
    return this.httpClient.post<ApiResponse<Comment>>('/comments', comment);
  }

  /**
   * 更新评论
   * @param id 评论ID
   * @param comment 评论数据
   * @returns 更新结果
   */
  async updateComment(id: number, comment: Partial<Comment>): Promise<ApiResponse<Comment>> {
    return this.httpClient.put<ApiResponse<Comment>>(`/comments/${id}`, comment);
  }

  /**
   * 删除评论
   * @param id 评论ID
   * @returns 删除结果
   */
  async deleteComment(id: number): Promise<ApiResponse<void>> {
    return this.httpClient.delete<ApiResponse<void>>(`/comments/${id}`);
  }

  /**
   * 根据ID获取评论
   * @param id 评论ID
   * @returns 评论详情
   */
  async getCommentById(id: number): Promise<ApiResponse<Comment>> {
    return this.httpClient.get<ApiResponse<Comment>>(`/comments/${id}`);
  }

  /**
   * 根据文章ID获取评论列表
   * @param articleId 文章ID
   * @param page 页码
   * @param size 每页大小
   * @returns 评论列表
   */
  async getCommentsByArticleId(
    articleId: number,
    page: number = 0,
    size: number = 10
  ): Promise<ApiResponse<PageResponse<Comment>>> {
    return this.httpClient.get<ApiResponse<PageResponse<Comment>>>(
      `/comments/article/${articleId}?page=${page}&size=${size}`
    );
  }

  /**
   * 获取待审核评论列表
   * @param page 页码
   * @param size 每页大小
   * @returns 待审核评论列表
   */
  async getPendingComments(
    page: number = 0,
    size: number = 10
  ): Promise<ApiResponse<PageResponse<Comment>>> {
    return this.httpClient.get<ApiResponse<PageResponse<Comment>>>(
      `/comments/pending?page=${page}&size=${size}`
    );
  }

  /**
   * 获取所有评论列表（分页）
   * @param page 页码
   * @param size 每页大小
   * @returns 评论列表
   */
  async getAllComments(
    page: number = 0,
    size: number = 10
  ): Promise<ApiResponse<PageResponse<Comment>>> {
    // 由于后端没有提供获取所有评论的接口，我们使用待审核评论接口
    // 在实际项目中，应该添加一个获取所有评论的接口
    return this.httpClient.get<ApiResponse<PageResponse<Comment>>>(
      `/comments/pending?page=${page}&size=${size}`
    );
  }

  /**
   * 审核通过评论
   * @param id 评论ID
   * @returns 审核结果
   */
  async approveComment(id: number): Promise<ApiResponse<Comment>> {
    return this.httpClient.post<ApiResponse<Comment>>(`/comments/${id}/approve`);
  }

  /**
   * 拒绝评论
   * @param id 评论ID
   * @returns 拒绝结果
   */
  async rejectComment(id: number): Promise<ApiResponse<Comment>> {
    return this.httpClient.post<ApiResponse<Comment>>(`/comments/${id}/reject`);
  }

  /**
   * 点赞评论
   * @param id 评论ID
   * @returns 点赞结果
   */
  async incrementLikeCount(id: number): Promise<ApiResponse<void>> {
    return this.httpClient.post<ApiResponse<void>>(`/comments/${id}/like`);
  }

  /**
   * 获取评论回复
   * @param id 评论ID
   * @returns 回复列表
   */
  async getCommentReplies(id: number): Promise<ApiResponse<Comment[]>> {
    return this.httpClient.get<ApiResponse<Comment[]>>(`/comments/${id}/replies`);
  }
}

export const commentApiService = new CommentApiService();