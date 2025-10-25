import { HttpClient } from './client';
import { ApiResponse } from '@/types';

/**
 * 博客统计数据类型定义
 */
export interface BlogStats {
  /** 文章总数 */
  totalArticles: number;
  /** 已发布文章数 */
  publishedArticles: number;
  /** 文章总浏览量 */
  totalViews: number;
  /** 文章总点赞数 */
  totalLikes: number;
  /** 分类总数 */
  totalCategories: number;
  /** 标签总数 */
  totalTags: number;
  /** 评论总数 */
  totalComments: number;
  /** 友链总数 */
  totalFriendLinks: number;
  /** 留言板消息总数 */
  totalGuestbookMessages: number;
}

/**
 * 公共API服务
 * 提供前端首页所需的公开数据
 */
class PublicApiService {
  private httpClient = new HttpClient();

  /**
   * 获取博客统计数据
   * @returns 博客统计数据
   */
  async getBlogStats(): Promise<ApiResponse<BlogStats>> {
    return this.httpClient.get<ApiResponse<BlogStats>>('/api/public/stats');
  }
}

export const publicApiService = new PublicApiService();
