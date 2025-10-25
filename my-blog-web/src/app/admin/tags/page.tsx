'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Tag as TagIcon,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { EditModal } from '@/components/ui/edit-modal';
import { Pagination, usePagination } from '@/components/ui/pagination';
import { tagApiService } from '@/lib/api/tags';
import type { Tag } from '@/types';

export default function TagsManagement() {
  const [tags, setTags] = useState<Tag[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingTag, setEditingTag] = useState<Tag | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingTag, setDeletingTag] = useState<Tag | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // 获取标签列表
  useEffect(() => {
    const fetchTags = async () => {
      try {
        setIsLoading(true);
        setError('');
        const response = await tagApiService.getAllTags();
        if (response.code === 200) {
          setTags(response.data);
        } else {
          setError('获取标签列表失败');
        }
      } catch (err: any) {
        setError(err.message || '获取标签列表失败');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTags();
  }, []);

  const filteredTags = tags.filter(tag =>
    tag.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tag.slug.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 分页功能
  const {
    currentPage,
    totalPages,
    totalItems,
    currentItems,
    goToPage,
  } = usePagination(filteredTags, 10);

  const handleAddTag = () => {
    setEditingTag(null);
    setShowModal(true);
  };

  const handleEditTag = (tag: Tag) => {
    setEditingTag(tag);
    setShowModal(true);
  };

  const handleSubmitTag = async (data: { name: string; slug: string; description: string; color: string }) => {
    try {
      if (editingTag) {
        // 更新标签
        const response = await tagApiService.updateTag(editingTag.id, {
          name: data.name,
          slug: data.slug,
          color: data.color
        });
        if (response.code === 200) {
          setTags(prev => prev.map(tag => 
            tag.id === editingTag.id ? response.data : tag
          ));
        }
      } else {
        // 添加新标签
        const response = await tagApiService.createTag({
          name: data.name,
          slug: data.slug,
          color: data.color,
          articleCount: 0
        });
        if (response.code === 200) {
          setTags(prev => [...prev, response.data]);
        }
      }
      setShowModal(false);
      setEditingTag(null);
    } catch (err: any) {
      console.error('保存标签失败:', err);
      setError(err.message || '保存标签失败');
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingTag(null);
  };

  const handleDeleteTag = (tag: Tag) => {
    setDeletingTag(tag);
    setShowDeleteModal(true);
  };

  const confirmDeleteTag = async () => {
    if (!deletingTag) return;
    
    try {
      const response = await tagApiService.deleteTag(deletingTag.id);
      if (response.code === 200) {
        setTags(prev => prev.filter(tag => tag.id !== deletingTag.id));
        setShowDeleteModal(false);
        setDeletingTag(null);
      }
    } catch (err: any) {
      console.error('删除标签失败:', err);
      setError(err.message || '删除标签失败');
    }
  };

  const cancelDeleteTag = () => {
    setShowDeleteModal(false);
    setDeletingTag(null);
  };

  return (
    <div className="space-y-6">
      {/* 页面标题和操作 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">标签管理</h1>
          <p className="text-gray-600">管理博客标签，共 {tags.length} 个标签</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleAddTag}
          className="flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200"
        >
          <Plus className="h-4 w-4" />
          <span>添加标签</span>
        </motion.button>
      </div>

      {/* 错误提示 */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center space-x-2">
          <AlertCircle className="w-5 h-5 text-red-500" />
          <span className="text-red-700">{error}</span>
        </div>
      )}

      {/* 加载状态 */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
          <span className="ml-2 text-gray-600">加载中...</span>
        </div>
      ) : (
        <>
          {/* 搜索栏 */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        <input
          type="text"
          placeholder="搜索标签..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>


      {/* 标签列表 */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">标签列表</h3>
        </div>
        <div className="divide-y divide-gray-200">
          {currentItems.length === 0 ? (
            <div className="p-8 text-center">
              <TagIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">没有找到标签</p>
            </div>
          ) : (
            currentItems.map((tag) => (
              <motion.div
                key={tag.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-6 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: tag.color }}
                    />
                    <div>
                      <h4 className="text-lg font-medium text-gray-900">{tag.name}</h4>
                      <p className="text-sm text-gray-500">别名: {tag.slug}</p>
                      <p className="text-sm text-gray-500">
                        {tag.articleCount} 篇文章 • 创建于 {new Date(tag.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleEditTag(tag)}
                      className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteTag(tag)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
        
        {/* 分页组件 */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={totalItems}
              itemsPerPage={10}
              onPageChange={goToPage}
            />
          </div>
        )}
      </div>
        </>
      )}

      {/* 编辑弹窗 */}
      <EditModal
        key={editingTag ? `edit-${editingTag.id}` : 'add'}
        isOpen={showModal}
        onClose={handleCloseModal}
        onSubmit={handleSubmitTag}
        type="tag"
        initialData={editingTag ? {
          name: editingTag.name,
          slug: editingTag.slug,
          description: '', // 标签没有description字段，使用空字符串
          color: editingTag.color || '#3b82f6'
        } : undefined}
        title={editingTag ? '编辑标签' : '添加标签'}
      />

      {/* 删除确认对话框 */}
      {showDeleteModal && deletingTag && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <Trash2 className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">删除标签</h3>
                <p className="text-sm text-gray-500">此操作不可撤销</p>
              </div>
            </div>
            
            <div className="mb-6">
              <p className="text-gray-700 mb-2">
                确定要删除标签 <span className="font-semibold text-blue-600">"{deletingTag.name}"</span> 吗？
              </p>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <div className="flex items-start space-x-2">
                  <AlertCircle className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-yellow-800">
                    <p className="font-medium">删除后影响：</p>
                    <ul className="mt-1 space-y-1">
                      <li>• 该标签将从所有文章中移除</li>
                      <li>• 相关文章将失去此标签分类</li>
                      <li>• 此操作无法撤销</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-end space-x-3">
              <button
                onClick={cancelDeleteTag}
                className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                取消
              </button>
              <button
                onClick={confirmDeleteTag}
                className="px-4 py-2 bg-red-600 text-white hover:bg-red-700 rounded-lg transition-colors"
              >
                确认删除
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
