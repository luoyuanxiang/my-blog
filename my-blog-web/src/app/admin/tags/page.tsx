'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Tag as TagIcon
} from 'lucide-react';
import { EditModal } from '@/components/ui/edit-modal';

// 模拟标签数据
const initialTags = [
  { id: 1, name: 'React', slug: 'react', color: '#61dafb', articleCount: 12, createdAt: '2024-01-01' },
  { id: 2, name: 'Next.js', slug: 'nextjs', color: '#000000', articleCount: 8, createdAt: '2024-01-01' },
  { id: 3, name: 'TypeScript', slug: 'typescript', color: '#3178c6', articleCount: 10, createdAt: '2024-01-01' },
  { id: 4, name: 'JavaScript', slug: 'javascript', color: '#f7df1e', articleCount: 15, createdAt: '2024-01-01' },
  { id: 5, name: 'Node.js', slug: 'nodejs', color: '#339933', articleCount: 6, createdAt: '2024-01-01' },
  { id: 6, name: 'CSS', slug: 'css', color: '#1572b6', articleCount: 9, createdAt: '2024-01-01' },
];

interface Tag {
  id: number;
  name: string;
  slug: string;
  color: string;
  articleCount: number;
  createdAt: string;
}

export default function TagsManagement() {
  const [tags, setTags] = useState<Tag[]>(initialTags);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingTag, setEditingTag] = useState<Tag | null>(null);

  const filteredTags = tags.filter(tag =>
    tag.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tag.slug.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddTag = () => {
    setEditingTag(null);
    setShowModal(true);
  };

  const handleEditTag = (tag: Tag) => {
    setEditingTag(tag);
    setShowModal(true);
  };

  const handleSubmitTag = (data: { name: string; slug: string; description: string; color: string }) => {
    if (editingTag) {
      // 更新标签
      setTags(tags.map(tag =>
        tag.id === editingTag.id
          ? {
              ...tag,
              name: data.name,
              slug: data.slug,
              color: data.color,
            }
          : tag
      ));
    } else {
      // 添加新标签
      const newTag: Tag = {
        id: Date.now(),
        name: data.name,
        slug: data.slug,
        color: data.color,
        articleCount: 0,
        createdAt: new Date().toISOString(),
      };
      setTags([...tags, newTag]);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingTag(null);
  };

  const handleDeleteTag = (id: number) => {
    if (confirm('确定要删除这个标签吗？')) {
      setTags(tags.filter(tag => tag.id !== id));
    }
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
          {filteredTags.length === 0 ? (
            <div className="p-8 text-center">
              <TagIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">没有找到标签</p>
            </div>
          ) : (
            filteredTags.map((tag) => (
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
                      onClick={() => handleDeleteTag(tag.id)}
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
    </div>
  );
}
