import { HttpClient } from './client';
import { API_ENDPOINTS } from './config';
import type { ApiResponse } from '@/types';

// 图片接口定义
export interface Image {
  id: number;
  filename: string;
  originalFilename: string;
  filePath: string;
  url: string;
  fileSize: number;
  contentType: string;
  extension: string;
  width?: number;
  height?: number;
  description?: string;
  storageType: string;
  uploadedBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface ImageUploadResponse {
  id: number;
  filename: string;
  originalFilename: string;
  filePath: string;
  url: string;
  fileSize: number;
  contentType: string;
  extension: string;
  width?: number;
  height?: number;
  description?: string;
  storageType: string;
  uploadedBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface ImageListResponse {
  images: Image[];
  totalElements: number;
  totalPages: number;
  currentPage: number;
  size: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

/**
 * 图片管理API服务
 */
class ImageApiService {
  private httpClient: HttpClient;

  constructor() {
    this.httpClient = new HttpClient();
  }

  /**
   * 获取图片列表
   * @param page 页码，从0开始
   * @param size 每页数量
   * @param keyword 搜索关键词
   * @param uploadedBy 上传者
   * @param storageType 存储类型
   */
  async getImages(page: number = 0, size: number = 20, keyword?: string, uploadedBy?: string, storageType?: string): Promise<ApiResponse<ImageListResponse>> {
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
    });
    
    if (keyword) {
      params.append('keyword', keyword);
    }
    
    if (uploadedBy) {
      params.append('uploadedBy', uploadedBy);
    }
    
    if (storageType) {
      params.append('storageType', storageType);
    }

    return this.httpClient.get(`${API_ENDPOINTS.IMAGES.LIST}?${params.toString()}`);
  }

  /**
   * 根据ID获取图片详情
   * @param id 图片ID
   */
  async getImageById(id: number): Promise<ApiResponse<Image>> {
    return this.httpClient.get(API_ENDPOINTS.IMAGES.GET_BY_ID(id));
  }

  /**
   * 上传图片
   * @param file 图片文件
   * @param description 图片描述
   * @param uploadedBy 上传者
   */
  async uploadImage(file: File, description?: string, uploadedBy: string = 'admin'): Promise<ApiResponse<ImageUploadResponse>> {
    const formData = new FormData();
    formData.append('file', file);
    
    if (description) {
      formData.append('description', description);
    }
    
    formData.append('uploadedBy', uploadedBy);

    return this.httpClient.post(API_ENDPOINTS.IMAGES.UPLOAD, formData);
  }

  /**
   * 更新图片描述
   * @param id 图片ID
   * @param description 图片描述
   */
  async updateImageDescription(id: number, description: string): Promise<ApiResponse<Image>> {
    return this.httpClient.put(API_ENDPOINTS.IMAGES.UPDATE(id), { description });
  }

  /**
   * 删除图片
   * @param id 图片ID
   */
  async deleteImage(id: number): Promise<ApiResponse<void>> {
    return this.httpClient.delete(API_ENDPOINTS.IMAGES.DELETE(id));
  }

  /**
   * 批量删除图片
   * @param ids 图片ID数组
   */
  async batchDeleteImages(ids: number[]): Promise<ApiResponse<{ deletedCount: number }>> {
    return this.httpClient.post(`${API_ENDPOINTS.IMAGES.BATCH_DELETE}`, { ids });
  }

  /**
   * 获取图片统计信息
   */
  async getImageStats(): Promise<ApiResponse<{
    totalImages: number;
    totalFileSize: number;
    recentImages: Image[];
    storageTypeStats: Record<string, number>;
  }>> {
    return this.httpClient.get(API_ENDPOINTS.IMAGES.STATS);
  }
}

export const imageApiService = new ImageApiService();
