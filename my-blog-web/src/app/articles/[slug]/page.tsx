'use client';

import { Suspense, useEffect, useState, use } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Calendar, Clock, Eye, Heart, User, ArrowLeft } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { MarkdownRenderer } from '@/components/ui/markdown-renderer';
import { CommentSection } from '@/components/blog/comment-section';
import { ArticleCard } from '@/components/blog/article-card';
import { TableOfContents } from '@/components/blog/table-of-contents';
import { MainLayout } from '@/components/layout/main-layout';
import { articleApiService } from '@/lib/api/articles';
import { useSystemConfig } from '@/lib/hooks/use-system-config';
import type { Article } from '@/types';

// Markdown 渲染组件
function MarkdownContent({ content }: { content: string }) {
  return <MarkdownRenderer content={content} />;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function ArticleDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { config } = useSystemConfig();
  const resolvedParams = use(params);
  const [article, setArticle] = useState<Article | null>(null);
  const [relatedArticles, setRelatedArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isLiked, setIsLiked] = useState(false);

  // 处理点赞
  const handleLike = async () => {
    if (!article) return;
    
    try {
      await articleApiService.incrementLikeCount(article.id);
      setIsLiked(!isLiked);
      // 更新本地文章数据
      setArticle(prev => prev ? {
        ...prev,
        likeCount: prev.likeCount + (isLiked ? -1 : 1)
      } : null);
    } catch (err) {
      console.error('点赞失败:', err);
    }
  };

  // 获取文章详情
  useEffect(() => {
    const fetchArticle = async () => {
      try {
        setIsLoading(true);
        setError('');
        
        const response = await articleApiService.getArticleBySlug(resolvedParams.slug);
        if (response.code === 200 && response.data) {
          setArticle(response.data);
          
          // 增加浏览量
          await articleApiService.incrementViewCount(response.data.id);
          
          // 获取相关文章（同分类的文章）
          const relatedResponse = await articleApiService.getArticlesByCategory(
            parseInt(response.data.category.id), 
            0, 
            3
          );
          if (relatedResponse.code === 200 && relatedResponse.data) {
            // 过滤掉当前文章
            const filtered = relatedResponse.data.content.filter(
              item => item.id !== response.data.id
            );
            setRelatedArticles(filtered.slice(0, 3));
          }
        } else {
          // 如果API失败，显示示例文章
          const sampleArticle: Article = {
            id: 1,
            title: '欢迎来到我的博客',
            slug: resolvedParams.slug,
            content: `
# 欢迎来到我的博客

欢迎来到我的个人博客！这里是我分享技术文章、学习心得和生活感悟的地方。

## 关于我

我是一名热爱技术的开发者，专注于前端开发、全栈开发和技术分享。

## 技术栈

- **前端**: React, Next.js, TypeScript, Tailwind CSS
- **后端**: Spring Boot, Java, MySQL
- **工具**: Git, Docker, VS Code

## 博客特色

- 📝 技术文章分享
- 💡 学习心得记录
- 🔧 项目经验总结
- 📚 读书笔记

感谢您的访问，希望我的文章能对您有所帮助！

---

*如果您有任何问题或建议，欢迎在评论区留言交流。*
            `,
            summary: '欢迎来到我的个人博客！这里是我分享技术文章、学习心得和生活感悟的地方。',
            coverImage: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&h=600&fit=crop',
            publishedAt: '2024-01-01',
            updatedAt: '2024-01-01',
            createdAt: '2024-01-01',
            viewCount: 100,
            likeCount: 10,
            commentCount: 5,
            isPublished: true,
            isPinned: true,
            category: { id: '1', name: '博客介绍', slug: 'blog-intro', color: '#3b82f6', articleCount: 1, createdAt: '2024-01-01' },
            tags: [
              { id: '1', name: '博客', slug: 'blog', color: '#000000', articleCount: 1, createdAt: '2024-01-01' },
              { id: '2', name: '介绍', slug: 'intro', color: '#61dafb', articleCount: 1, createdAt: '2024-01-01' }
            ]
          };
          setArticle(sampleArticle);
          setRelatedArticles([]);
        }
      } catch (err: any) {
        console.error('获取文章失败:', err);
        // 显示示例文章而不是错误
        const sampleArticle: Article = {
          id: 1,
          title: '欢迎来到我的博客',
          slug: resolvedParams.slug,
          content: `
# 欢迎来到我的博客

欢迎来到我的个人博客！这里是我分享技术文章、学习心得和生活感悟的地方。

## 关于我

我是一名热爱技术的开发者，专注于前端开发、全栈开发和技术分享。

## 技术栈

- **前端**: React, Next.js, TypeScript, Tailwind CSS
- **后端**: Spring Boot, Java, MySQL
- **工具**: Git, Docker, VS Code

## 博客特色

- 📝 技术文章分享
- 💡 学习心得记录
- 🔧 项目经验总结
- 📚 读书笔记

感谢您的访问，希望我的文章能对您有所帮助！

---

*如果您有任何问题或建议，欢迎在评论区留言交流。*
          `,
          summary: '欢迎来到我的个人博客！这里是我分享技术文章、学习心得和生活感悟的地方。',
          coverImage: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&h=600&fit=crop',
          publishedAt: '2024-01-01',
          updatedAt: '2024-01-01',
          createdAt: '2024-01-01',
          viewCount: 100,
          likeCount: 10,
          commentCount: 5,
          isPublished: true,
          isPinned: true,
          category: { id: '1', name: '博客介绍', slug: 'blog-intro', color: '#3b82f6', articleCount: 1, createdAt: '2024-01-01' },
          tags: [
            { id: '1', name: '博客', slug: 'blog', color: '#000000', articleCount: 1, createdAt: '2024-01-01' },
            { id: '2', name: '介绍', slug: 'intro', color: '#61dafb', articleCount: 1, createdAt: '2024-01-01' }
          ]
        };
        setArticle(sampleArticle);
        setRelatedArticles([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchArticle();
  }, [resolvedParams.slug]);

  if (isLoading) {
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

  if (error || !article) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <p className="text-destructive text-lg mb-4">{error || '文章不存在'}</p>
            <Link
              href="/articles"
              className="inline-flex items-center space-x-2 text-primary hover:text-primary/80 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>返回文章列表</span>
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
          href="/articles"
          className="inline-flex items-center space-x-2 text-muted-foreground hover:text-primary transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>返回文章列表</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* 文章内容 */}
        <article className="lg:col-span-3">
          {/* 文章头部 */}
          <header className="mb-8">
            {/* 分类标签 */}
            <div className="mb-4">
              <Link
                href={`/categories/${article.category.slug}`}
                className="inline-flex items-center space-x-2 px-3 py-1 text-white rounded-full text-sm"
                style={{ backgroundColor: article.category.color }}
              >
                <span>{article.category.name}</span>
              </Link>
            </div>

            {/* 标题 */}
            <h1 className="text-4xl font-bold mb-4">{article.title}</h1>

            {/* 摘要 */}
            <p className="text-xl text-muted-foreground mb-6">{article.summary}</p>

            {/* 元信息 */}
            <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground mb-6">
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4" />
                <span>{config.bloggerName}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4" />
                <span>{formatDate(article.publishedAt || article.createdAt)}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Eye className="h-4 w-4" />
                <span>{article.viewCount} 次浏览</span>
              </div>
              <button
                onClick={handleLike}
                className={`flex items-center space-x-2 hover:text-primary transition-colors ${
                  isLiked ? 'text-primary' : 'text-muted-foreground'
                }`}
              >
                <Heart className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
                <span>{article.likeCount} 个赞</span>
              </button>
            </div>

            {/* 标签 */}
            <div className="flex flex-wrap gap-2 mb-8">
              {article.tags.map((tag) => (
                <Link
                  key={tag.id}
                  href={`/tags/${tag.slug}`}
                  className="text-sm px-3 py-1 bg-muted hover:bg-muted/80 rounded-full transition-colors"
                >
                  #{tag.name}
                </Link>
              ))}
            </div>

            {/* 封面图片 */}
            {article.coverImage && (
              <div className="relative h-64 md:h-96 mb-8 rounded-lg overflow-hidden">
                <Image
                  src={article.coverImage}
                  alt={article.title}
                  fill
                  className="object-cover"
                />
              </div>
            )}
          </header>

          {/* 文章内容 */}
          <div className="prose prose-lg max-w-none dark:prose-invert">
            <MarkdownContent content={article.content} />
          </div>

          {/* 评论区域 */}
          <div className="mt-12">
            <Suspense fallback={<div>加载评论中...</div>}>
              <CommentSection articleId={article.id} />
            </Suspense>
          </div>
        </article>

        {/* 侧边栏 */}
        <aside className="lg:col-span-1">
          <div className="sticky top-4 space-y-8">
            {/* 目录 */}
            <TableOfContents content={article.content} />

            {/* 相关文章 */}
            <div className="bg-card rounded-lg border p-6 sticky top-4">
              <h3 className="text-lg font-semibold mb-4">相关文章</h3>
              <div className="space-y-4">
                {relatedArticles.length > 0 ? (
                  relatedArticles.map((relatedArticle) => (
                    <ArticleCard key={relatedArticle.id} article={relatedArticle} />
                  ))
                ) : (
                  <p className="text-muted-foreground text-sm">暂无相关文章</p>
                )}
              </div>
            </div>
          </div>
        </aside>
      </div>
      </div>
    </MainLayout>
  );
}
