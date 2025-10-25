'use client';

import { useState, useEffect } from 'react';
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
  EyeOff,
  Loader2,
  AlertCircle,
  CheckCircle,
  Clock,
  Mail
} from 'lucide-react';
import Image from "next/image";
import { Pagination, usePagination } from '@/components/ui/pagination';
import { friendLinkApiService } from '@/lib/api/friend-links';
import { urlMetadataApiService } from '@/lib/api/url-metadata';
import type { FriendLink } from '@/types';

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
  const [links, setLinks] = useState<FriendLink[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingLink, setEditingLink] = useState<FriendLink | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingLink, setDeletingLink] = useState<FriendLink | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    url: '',
    description: '',
      logo: '',
    isApproved: true,
    sortOrder: 0,
    email: '',
  });
  const [isFetchingMetadata, setIsFetchingMetadata] = useState(false);
  const [metadataError, setMetadataError] = useState('');

  // 获取友链列表
  useEffect(() => {
    const fetchLinks = async () => {
      try {
        setIsLoading(true);
        setError('');
        const response = await friendLinkApiService.getFriendLinks(0, 1000);
        if (response.code === 200 && response.data && Array.isArray(response.data.content)) {
          setLinks(response.data.content);
        } else {
          setError('获取友链列表失败');
          setLinks([]); // 确保links始终是数组
        }
      } catch (err: any) {
        setError(err.message || '获取友链列表失败');
        setLinks([]); // 确保links始终是数组
      } finally {
        setIsLoading(false);
      }
    };

    fetchLinks();
  }, []);

  const filteredLinks = (Array.isArray(links) ? links : []).filter(link =>
    link.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    link.url.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (link.description && link.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // 分页功能
  const {
    currentPage,
    totalPages,
    totalItems,
    currentItems,
    goToPage,
  } = usePagination(filteredLinks, 10);

  const handleAddLink = async () => {
    if (!formData.name.trim() || !formData.url.trim()) return;

    try {
      const response = await friendLinkApiService.createFriendLink({
        name: formData.name,
        url: formData.url,
        description: formData.description,
          logo: formData.logo || undefined,
        isApproved: formData.isApproved,
        sortOrder: formData.sortOrder || links.length + 1,
        email: formData.email,
      });

      if (response.code === 200) {
        setLinks(prev => [...prev, response.data]);
        setFormData({ name: '', url: '', description: '', logo: '', isApproved: true, sortOrder: 0, email: '' });
        setShowAddForm(false);
      }
    } catch (err: any) {
      console.error('添加友链失败:', err);
      setError(err.message || '添加友链失败');
    }
  };

  const handleEditLink = (link: FriendLink) => {
    setEditingLink(link);
    setFormData({
      name: link.name,
      url: link.url,
      description: link.description || '',
        logo: link.logo || '',
      isApproved: link.isApproved,
      sortOrder: link.sortOrder || 0,
      email: link.email || '',
    });
    setShowAddForm(true);
  };

  const handleUpdateLink = async () => {
    if (!editingLink || !formData.name.trim() || !formData.url.trim()) return;

    try {
      const response = await friendLinkApiService.updateFriendLink(editingLink.id, {
        name: formData.name,
        url: formData.url,
        description: formData.description,
          logo: formData.logo || undefined,
        isApproved: formData.isApproved,
        sortOrder: formData.sortOrder,
        email: formData.email,
      });

      if (response.code === 200) {
        setLinks(prev => prev.map(link => 
          link.id === editingLink.id ? response.data : link
        ));
        setFormData({ name: '', url: '', description: '', logo: '', isApproved: true, sortOrder: 0, email: '' });
        setEditingLink(null);
        setShowAddForm(false);
      }
    } catch (err: any) {
      console.error('更新友链失败:', err);
      setError(err.message || '更新友链失败');
    }
  };

  const handleDeleteLink = (link: FriendLink) => {
    setDeletingLink(link);
    setShowDeleteModal(true);
  };

  const confirmDeleteLink = async () => {
    if (!deletingLink) return;
    
    try {
      const response = await friendLinkApiService.deleteFriendLink(deletingLink.id);
      if (response.code === 200) {
        setLinks(prev => prev.filter(link => link.id !== deletingLink.id));
        setShowDeleteModal(false);
        setDeletingLink(null);
      }
    } catch (err: any) {
      console.error('删除友链失败:', err);
      setError(err.message || '删除友链失败');
    }
  };

  const cancelDeleteLink = () => {
    setShowDeleteModal(false);
    setDeletingLink(null);
  };

  const handleApproveLink = async (link: FriendLink) => {
    try {
      const response = await friendLinkApiService.approveFriendLink(link.id);
      if (response.code === 200) {
        setLinks(prev => prev.map(l => 
          l.id === link.id ? response.data : l
        ));
      }
    } catch (err: any) {
      console.error('审核友链失败:', err);
      setError(err.message || '审核友链失败');
    }
  };

  const handleRejectLink = async (link: FriendLink) => {
    try {
      const response = await friendLinkApiService.rejectFriendLink(link.id);
      if (response.code === 200) {
        setLinks(prev => prev.map(l => 
          l.id === link.id ? response.data : l
        ));
      }
    } catch (err: any) {
      console.error('拒绝友链失败:', err);
      setError(err.message || '拒绝友链失败');
    }
  };

  const handleToggleApproval = async (link: FriendLink) => {
    try {
      let response;
      if (link.isApproved) {
        // 如果已审核，则拒绝
        response = await friendLinkApiService.rejectFriendLink(link.id);
      } else {
        // 如果未审核，则通过
        response = await friendLinkApiService.approveFriendLink(link.id);
      }
      
      if (response.code === 200) {
        setLinks(prev => prev.map(l => 
          l.id === link.id ? response.data : l
        ));
      }
    } catch (err: any) {
      console.error('审核操作失败:', err);
      setError(err.message || '审核操作失败');
    }
  };

  const handleCancel = () => {
    setShowAddForm(false);
    setEditingLink(null);
    setFormData({ name: '', url: '', description: '', logo: '', isApproved: true, sortOrder: 0, email: '' });
    setMetadataError('');
  };

  // 获取URL元数据
  const fetchUrlMetadata = async (url: string) => {
    if (!url || url.trim() === '') return;
    
    try {
      setIsFetchingMetadata(true);
      setMetadataError('');
      
      const response = await urlMetadataApiService.fetchUrlMetadata(url);
      
      if (response.code === 200 && response.data && response.data.success) {
        const metadata = response.data;
        setFormData(prev => ({
          ...prev,
          name: metadata.title || prev.name,
          description: metadata.description || prev.description,
            logo: metadata.logo || prev.logo,
        }));
      } else {
        setMetadataError(response.message || '获取网站信息失败');
      }
    } catch (error: any) {
      setMetadataError('获取网站信息失败: ' + error.message);
    } finally {
      setIsFetchingMetadata(false);
    }
  };

  // URL输入变化处理
  const handleUrlChange = (url: string) => {
    setFormData(prev => ({ ...prev, url }));
    setMetadataError('');
  };

  // 手动获取网站信息
  const handleFetchMetadata = () => {
    if (!formData.url || formData.url.trim() === '') {
      setMetadataError('请输入网站URL');
      return;
    }
    fetchUrlMetadata(formData.url);
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
                <div className="flex space-x-2">
                  <div className="flex-1 relative">
                    <input
                      type="url"
                      value={formData.url}
                      onChange={(e) => handleUrlChange(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="https://example.com"
                    />
                    {isFetchingMetadata && (
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        <Loader2 className="h-4 w-4 animate-spin text-orange-500" />
                      </div>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={handleFetchMetadata}
                    disabled={isFetchingMetadata || !formData.url.trim()}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200 flex items-center space-x-2"
                  >
                    {isFetchingMetadata ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>获取中...</span>
                      </>
                    ) : (
                      <>
                        <Search className="h-4 w-4" />
                        <span>获取信息</span>
                      </>
                    )}
                  </button>
                </div>
                {metadataError && (
                  <p className="text-sm text-red-500 mt-1">{metadataError}</p>
                )}
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
                    checked={formData.isApproved}
                    onChange={(e) => setFormData({ ...formData, isApproved: e.target.checked })}
                    className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                  />
                  <span className="text-sm font-medium text-gray-700">审核通过</span>
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
          {currentItems.length === 0 ? (
            <div className="p-8 text-center">
              <LinkIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">没有找到友链</p>
            </div>
          ) : (
            currentItems.map((link) => (
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
                          link.isApproved 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {link.isApproved ? '已审核' : '待审核'}
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
                      onClick={() => handleToggleApproval(link)}
                      className={`p-2 rounded-lg transition-colors ${
                        link.isApproved
                          ? 'text-gray-400 hover:text-red-600 hover:bg-red-50'
                          : 'text-gray-400 hover:text-green-600 hover:bg-green-50'
                      }`}
                      title={link.isApproved ? '拒绝审核' : '审核通过'}
                    >
                      {link.isApproved ? <AlertCircle className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
                    </button>
                    <button
                      onClick={() => handleEditLink(link)}
                      className="p-2 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteLink(link)}
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

      {/* 删除确认对话框 */}
      {showDeleteModal && deletingLink && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <Trash2 className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">删除友链</h3>
                <p className="text-sm text-gray-500">此操作不可撤销</p>
              </div>
            </div>
            
            <div className="mb-6">
              <p className="text-gray-700">
                确定要删除友链 <span className="font-medium text-gray-900">"{deletingLink.name}"</span> 吗？
              </p>
            </div>
            
            <div className="flex items-center justify-end space-x-3">
              <button
                onClick={cancelDeleteLink}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                取消
              </button>
              <button
                onClick={confirmDeleteLink}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                删除
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
