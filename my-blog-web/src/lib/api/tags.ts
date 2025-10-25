import { httpClient } from './client';
import type { ApiResponse, Tag } from '@/types';

/**
 * 标签API服务
 * 处理标签的增删改查操作
 */
class TagApiService {
  /**
   * 获取标签列表（分页）
   * @param page 页码
   * @param size 每页大小
   * @param sortBy 排序字段
   * @param sortDir 排序方向
   * @returns 分页标签列表
   */
  async getTags(
    page: number = 0,
    size: number = 10,
    sortBy: string = 'createdAt',
    sortDir: string = 'desc'
  ): Promise<ApiResponse<any>> {
    return httpClient.get<ApiResponse<any>>(
      `/tags?page=${page}&size=${size}&sortBy=${sortBy}&sortDir=${sortDir}`
    );
  }

  /**
   * 获取所有标签
   * @returns 所有标签列表
   */
  async getAllTags(): Promise<ApiResponse<Tag[]>> {
    return httpClient.get<ApiResponse<Tag[]>>('/tags/all');
  }

  /**
   * 根据ID获取标签
   * @param id 标签ID
   * @returns 标签详情
   */
  async getTagById(id: string): Promise<ApiResponse<Tag>> {
    return httpClient.get<ApiResponse<Tag>>(`/tags/${id}`);
  }

  /**
   * 根据slug获取标签
   * @param slug 标签slug
   * @returns 标签详情
   */
  async getTagBySlug(slug: string): Promise<ApiResponse<Tag>> {
    return httpClient.get<ApiResponse<Tag>>(`/tags/slug/${slug}`);
  }

  /**
   * 创建标签
   * @param tagData 标签数据
   * @returns 创建的标签
   */
  async createTag(tagData: Omit<Tag, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<Tag>> {
    return httpClient.post<ApiResponse<Tag>>('/tags', tagData);
  }

  /**
   * 更新标签
   * @param id 标签ID
   * @param tagData 标签数据
   * @returns 更新后的标签
   */
  async updateTag(id: string, tagData: Partial<Tag>): Promise<ApiResponse<Tag>> {
    return httpClient.put<ApiResponse<Tag>>(`/tags/${id}`, tagData);
  }

  /**
   * 删除标签
   * @param id 标签ID
   * @returns 删除结果
   */
  async deleteTag(id: string): Promise<ApiResponse<void>> {
    return httpClient.delete<ApiResponse<void>>(`/tags/${id}`);
  }

  /**
   * 获取有文章的标签
   * @returns 有文章的标签列表
   */
  async getTagsWithArticles(): Promise<ApiResponse<Tag[]>> {
    return httpClient.get<ApiResponse<Tag[]>>('/tags/with-articles');
  }

  /**
   * 获取热门标签
   * @returns 热门标签列表
   */
  async getPopularTags(): Promise<ApiResponse<Tag[]>> {
    return httpClient.get<ApiResponse<Tag[]>>('/tags/popular');
  }
}

// 导出服务实例
export const tagApiService = new TagApiService();