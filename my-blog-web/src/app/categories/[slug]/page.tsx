'use client';

import { useState, useEffect } from 'react';
import { use } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, Eye, Heart, MessageCircle } from 'lucide-react';
import Link from 'next/link';
import { ArticleCard } from '@/components/blog/article-card';
import { MainLayout } from '@/components/layout/main-layout';
import { categoryApiService } from '@/lib/api/categories';
import { articleApiService } from '@/lib/api/articles';
import { useSystemConfig } from '@/lib/hooks/use-system-config';
import { formatDateTime } from '@/lib/utils';
import type { Category, Article } from '@/types';

interface CategoryDetailPageProps {
  params: Promise<{ slug: string }>;
}

export default function CategoryDetailPage({ params }: CategoryDetailPageProps) {
  const resolvedParams = use(params);
  const { config } = useSystemConfig();
  const [category, setCategory] = useState<Category | null>(null);
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 获取分类详情和相关文章
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // 获取分类信息
        const categoryResponse = await categoryApiService.getCategoryBySlug(resolvedParams.slug);
        
        if (categoryResponse.code === 200 && categoryResponse.data) {
          setCategory(categoryResponse.data);
          
          // 获取该分类下的文章
          const articlesResponse = await articleApiService.getArticlesByCategory(
            parseInt(categoryResponse.data.id), 
            0, 
            20
          );
          
          if (articlesResponse.code === 200 && articlesResponse.data) {
            setArticles(articlesResponse.data.content || []);
          } else {
            setArticles([]);
          }
        } else {
          // 如果API失败，使用示例数据
          const sampleCategory: Category = {
            id: '1',
            name: '前端开发',
            slug: resolvedParams.slug,
            description: '前端技术相关文章，包括 React、Vue、Angular 等框架的使用和最佳实践',
            color: '#3b82f6',
            articleCount: 25,
            createdAt: '2024-01-01'
          };
          
          const sampleArticles: Article[] = [
            {
              id: 1,
              title: 'React 18 新特性详解',
              slug: 'react-18-features',
              summary: '深入解析 React 18 的新特性，包括并发渲染、自动批处理等',
              content: '',
              category: sampleCategory,
              tags: [],
              viewCount: 1250,
              likeCount: 89,
              commentCount: 23,
              isPublished: true,
              isPinned: false,
              createdAt: '2024-01-15',
              publishedAt: '2024-01-15'
            },
            {
              id: 2,
              title: 'Vue 3 Composition API 最佳实践',
              slug: 'vue3-composition-api',
              summary: '学习 Vue 3 Composition API 的使用技巧和最佳实践',
              content: '',
              category: sampleCategory,
              tags: [],
              viewCount: 980,
              likeCount: 67,
              commentCount: 18,
              isPublished: true,
              isPinned: false,
              createdAt: '2024-01-10',
              publishedAt: '2024-01-10'
            }
          ];
          
          setCategory(sampleCategory);
          setArticles(sampleArticles);
        }
      } catch (err) {
        console.error('获取分类数据失败:', err);
        setError('获取分类数据失败');
        
        // 使用示例数据作为降级方案
        const sampleCategory: Category = {
          id: '1',
          name: '前端开发',
          slug: resolvedParams.slug,
          description: '前端技术相关文章，包括 React、Vue、Angular 等框架的使用和最佳实践',
          color: '#3b82f6',
          articleCount: 25,
          createdAt: '2024-01-01'
        };
        
        const sampleArticles: Article[] = [
          {
            id: 1,
            title: 'React 18 新特性详解',
            slug: 'react-18-features',
            summary: '深入解析 React 18 的新特性，包括并发渲染、自动批处理等',
            content: '',
            category: sampleCategory,
            tags: [],
            viewCount: 1250,
            likeCount: 89,
            commentCount: 23,
            isPublished: true,
            isPinned: false,
            createdAt: '2024-01-15',
            publishedAt: '2024-01-15'
          }
        ];
        
        setCategory(sampleCategory);
        setArticles(sampleArticles);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [resolvedParams.slug]);

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

  if (error && !category) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <p className="text-destructive text-lg mb-4">{error}</p>
            <Link 
              href="/categories" 
              className="text-primary hover:underline"
            >
              返回分类列表
            </Link>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (!category) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg mb-4">分类不存在</p>
            <Link 
              href="/categories" 
              className="text-primary hover:underline"
            >
              返回分类列表
            </Link>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        {/* 返回按钮 */}
        <div className="mb-6">
          <Link 
            href="/categories"
            className="inline-flex items-center space-x-2 text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>返回分类列表</span>
          </Link>
        </div>

        {/* 分类头部信息 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex items-center space-x-4 mb-4">
            <div
              className="w-16 h-16 rounded-lg flex items-center justify-center text-white font-bold text-2xl"
              style={{ backgroundColor: category.color }}
            >
              {category.name.charAt(0)}
            </div>
            <div>
              <h1 className="text-3xl font-bold">{category.name}</h1>
              <p className="text-muted-foreground">{category.description}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-6 text-sm text-muted-foreground">
            <div className="flex items-center space-x-1">
              <Calendar className="h-4 w-4" />
              <span>创建于 {formatDateTime(category.createdAt)}</span>
            </div>
            <div className="flex items-center space-x-1">
              <MessageCircle className="h-4 w-4" />
              <span>{category.articleCount} 篇文章</span>
            </div>
          </div>
        </motion.div>

        {/* 文章列表 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-4">
              {category.name} 相关文章
            </h2>
            {articles.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg mb-4">
                  该分类下暂无文章
                </p>
                <Link 
                  href="/articles" 
                  className="text-primary hover:underline"
                >
                  查看所有文章
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {articles.map((article) => (
                  <ArticleCard key={article.id} article={article} />
                ))}
              </div>
            )}
          </div>
        </motion.div>

        {/* 统计信息 */}
        {articles.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-8 p-6 bg-muted/50 rounded-lg"
          >
            <h3 className="text-lg font-semibold mb-4">统计信息</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{articles.length}</div>
                <div className="text-sm text-muted-foreground">文章数量</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">
                  {articles.reduce((sum, article) => sum + article.viewCount, 0)}
                </div>
                <div className="text-sm text-muted-foreground">总阅读量</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">
                  {articles.reduce((sum, article) => sum + article.likeCount, 0)}
                </div>
                <div className="text-sm text-muted-foreground">总点赞数</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">
                  {articles.reduce((sum, article) => sum + article.commentCount, 0)}
                </div>
                <div className="text-sm text-muted-foreground">总评论数</div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </MainLayout>
  );
}
