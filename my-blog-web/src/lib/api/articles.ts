import { HttpClient } from './client';
import { ApiResponse, PageResponse, Article, Category, Tag } from '@/types';

/**
 * 文章API服务
 * 提供文章相关的API调用方法
 */
class ArticleApiService {
  private httpClient = new HttpClient();

  /**
   * 获取文章列表（分页）
   * @param page 页码
   * @param size 每页大小
   * @param sortBy 排序字段
   * @param sortDir 排序方向
   * @returns 分页文章列表
   */
  async getArticles(
    page: number = 0,
    size: number = 10,
    sortBy: string = 'createdAt',
    sortDir: string = 'desc'
  ): Promise<ApiResponse<PageResponse<Article>>> {
    return this.httpClient.get<ApiResponse<PageResponse<Article>>>(
      `/articles?page=${page}&size=${size}&sortBy=${sortBy}&sortDir=${sortDir}`
    );
  }

  /**
   * 获取所有文章（不分页）
   * @returns 所有文章列表
   */
  async getAllArticles(): Promise<ApiResponse<Article[]>> {
    // 使用分页接口获取所有文章，设置较大的size来获取所有数据
    return this.httpClient.get<ApiResponse<Article[]>>('/articles?page=0&size=1000');
  }

  /**
   * 根据ID获取文章
   * @param id 文章ID
   * @returns 文章详情
   */
  async getArticleById(id: number): Promise<ApiResponse<Article>> {
    return this.httpClient.get<ApiResponse<Article>>(`/articles/${id}`);
  }

  /**
   * 根据slug获取文章
   * @param slug 文章slug
   * @returns 文章详情
   */
  async getArticleBySlug(slug: string): Promise<ApiResponse<Article>> {
    return this.httpClient.get<ApiResponse<Article>>(`/articles/slug/${slug}`);
  }

  /**
   * 创建文章
   * @param article 文章数据
   * @returns 创建结果
   */
  async createArticle(article: Omit<Article, 'id' | 'createdAt' | 'updatedAt' | 'publishedAt'>): Promise<ApiResponse<Article>> {
    return this.httpClient.post<ApiResponse<Article>>('/articles', article);
  }

  /**
   * 更新文章
   * @param id 文章ID
   * @param article 文章数据
   * @returns 更新结果
   */
  async updateArticle(id: number, article: Partial<Article>): Promise<ApiResponse<Article>> {
    return this.httpClient.put<ApiResponse<Article>>(`/articles/${id}`, article);
  }

  /**
   * 删除文章
   * @param id 文章ID
   * @returns 删除结果
   */
  async deleteArticle(id: number): Promise<ApiResponse<void>> {
    return this.httpClient.delete<ApiResponse<void>>(`/articles/${id}`);
  }

  /**
   * 发布文章
   * @param id 文章ID
   * @returns 发布结果
   */
  async publishArticle(id: number): Promise<ApiResponse<Article>> {
    return this.httpClient.post<ApiResponse<Article>>(`/articles/${id}/publish`);
  }

  /**
   * 取消发布文章
   * @param id 文章ID
   * @returns 取消发布结果
   */
  async unpublishArticle(id: number): Promise<ApiResponse<Article>> {
    return this.httpClient.post<ApiResponse<Article>>(`/articles/${id}/unpublish`);
  }

  /**
   * 置顶文章
   * @param id 文章ID
   * @returns 置顶结果
   */
  async pinArticle(id: number): Promise<ApiResponse<Article>> {
    return this.httpClient.post<ApiResponse<Article>>(`/articles/${id}/pin`);
  }

  /**
   * 取消置顶文章
   * @param id 文章ID
   * @returns 取消置顶结果
   */
  async unpinArticle(id: number): Promise<ApiResponse<Article>> {
    return this.httpClient.post<ApiResponse<Article>>(`/articles/${id}/unpin`);
  }

  /**
   * 增加文章浏览量
   * @param id 文章ID
   * @returns 操作结果
   */
  async incrementViewCount(id: number): Promise<ApiResponse<void>> {
    return this.httpClient.post<ApiResponse<void>>(`/articles/${id}/view`);
  }

  /**
   * 增加文章点赞数
   * @param id 文章ID
   * @returns 操作结果
   */
  async incrementLikeCount(id: number): Promise<ApiResponse<void>> {
    return this.httpClient.post<ApiResponse<void>>(`/articles/${id}/like`);
  }

  /**
   * 获取最新文章（首页用）
   * @param limit 限制数量
   * @returns 最新文章列表
   */
  async getLatestArticles(limit: number = 6): Promise<Article[]> {
    const response = await this.getPublishedArticles(0, limit, 'publishedAt', 'desc');
    if (response.code === 200 && response.data) {
      return response.data.content || [];
    }
    return [];
  }

  /**
   * 获取已发布文章列表
   * @param page 页码
   * @param size 每页大小
   * @param sortBy 排序字段
   * @param sortDir 排序方向
   * @returns 已发布文章列表
   */
  async getPublishedArticles(
    page: number = 0,
    size: number = 10,
    sortBy: string = 'publishedAt',
    sortDir: string = 'desc'
  ): Promise<ApiResponse<PageResponse<Article>>> {
    return this.httpClient.get<ApiResponse<PageResponse<Article>>>(
      `/articles/published?page=${page}&size=${size}&sortBy=${sortBy}&sortDir=${sortDir}`
    );
  }

  /**
   * 根据分类获取文章
   * @param categoryId 分类ID
   * @param page 页码
   * @param size 每页大小
   * @returns 分类下的文章列表
   */
  async getArticlesByCategory(
    categoryId: number,
    page: number = 0,
    size: number = 10
  ): Promise<ApiResponse<PageResponse<Article>>> {
    return this.httpClient.get<ApiResponse<PageResponse<Article>>>(
      `/articles/category/${categoryId}?page=${page}&size=${size}`
    );
  }

  /**
   * 根据标签获取文章
   * @param tagId 标签ID
   * @param page 页码
   * @param size 每页大小
   * @returns 标签下的文章列表
   */
  async getArticlesByTag(
    tagId: number,
    page: number = 0,
    size: number = 10
  ): Promise<ApiResponse<PageResponse<Article>>> {
    return this.httpClient.get<ApiResponse<PageResponse<Article>>>(
      `/articles/tag/${tagId}?page=${page}&size=${size}`
    );
  }

  /**
   * 搜索文章
   * @param keyword 搜索关键词
   * @param page 页码
   * @param size 每页大小
   * @returns 搜索结果
   */
  async searchArticles(
    keyword: string,
    page: number = 0,
    size: number = 10
  ): Promise<ApiResponse<PageResponse<Article>>> {
    return this.httpClient.get<ApiResponse<PageResponse<Article>>>(
      `/articles/search?keyword=${encodeURIComponent(keyword)}&page=${page}&size=${size}`
    );
  }

  /**
   * 获取置顶文章
   * @returns 置顶文章列表
   */
  async getPinnedArticles(): Promise<ApiResponse<Article[]>> {
    return this.httpClient.get<ApiResponse<Article[]>>('/articles/pinned');
  }

  /**
   * 获取热门文章
   * @param page 页码
   * @param size 每页大小
   * @returns 热门文章列表
   */
  async getPopularArticles(
    page: number = 0,
    size: number = 10
  ): Promise<ApiResponse<PageResponse<Article>>> {
    return this.httpClient.get<ApiResponse<PageResponse<Article>>>(
      `/articles/popular?page=${page}&size=${size}`
    );
  }
}

export const articleApiService = new ArticleApiService();