'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  FolderOpen,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { EditModal } from '@/components/ui/edit-modal';
import { Pagination, usePagination } from '@/components/ui/pagination';
import { categoryApiService } from '@/lib/api/categories';
import type { Category } from '@/types';

export default function CategoriesManagement() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingCategory, setDeletingCategory] = useState<Category | null>(null);

  // 获取分类列表
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoading(true);
        setError('');
        const response = await categoryApiService.getAllCategories();
        if (response.code === 200) {
          setCategories(response.data);
        } else {
          setError('获取分类列表失败');
        }
      } catch (err: any) {
        setError(err.message || '获取分类列表失败');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.slug.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (category.description && category.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // 分页功能
  const {
    currentPage,
    totalPages,
    totalItems,
    currentItems,
    goToPage,
  } = usePagination(filteredCategories, 10);

  const handleAddCategory = () => {
    setEditingCategory(null);
    setShowModal(true);
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    setShowModal(true);
  };

  const handleSubmitCategory = async (data: { name: string; slug: string; description: string; color: string }) => {
    try {
      if (editingCategory) {
        // 更新分类
        const response = await categoryApiService.updateCategory(editingCategory.id, {
          name: data.name,
          slug: data.slug,
          description: data.description,
          color: data.color
        });
        if (response.code === 200) {
          setCategories(prev => prev.map(category => 
            category.id === editingCategory.id ? response.data : category
          ));
        }
      } else {
        // 添加新分类
        const response = await categoryApiService.createCategory({
          name: data.name,
          slug: data.slug,
          description: data.description,
          color: data.color,
          articleCount: 0
        });
        if (response.code === 200) {
          setCategories(prev => [...prev, response.data]);
        }
      }
      setShowModal(false);
      setEditingCategory(null);
    } catch (err: any) {
      console.error('保存分类失败:', err);
      setError(err.message || '保存分类失败');
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingCategory(null);
  };

  const handleDeleteCategory = (category: Category) => {
    setDeletingCategory(category);
    setShowDeleteModal(true);
  };

  const confirmDeleteCategory = async () => {
    if (!deletingCategory) return;
    
    try {
      const response = await categoryApiService.deleteCategory(deletingCategory.id);
      if (response.code === 200) {
        setCategories(prev => prev.filter(category => category.id !== deletingCategory.id));
        setShowDeleteModal(false);
        setDeletingCategory(null);
      }
    } catch (err: any) {
      console.error('删除分类失败:', err);
      setError(err.message || '删除分类失败');
    }
  };

  const cancelDeleteCategory = () => {
    setShowDeleteModal(false);
    setDeletingCategory(null);
  };

  return (
    <div className="space-y-6">
      {/* 页面标题和操作 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">分类管理</h1>
          <p className="text-gray-600">管理博客分类，共 {categories.length} 个分类</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleAddCategory}
          className="flex items-center space-x-2 bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-200"
        >
          <Plus className="h-4 w-4" />
          <span>添加分类</span>
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
          <Loader2 className="w-8 h-8 animate-spin text-green-500" />
          <span className="ml-2 text-gray-600">加载中...</span>
        </div>
      ) : (
        <>
          {/* 搜索栏 */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        <input
          type="text"
          placeholder="搜索分类..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
        />
      </div>


      {/* 分类列表 */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">分类列表</h3>
        </div>
        <div className="divide-y divide-gray-200">
          {currentItems.length === 0 ? (
            <div className="p-8 text-center">
              <FolderOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">没有找到分类</p>
            </div>
          ) : (
            currentItems.map((category) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-6 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: category.color }}
                    />
                    <div>
                      <h4 className="text-lg font-medium text-gray-900">{category.name}</h4>
                      <p className="text-sm text-gray-500">别名: {category.slug}</p>
                      <p className="text-sm text-gray-500">{category.description}</p>
                      <p className="text-sm text-gray-500">
                        {category.articleCount} 篇文章 • 创建于 {new Date(category.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleEditCategory(category)}
                      className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteCategory(category)}
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
        key={editingCategory ? `edit-${editingCategory.id}` : 'add'}
        isOpen={showModal}
        onClose={handleCloseModal}
        onSubmit={handleSubmitCategory}
        type="category"
        initialData={editingCategory ? {
          name: editingCategory.name,
          slug: editingCategory.slug,
          description: editingCategory.description || '',
          color: editingCategory.color || '#3b82f6'
        } : undefined}
        title={editingCategory ? '编辑分类' : '添加分类'}
      />

      {/* 删除确认对话框 */}
      {showDeleteModal && deletingCategory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <Trash2 className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">删除分类</h3>
                <p className="text-sm text-gray-500">此操作不可撤销</p>
              </div>
            </div>
            
            <div className="mb-6">
              <p className="text-gray-700 mb-2">
                确定要删除分类 <span className="font-semibold text-green-600">"{deletingCategory.name}"</span> 吗？
              </p>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <div className="flex items-start space-x-2">
                  <AlertCircle className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-yellow-800">
                    <p className="font-medium">删除后影响：</p>
                    <ul className="mt-1 space-y-1">
                      <li>• 该分类下的所有文章将变为未分类状态</li>
                      <li>• 相关文章将失去此分类归属</li>
                      <li>• 此操作无法撤销</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-end space-x-3">
              <button
                onClick={cancelDeleteCategory}
                className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                取消
              </button>
              <button
                onClick={confirmDeleteCategory}
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
