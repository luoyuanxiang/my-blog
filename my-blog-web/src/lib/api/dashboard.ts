import { httpClient } from './client';
import type { ApiResponse } from '@/types';

/**
 * 仪表盘统计数据接口
 */
export interface DashboardStats {
  /** 文章总数 */
  totalArticles: number;
  /** 已发布文章数 */
  publishedArticles: number;
  /** 草稿文章数 */
  draftArticles: number;
  /** 置顶文章数 */
  pinnedArticles: number;
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
  /** 已审核评论数 */
  approvedComments: number;
  /** 待审核评论数 */
  pendingComments: number;
  /** 友链总数 */
  totalFriendLinks: number;
  /** 已审核友链数 */
  approvedFriendLinks: number;
  /** 待审核友链数 */
  pendingFriendLinks: number;
  /** 留言板消息总数 */
  totalGuestbookMessages: number;
  /** 已审核留言数 */
  approvedGuestbookMessages: number;
  /** 待审核留言数 */
  pendingGuestbookMessages: number;
  /** 用户总数 */
  totalUsers: number;
  /** 启用用户数 */
  enabledUsers: number;
  /** 今日新增文章数 */
  todayArticles: number;
  /** 今日新增评论数 */
  todayComments: number;
  /** 今日新增留言数 */
  todayGuestbookMessages: number;
  /** 今日新增友链数 */
  todayFriendLinks: number;
}

/**
 * 仪表盘API服务
 * 处理管理端仪表盘数据统计相关操作
 */
class DashboardApiService {
  /**
   * 获取仪表盘统计数据
   * @returns 仪表盘统计数据
   */
  async getDashboardStats(): Promise<ApiResponse<DashboardStats>> {
    return httpClient.get<ApiResponse<DashboardStats>>('/dashboard/stats');
  }

  /**
   * 获取最近文章
   * @returns 最近文章列表
   */
  async getRecentArticles(): Promise<ApiResponse<any[]>> {
    return httpClient.get<ApiResponse<any[]>>('/dashboard/recent-articles');
  }

  /**
   * 获取最近评论
   * @returns 最近评论列表
   */
  async getRecentComments(): Promise<ApiResponse<any[]>> {
    return httpClient.get<ApiResponse<any[]>>('/dashboard/recent-comments');
  }

  /**
   * 获取系统信息
   * @returns 系统信息
   */
  async getSystemInfo(): Promise<ApiResponse<any>> {
    return httpClient.get<ApiResponse<any>>('/dashboard/system-info');
  }
}

// 导出服务实例
export const dashboardApiService = new DashboardApiService();
