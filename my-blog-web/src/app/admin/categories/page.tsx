'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  FolderOpen
} from 'lucide-react';
import { EditModal } from '@/components/ui/edit-modal';

// 模拟分类数据
const initialCategories = [
  { id: 1, name: '前端开发', slug: 'frontend', description: '前端技术相关文章', color: '#3B82F6', articleCount: 15, createdAt: '2024-01-01' },
  { id: 2, name: '编程语言', slug: 'programming', description: '编程语言相关文章', color: '#10B981', articleCount: 8, createdAt: '2024-01-01' },
  { id: 3, name: '工具与框架', slug: 'tools', description: '开发工具和框架', color: '#F59E0B', articleCount: 12, createdAt: '2024-01-01' },
  { id: 4, name: '算法与数据结构', slug: 'algorithms', description: '算法和数据结构', color: '#EF4444', articleCount: 6, createdAt: '2024-01-01' },
];

interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
  color: string;
  articleCount: number;
  createdAt: string;
}

export default function CategoriesManagement() {
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.slug.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddCategory = () => {
    setEditingCategory(null);
    setShowModal(true);
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    setShowModal(true);
  };

  const handleSubmitCategory = (data: { name: string; slug: string; description: string; color: string }) => {
    if (editingCategory) {
      // 更新分类
      setCategories(categories.map(category =>
        category.id === editingCategory.id
          ? {
              ...category,
              name: data.name,
              slug: data.slug,
              description: data.description,
              color: data.color,
            }
          : category
      ));
    } else {
      // 添加新分类
      const newCategory: Category = {
        id: Date.now(),
        name: data.name,
        slug: data.slug,
        description: data.description,
        color: data.color,
        articleCount: 0,
        createdAt: new Date().toISOString(),
      };
      setCategories([...categories, newCategory]);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingCategory(null);
  };

  const handleDeleteCategory = (id: number) => {
    if (confirm('确定要删除这个分类吗？删除后相关文章将变为未分类状态。')) {
      setCategories(categories.filter(category => category.id !== id));
    }
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
          {filteredCategories.length === 0 ? (
            <div className="p-8 text-center">
              <FolderOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">没有找到分类</p>
            </div>
          ) : (
            filteredCategories.map((category) => (
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
                      onClick={() => handleDeleteCategory(category.id)}
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
      </div>

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
    </div>
  );
}
