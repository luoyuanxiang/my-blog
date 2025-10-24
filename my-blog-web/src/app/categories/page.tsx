import { Suspense } from 'react';
import { CategoryCard } from '@/components/blog/category-card';
import { ArticleCard } from '@/components/blog/article-card';
import { SearchBar } from '@/components/ui/search-bar';
import { MainLayout } from '@/components/layout/main-layout';
import type { Category, Article } from '@/types';

// 模拟数据 - 实际项目中这些数据应该来自API
const categories: Category[] = [
  { 
    id: '1', 
    name: '前端开发', 
    slug: 'frontend', 
    description: '前端技术相关文章，包括 React、Vue、Angular 等框架的使用和最佳实践', 
    color: '#3b82f6', 
    articleCount: 25, 
    createdAt: '2024-01-01' 
  },
  { 
    id: '2', 
    name: '后端开发', 
    slug: 'backend', 
    description: '后端技术相关文章，包括 Node.js、Python、Java 等后端开发技术', 
    color: '#10b981', 
    articleCount: 18, 
    createdAt: '2024-01-01' 
  },
  { 
    id: '3', 
    name: '数据库', 
    slug: 'database', 
    description: '数据库相关文章，包括 MySQL、MongoDB、Redis 等数据库的使用和优化', 
    color: '#f59e0b', 
    articleCount: 12, 
    createdAt: '2024-01-01' 
  },
  { 
    id: '4', 
    name: 'DevOps', 
    slug: 'devops', 
    description: 'DevOps 相关文章，包括 Docker、Kubernetes、CI/CD 等运维技术', 
    color: '#ef4444', 
    articleCount: 8, 
    createdAt: '2024-01-01' 
  },
  { 
    id: '5', 
    name: '移动开发', 
    slug: 'mobile', 
    description: '移动端开发相关文章，包括 React Native、Flutter 等跨平台开发技术', 
    color: '#8b5cf6', 
    articleCount: 15, 
    createdAt: '2024-01-01' 
  },
  { 
    id: '6', 
    name: '人工智能', 
    slug: 'ai', 
    description: '人工智能相关文章，包括机器学习、深度学习等 AI 技术', 
    color: '#06b6d4', 
    articleCount: 6, 
    createdAt: '2024-01-01' 
  }
];

const featuredArticles: Article[] = [
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
    title: 'Node.js 性能优化指南',
    slug: 'nodejs-performance-optimization',
    content: 'Node.js 性能优化是后端开发中的重要话题...',
    excerpt: '学习 Node.js 性能优化的各种技巧和最佳实践，提升应用性能',
    coverImage: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=800&h=400&fit=crop',
    publishedAt: '2024-01-12',
    updatedAt: '2024-01-12',
    readTime: 12,
    views: 980,
    likes: 32,
    category: { id: '2', name: '后端开发', slug: 'backend', color: '#10b981', articleCount: 18, createdAt: '2024-01-01' },
    tags: [
      { id: '3', name: 'Node.js', slug: 'nodejs', color: '#339933', articleCount: 12, createdAt: '2024-01-01' },
      { id: '4', name: '性能优化', slug: 'performance', color: '#f59e0b', articleCount: 8, createdAt: '2024-01-01' }
    ],
    author: { id: '1', name: '作者', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop' },
    comments: [],
    isPublished: true
  }
];

export default function CategoriesPage() {
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        {/* 页面标题 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">文章分类</h1>
          <p className="text-muted-foreground">
            按分类浏览文章，找到你感兴趣的技术领域
          </p>
        </div>

        {/* 搜索栏 */}
        <div className="mb-8">
          <Suspense fallback={<div>加载中...</div>}>
            <SearchBar placeholder="搜索分类..." />
          </Suspense>
        </div>

        {/* 分类统计 */}
        <div className="mb-8">
          <div className="bg-card rounded-lg border p-6">
            <h2 className="text-xl font-semibold mb-4">分类统计</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {categories.map((category) => (
                <div key={category.id} className="text-center">
                  <div
                    className="w-12 h-12 rounded-lg mx-auto mb-2 flex items-center justify-center text-white font-bold text-lg"
                    style={{ backgroundColor: category.color }}
                  >
                    {category.articleCount}
                  </div>
                  <div className="text-sm font-medium">{category.name}</div>
                  <div className="text-xs text-muted-foreground">篇文章</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 分类网格 */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">所有分类</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        </div>

        {/* 精选文章 */}
        <div>
          <h2 className="text-2xl font-bold mb-6">精选文章</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {featuredArticles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
