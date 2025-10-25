'use client';

import { Suspense, useState, useEffect } from 'react';
import { CategoryCard } from '@/components/blog/category-card';
import { ArticleCard } from '@/components/blog/article-card';
import { SearchBar } from '@/components/ui/search-bar';
import { MainLayout } from '@/components/layout/main-layout';
import { categoryApiService } from '@/lib/api/categories';
import { articleApiService } from '@/lib/api/articles';
import type { Category, Article } from '@/types';

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [featuredArticles, setFeaturedArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // 获取分类和精选文章数据
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // 并行获取分类和精选文章数据
        const [categoriesResponse, articlesResponse] = await Promise.all([
          categoryApiService.getAllCategories(),
          articleApiService.getLatestArticles(6)
        ]);

        if (categoriesResponse.code === 200 && categoriesResponse.data) {
          setCategories(categoriesResponse.data);
        } else {
          // 如果API失败，使用示例数据
          const sampleCategories: Category[] = [
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
          setCategories(sampleCategories);
        }

        if (articlesResponse && articlesResponse.length > 0) {
          setFeaturedArticles(articlesResponse);
        } else {
          // 如果API失败，使用示例数据
          const sampleArticles: Article[] = [
            {
              id: 1,
              title: 'Next.js 14 新特性详解',
              slug: 'nextjs-14-features',
              content: 'Next.js 14 带来了许多令人兴奋的新特性...',
              summary: '探索 Next.js 14 的最新特性，包括 App Router 的改进、Server Components 的优化等',
              coverImage: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=400&fit=crop',
              publishedAt: '2024-01-15',
              updatedAt: '2024-01-15',
              createdAt: '2024-01-15',
              viewCount: 1250,
              likeCount: 45,
              commentCount: 12,
              isPublished: true,
              isPinned: false,
              category: { id: '1', name: '前端开发', slug: 'frontend', color: '#3b82f6', articleCount: 25, createdAt: '2024-01-01' },
              tags: [
                { id: '1', name: 'Next.js', slug: 'nextjs', color: '#000000', articleCount: 15, createdAt: '2024-01-01' },
                { id: '2', name: 'React', slug: 'react', color: '#61dafb', articleCount: 20, createdAt: '2024-01-01' }
              ]
            },
            {
              id: 2,
              title: 'Node.js 性能优化指南',
              slug: 'nodejs-performance-optimization',
              content: 'Node.js 性能优化是后端开发中的重要话题...',
              summary: '学习 Node.js 性能优化的各种技巧和最佳实践，提升应用性能',
              coverImage: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=800&h=400&fit=crop',
              publishedAt: '2024-01-12',
              updatedAt: '2024-01-12',
              createdAt: '2024-01-12',
              viewCount: 980,
              likeCount: 32,
              commentCount: 8,
              isPublished: true,
              isPinned: false,
              category: { id: '2', name: '后端开发', slug: 'backend', color: '#10b981', articleCount: 18, createdAt: '2024-01-01' },
              tags: [
                { id: '3', name: 'Node.js', slug: 'nodejs', color: '#339933', articleCount: 12, createdAt: '2024-01-01' },
                { id: '4', name: '性能优化', slug: 'performance', color: '#f59e0b', articleCount: 8, createdAt: '2024-01-01' }
              ]
            }
          ];
          setFeaturedArticles(sampleArticles);
        }
      } catch (err: any) {
        console.error('获取数据失败:', err);
        setError(err.message || '获取数据失败');
        
        // 使用示例数据作为降级方案
        const sampleCategories: Category[] = [
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
        setCategories(sampleCategories);
        
        const sampleArticles: Article[] = [
          {
            id: 1,
            title: 'Next.js 14 新特性详解',
            slug: 'nextjs-14-features',
            content: 'Next.js 14 带来了许多令人兴奋的新特性...',
            summary: '探索 Next.js 14 的最新特性，包括 App Router 的改进、Server Components 的优化等',
            coverImage: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=400&fit=crop',
            publishedAt: '2024-01-15',
            updatedAt: '2024-01-15',
            createdAt: '2024-01-15',
            viewCount: 1250,
            likeCount: 45,
            commentCount: 12,
            isPublished: true,
            isPinned: false,
            category: { id: '1', name: '前端开发', slug: 'frontend', color: '#3b82f6', articleCount: 25, createdAt: '2024-01-01' },
            tags: [
              { id: '1', name: 'Next.js', slug: 'nextjs', color: '#000000', articleCount: 15, createdAt: '2024-01-01' },
              { id: '2', name: 'React', slug: 'react', color: '#61dafb', articleCount: 20, createdAt: '2024-01-01' }
            ]
          },
          {
            id: 2,
            title: 'Node.js 性能优化指南',
            slug: 'nodejs-performance-optimization',
            content: 'Node.js 性能优化是后端开发中的重要话题...',
            summary: '学习 Node.js 性能优化的各种技巧和最佳实践，提升应用性能',
            coverImage: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=800&h=400&fit=crop',
            publishedAt: '2024-01-12',
            updatedAt: '2024-01-12',
            createdAt: '2024-01-12',
            viewCount: 980,
            likeCount: 32,
            commentCount: 8,
            isPublished: true,
            isPinned: false,
            category: { id: '2', name: '后端开发', slug: 'backend', color: '#10b981', articleCount: 18, createdAt: '2024-01-01' },
            tags: [
              { id: '3', name: 'Node.js', slug: 'nodejs', color: '#339933', articleCount: 12, createdAt: '2024-01-01' },
              { id: '4', name: '性能优化', slug: 'performance', color: '#f59e0b', articleCount: 8, createdAt: '2024-01-01' }
            ]
          }
        ];
        setFeaturedArticles(sampleArticles);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // 过滤分类
  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.slug.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (category.description && category.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">加载中...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <p className="text-destructive text-lg mb-4">{error}</p>
            <p className="text-muted-foreground">已显示示例数据</p>
          </div>
        </div>
      </MainLayout>
    );
  }

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
            <SearchBar 
              placeholder="搜索分类..." 
              onSearch={setSearchTerm}
            />
          </Suspense>
        </div>

        {/* 分类统计 */}
        <div className="mb-8">
          <div className="bg-card rounded-lg border p-6">
            <h2 className="text-xl font-semibold mb-4">分类统计</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {filteredCategories.map((category) => (
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
          {filteredCategories.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCategories.map((category) => (
                <CategoryCard key={category.id} category={category} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">没有找到匹配的分类</p>
            </div>
          )}
        </div>

        {/* 精选文章 */}
        <div>
          <h2 className="text-2xl font-bold mb-6">精选文章</h2>
          {featuredArticles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {featuredArticles.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">暂无精选文章</p>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
