'use client';

import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, X, Image as ImageIcon, Check, AlertCircle } from 'lucide-react';
import { imageApiService } from '@/lib/api/images';
import type { ImageUploadResponse } from '@/lib/api/images';

interface ImageUploadProps {
  onUploadSuccess?: (image: ImageUploadResponse) => void;
  onUploadError?: (error: string) => void;
  multiple?: boolean;
  maxSize?: number; // MB
  acceptedTypes?: string[];
  className?: string;
  description?: string;
}

interface UploadFile {
  file: File;
  id: string;
  progress: number;
  status: 'uploading' | 'success' | 'error';
  error?: string;
  result?: ImageUploadResponse;
}

export function ImageUpload({
  onUploadSuccess,
  onUploadError,
  multiple = false,
  maxSize = 10, // 10MB
  acceptedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  className = '',
  description = ''
}: ImageUploadProps) {
  const [uploadFiles, setUploadFiles] = useState<UploadFile[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 验证文件
  const validateFile = (file: File): string | null => {
    if (!acceptedTypes.includes(file.type)) {
      return `不支持的文件类型: ${file.type}`;
    }
    
    if (file.size > maxSize * 1024 * 1024) {
      return `文件大小超过限制: ${maxSize}MB`;
    }
    
    return null;
  };

  // 上传文件
  const uploadFile = async (file: File): Promise<void> => {
    const fileId = Math.random().toString(36).substr(2, 9);
    const uploadFile: UploadFile = {
      file,
      id: fileId,
      progress: 0,
      status: 'uploading'
    };

    setUploadFiles(prev => [...prev, uploadFile]);

    try {
      const response = await imageApiService.uploadImage(file, description, 'admin');
      
      if (response.code === 200 && response.data) {
        setUploadFiles(prev => 
          prev.map(f => 
            f.id === fileId 
              ? { ...f, progress: 100, status: 'success', result: response.data }
              : f
          )
        );
        
        onUploadSuccess?.(response.data);
      } else {
        throw new Error(response.message || '上传失败');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '上传失败';
      setUploadFiles(prev => 
        prev.map(f => 
          f.id === fileId 
            ? { ...f, status: 'error', error: errorMessage }
            : f
        )
      );
      onUploadError?.(errorMessage);
    }
  };

  // 处理文件选择
  const handleFileSelect = useCallback((files: FileList) => {
    const fileArray = Array.from(files);
    
    fileArray.forEach(file => {
      const validationError = validateFile(file);
      if (validationError) {
        onUploadError?.(validationError);
        return;
      }
      
      uploadFile(file);
    });
  }, [maxSize, acceptedTypes, onUploadError]);

  // 文件输入变化
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files);
    }
    // 清空input值，允许重复选择同一文件
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // 拖拽处理
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleFileSelect(files);
    }
  };

  // 移除文件
  const removeFile = (fileId: string) => {
    setUploadFiles(prev => prev.filter(f => f.id !== fileId));
  };

  // 格式化文件大小
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className={className}>
      {/* 上传区域 */}
      <div
        className={`
          relative border-2 border-dashed rounded-lg p-8 text-center transition-colors
          ${isDragOver 
            ? 'border-primary bg-primary/5' 
            : 'border-muted-foreground/25 hover:border-primary/50 hover:bg-primary/5'
          }
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple={multiple}
          accept={acceptedTypes.join(',')}
          onChange={handleFileInputChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        
        <div className="space-y-4">
          <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
            <Upload className="h-6 w-6 text-primary" />
          </div>
          
          <div>
            <p className="text-lg font-medium">
              拖拽图片到此处或{' '}
              <span className="text-primary cursor-pointer">点击选择</span>
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              支持 {acceptedTypes.map(type => type.split('/')[1].toUpperCase()).join(', ')} 格式
            </p>
            <p className="text-sm text-muted-foreground">
              最大文件大小: {maxSize}MB
            </p>
          </div>
        </div>
      </div>

      {/* 上传文件列表 */}
      <AnimatePresence>
        {uploadFiles.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 space-y-2"
          >
            {uploadFiles.map((uploadFile) => (
              <motion.div
                key={uploadFile.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="flex items-center space-x-3 p-3 bg-card rounded-lg border"
              >
                {/* 文件图标 */}
                <div className="flex-shrink-0">
                  {uploadFile.status === 'success' ? (
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <Check className="h-4 w-4 text-green-600" />
                    </div>
                  ) : uploadFile.status === 'error' ? (
                    <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                      <AlertCircle className="h-4 w-4 text-red-600" />
                    </div>
                  ) : (
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <ImageIcon className="h-4 w-4 text-blue-600" />
                    </div>
                  )}
                </div>

                {/* 文件信息 */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    {uploadFile.file.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatFileSize(uploadFile.file.size)}
                  </p>
                  {uploadFile.error && (
                    <p className="text-xs text-red-600">
                      {uploadFile.error}
                    </p>
                  )}
                </div>

                {/* 进度条 */}
                {uploadFile.status === 'uploading' && (
                  <div className="flex-1 max-w-32">
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full transition-all duration-300"
                        style={{ width: `${uploadFile.progress}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* 移除按钮 */}
                <button
                  onClick={() => removeFile(uploadFile.id)}
                  className="flex-shrink-0 p-1 text-muted-foreground hover:text-destructive transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
