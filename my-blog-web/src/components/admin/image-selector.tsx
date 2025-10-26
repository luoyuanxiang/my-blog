'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  X, 
  Check, 
  Image as ImageIcon, 
  Upload,
  Grid3X3,
  List,
  Copy,
  Eye
} from 'lucide-react';
import { imageApiService } from '@/lib/api/images';
import { ImageUpload } from './image-upload';
import type { Image, ImageUploadResponse } from '@/lib/api/images';

interface ImageSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (image: Image) => void;
  multiple?: boolean;
  selectedImages?: Image[];
  className?: string;
}

export function ImageSelector({
  isOpen,
  onClose,
  onSelect,
  multiple = false,
  selectedImages = [],
  className = ''
}: ImageSelectorProps) {
  const [images, setImages] = useState<Image[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [activeTab, setActiveTab] = useState<'library' | 'upload'>('library');

  // 获取图片列表
  const fetchImages = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await imageApiService.getImages(0, 50, searchTerm);
      
      if (response.code === 200 && response.data) {
        setImages(response.data.images);
      } else {
        // 使用示例数据
        const sampleImages: Image[] = [
          {
            id: '1',
            filename: 'sample-image-1.jpg',
            originalName: 'sample-image-1.jpg',
            url: '/api/images/sample-image-1.jpg',
            path: '/uploads/sample-image-1.jpg',
            size: 1024000,
            mimeType: 'image/jpeg',
            width: 1920,
            height: 1080,
            alt: '示例图片1',
            description: '这是一个示例图片',
            uploadedAt: '2024-01-15T10:30:00Z',
            uploadedBy: 'admin'
          },
          {
            id: '2',
            filename: 'sample-image-2.png',
            originalName: 'sample-image-2.png',
            url: '/api/images/sample-image-2.png',
            path: '/uploads/sample-image-2.png',
            size: 2048000,
            mimeType: 'image/png',
            width: 800,
            height: 600,
            alt: '示例图片2',
            description: '这是另一个示例图片',
            uploadedAt: '2024-01-16T14:20:00Z',
            uploadedBy: 'admin'
          }
        ];
        setImages(sampleImages);
      }
    } catch (err) {
      console.error('获取图片列表失败:', err);
      setError('获取图片列表失败');
    } finally {
      setIsLoading(false);
    }
  };

  // 搜索时获取图片
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchImages();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  // 处理图片选择
  const handleImageSelect = (image: Image) => {
    if (multiple) {
      // 多选模式
      const isSelected = selectedImages.some(img => img.id === image.id);
      if (isSelected) {
        // 取消选择
        const newSelected = selectedImages.filter(img => img.id !== image.id);
        // 这里需要父组件处理多选状态
      } else {
        // 添加选择
        onSelect(image);
      }
    } else {
      // 单选模式
      onSelect(image);
      onClose();
    }
  };

  // 处理上传成功
  const handleUploadSuccess = (uploadResult: ImageUploadResponse) => {
    // 将上传结果转换为Image格式
    const newImage: Image = {
      id: uploadResult.id,
      filename: uploadResult.filename,
      originalName: uploadResult.filename,
      url: uploadResult.url,
      path: uploadResult.path,
      size: uploadResult.size,
      mimeType: uploadResult.mimeType,
      width: uploadResult.width,
      height: uploadResult.height,
      uploadedAt: new Date().toISOString(),
      uploadedBy: 'admin'
    };

    setImages(prev => [newImage, ...prev]);
    
    // 自动选择新上传的图片
    if (!multiple) {
      onSelect(newImage);
      onClose();
    }
  };

  // 复制图片URL
  const handleCopyUrl = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
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

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className={`bg-background rounded-lg shadow-xl max-w-4xl w-full max-h-[80vh] flex flex-col ${className}`}
        >
          {/* 头部 */}
          <div className="flex items-center justify-between p-6 border-b">
            <h2 className="text-xl font-semibold">选择图片</h2>
            <button
              onClick={onClose}
              className="p-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* 标签页 */}
          <div className="flex border-b">
            <button
              onClick={() => setActiveTab('library')}
              className={`px-6 py-3 text-sm font-medium transition-colors ${
                activeTab === 'library'
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              图片库
            </button>
            <button
              onClick={() => setActiveTab('upload')}
              className={`px-6 py-3 text-sm font-medium transition-colors ${
                activeTab === 'upload'
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              上传图片
            </button>
          </div>

          {/* 内容区域 */}
          <div className="flex-1 overflow-hidden">
            {activeTab === 'library' ? (
              <div className="h-full flex flex-col">
                {/* 搜索和视图控制 */}
                <div className="p-4 border-b flex items-center space-x-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <input
                      type="text"
                      placeholder="搜索图片..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-input rounded-md bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                    />
                  </div>
                  
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

                {/* 图片列表 */}
                <div className="flex-1 overflow-auto p-4">
                  {isLoading ? (
                    <div className="flex items-center justify-center h-32">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>
                  ) : error ? (
                    <div className="text-center py-8">
                      <p className="text-destructive">{error}</p>
                    </div>
                  ) : images.length === 0 ? (
                    <div className="text-center py-8">
                      <ImageIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">暂无图片</p>
                    </div>
                  ) : viewMode === 'grid' ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                      {images.map((image) => {
                        const isSelected = selectedImages.some(img => img.id === image.id);
                        return (
                          <motion.div
                            key={image.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className={`relative group cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${
                              isSelected ? 'border-primary ring-2 ring-primary/20' : 'border-border hover:border-primary/50'
                            }`}
                            onClick={() => handleImageSelect(image)}
                          >
                            {/* 选择状态 */}
                            {isSelected && (
                              <div className="absolute top-2 right-2 z-10 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                                <Check className="h-4 w-4 text-primary-foreground" />
                              </div>
                            )}

                            {/* 图片预览 */}
                            <div className="aspect-square bg-muted flex items-center justify-center">
                              <img
                                src={image.url}
                                alt={image.alt || image.originalName}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.currentTarget.style.display = 'none';
                                  e.currentTarget.nextElementSibling?.classList.remove('hidden');
                                }}
                              />
                              <div className="hidden w-full h-full flex items-center justify-center">
                                <ImageIcon className="h-8 w-8 text-muted-foreground" />
                              </div>
                            </div>

                            {/* 图片信息 */}
                            <div className="p-2">
                              <p className="text-xs font-medium truncate">
                                {image.originalName}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {formatFileSize(image.size)}
                              </p>
                            </div>

                            {/* 操作按钮 */}
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  window.open(image.url, '_blank');
                                }}
                                className="p-2 bg-background/80 rounded-md hover:bg-background transition-colors"
                                title="预览"
                              >
                                <Eye className="h-4 w-4" />
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleCopyUrl(image.url);
                                }}
                                className="p-2 bg-background/80 rounded-md hover:bg-background transition-colors"
                                title="复制链接"
                              >
                                <Copy className="h-4 w-4" />
                              </button>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {images.map((image) => {
                        const isSelected = selectedImages.some(img => img.id === image.id);
                        return (
                          <motion.div
                            key={image.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className={`flex items-center space-x-4 p-3 rounded-lg border cursor-pointer transition-all ${
                              isSelected ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
                            }`}
                            onClick={() => handleImageSelect(image)}
                          >
                            {/* 选择状态 */}
                            <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                              isSelected ? 'bg-primary border-primary' : 'border-border'
                            }`}>
                              {isSelected && <Check className="h-3 w-3 text-primary-foreground" />}
                            </div>

                            {/* 图片缩略图 */}
                            <div className="w-12 h-12 bg-muted rounded-md overflow-hidden flex-shrink-0">
                              <img
                                src={image.url}
                                alt={image.alt || image.originalName}
                                className="w-full h-full object-cover"
                              />
                            </div>

                            {/* 图片信息 */}
                            <div className="flex-1 min-w-0">
                              <p className="font-medium truncate">{image.originalName}</p>
                              <p className="text-sm text-muted-foreground">
                                {formatFileSize(image.size)} • {image.mimeType}
                              </p>
                              {image.alt && (
                                <p className="text-sm text-muted-foreground truncate">
                                  Alt: {image.alt}
                                </p>
                              )}
                            </div>

                            {/* 操作按钮 */}
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  window.open(image.url, '_blank');
                                }}
                                className="p-2 text-muted-foreground hover:text-primary transition-colors"
                                title="预览"
                              >
                                <Eye className="h-4 w-4" />
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleCopyUrl(image.url);
                                }}
                                className="p-2 text-muted-foreground hover:text-primary transition-colors"
                                title="复制链接"
                              >
                                <Copy className="h-4 w-4" />
                              </button>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="p-6">
                <ImageUpload
                  onUploadSuccess={handleUploadSuccess}
                  onUploadError={(error) => console.error('上传失败:', error)}
                  multiple={false}
                  className="max-w-md mx-auto"
                />
              </div>
            )}
          </div>

          {/* 底部操作 */}
          {activeTab === 'library' && multiple && (
            <div className="p-6 border-t flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                已选择 {selectedImages.length} 张图片
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={onClose}
                  className="px-4 py-2 bg-muted text-muted-foreground rounded-md hover:bg-muted/80 transition-colors"
                >
                  取消
                </button>
                <button
                  onClick={onClose}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
                >
                  确定
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
