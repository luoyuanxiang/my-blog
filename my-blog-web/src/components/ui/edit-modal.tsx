'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, Tag as TagIcon, FolderOpen } from 'lucide-react';

interface FormData {
  name: string;
  slug: string;
  description: string;
  color: string;
}

interface EditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: FormData) => void;
  type: 'tag' | 'category';
  initialData?: FormData;
  title: string;
}

export function EditModal({ isOpen, onClose, onSubmit, type, initialData, title }: Readonly<EditModalProps>) {
  const [formData, setFormData] = useState<FormData>(() => {
    if (initialData) {
      return {
        name: initialData.name || '',
        slug: initialData.slug || '',
        description: initialData.description || '',
        color: initialData.color || '#3b82f6',
      };
    }
    return {
      name: '',
      slug: '',
      description: '',
      color: '#3b82f6',
    };
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    const data = {
      name: formData.name,
      slug: formData.slug || formData.name.toLowerCase().replace(/\s+/g, '-'),
      description: formData.description,
      color: formData.color,
    };

    onSubmit(data);
    onClose();
  };

  const handleCancel = () => {
    onClose();
  };

  const isTag = type === 'tag';
  const icon = isTag ? TagIcon : FolderOpen;

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
                {React.createElement(icon, { className: "h-5 w-5 text-primary" })}
                <h3 className="text-lg font-semibold">{title}</h3>
              </div>
              <button
                onClick={handleCancel}
                className="p-1 hover:bg-muted rounded-lg transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* 表单内容 */}
            <form onSubmit={handleSubmit} className="p-4 space-y-4">
              {/* 名称 */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  {isTag ? '标签名称' : '分类名称'} *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-3 border border-input rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                  placeholder={`输入${isTag ? '标签' : '分类'}名称`}
                  required
                />
              </div>

              {/* 别名 */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  {isTag ? '标签别名' : '分类别名'}
                </label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  className="w-full p-3 border border-input rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                  placeholder={`输入${isTag ? '标签' : '分类'}别名`}
                />
              </div>

              {/* 描述（仅分类） */}
              {!isTag && (
                <div>
                  <label className="block text-sm font-medium mb-2">分类描述</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full p-3 border border-input rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent resize-none"
                    placeholder="输入分类描述"
                    rows={3}
                  />
                </div>
              )}

              {/* 颜色 */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  {isTag ? '标签颜色' : '分类颜色'}
                </label>
                <div className="flex items-center space-x-3">
                  <input
                    type="color"
                    value={formData.color}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    className="w-12 h-10 border border-input rounded-lg cursor-pointer"
                  />
                  <input
                    type="text"
                    value={formData.color}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    className="flex-1 p-3 border border-input rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                    placeholder="#3b82f6"
                  />
                </div>
              </div>

              {/* 底部按钮 */}
              <div className="flex justify-end space-x-2 pt-4">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-4 py-2 border border-input rounded-lg hover:bg-muted transition-colors"
                >
                  取消
                </button>
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-white transition-all duration-200 ${
                    isTag 
                      ? 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700'
                      : 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700'
                  }`}
                >
                  <Save className="h-4 w-4" />
                  <span>{initialData ? '更新' : '添加'}</span>
                </motion.button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
