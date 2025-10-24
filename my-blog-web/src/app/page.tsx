import {Carousel} from '@/components/ui/carousel';
import {BlogStats} from '@/components/blog/blog-stats';
import {ArticleCard} from '@/components/blog/article-card';
import {CategoryCard} from '@/components/blog/category-card';
import {TagCloud3D} from '@/components/blog/tag-cloud-3d';
import {AuthorCard} from '@/components/blog/author-card';
import {MainLayout} from '@/components/layout/main-layout';
import Link from 'next/link';
import type {Article, BlogStats as BlogStatsType, CarouselItem, Category, Tag} from '@/types';

// 模拟数据
const carouselItems: CarouselItem[] = [
    {
        id: '1',
        title: '欢迎来到我的博客',
        description: '分享技术文章，记录学习心得，与大家一起成长',
        image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&h=600&fit=crop',
        link: '/articles',
    },
    {
        id: '2',
        title: 'Next.js 14 新特性详解',
        description: '深入了解 Next.js 14 带来的新功能和改进',
        image: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=1200&h=600&fit=crop',
        link: '/articles/nextjs-14-features',
    },
    {
        id: '3',
        title: 'React 18 并发特性',
        description: '探索 React 18 的并发渲染和 Suspense 功能',
        image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=1200&h=600&fit=crop',
        link: '/articles/react-18-concurrent',
    },
];

const recentArticles: Article[] = [
    {
        id: '1',
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
        category: {
            id: '1', name: '前端开发', slug: 'frontend', description: '前端技术相关文章',
            color: "",
            articleCount: 0,
            createdAt: ""
        },
        tags: [
            {
                id: '1', name: 'Next.js', slug: 'nextjs', color: '#000000',
                articleCount: 0,
                createdAt: ""
            },
            {
                id: '2', name: 'React', slug: 'react', color: '#61DAFB',
                articleCount: 0,
                createdAt: ""
            },
            {
                id: '3', name: 'JavaScript', slug: 'javascript', color: '#F7DF1E',
                articleCount: 0,
                createdAt: ""
            },
        ],
        author: {
            name: '作者', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
            id: 0
        },
        isPinned: true,
        comments: [],
        isPublished: false
    },
    {
        id: '2',
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
        category: {
            id: '1', name: '前端开发', slug: 'frontend', description: '前端技术相关文章',
            color: "",
            articleCount: 0,
            createdAt: ""
        },
        tags: [
            {
                id: '2', name: 'React', slug: 'react', color: '#61DAFB',
                articleCount: 0,
                createdAt: ""
            },
            {
                id: '4', name: '并发', slug: 'concurrent', color: '#FF6B6B',
                articleCount: 0,
                createdAt: ""
            },
        ],
        author: {
            name: '作者',
            avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
            id: 0
        },
        isPinned: false,
        comments: [],
        isPublished: false
    },
    {
        id: '3',
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
        category: {
            id: '2', name: '编程语言', slug: 'programming', description: '编程语言相关文章',
            color: "",
            articleCount: 0,
            createdAt: ""
        },
        tags: [
            {
                id: '5', name: 'TypeScript', slug: 'typescript', color: '#3178C6',
                articleCount: 0,
                createdAt: ""
            },
            {
                id: '6', name: '类型系统', slug: 'type-system', color: '#8B5CF6',
                articleCount: 0,
                createdAt: ""
            },
        ],
        author: {
            name: '作者',
            avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
            id: 0
        },
        isPinned: true,
        comments: [],
        isPublished: false
    },
];

const categories: Category[] = [
    {
        id: '1', name: '前端开发', slug: 'frontend', description: '前端技术相关文章', articleCount: 15, color: '#3B82F6',
        createdAt: ""
    },
    {
        id: '2',
        name: '编程语言',
        slug: 'programming',
        description: '编程语言相关文章',
        articleCount: 8,
        color: '#10B981',
        createdAt: ""
    },
    {
        id: '3', name: '工具与框架', slug: 'tools', description: '开发工具和框架', articleCount: 12, color: '#F59E0B',
        createdAt: ""
    },
    {
        id: '4',
        name: '算法与数据结构',
        slug: 'algorithms',
        description: '算法和数据结构',
        articleCount: 6,
        color: '#EF4444',
        createdAt: ""
    },
];

