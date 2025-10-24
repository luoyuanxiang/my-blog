import { httpClient } from './client';
import { API_ENDPOINTS } from './config';
import type { Tag, PaginationParams } from '@/types';

// 标签创建/更新请求类型
export interface TagRequest {
  name: string;
  slug?: string;
  description?: string;
  color?: string;
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

// 标签 API 服务
export class TagApiService {
  // 获取标签列表
  async getTags(params?: PaginationParams): Promise<PageResponse<Tag>> {
    const response = await httpClient.get<ApiResponse<PageResponse<Tag>>>(
      API_ENDPOINTS.TAGS.LIST,
      params
    );
    return response.data;
  }

  // 获取所有标签（不分页）
  async getAllTags(): Promise<Tag[]> {
    const response = await httpClient.get<ApiResponse<Tag[]>>(
      API_ENDPOINTS.TAGS.LIST,
      { size: 1000 } // 获取大量数据
    );
    return response.data;
  }

  // 获取标签详情
  async getTag(id: string): Promise<Tag> {
    const response = await httpClient.get<ApiResponse<Tag>>(
      API_ENDPOINTS.TAGS.GET(id)
    );
    return response.data;
  }

  // 创建标签
  async createTag(tagData: TagRequest): Promise<Tag> {
    const response = await httpClient.post<ApiResponse<Tag>>(
      API_ENDPOINTS.TAGS.CREATE,
      tagData
    );
    return response.data;
  }

  // 更新标签
  async updateTag(id: string, tagData: Partial<TagRequest>): Promise<Tag> {
    const response = await httpClient.put<ApiResponse<Tag>>(
      API_ENDPOINTS.TAGS.UPDATE(id),
      tagData
    );
    return response.data;
  }

  // 删除标签
  async deleteTag(id: string): Promise<void> {
    await httpClient.delete<ApiResponse<void>>(
      API_ENDPOINTS.TAGS.DELETE(id)
    );
  }

  // 搜索标签
  async searchTags(query: string, params?: PaginationParams): Promise<PageResponse<Tag>> {
    const searchParams = {
      ...params,
      search: query,
    };
    
    const response = await httpClient.get<ApiResponse<PageResponse<Tag>>>(
      API_ENDPOINTS.TAGS.LIST,
      searchParams
    );
    return response.data;
  }

  // 根据 slug 获取标签
  async getTagBySlug(slug: string): Promise<Tag> {
    const response = await httpClient.get<ApiResponse<Tag>>(
      API_ENDPOINTS.TAGS.LIST,
      { slug }
    );
    
    // 如果返回的是分页数据，取第一个
    if (Array.isArray(response.data)) {
      return response.data[0];
    }
    
    return response.data;
  }

  // 获取热门标签
  async getPopularTags(limit: number = 20): Promise<Tag[]> {
    const response = await httpClient.get<ApiResponse<Tag[]>>(
      API_ENDPOINTS.TAGS.LIST,
      { 
        size: limit, 
        sort: 'articleCount,desc' 
      }
    );
    return response.data;
  }

  // 获取标签云数据
  async getTagCloud(): Promise<Tag[]> {
    const response = await httpClient.get<ApiResponse<Tag[]>>(
      `${API_ENDPOINTS.TAGS.LIST}/cloud`
    );
    return response.data;
  }

  // 获取标签统计信息
  async getTagStats(): Promise<{ total: number; withArticles: number }> {
    const response = await httpClient.get<ApiResponse<{ total: number; withArticles: number }>>(
      `${API_ENDPOINTS.TAGS.LIST}/stats`
    );
    return response.data;
  }
}

// 创建标签服务实例
export const tagApiService = new TagApiService();
