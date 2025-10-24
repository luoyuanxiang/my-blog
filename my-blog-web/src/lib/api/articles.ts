import { httpClient } from './client';
import { API_ENDPOINTS } from './config';
import type { Article, PaginationParams, ArticleQueryParams } from '@/types';

// 文章创建/更新请求类型
export interface ArticleRequest {
  title: string;
  content: string;
  excerpt?: string;
  coverImage?: string;
  categoryId: string;
  tagIds: string[];
  isPublished?: boolean;
  isPinned?: boolean;
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

// API 响应类型
export interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

// 文章 API 服务
export class ArticleApiService {
  // 获取文章列表
  async getArticles(params?: ArticleQueryParams): Promise<PageResponse<Article>> {
    const response = await httpClient.get<ApiResponse<PageResponse<Article>>>(
      API_ENDPOINTS.ARTICLES.LIST,
      params
    );
    return response.data;
  }

  // 获取文章详情
  async getArticle(id: string): Promise<Article> {
    const response = await httpClient.get<ApiResponse<Article>>(
      API_ENDPOINTS.ARTICLES.GET(id)
    );
    return response.data;
  }

  // 创建文章
  async createArticle(articleData: ArticleRequest): Promise<Article> {
    const response = await httpClient.post<ApiResponse<Article>>(
      API_ENDPOINTS.ARTICLES.CREATE,
      articleData
    );
    return response.data;
  }

  // 更新文章
  async updateArticle(id: string, articleData: Partial<ArticleRequest>): Promise<Article> {
    const response = await httpClient.put<ApiResponse<Article>>(
      API_ENDPOINTS.ARTICLES.UPDATE(id),
      articleData
    );
    return response.data;
  }

  // 删除文章
  async deleteArticle(id: string): Promise<void> {
    await httpClient.delete<ApiResponse<void>>(
      API_ENDPOINTS.ARTICLES.DELETE(id)
    );
  }

  // 发布文章
  async publishArticle(id: string): Promise<Article> {
    const response = await httpClient.patch<ApiResponse<Article>>(
      API_ENDPOINTS.ARTICLES.PUBLISH(id)
    );
    return response.data;
  }

  // 取消发布文章
  async unpublishArticle(id: string): Promise<Article> {
    const response = await httpClient.patch<ApiResponse<Article>>(
      API_ENDPOINTS.ARTICLES.UNPUBLISH(id)
    );
    return response.data;
  }

  // 置顶文章
  async pinArticle(id: string): Promise<Article> {
    const response = await httpClient.patch<ApiResponse<Article>>(
      API_ENDPOINTS.ARTICLES.PIN(id)
    );
    return response.data;
  }

  // 取消置顶文章
  async unpinArticle(id: string): Promise<Article> {
    const response = await httpClient.patch<ApiResponse<Article>>(
      API_ENDPOINTS.ARTICLES.UNPIN(id)
    );
    return response.data;
  }

  // 搜索文章
  async searchArticles(query: string, params?: PaginationParams): Promise<PageResponse<Article>> {
    const searchParams = {
      ...params,
      search: query,
    };
    
    const response = await httpClient.get<ApiResponse<PageResponse<Article>>>(
      API_ENDPOINTS.ARTICLES.LIST,
      searchParams
    );
    return response.data;
  }

  // 根据分类获取文章
  async getArticlesByCategory(categoryId: string, params?: PaginationParams): Promise<PageResponse<Article>> {
    const searchParams = {
      ...params,
      category: categoryId,
    };
    
    const response = await httpClient.get<ApiResponse<PageResponse<Article>>>(
      API_ENDPOINTS.ARTICLES.LIST,
      searchParams
    );
    return response.data;
  }

  // 根据标签获取文章
  async getArticlesByTag(tagId: string, params?: PaginationParams): Promise<PageResponse<Article>> {
    const searchParams = {
      ...params,
      tag: tagId,
    };
    
    const response = await httpClient.get<ApiResponse<PageResponse<Article>>>(
      API_ENDPOINTS.ARTICLES.LIST,
      searchParams
    );
    return response.data;
  }

  // 获取置顶文章
  async getPinnedArticles(): Promise<Article[]> {
    const response = await httpClient.get<ApiResponse<Article[]>>(
      API_ENDPOINTS.ARTICLES.LIST,
      { pinned: true, size: 10 }
    );
    return response.data;
  }

  // 获取最新文章
  async getLatestArticles(limit: number = 10): Promise<Article[]> {
    const response = await httpClient.get<ApiResponse<Article[]>>(
      API_ENDPOINTS.ARTICLES.LIST,
      { size: limit, sort: 'createdAt,desc' }
    );
    return response.data;
  }

  // 获取热门文章
  async getPopularArticles(limit: number = 10): Promise<Article[]> {
    const response = await httpClient.get<ApiResponse<Article[]>>(
      API_ENDPOINTS.ARTICLES.LIST,
      { size: limit, sort: 'views,desc' }
    );
    return response.data;
  }
}

// 创建文章服务实例
export const articleApiService = new ArticleApiService();
