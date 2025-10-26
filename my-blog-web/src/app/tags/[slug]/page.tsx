'use client';

import { useState, useEffect } from 'react';
import { use } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, Eye, Heart, MessageCircle, Hash } from 'lucide-react';
import Link from 'next/link';
import { ArticleCard } from '@/components/blog/article-card';
import { MainLayout } from '@/components/layout/main-layout';
import { tagApiService } from '@/lib/api/tags';
import { articleApiService } from '@/lib/api/articles';
import { useSystemConfig } from '@/lib/hooks/use-system-config';
import { formatDateTime } from '@/lib/utils';
import type { Tag, Article } from '@/types';

interface TagDetailPageProps {
  params: Promise<{ slug: string }>;
}

export default function TagDetailPage({ params }: TagDetailPageProps) {
  const resolvedParams = use(params);
  const { config } = useSystemConfig();
  const [tag, setTag] = useState<Tag | null>(null);
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 获取标签详情和相关文章
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // 获取标签信息
        const tagResponse = await tagApiService.getTagBySlug(resolvedParams.slug);
        
        if (tagResponse.code === 200 && tagResponse.data) {
          setTag(tagResponse.data);
          
          // 获取该标签下的文章
          const articlesResponse = await articleApiService.getArticlesByTag(
            parseInt(tagResponse.data.id), 
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
          const sampleTag: Tag = {
            id: '1',
            name: 'Vue.js',
            slug: resolvedParams.slug,
            color: '#4fc08d',
            articleCount: 10,
            createdAt: '2024-01-01'
          };
          
          const sampleArticles: Article[] = [
            {
              id: 1,
              title: 'Vue 3 Composition API 深度解析',
              slug: 'vue3-composition-api',
              summary: '深入理解 Vue 3 Composition API 的设计理念和使用方法',
              content: '',
              category: {
                id: '1',
                name: '前端开发',
                slug: 'frontend',
                description: '前端技术相关文章',
                color: '#3b82f6',
                articleCount: 25,
                createdAt: '2024-01-01'
              },
              tags: [sampleTag],
              viewCount: 850,
              likeCount: 45,
              commentCount: 12,
              isPublished: true,
              isPinned: false,
              createdAt: '2024-01-20',
              publishedAt: '2024-01-20'
            },
            {
              id: 2,
              title: 'Vue Router 4 新特性详解',
              slug: 'vue-router-4',
              summary: '探索 Vue Router 4 的新特性和最佳实践',
              content: '',
              category: {
                id: '1',
                name: '前端开发',
                slug: 'frontend',
                description: '前端技术相关文章',
                color: '#3b82f6',
                articleCount: 25,
                createdAt: '2024-01-01'
              },
              tags: [sampleTag],
              viewCount: 720,
              likeCount: 38,
              commentCount: 8,
              isPublished: true,
              isPinned: false,
              createdAt: '2024-01-18',
              publishedAt: '2024-01-18'
            }
          ];
          
          setTag(sampleTag);
          setArticles(sampleArticles);
        }
      } catch (err) {
        console.error('获取标签数据失败:', err);
        setError('获取标签数据失败');
        
        // 使用示例数据作为降级方案
        const sampleTag: Tag = {
          id: '1',
          name: 'Vue.js',
          slug: resolvedParams.slug,
          color: '#4fc08d',
          articleCount: 10,
          createdAt: '2024-01-01'
        };
        
        const sampleArticles: Article[] = [
          {
            id: 1,
            title: 'Vue 3 Composition API 深度解析',
            slug: 'vue3-composition-api',
            summary: '深入理解 Vue 3 Composition API 的设计理念和使用方法',
            content: '',
            category: {
              id: '1',
              name: '前端开发',
              slug: 'frontend',
              description: '前端技术相关文章',
              color: '#3b82f6',
              articleCount: 25,
              createdAt: '2024-01-01'
            },
            tags: [sampleTag],
            viewCount: 850,
            likeCount: 45,
            commentCount: 12,
            isPublished: true,
            isPinned: false,
            createdAt: '2024-01-20',
            publishedAt: '2024-01-20'
          }
        ];
        
        setTag(sampleTag);
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

  if (error && !tag) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <p className="text-destructive text-lg mb-4">{error}</p>
            <Link 
              href="/tags" 
              className="text-primary hover:underline"
            >
              返回标签列表
            </Link>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (!tag) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg mb-4">标签不存在</p>
            <Link 
              href="/tags" 
              className="text-primary hover:underline"
            >
              返回标签列表
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
            href="/tags"
            className="inline-flex items-center space-x-2 text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>返回标签列表</span>
          </Link>
        </div>

        {/* 标签头部信息 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex items-center space-x-4 mb-4">
            <div
              className="w-16 h-16 rounded-lg flex items-center justify-center text-white font-bold text-2xl shadow-lg"
              style={{ 
                backgroundColor: tag.color,
                boxShadow: `0 8px 32px ${tag.color}40`
              }}
            >
              <Hash className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold flex items-center space-x-2">
                <span style={{ color: tag.color }}>#{tag.name}</span>
              </h1>
              <p className="text-muted-foreground">
                探索与 {tag.name} 相关的所有文章
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-6 text-sm text-muted-foreground">
            <div className="flex items-center space-x-1">
              <Calendar className="h-4 w-4" />
              <span>创建于 {formatDateTime(tag.createdAt)}</span>
            </div>
            <div className="flex items-center space-x-1">
              <MessageCircle className="h-4 w-4" />
              <span>{tag.articleCount} 篇文章</span>
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
              #{tag.name} 相关文章
            </h2>
            {articles.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ backgroundColor: `${tag.color}20` }}>
                  <Hash className="h-8 w-8" style={{ color: tag.color }} />
                </div>
                <p className="text-muted-foreground text-lg mb-4">
                  该标签下暂无文章
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
            className="mt-8 p-6 rounded-lg border"
            style={{ 
              backgroundColor: `${tag.color}10`,
              borderColor: `${tag.color}30`
            }}
          >
            <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
              <Hash className="h-5 w-5" style={{ color: tag.color }} />
              <span>#{tag.name} 统计信息</span>
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold" style={{ color: tag.color }}>{articles.length}</div>
                <div className="text-sm text-muted-foreground">文章数量</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold" style={{ color: tag.color }}>
                  {articles.reduce((sum, article) => sum + article.viewCount, 0)}
                </div>
                <div className="text-sm text-muted-foreground">总阅读量</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold" style={{ color: tag.color }}>
                  {articles.reduce((sum, article) => sum + article.likeCount, 0)}
                </div>
                <div className="text-sm text-muted-foreground">总点赞数</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold" style={{ color: tag.color }}>
                  {articles.reduce((sum, article) => sum + article.commentCount, 0)}
                </div>
                <div className="text-sm text-muted-foreground">总评论数</div>
              </div>
            </div>
          </motion.div>
        )}

        {/* 相关标签推荐 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-8"
        >
          <h3 className="text-lg font-semibold mb-4">相关标签</h3>
          <div className="flex flex-wrap gap-2">
            {['JavaScript', 'TypeScript', '前端开发', 'Web开发'].map((relatedTag) => (
              <Link
                key={relatedTag}
                href={`/tags/${relatedTag.toLowerCase()}`}
                className="px-3 py-1 rounded-full text-sm bg-muted hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                #{relatedTag}
              </Link>
            ))}
          </div>
        </motion.div>
      </div>
    </MainLayout>
  );
}
