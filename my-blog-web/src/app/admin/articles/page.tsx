'use client';

import { useState } from 'react';
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
  FolderOpen
} from 'lucide-react';
import Image from "next/image";
import Link from "next/link";

// 模拟文章数据
const initialArticles = [
  {
    id: 1,
    title: 'Next.js 14 新特性详解',
    slug: 'nextjs-14-features',
    excerpt: 'Next.js 14 带来了许多令人兴奋的新特性，包括改进的 App Router、更好的性能优化和增强的开发体验。',
    content: '# Next.js 14 新特性详解\n\nNext.js 14 是一个重要的版本更新...',
    coverImage: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800&h=400&fit=crop',
    publishedAt: '2024-01-15',
    updatedAt: '2024-01-15',
    readTime: 8,
    views: 1250,
    likes: 89,
    category: { id: 1, name: '前端开发', slug: 'frontend' },
    tags: [
      { id: 1, name: 'Next.js', slug: 'nextjs' },
      { id: 2, name: 'React', slug: 'react' },
    ],
    author: { id: 1, name: '作者' },
    isPublished: true,
    isPinned: true,
  },
  {
    id: 2,
    title: 'React 18 并发特性深度解析',
    slug: 'react-18-concurrent',
    excerpt: 'React 18 引入了并发特性，包括自动批处理、Suspense 改进和新的并发渲染器。',
    content: '# React 18 并发特性深度解析\n\nReact 18 是一个里程碑版本...',
    coverImage: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=400&fit=crop',
    publishedAt: '2024-01-10',
    updatedAt: '2024-01-10',
    readTime: 12,
    views: 980,
    likes: 67,
    category: { id: 1, name: '前端开发', slug: 'frontend' },
    tags: [
      { id: 2, name: 'React', slug: 'react' },
      { id: 4, name: '并发', slug: 'concurrent' },
    ],
    author: { id: 1, name: '作者' },
    isPublished: true,
    isPinned: false,
  },
  {
    id: 3,
    title: 'TypeScript 5.0 新特性介绍',
    slug: 'typescript-5-features',
    excerpt: 'TypeScript 5.0 带来了装饰器支持、性能改进和更好的类型推断。',
    content: '# TypeScript 5.0 新特性介绍\n\nTypeScript 5.0 是一个重要更新...',
    coverImage: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800&h=400&fit=crop',
    publishedAt: '2024-01-05',
    updatedAt: '2024-01-05',
    readTime: 6,
    views: 756,
    likes: 45,
    category: { id: 2, name: '编程语言', slug: 'programming' },
    tags: [
      { id: 5, name: 'TypeScript', slug: 'typescript' },
      { id: 6, name: '类型系统', slug: 'type-system' },
    ],
    author: { id: 1, name: '作者' },
    isPublished: false,
    isPinned: false,
  },
];

interface Article {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage?: string;
  publishedAt: string;
  updatedAt: string;
  readTime: number;
  views: number;
  likes: number;
  category: { id: number; name: string; slug: string };
  tags: { id: number; name: string; slug: string }[];
  author: { id: number; name: string };
  isPublished: boolean;
  isPinned: boolean;
}

export default function ArticlesManagement() {
  const [articles, setArticles] = useState<Article[]>(initialArticles);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'published' | 'draft'>('all');

  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.tags.some(tag => tag.name.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = filterStatus === 'all' || 
                         (filterStatus === 'published' && article.isPublished) ||
                         (filterStatus === 'draft' && !article.isPublished);
    
    return matchesSearch && matchesStatus;
  });

  const handleTogglePublish = (id: number) => {
    setArticles(articles.map(article =>
      article.id === id
        ? { ...article, isPublished: !article.isPublished }
        : article
    ));
  };

  const handleTogglePin = (id: number) => {
    setArticles(articles.map(article =>
      article.id === id
        ? { ...article, isPinned: !article.isPinned }
        : article
    ));
  };

  const handleDelete = (id: number) => {
    if (confirm('确定要删除这篇文章吗？')) {
      setArticles(articles.filter(article => article.id !== id));
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-CN');
  };

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
          {filteredArticles.length === 0 ? (
            <div className="p-8 text-center">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">没有找到文章</p>
            </div>
          ) : (
            filteredArticles.map((article) => (
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
                        
                        <p className="text-gray-600 mb-3 line-clamp-2">{article.excerpt}</p>
                        
                        <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                          <div className="flex items-center space-x-1">
                            <User className="h-4 w-4" />
                            <span>{article.author.name}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-4 w-4" />
                            <span>{formatDate(article.publishedAt)}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <FolderOpen className="h-4 w-4" />
                            <span>{article.category.name}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Eye className="h-4 w-4" />
                            <span>{article.views}</span>
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
                          onClick={() => handleTogglePublish(article.id)}
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
                          onClick={() => handleTogglePin(article.id)}
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
                          onClick={() => handleDelete(article.id)}
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
      </div>
    </div>
  );
}
