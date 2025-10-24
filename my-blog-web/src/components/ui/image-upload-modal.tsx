'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, Image as ImageIcon, Copy } from 'lucide-react';

interface ImageUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInsert: (imageMarkdown: string) => void;
}

export function ImageUploadModal({ isOpen, onClose, onInsert }: Readonly<ImageUploadModalProps>) {
  const [imageUrl, setImageUrl] = useState('');
  const [altText, setAltText] = useState('');
  const [title, setTitle] = useState('');
  const [dragActive, setDragActive] = useState(false);

  const handleFileUpload = (file: File) => {
    // 模拟文件上传
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setImageUrl(result);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = () => {
    setDragActive(false);
  };

  const handleInsert = () => {
    if (!imageUrl) return;
    
    let markdown = `![${altText}](${imageUrl})`;
    if (title) {
      markdown = `![${altText}](${imageUrl} "${title}")`;
    }
    
    onInsert(markdown);
    onClose();
    
    // 重置表单
    setImageUrl('');
    setAltText('');
    setTitle('');
  };

  const copyImageUrl = () => {
    navigator.clipboard.writeText(imageUrl);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-background rounded-xl border shadow-xl w-full max-w-md mx-4"
          >
            {/* 头部 */}
            <div className="flex items-center justify-between p-4 border-b">
              <div className="flex items-center space-x-2">
                <ImageIcon className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-semibold">插入图片</h3>
              </div>
              <button
                onClick={onClose}
                className="p-1 hover:bg-muted rounded-lg transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* 内容 */}
            <div className="p-4 space-y-4">
              {/* 图片URL输入 */}
              <div>
                <label className="block text-sm font-medium mb-2">图片地址</label>
                <div className="flex space-x-2">
                  <input
                    type="url"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="https://example.com/image.jpg"
                    className="flex-1 p-3 border border-input rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                  />
                  {imageUrl && (
                    <button
                      onClick={copyImageUrl}
                      className="p-3 border border-input rounded-lg hover:bg-muted transition-colors"
                      title="复制链接"
                    >
                      <Copy className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* 拖拽上传区域 */}
              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                  dragActive 
                    ? 'border-primary bg-primary/5' 
                    : 'border-muted-foreground/25 hover:border-muted-foreground/50'
                }`}
              >
                <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  拖拽图片到此处或点击上传
                </p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFileUpload(file);
                  }}
                  className="hidden"
                  id="image-upload"
                />
                <label
                  htmlFor="image-upload"
                  className="inline-block mt-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors cursor-pointer text-sm"
                >
                  选择文件
                </label>
              </div>

              {/* 图片预览 */}
              {imageUrl && (
                <div className="space-y-2">
                  <label className="block text-sm font-medium">预览</label>
                  <div className="border border-input rounded-lg p-2">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={imageUrl}
                      alt="预览"
                      className="max-w-full h-auto max-h-32 rounded"
                      onError={() => setImageUrl('')}
                    />
                  </div>
                </div>
              )}

              {/* 替代文本 */}
              <div>
                <label className="block text-sm font-medium mb-2">替代文本</label>
                <input
                  type="text"
                  value={altText}
                  onChange={(e) => setAltText(e.target.value)}
                  placeholder="图片描述（可选）"
                  className="w-full p-3 border border-input rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                />
              </div>

              {/* 标题 */}
              <div>
                <label className="block text-sm font-medium mb-2">标题</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="图片标题（可选）"
                  className="w-full p-3 border border-input rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                />
              </div>
            </div>

            {/* 底部按钮 */}
            <div className="flex justify-end space-x-2 p-4 border-t">
              <button
                onClick={onClose}
                className="px-4 py-2 border border-input rounded-lg hover:bg-muted transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleInsert}
                disabled={!imageUrl}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                插入图片
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
