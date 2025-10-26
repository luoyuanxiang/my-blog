'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Upload, 
  Search, 
  Trash2, 
  Edit3, 
  Eye, 
  Download, 
  Copy, 
  Check, 
  X,
  Image as ImageIcon,
  Plus,
  Filter,
  Grid3X3,
  List
} from 'lucide-react';
import { imageApiService } from '@/lib/api/images';
import { Pagination } from '@/components/ui/pagination';
import { usePagination } from '@/components/ui/pagination';
import type { Image } from '@/lib/api/images';

export default function ImagesManagementPage() {
  const [images, setImages] = useState<Image[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedImages, setSelectedImages] = useState<Image[]>([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingImages, setDeletingImages] = useState<Image[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadingFiles, setUploadingFiles] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  // 分页状态管理
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 20;

  // 获取图片列表
  useEffect(() => {
    fetchImages();
  }, [currentPage, searchTerm]);

  const fetchImages = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await imageApiService.getImages(currentPage, itemsPerPage, searchTerm);
      
      if (response.code === 200 && response.data) {
        setImages(response.data.images);
        setTotalPages(response.data.totalPages);
        setTotalItems(response.data.totalElements);
      } else {
        // 使用示例数据
        const sampleImages: Image[] = [
          {
            id: 1,
            filename: 'sample-image-1.jpg',
            originalFilename: 'sample-image-1.jpg',
            filePath: './uploads/images/sample-image-1.jpg',
            url: '/api/images/sample-image-1.jpg',
            fileSize: 1024000,
            contentType: 'image/jpeg',
            extension: 'jpg',
            width: 1920,
            height: 1080,
            description: '这是示例图片1',
            storageType: 'local',
            uploadedBy: 'admin',
            createdAt: '2024-01-15T10:00:00Z',
            updatedAt: '2024-01-15T10:00:00Z'
          },
          {
            id: 2,
            filename: 'sample-image-2.png',
            originalFilename: 'sample-image-2.png',
            filePath: './uploads/images/sample-image-2.png',
            url: '/api/images/sample-image-2.png',
            fileSize: 2048000,
            contentType: 'image/png',
            extension: 'png',
            width: 1280,
            height: 720,
            description: '这是另一个示例图片',
            storageType: 'local',
            uploadedBy: 'admin',
            createdAt: '2024-01-16T14:20:00Z',
            updatedAt: '2024-01-16T14:20:00Z'
          }
        ];
        setImages(sampleImages);
        setTotalPages(1);
        setTotalItems(sampleImages.length);
      }
    } catch (err) {
      console.error('获取图片列表失败:', err);
      setError('获取图片列表失败');
    } finally {
      setIsLoading(false);
    }
  };

  // 处理文件上传
  const handleFileUpload = async (files: FileList) => {
    const fileArray = Array.from(files);
    setUploadingFiles(fileArray);
    setShowUploadModal(true);

    for (const file of fileArray) {
      try {
        setUploadProgress(prev => ({ ...prev, [file.name]: 0 }));
        
        const response = await imageApiService.uploadImage(file, '管理端上传', 'admin');
        
        if (response.code === 200) {
          setUploadProgress(prev => ({ ...prev, [file.name]: 100 }));
          // 上传成功后刷新列表
          setTimeout(() => {
            fetchImages();
          }, 1000);
        }
      } catch (err) {
        console.error('上传图片失败:', err);
        setUploadProgress(prev => ({ ...prev, [file.name]: -1 }));
      }
    }

    // 清空上传文件
    setTimeout(() => {
      setUploadingFiles([]);
      setUploadProgress({});
      setShowUploadModal(false);
    }, 2000);
  };

  // 处理文件选择
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileUpload(files);
    }
  };

  // 删除图片
  const handleDeleteImage = async (imageId: number) => {
    try {
      await imageApiService.deleteImage(imageId);
      setImages(images.filter(img => img.id !== imageId));
    } catch (err) {
      console.error('删除图片失败:', err);
    }
  };

  // 批量删除图片
  const handleBatchDelete = async () => {
    try {
      setDeletingImages(selectedImages);
      await imageApiService.batchDeleteImages(selectedImages.map(img => img.id));
      setImages(images.filter(img => !selectedImages.includes(img)));
      setSelectedImages([]);
      setShowDeleteModal(false);
    } catch (err) {
      console.error('批量删除图片失败:', err);
    } finally {
      setDeletingImages([]);
    }
  };

  // 复制图片URL
  const handleCopyUrl = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      // 可以添加成功提示
    } catch (err) {
      console.error('复制失败:', err);
    }
  };

  // 格式化文件大小
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // 格式化日期
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">加载中...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <p className="text-destructive text-lg mb-4">{error}</p>
          <button 
            onClick={fetchImages}
            className="text-primary hover:underline"
          >
            重试
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* 页面标题 */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">图片管理</h1>
        <p className="text-muted-foreground">
          管理网站中的所有图片，支持上传、删除和批量操作
        </p>
      </div>

      {/* 操作栏 */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex items-center space-x-4">
          {/* 搜索框 */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <input
              type="text"
              placeholder="搜索图片..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-input rounded-md bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
            />
          </div>

          {/* 视图模式切换 */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-md ${viewMode === 'grid' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}
            >
              <Grid3X3 className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-md ${viewMode === 'list' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {/* 批量删除按钮 */}
          {selectedImages.length > 0 && (
            <button
              onClick={() => setShowDeleteModal(true)}
              className="px-4 py-2 bg-destructive text-destructive-foreground rounded-md hover:bg-destructive/90 transition-colors flex items-center space-x-2"
            >
              <Trash2 className="h-4 w-4" />
              <span>删除选中 ({selectedImages.length})</span>
            </button>
          )}

          {/* 上传按钮 */}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors flex items-center space-x-2"
          >
            <Upload className="h-4 w-4" />
            <span>上传图片</span>
          </button>
        </div>
      </div>

      {/* 图片列表 */}
      {images.length === 0 ? (
        <div className="text-center py-12">
          <ImageIcon className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground text-lg mb-4">暂无图片</p>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="text-primary hover:underline"
          >
            上传第一张图片
          </button>
        </div>
      ) : (
        <>
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mb-8">
              {images.map((image) => (
                <motion.div
                  key={image.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="relative group bg-card rounded-lg border overflow-hidden"
                >
                  {/* 选择框 */}
                  <div className="absolute top-2 left-2 z-10">
                    <input
                      type="checkbox"
                      checked={selectedImages.some(img => img.id === image.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedImages([...selectedImages, image]);
                        } else {
                          setSelectedImages(selectedImages.filter(img => img.id !== image.id));
                        }
                      }}
                      className="w-4 h-4 text-primary bg-background border-border rounded focus:ring-primary"
                    />
                  </div>

                  {/* 图片预览 */}
                  <div className="aspect-square bg-muted flex items-center justify-center">
                    <img
                      src={image.url}
                      alt={image.description || image.originalFilename}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.nextElementSibling?.classList.remove('hidden');
                      }}
                    />
                    <div className="hidden w-full h-full flex items-center justify-center">
                      <ImageIcon className="h-12 w-12 text-muted-foreground" />
                    </div>
                  </div>

                  {/* 图片信息 */}
                  <div className="p-3">
                    <h3 className="font-medium text-sm truncate mb-1">
                      {image.originalFilename}
                    </h3>
                    <p className="text-xs text-muted-foreground mb-2">
                      {formatFileSize(image.fileSize)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatDate(image.createdAt)}
                    </p>
                  </div>

                  {/* 操作按钮 */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2">
                    <button
                      onClick={() => window.open(image.url, '_blank')}
                      className="p-2 bg-background/80 rounded-md hover:bg-background transition-colors"
                      title="预览"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleCopyUrl(image.url)}
                      className="p-2 bg-background/80 rounded-md hover:bg-background transition-colors"
                      title="复制链接"
                    >
                      <Copy className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteImage(image.id)}
                      className="p-2 bg-destructive/80 rounded-md hover:bg-destructive transition-colors"
                      title="删除"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="space-y-2 mb-8">
              {images.map((image) => (
                <motion.div
                  key={image.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center space-x-4 p-4 bg-card rounded-lg border"
                >
                  {/* 选择框 */}
                  <input
                    type="checkbox"
                    checked={selectedImages.some(img => img.id === image.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedImages([...selectedImages, image]);
                      } else {
                        setSelectedImages(selectedImages.filter(img => img.id !== image.id));
                      }
                    }}
                    className="w-4 h-4 text-primary bg-background border-border rounded focus:ring-primary"
                  />

                  {/* 图片缩略图 */}
                  <div className="w-16 h-16 bg-muted rounded-md overflow-hidden flex-shrink-0">
                    <img
                      src={image.url}
                      alt={image.description || image.originalFilename}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* 图片信息 */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium truncate">{image.originalFilename}</h3>
                    <p className="text-sm text-muted-foreground">
                      {formatFileSize(image.fileSize)} • {image.contentType} • {formatDate(image.createdAt)}
                    </p>
                    {image.description && (
                      <p className="text-sm text-muted-foreground truncate">
                        {image.description}
                      </p>
                    )}
                  </div>

                  {/* 操作按钮 */}
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => window.open(image.url, '_blank')}
                      className="p-2 text-muted-foreground hover:text-primary transition-colors"
                      title="预览"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleCopyUrl(image.url)}
                      className="p-2 text-muted-foreground hover:text-primary transition-colors"
                      title="复制链接"
                    >
                      <Copy className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteImage(image.id)}
                      className="p-2 text-destructive hover:text-destructive/80 transition-colors"
                      title="删除"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* 分页 */}
          <Pagination
            currentPage={currentPage + 1}
            totalPages={totalPages}
            totalItems={totalItems}
            itemsPerPage={itemsPerPage}
            onPageChange={(page) => setCurrentPage(page - 1)}
            showInfo={true}
          />
        </>
      )}

      {/* 隐藏的文件输入 */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* 上传进度模态框 */}
      <AnimatePresence>
        {showUploadModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-background rounded-lg p-6 max-w-md w-full mx-4"
            >
              <h3 className="text-lg font-semibold mb-4">上传图片</h3>
              <div className="space-y-3">
                {uploadingFiles.map((file) => (
                  <div key={file.name} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm truncate">{file.name}</span>
                      <span className="text-sm text-muted-foreground">
                        {uploadProgress[file.name] === -1 ? '失败' : 
                         uploadProgress[file.name] === 100 ? '完成' : 
                         `${uploadProgress[file.name] || 0}%`}
                      </span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${
                          uploadProgress[file.name] === -1 ? 'bg-destructive' :
                          uploadProgress[file.name] === 100 ? 'bg-green-500' : 'bg-primary'
                        }`}
                        style={{ width: `${Math.max(0, uploadProgress[file.name] || 0)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex justify-end mt-6">
                <button
                  onClick={() => {
                    setShowUploadModal(false);
                    setUploadingFiles([]);
                    setUploadProgress({});
                  }}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
                >
                  关闭
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 删除确认模态框 */}
      <AnimatePresence>
        {showDeleteModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-background rounded-lg p-6 max-w-md w-full mx-4"
            >
              <h3 className="text-lg font-semibold mb-4">确认删除</h3>
              <p className="text-muted-foreground mb-6">
                确定要删除选中的 {selectedImages.length} 张图片吗？此操作不可撤销。
              </p>
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="px-4 py-2 bg-muted text-muted-foreground rounded-md hover:bg-muted/80 transition-colors"
                >
                  取消
                </button>
                <button
                  onClick={handleBatchDelete}
                  disabled={deletingImages.length > 0}
                  className="px-4 py-2 bg-destructive text-destructive-foreground rounded-md hover:bg-destructive/90 transition-colors disabled:opacity-50"
                >
                  {deletingImages.length > 0 ? '删除中...' : '确认删除'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
