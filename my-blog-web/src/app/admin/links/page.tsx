'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Link as LinkIcon,
  X,
  Save,
  ExternalLink,
  Eye,
  EyeOff
} from 'lucide-react';
import Image from "next/image";

// 模拟友链数据
const initialLinks = [
  {
    id: 1,
    name: '技术博客',
    url: 'https://tech-blog.com',
    description: '分享技术文章和开发经验',
    logo: 'https://via.placeholder.com/32x32',
    isVisible: true,
    sortOrder: 1,
    createdAt: '2024-01-01',
  },
  {
    id: 2,
    name: '前端开发',
    url: 'https://frontend-dev.com',
    description: '专注于前端技术的学习和分享',
    logo: 'https://via.placeholder.com/32x32',
    isVisible: true,
    sortOrder: 2,
    createdAt: '2024-01-01',
  },
  {
    id: 3,
    name: '设计灵感',
    url: 'https://design-inspiration.com',
    description: '收集优秀的设计作品和灵感',
    logo: 'https://via.placeholder.com/32x32',
    isVisible: false,
    sortOrder: 3,
    createdAt: '2024-01-01',
  },
];

interface Link {
  id: number;
  name: string;
  url: string;
  description: string;
  logo?: string;
  isVisible: boolean;
  sortOrder: number;
  createdAt: string;
}

export default function LinksManagement() {
  const [links, setLinks] = useState<Link[]>(initialLinks);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingLink, setEditingLink] = useState<Link | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    url: '',
    description: '',
    logo: '',
    isVisible: true,
    sortOrder: 0,
  });

  const filteredLinks = links.filter(link =>
    link.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    link.url.toLowerCase().includes(searchTerm.toLowerCase()) ||
    link.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddLink = () => {
    if (!formData.name.trim() || !formData.url.trim()) return;

    const newLink: Link = {
      id: Date.now(),
      name: formData.name,
      url: formData.url,
      description: formData.description,
      logo: formData.logo || undefined,
      isVisible: formData.isVisible,
      sortOrder: formData.sortOrder || links.length + 1,
      createdAt: new Date().toISOString(),
    };

    setLinks([...links, newLink]);
    setFormData({ name: '', url: '', description: '', logo: '', isVisible: true, sortOrder: 0 });
    setShowAddForm(false);
  };

  const handleEditLink = (link: Link) => {
    setEditingLink(link);
    setFormData({
      name: link.name,
      url: link.url,
      description: link.description,
      logo: link.logo || '',
      isVisible: link.isVisible,
      sortOrder: link.sortOrder,
    });
  };

  const handleUpdateLink = () => {
    if (!editingLink || !formData.name.trim() || !formData.url.trim()) return;

    setLinks(links.map(link =>
      link.id === editingLink.id
        ? {
            ...link,
            name: formData.name,
            url: formData.url,
            description: formData.description,
            logo: formData.logo || undefined,
            isVisible: formData.isVisible,
            sortOrder: formData.sortOrder,
          }
        : link
    ));

    setEditingLink(null);
    setFormData({ name: '', url: '', description: '', logo: '', isVisible: true, sortOrder: 0 });
  };

  const handleDeleteLink = (id: number) => {
    if (confirm('确定要删除这个友链吗？')) {
      setLinks(links.filter(link => link.id !== id));
    }
  };

  const handleToggleVisibility = (id: number) => {
    setLinks(links.map(link =>
      link.id === id
        ? { ...link, isVisible: !link.isVisible }
        : link
    ));
  };

  const handleCancel = () => {
    setShowAddForm(false);
    setEditingLink(null);
    setFormData({ name: '', url: '', description: '', logo: '', isVisible: true, sortOrder: 0 });
  };

  return (
    <div className="space-y-6">
      {/* 页面标题和操作 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">友链管理</h1>
          <p className="text-gray-600">管理友情链接，共 {links.length} 个友链</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowAddForm(true)}
          className="flex items-center space-x-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-4 py-2 rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-200"
        >
          <Plus className="h-4 w-4" />
          <span>添加友链</span>
        </motion.button>
      </div>

      {/* 搜索栏 */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        <input
          type="text"
          placeholder="搜索友链..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
        />
      </div>

      {/* 添加/编辑表单 */}
      <AnimatePresence>
        {(showAddForm || editingLink) && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                {editingLink ? '编辑友链' : '添加友链'}
              </h3>
              <button
                onClick={handleCancel}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  网站名称 *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="输入网站名称"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  网站链接 *
                </label>
                <input
                  type="url"
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="https://example.com"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  网站描述
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="输入网站描述"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Logo 链接
                </label>
                <input
                  type="url"
                  value={formData.logo}
                  onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="https://example.com/logo.png"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  排序
                </label>
                <input
                  type="number"
                  value={formData.sortOrder}
                  onChange={(e) => setFormData({ ...formData, sortOrder: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="排序数字"
                />
              </div>

              <div className="md:col-span-2">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.isVisible}
                    onChange={(e) => setFormData({ ...formData, isVisible: e.target.checked })}
                    className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                  />
                  <span className="text-sm font-medium text-gray-700">显示在友链页面</span>
                </label>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3 mt-6">
              <button
                onClick={handleCancel}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                取消
              </button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={editingLink ? handleUpdateLink : handleAddLink}
                className="flex items-center space-x-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-4 py-2 rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-200"
              >
                <Save className="h-4 w-4" />
                <span>{editingLink ? '更新' : '添加'}</span>
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 友链列表 */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">友链列表</h3>
        </div>
        <div className="divide-y divide-gray-200">
          {filteredLinks.length === 0 ? (
            <div className="p-8 text-center">
              <LinkIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">没有找到友链</p>
            </div>
          ) : (
            filteredLinks.map((link) => (
              <motion.div
                key={link.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-6 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    {link.logo ? (
                      <Image
                        src={link.logo}
                        alt={link.name}
                        width={48}
                        height={48}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
                        <LinkIcon className="h-6 w-6 text-white" />
                      </div>
                    )}
                    <div>
                      <div className="flex items-center space-x-2">
                        <h4 className="text-lg font-medium text-gray-900">{link.name}</h4>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          link.isVisible 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {link.isVisible ? '显示' : '隐藏'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500">{link.description}</p>
                      <div className="flex items-center space-x-4 mt-1">
                        <a
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-700 text-sm flex items-center space-x-1"
                        >
                          <span>{link.url}</span>
                          <ExternalLink className="h-3 w-3" />
                        </a>
                        <span className="text-sm text-gray-500">排序: {link.sortOrder}</span>
                        <span className="text-sm text-gray-500">
                          创建于 {new Date(link.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleToggleVisibility(link.id)}
                      className={`p-2 rounded-lg transition-colors ${
                        link.isVisible
                          ? 'text-gray-400 hover:text-green-600 hover:bg-green-50'
                          : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
                      }`}
                      title={link.isVisible ? '隐藏' : '显示'}
                    >
                      {link.isVisible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                    </button>
                    <button
                      onClick={() => handleEditLink(link)}
                      className="p-2 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteLink(link.id)}
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
    </div>
  );
}
