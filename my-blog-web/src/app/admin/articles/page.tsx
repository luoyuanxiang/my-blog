'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  FileText,
  Eye,
  EyeOff,
  Calendar,
  User,
  Tag,
  FolderOpen,
  AlertCircle
} from 'lucide-react';
import Image from "next/image";
import Link from "next/link";
import { Pagination, usePagination } from '@/components/ui/pagination';
import { articleApiService } from '@/lib/api/articles';
import type { Article } from '@/types';


export default function ArticlesManagement() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'published' | 'draft'>('all');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingArticle, setDeletingArticle] = useState<Article | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // 获取文章列表
  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setIsLoading(true);
        setError('');
        const response = await articleApiService.getArticles(0, 1000);
        if (response.code === 200 && response.data && Array.isArray(response.data.content)) {
          setArticles(response.data.content);
        } else {
          setError('获取文章列表失败');
          setArticles([]);
        }
      } catch (err: any) {
        setError(err.message || '获取文章列表失败');
        setArticles([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchArticles();
  }, []);

  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.tags.some(tag => tag.name.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = filterStatus === 'all' || 
                         (filterStatus === 'published' && article.isPublished) ||
                         (filterStatus === 'draft' && !article.isPublished);
    
    return matchesSearch && matchesStatus;
  });

  // 分页功能
  const {
    currentPage,
    totalPages,
    totalItems,
    currentItems,
    goToPage,
  } = usePagination(filteredArticles, 8);

  const handleTogglePublish = async (article: Article) => {
    try {
      const response = article.isPublished 
        ? await articleApiService.unpublishArticle(article.id)
        : await articleApiService.publishArticle(article.id);
      
      if (response.code === 200) {
        setArticles(articles.map(a =>
          a.id === article.id ? response.data : a
        ));
      }
    } catch (err: any) {
      console.error('切换发布状态失败:', err);
      setError(err.message || '切换发布状态失败');
    }
  };

  const handleTogglePin = async (article: Article) => {
    try {
      const response = article.isPinned 
        ? await articleApiService.unpinArticle(article.id)
        : await articleApiService.pinArticle(article.id);
      
      if (response.code === 200) {
        setArticles(articles.map(a =>
          a.id === article.id ? response.data : a
        ));
      }
    } catch (err: any) {
      console.error('切换置顶状态失败:', err);
      setError(err.message || '切换置顶状态失败');
    }
  };

  const handleDelete = (article: Article) => {
    setDeletingArticle(article);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!deletingArticle) return;
    
    try {
      const response = await articleApiService.deleteArticle(deletingArticle.id);
      if (response.code === 200) {
        setArticles(articles.filter(article => article.id !== deletingArticle.id));
        setShowDeleteModal(false);
        setDeletingArticle(null);
      }
    } catch (err: any) {
      console.error('删除文章失败:', err);
      setError(err.message || '删除文章失败');
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setDeletingArticle(null);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-CN');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">加载中...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-center">
          <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
          <p className="text-red-800">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 页面标题和操作 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">文章管理</h1>
          <p className="text-gray-600">管理博客文章，共 {articles.length} 篇文章</p>
        </div>
        <Link href="/admin/articles/create">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200"
          >
            <Plus className="h-4 w-4" />
            <span>写文章</span>
          </motion.button>
        </Link>
      </div>

      {/* 搜索和筛选 */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="搜索文章..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setFilterStatus('all')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filterStatus === 'all'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            全部
          </button>
          <button
            onClick={() => setFilterStatus('published')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filterStatus === 'published'
                ? 'bg-green-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            已发布
          </button>
          <button
            onClick={() => setFilterStatus('draft')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filterStatus === 'draft'
                ? 'bg-yellow-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            草稿
          </button>
        </div>
      </div>

      {/* 文章列表 */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">文章列表</h3>
        </div>
        <div className="divide-y divide-gray-200">
          {currentItems.length === 0 ? (
            <div className="p-8 text-center">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">没有找到文章</p>
            </div>
          ) : (
            currentItems.map((article) => (
              <motion.div
                key={article.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-6 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start space-x-4">
                  {/* 封面图片 */}
                  {article.coverImage && (
                    <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                      <Image
                        src={article.coverImage}
                        alt={article.title}
                        width={96}
                        height={96}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  {/* 文章信息 */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900 truncate">
                            {article.title}
                          </h3>
                          {article.isPinned && (
                            <span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full">
                              置顶
                            </span>
                          )}
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            article.isPublished 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {article.isPublished ? '已发布' : '草稿'}
                          </span>
                        </div>
                        
                        <p className="text-gray-600 mb-3 line-clamp-2">{article.summary}</p>
                        
                        <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-4 w-4" />
                            <span>{formatDate(article.publishedAt || article.createdAt)}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <FolderOpen className="h-4 w-4" />
                            <span>{article.category.name}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Eye className="h-4 w-4" />
                            <span>{article.viewCount}</span>
                          </div>
                        </div>

                        {/* 标签 */}
                        <div className="flex items-center space-x-2">
                          <Tag className="h-4 w-4 text-gray-400" />
                          <div className="flex flex-wrap gap-1">
                            {article.tags.map((tag) => (
                              <span
                                key={tag.id}
                                className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-full"
                              >
                                {tag.name}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* 操作按钮 */}
                      <div className="flex items-center space-x-2 ml-4">
                        <button
                          onClick={() => handleTogglePublish(article)}
                          className={`p-2 rounded-lg transition-colors ${
                            article.isPublished
                              ? 'text-gray-400 hover:text-green-600 hover:bg-green-50'
                              : 'text-gray-400 hover:text-blue-600 hover:bg-blue-50'
                          }`}
                          title={article.isPublished ? '取消发布' : '发布'}
                        >
                          {article.isPublished ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                        <button
                          onClick={() => handleTogglePin(article)}
                          className={`p-2 rounded-lg transition-colors ${
                            article.isPinned
                              ? 'text-red-600 hover:bg-red-50'
                              : 'text-gray-400 hover:text-red-600 hover:bg-red-50'
                          }`}
                          title={article.isPinned ? '取消置顶' : '置顶'}
                        >
                          <span className="text-xs font-bold">📌</span>
                        </button>
                        <Link href={`/admin/articles/edit/${article.id}`}>
                          <button
                            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="编辑文章"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                        </Link>
                        <button
                          onClick={() => handleDelete(article)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="删除文章"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
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
              itemsPerPage={8}
              onPageChange={goToPage}
            />
          </div>
        )}
      </div>

      {/* 删除确认对话框 */}
      {showDeleteModal && deletingArticle && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4">
            <div className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <Trash2 className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">删除文章</h3>
                  <p className="text-sm text-gray-600">此操作将永久删除该文章</p>
                </div>
              </div>
              
              <div className="mb-6">
                <p className="text-gray-700 mb-2">
                  确定要删除文章 <span className="font-semibold text-red-600">"{deletingArticle.title}"</span> 吗？
                </p>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                  <div className="flex items-start space-x-2">
                    <AlertCircle className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                    <div className="text-sm text-yellow-800">
                      <p className="font-medium">删除后影响：</p>
                      <ul className="mt-1 space-y-1">
                        <li>• 该文章将被永久删除</li>
                        <li>• 所有相关评论也将被删除</li>
                        <li>• 文章的所有统计数据将丢失</li>
                        <li>• 此操作无法撤销</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-end space-x-3">
                <button
                  onClick={cancelDelete}
                  className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  取消
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-4 py-2 bg-red-600 text-white hover:bg-red-700 rounded-lg transition-colors"
                >
                  确认删除
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
