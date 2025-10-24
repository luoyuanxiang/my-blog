'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, File, AlertCircle } from 'lucide-react';

interface FileImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (content: string, type: 'html' | 'markdown' | 'json') => void;
  editorType: 'rich' | 'markdown';
}

export function FileImportModal({ isOpen, onClose, onImport, editorType }: Readonly<FileImportModalProps>) {
  const [dragActive, setDragActive] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (file: File) => {
    setIsProcessing(true);
    setError('');

    try {
      const fileExtension = file.name.split('.').pop()?.toLowerCase();

      switch (fileExtension) {
        case 'docx':
          if (editorType === 'rich') {
            await handleWordDocument(file);
          } else {
            setError('Word文档只能导入到富文本编辑器');
          }
          break;

        case 'md':
        case 'markdown':
          if (editorType === 'markdown') {
            await handleMarkdownFile(file);
          } else {
            setError('Markdown文件只能导入到Markdown编辑器');
          }
          break;

        case 'json':
          await handleJsonFile(file);
          break;

        case 'txt':
          await handleTextFile(file);
          break;

        default:
          setError(`不支持的文件格式: .${fileExtension}`);
      }
    } catch (err) {
      setError(`文件处理失败: ${err instanceof Error ? err.message : '未知错误'}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleWordDocument = async (file: File) => {
    try {
      // 动态导入mammoth
      const mammoth = await import('mammoth');
      
      const arrayBuffer = await file.arrayBuffer();
      const result = await mammoth.convertToHtml({ arrayBuffer });
      
      onImport(result.value, 'html');
      onClose();
    } catch {
      throw new Error('Word文档解析失败');
    }
  };

  const handleMarkdownFile = async (file: File) => {
    const content = await file.text();
    onImport(content, 'markdown');
    onClose();
  };

  const handleJsonFile = async (file: File) => {
    const content = await file.text();
    try {
      const jsonData = JSON.parse(content);
      
      // 尝试从JSON中提取内容
      let extractedContent = '';
      
      if (jsonData.content) {
        extractedContent = jsonData.content;
      } else if (jsonData.text) {
        extractedContent = jsonData.text;
      } else if (jsonData.body) {
        extractedContent = jsonData.body;
      } else if (typeof jsonData === 'string') {
        extractedContent = jsonData;
      } else {
        // 如果是对象，尝试转换为字符串
        extractedContent = JSON.stringify(jsonData, null, 2);
      }

      const contentType = editorType === 'rich' ? 'html' : 'markdown';
      onImport(extractedContent, contentType);
      onClose();
    } catch {
      throw new Error('JSON文件格式不正确');
    }
  };

  const handleTextFile = async (file: File) => {
    const content = await file.text();
    const contentType = editorType === 'rich' ? 'html' : 'markdown';
    onImport(content, contentType);
    onClose();
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

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const getAcceptedTypes = () => {
    if (editorType === 'rich') {
      return '.docx,.json,.txt';
    } else {
      return '.md,.markdown,.json,.txt';
    }
  };

  const getSupportedFormats = () => {
    if (editorType === 'rich') {
      return ['Word文档 (.docx)', 'JSON文件 (.json)', '文本文件 (.txt)'];
    } else {
      return ['Markdown文件 (.md)', 'JSON文件 (.json)', '文本文件 (.txt)'];
    }
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
                <Upload className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-semibold">导入文档</h3>
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
              {/* 错误提示 */}
              {error && (
                <div className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700">
                  <AlertCircle className="h-4 w-4 flex-shrink-0" />
                  <span className="text-sm">{error}</span>
                </div>
              )}

              {/* 拖拽上传区域 */}
              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                  dragActive 
                    ? 'border-primary bg-primary/5' 
                    : 'border-muted-foreground/25 hover:border-muted-foreground/50'
                } ${isProcessing ? 'opacity-50 pointer-events-none' : ''}`}
              >
                <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm text-muted-foreground mb-2">
                  {isProcessing ? '正在处理文件...' : '拖拽文件到此处或点击上传'}
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept={getAcceptedTypes()}
                  onChange={handleFileInputChange}
                  className="hidden"
                  id="file-upload"
                  disabled={isProcessing}
                />
                <label
                  htmlFor="file-upload"
                  className={`inline-block px-4 py-2 rounded-lg transition-colors cursor-pointer text-sm ${
                    isProcessing 
                      ? 'bg-muted text-muted-foreground cursor-not-allowed' 
                      : 'bg-primary text-primary-foreground hover:bg-primary/90'
                  }`}
                >
                  {isProcessing ? '处理中...' : '选择文件'}
                </label>
              </div>

              {/* 支持的文件格式 */}
              <div>
                <h4 className="text-sm font-medium mb-2">支持的文件格式：</h4>
                <ul className="space-y-1">
                  {getSupportedFormats().map((format, index) => (
                    <li key={index} className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <File className="h-3 w-3" />
                      <span>{format}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* 使用说明 */}
              <div className="bg-muted/50 rounded-lg p-3">
                <h4 className="text-sm font-medium mb-2">使用说明：</h4>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>• Word文档会自动转换为HTML格式</li>
                  <li>• Markdown文件保持原始格式</li>
                  <li>• JSON文件会尝试提取content、text或body字段</li>
                  <li>• 文本文件会按当前编辑器类型处理</li>
                </ul>
              </div>
            </div>

            {/* 底部按钮 */}
            <div className="flex justify-end space-x-2 p-4 border-t">
              <button
                onClick={onClose}
                disabled={isProcessing}
                className="px-4 py-2 border border-input rounded-lg hover:bg-muted transition-colors disabled:opacity-50"
              >
                取消
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
