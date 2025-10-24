import { httpClient } from './client';
import { API_ENDPOINTS } from './config';
import type { Category, PaginationParams } from '@/types';

// 分类创建/更新请求类型
export interface CategoryRequest {
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

// 分类 API 服务
export class CategoryApiService {
  // 获取分类列表
  async getCategories(params?: PaginationParams): Promise<PageResponse<Category>> {
    const response = await httpClient.get<ApiResponse<PageResponse<Category>>>(
      API_ENDPOINTS.CATEGORIES.LIST,
      params
    );
    return response.data;
  }

  // 获取所有分类（不分页）
  async getAllCategories(): Promise<Category[]> {
    const response = await httpClient.get<ApiResponse<Category[]>>(
      API_ENDPOINTS.CATEGORIES.LIST,
      { size: 1000 } // 获取大量数据
    );
    return response.data;
  }

  // 获取分类详情
  async getCategory(id: string): Promise<Category> {
    const response = await httpClient.get<ApiResponse<Category>>(
      API_ENDPOINTS.CATEGORIES.GET(id)
    );
    return response.data;
  }

  // 创建分类
  async createCategory(categoryData: CategoryRequest): Promise<Category> {
    const response = await httpClient.post<ApiResponse<Category>>(
      API_ENDPOINTS.CATEGORIES.CREATE,
      categoryData
    );
    return response.data;
  }

  // 更新分类
  async updateCategory(id: string, categoryData: Partial<CategoryRequest>): Promise<Category> {
    const response = await httpClient.put<ApiResponse<Category>>(
      API_ENDPOINTS.CATEGORIES.UPDATE(id),
      categoryData
    );
    return response.data;
  }

  // 删除分类
  async deleteCategory(id: string): Promise<void> {
    await httpClient.delete<ApiResponse<void>>(
      API_ENDPOINTS.CATEGORIES.DELETE(id)
    );
  }

  // 搜索分类
  async searchCategories(query: string, params?: PaginationParams): Promise<PageResponse<Category>> {
    const searchParams = {
      ...params,
      search: query,
    };
    
    const response = await httpClient.get<ApiResponse<PageResponse<Category>>>(
      API_ENDPOINTS.CATEGORIES.LIST,
      searchParams
    );
    return response.data;
  }

  // 根据 slug 获取分类
  async getCategoryBySlug(slug: string): Promise<Category> {
    const response = await httpClient.get<ApiResponse<Category>>(
      API_ENDPOINTS.CATEGORIES.LIST,
      { slug }
    );
    
    // 如果返回的是分页数据，取第一个
    if (Array.isArray(response.data)) {
      return response.data[0];
    }
    
    return response.data;
  }

  // 获取分类统计信息
  async getCategoryStats(): Promise<{ total: number; withArticles: number }> {
    const response = await httpClient.get<ApiResponse<{ total: number; withArticles: number }>>(
      `${API_ENDPOINTS.CATEGORIES.LIST}/stats`
    );
    return response.data;
  }
}

// 创建分类服务实例
export const categoryApiService = new CategoryApiService();
