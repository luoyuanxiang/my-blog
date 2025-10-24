'use client';

import { Suspense } from 'react';
import { ArticleCard } from '@/components/blog/article-card';
import { SearchBar } from '@/components/ui/search-bar';
import { CategoryFilter } from '@/components/ui/category-filter';
import { TagFilter } from '@/components/ui/tag-filter';
import { Pagination } from '@/components/ui/pagination';
import { MainLayout } from '@/components/layout/main-layout';
import type { Article, Category, Tag } from '@/types';

// 模拟数据 - 实际项目中这些数据应该来自API
const articles: Article[] = [
  {
    id: '1',
    title: 'Next.js 14 新特性详解',
    slug: 'nextjs-14-features',
    content: 'Next.js 14 带来了许多令人兴奋的新特性...',
    excerpt: '探索 Next.js 14 的最新特性，包括 App Router 的改进、Server Components 的优化等',
    coverImage: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=400&fit=crop',
    publishedAt: '2024-01-15',
    updatedAt: '2024-01-15',
    readTime: 8,
    views: 1250,
    likes: 45,
    category: { id: '1', name: '前端开发', slug: 'frontend', color: '#3b82f6', articleCount: 25, createdAt: '2024-01-01' },
    tags: [
      { id: '1', name: 'Next.js', slug: 'nextjs', color: '#000000', articleCount: 15, createdAt: '2024-01-01' },
      { id: '2', name: 'React', slug: 'react', color: '#61dafb', articleCount: 20, createdAt: '2024-01-01' }
    ],
    author: { id: '1', name: '作者', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop' },
    comments: [],
    isPublished: true
  },
  {
    id: '2',
    title: 'TypeScript 高级类型技巧',
    slug: 'typescript-advanced-types',
    content: 'TypeScript 的高级类型系统提供了强大的类型安全...',
    excerpt: '学习 TypeScript 的高级类型技巧，提升代码质量和开发效率',
    coverImage: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800&h=400&fit=crop',
    publishedAt: '2024-01-10',
    updatedAt: '2024-01-10',
    readTime: 12,
    views: 980,
    likes: 32,
    category: { id: '2', name: 'TypeScript', slug: 'typescript', color: '#3178c6', articleCount: 18, createdAt: '2024-01-01' },
    tags: [
      { id: '3', name: 'TypeScript', slug: 'typescript', color: '#3178c6', articleCount: 18, createdAt: '2024-01-01' },
      { id: '4', name: 'JavaScript', slug: 'javascript', color: '#f7df1e', articleCount: 30, createdAt: '2024-01-01' }
    ],
    author: { id: '1', name: '作者', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop' },
    comments: [],
    isPublished: true
  },
  {
    id: '3',
    title: 'React 18 并发特性深度解析',
    slug: 'react-18-concurrent-features',
    content: 'React 18 引入了并发特性，改变了组件的渲染方式...',
    excerpt: '深入了解 React 18 的并发特性，包括 Suspense、useTransition 等新 API',
    coverImage: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=400&fit=crop',
    publishedAt: '2024-01-05',
    updatedAt: '2024-01-05',
    readTime: 15,
    views: 2100,
    likes: 78,
    category: { id: '1', name: '前端开发', slug: 'frontend', color: '#3b82f6', articleCount: 25, createdAt: '2024-01-01' },
    tags: [
      { id: '2', name: 'React', slug: 'react', color: '#61dafb', articleCount: 20, createdAt: '2024-01-01' },
      { id: '5', name: '并发', slug: 'concurrent', color: '#8b5cf6', articleCount: 5, createdAt: '2024-01-01' }
    ],
    author: { id: '1', name: '作者', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop' },
    comments: [],
    isPublished: true
  }
];

const categories: Category[] = [
  { id: '1', name: '前端开发', slug: 'frontend', description: '前端技术相关文章', color: '#3b82f6', articleCount: 25, createdAt: '2024-01-01' },
  { id: '2', name: '后端开发', slug: 'backend', description: '后端技术相关文章', color: '#10b981', articleCount: 18, createdAt: '2024-01-01' },
  { id: '3', name: '数据库', slug: 'database', description: '数据库相关文章', color: '#f59e0b', articleCount: 12, createdAt: '2024-01-01' },
  { id: '4', name: 'DevOps', slug: 'devops', description: 'DevOps 相关文章', color: '#ef4444', articleCount: 8, createdAt: '2024-01-01' }
];

const tags: Tag[] = [
  { id: '1', name: 'React', slug: 'react', color: '#61dafb', articleCount: 20, createdAt: '2024-01-01' },
  { id: '2', name: 'Next.js', slug: 'nextjs', color: '#000000', articleCount: 15, createdAt: '2024-01-01' },
  { id: '3', name: 'TypeScript', slug: 'typescript', color: '#3178c6', articleCount: 18, createdAt: '2024-01-01' },
  { id: '4', name: 'Node.js', slug: 'nodejs', color: '#339933', articleCount: 12, createdAt: '2024-01-01' },
  { id: '5', name: 'MongoDB', slug: 'mongodb', color: '#47a248', articleCount: 8, createdAt: '2024-01-01' },
  { id: '6', name: 'Docker', slug: 'docker', color: '#2496ed', articleCount: 6, createdAt: '2024-01-01' }
];

export default function ArticlesPage() {
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        {/* 页面标题 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">文章列表</h1>
          <p className="text-muted-foreground">
            分享技术、记录生活，用文字记录成长的足迹
          </p>
        </div>

        {/* 搜索和筛选 */}
        <div className="mb-8 space-y-4">
          <Suspense fallback={<div>加载中...</div>}>
            <SearchBar placeholder="搜索文章..." />
          </Suspense>
          
          <div className="flex flex-wrap gap-4">
            <Suspense fallback={<div>加载中...</div>}>
              <CategoryFilter categories={categories} />
            </Suspense>
            <Suspense fallback={<div>加载中...</div>}>
              <TagFilter tags={tags} />
            </Suspense>
          </div>
        </div>

        {/* 文章列表 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {articles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>

        {/* 分页 */}
        <div className="flex justify-center">
          <Pagination
            currentPage={1}
            totalPages={5}
            onPageChange={(page) => console.log('Page changed:', page)}
          />
        </div>
      </div>
    </MainLayout>
  );
}
