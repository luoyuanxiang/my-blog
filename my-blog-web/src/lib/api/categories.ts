import { httpClient } from './client';
import type { ApiResponse, Category } from '@/types';

/**
 * 分类API服务
 * 处理分类的增删改查操作
 */
class CategoryApiService {
  /**
   * 获取分类列表（分页）
   * @param page 页码
   * @param size 每页大小
   * @param sortBy 排序字段
   * @param sortDir 排序方向
   * @returns 分页分类列表
   */
  async getCategories(
    page: number = 0,
    size: number = 10,
    sortBy: string = 'createdAt',
    sortDir: string = 'desc'
  ): Promise<ApiResponse<any>> {
    return httpClient.get<ApiResponse<any>>(
      `/categories?page=${page}&size=${size}&sortBy=${sortBy}&sortDir=${sortDir}`
    );
  }

  /**
   * 获取所有分类
   * @returns 所有分类列表
   */
  async getAllCategories(): Promise<ApiResponse<Category[]>> {
    return httpClient.get<ApiResponse<Category[]>>('/categories/all');
  }

  /**
   * 根据ID获取分类
   * @param id 分类ID
   * @returns 分类详情
   */
  async getCategoryById(id: string): Promise<ApiResponse<Category>> {
    return httpClient.get<ApiResponse<Category>>(`/categories/${id}`);
  }

  /**
   * 根据slug获取分类
   * @param slug 分类slug
   * @returns 分类详情
   */
  async getCategoryBySlug(slug: string): Promise<ApiResponse<Category>> {
    return httpClient.get<ApiResponse<Category>>(`/categories/slug/${slug}`);
  }

  /**
   * 创建分类
   * @param categoryData 分类数据
   * @returns 创建的分类
   */
  async createCategory(categoryData: Omit<Category, 'id' | 'createdAt'>): Promise<ApiResponse<Category>> {
    return httpClient.post<ApiResponse<Category>>('/categories', categoryData);
  }

  /**
   * 更新分类
   * @param id 分类ID
   * @param categoryData 分类数据
   * @returns 更新后的分类
   */
  async updateCategory(id: string, categoryData: Partial<Category>): Promise<ApiResponse<Category>> {
    return httpClient.put<ApiResponse<Category>>(`/categories/${id}`, categoryData);
  }

  /**
   * 删除分类
   * @param id 分类ID
   * @returns 删除结果
   */
  async deleteCategory(id: string): Promise<ApiResponse<void>> {
    return httpClient.delete<ApiResponse<void>>(`/categories/${id}`);
  }

  /**
   * 获取有文章的分类
   * @returns 有文章的分类列表
   */
  async getCategoriesWithArticles(): Promise<ApiResponse<Category[]>> {
    return httpClient.get<ApiResponse<Category[]>>('/categories/with-articles');
  }
}

// 导出服务实例
export const categoryApiService = new CategoryApiService();