const tags: Tag[] = [
    {
        id: '1', name: 'Next.js', slug: 'nextjs', color: '#000000', articleCount: 8,
        createdAt: ""
    },
    {
        id: '2', name: 'React', slug: 'react', color: '#61DAFB', articleCount: 12,
        createdAt: ""
    },
    {
        id: '3', name: 'JavaScript', slug: 'javascript', color: '#F7DF1E', articleCount: 15,
        createdAt: ""
    },
    {
        id: '4', name: 'TypeScript', slug: 'typescript', color: '#3178C6', articleCount: 10,
        createdAt: ""
    },
    {
        id: '5', name: 'Node.js', slug: 'nodejs', color: '#339933', articleCount: 6,
        createdAt: ""
    },
    {
        id: '6', name: 'CSS', slug: 'css', color: '#1572B6', articleCount: 9,
        createdAt: ""
    },
    {
        id: '7', name: 'HTML', slug: 'html', color: '#E34F26', articleCount: 7,
        createdAt: ""
    },
    {
        id: '8', name: 'Vue.js', slug: 'vue', color: '#4FC08D', articleCount: 5,
        createdAt: ""
    },
];

const blogStats: BlogStatsType = {
    totalArticles: 45,
    totalViews: 12580,
    totalLikes: 892,
    totalComments: 234,
    totalCategories: 8,
    totalTags: 25,
};

const author = {
    name: '张三',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop',
    bio: '全栈开发工程师，热爱技术分享，专注于前端开发和用户体验设计。喜欢探索新技术，记录学习心得，与大家一起成长。',
    location: '北京，中国',
    website: 'https://example.com',
    github: 'https://github.com/username',
    twitter: 'https://twitter.com/username',
    email: 'contact@example.com',
    joinDate: '2020年3月加入',
    stats: {
        articles: 45,
        views: 12580,
        likes: 892,
    },
};

export default function Home() {
  return (
        <MainLayout>
            <div className="min-h-screen bg-background">
                {/* 轮播图区域 */}
                <section className="mb-12">
                    <Carousel items={carouselItems}/>
                </section>

                <div className="container mx-auto px-4">
                    {/* 博客统计 */}
                    <section className="mb-12">
                        <h2 className="text-2xl font-bold text-center mb-8 text-foreground">博客统计</h2>
                        <BlogStats stats={blogStats}/>
                    </section>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* 主要内容区域 */}
                        <div className="lg:col-span-2">
                            {/* 最新文章 */}
                            <section className="mb-12">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-2xl font-bold text-foreground">最新文章</h2>
                                    <Link
                                        href="/articles"
                                        className="text-primary hover:text-primary/80 transition-colors font-medium"
                                    >
                                        查看全部 →
                                    </Link>
                                </div>
                                <div className="space-y-6">
                                    {recentArticles
                                        .toSorted((a, b) => {
                                            // 置顶文章优先显示
                                            if (a.isPinned && !b.isPinned) return -1;
                                            if (!a.isPinned && b.isPinned) return 1;
                                            // 同级别按发布时间排序
                                            return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
                                        })
                                        .map((article) => (
                                            <ArticleCard key={article.id} article={article}/>
                                        ))}
                                </div>
                            </section>
                        </div>

                        {/* 侧边栏 */}
                        <div className="space-y-8">
                            {/* 作者信息 */}
                            <section>
                                <h3 className="text-xl font-bold mb-4 text-foreground">关于作者</h3>
                                <AuthorCard author={author}/>
                            </section>

                            {/* 分类 */}
                            <section>
                                <h3 className="text-xl font-bold mb-4 text-foreground">文章分类</h3>
                                <div className="grid grid-cols-1 gap-3">
                                    {categories.map((category) => (
                                        <CategoryCard key={category.id} category={category}/>
                                    ))}
        </div>
                                <div className="mt-4 text-center">
                                    <a
                                        href="/categories"
                                        className="text-primary hover:text-primary/80 transition-colors text-sm font-medium"
                                    >
                                        查看全部分类 →
                                    </a>
                                </div>
                            </section>

                            {/* 标签云 */}
                            <section>
                                <h3 className="text-xl font-bold mb-4 text-foreground">标签云</h3>
                                <TagCloud3D tags={tags}/>
                                <div className="mt-4 text-center">
                                    <a
                                        href="/tags"
                                        className="text-primary hover:text-primary/80 transition-colors text-sm font-medium"
                                    >
                                        查看全部标签 →
          </a>
        </div>
                            </section>
                        </div>
                    </div>
                </div>
    </div>
        </MainLayout>
  );
}
