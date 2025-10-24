import { Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Calendar, Clock, Eye, Heart, User, ArrowLeft } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { MarkdownRenderer } from '@/components/ui/markdown-renderer';
import { CommentSection } from '@/components/blog/comment-section';
import { ArticleCard } from '@/components/blog/article-card';
import { TableOfContents } from '@/components/blog/table-of-contents';
import type { Article } from '@/types';

// 模拟数据 - 实际项目中这些数据应该来自API
const article: Article = {
  id: '1',
  title: 'Next.js 14 新特性详解',
  slug: 'nextjs-14-features',
  content: `
# Next.js 14 新特性详解

Next.js 14 带来了许多令人兴奋的新特性，让我们来详细了解一下这些改进。

## 主要新特性

### 1. App Router 的改进

App Router 在 Next.js 14 中得到了显著改进，提供了更好的性能和开发体验。

\`\`\`javascript
// app/page.js
export default function HomePage() {
  return (
    <div>
      <h1>欢迎来到 Next.js 14</h1>
      <p>这是一个使用 App Router 的页面</p>
    </div>
  );
}
\`\`\`

### 2. Server Components 优化

Server Components 现在更加高效，减少了客户端 JavaScript 包的大小。

\`\`\`typescript
// components/ServerComponent.tsx
import { Suspense } from 'react';

export default async function ServerComponent() {
  const data = await fetch('https://api.example.com/data');
  const result = await data.json();
  
  return (
    <Suspense fallback={<div>加载中...</div>}>
      <div>{result.title}</div>
    </Suspense>
  );
}
\`\`\`

### 3. 性能提升

Next.js 14 在性能方面有了显著提升，包括：

- 更快的构建时间
- 更小的包大小
- 更好的缓存策略

## 总结

Next.js 14 是一个重要的版本更新，带来了许多实用的新特性和性能改进。建议开发者尽快升级到新版本，享受更好的开发体验。
  `,
  excerpt: '探索 Next.js 14 的最新特性，包括 App Router 的改进、Server Components 的优化等',
  coverImage: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&h=600&fit=crop',
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
};

const relatedArticles: Article[] = [
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

// Markdown 渲染组件
function MarkdownContent({ content }: { content: string }) {
  return <MarkdownRenderer content={content} />;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function ArticleDetailPage({ params: _params }: { params: { slug: string } }) {
  return (
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
            <p className="text-xl text-muted-foreground mb-6">{article.excerpt}</p>

            {/* 元信息 */}
            <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground mb-6">
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4" />
                <span>{article.author.name}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4" />
                <span>{formatDate(article.publishedAt)}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4" />
                <span>{article.readTime} 分钟阅读</span>
              </div>
              <div className="flex items-center space-x-2">
                <Eye className="h-4 w-4" />
                <span>{article.views} 次浏览</span>
              </div>
              <div className="flex items-center space-x-2">
                <Heart className="h-4 w-4" />
                <span>{article.likes} 个赞</span>
              </div>
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
                {relatedArticles.map((relatedArticle) => (
                  <ArticleCard key={relatedArticle.id} article={relatedArticle} />
                ))}
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
