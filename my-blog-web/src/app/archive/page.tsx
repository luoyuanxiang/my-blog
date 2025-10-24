'use client';

import { Suspense, useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArticleCard } from '@/components/blog/article-card';
import { SearchBar } from '@/components/ui/search-bar';
import { MainLayout } from '@/components/layout/main-layout';
import type { ArchiveItem } from '@/types';

// 模拟数据 - 实际项目中这些数据应该来自API
const archiveData: ArchiveItem[] = [
  {
    year: 2024,
    month: 1,
    articles: [
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
    ]
  },
  {
    year: 2023,
    month: 12,
    articles: [
      {
        id: '4',
        title: 'Node.js 性能优化指南',
        slug: 'nodejs-performance-optimization',
        content: 'Node.js 性能优化是后端开发中的重要话题...',
        excerpt: '学习 Node.js 性能优化的各种技巧和最佳实践，提升应用性能',
        coverImage: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=800&h=400&fit=crop',
        publishedAt: '2023-12-28',
        updatedAt: '2023-12-28',
        readTime: 12,
        views: 980,
        likes: 32,
        category: { id: '2', name: '后端开发', slug: 'backend', color: '#10b981', articleCount: 18, createdAt: '2024-01-01' },
        tags: [
          { id: '6', name: 'Node.js', slug: 'nodejs', color: '#339933', articleCount: 12, createdAt: '2024-01-01' },
          { id: '7', name: '性能优化', slug: 'performance', color: '#f59e0b', articleCount: 8, createdAt: '2024-01-01' }
        ],
        author: { id: '1', name: '作者', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop' },
        comments: [],
        isPublished: true
      },
      {
        id: '5',
        title: 'MongoDB 数据库设计最佳实践',
        slug: 'mongodb-database-design',
        content: 'MongoDB 作为 NoSQL 数据库，有其独特的设计模式...',
        excerpt: '学习 MongoDB 数据库设计的最佳实践，提升数据存储效率',
        coverImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop',
        publishedAt: '2023-12-20',
        updatedAt: '2023-12-20',
        readTime: 10,
        views: 750,
        likes: 28,
        category: { id: '3', name: '数据库', slug: 'database', color: '#f59e0b', articleCount: 12, createdAt: '2024-01-01' },
        tags: [
          { id: '8', name: 'MongoDB', slug: 'mongodb', color: '#47a248', articleCount: 8, createdAt: '2024-01-01' },
          { id: '9', name: '数据库设计', slug: 'database-design', color: '#8b5cf6', articleCount: 6, createdAt: '2024-01-01' }
        ],
        author: { id: '1', name: '作者', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop' },
        comments: [],
        isPublished: true
      }
    ]
  },
  {
    year: 2023,
    month: 11,
    articles: [
      {
        id: '6',
        title: 'Docker 容器化部署实践',
        slug: 'docker-containerization-practice',
        content: 'Docker 容器化是现代应用部署的重要技术...',
        excerpt: '学习 Docker 容器化部署的实践技巧，提升应用部署效率',
        coverImage: 'https://images.unsplash.com/photo-1605745341112-85968b19335a?w=800&h=400&fit=crop',
        publishedAt: '2023-11-15',
        updatedAt: '2023-11-15',
        readTime: 14,
        views: 1100,
        likes: 35,
        category: { id: '4', name: 'DevOps', slug: 'devops', color: '#ef4444', articleCount: 8, createdAt: '2024-01-01' },
        tags: [
          { id: '10', name: 'Docker', slug: 'docker', color: '#2496ed', articleCount: 6, createdAt: '2024-01-01' },
          { id: '11', name: '容器化', slug: 'containerization', color: '#06b6d4', articleCount: 4, createdAt: '2024-01-01' }
        ],
        author: { id: '1', name: '作者', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop' },
        comments: [],
        isPublished: true
      }
    ]
  }
];

const monthNames = [
  '一月', '二月', '三月', '四月', '五月', '六月',
  '七月', '八月', '九月', '十月', '十一月', '十二月'
];

interface ArchiveYearProps {
  year: number;
  months: ArchiveItem[];
}

function ArchiveYear({ year, months }: ArchiveYearProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="mb-8">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center space-x-2 text-xl font-bold mb-4 hover:text-primary transition-colors"
      >
        {isExpanded ? (
          <ChevronDown className="h-5 w-5" />
        ) : (
          <ChevronRight className="h-5 w-5" />
        )}
        <span>{year} 年</span>
        <span className="text-sm font-normal text-muted-foreground">
          ({months.reduce((total, month) => total + month.articles.length, 0)} 篇文章)
        </span>
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {months.map((month) => (
              <ArchiveMonth key={`${year}-${month.month}`} month={month} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

interface ArchiveMonthProps {
  month: ArchiveItem;
}

function ArchiveMonth({ month }: ArchiveMonthProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="ml-6">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center space-x-2 text-lg font-semibold mb-3 hover:text-primary transition-colors"
      >
        {isExpanded ? (
          <ChevronDown className="h-4 w-4" />
        ) : (
          <ChevronRight className="h-4 w-4" />
        )}
        <span>{monthNames[month.month - 1]}</span>
        <span className="text-sm font-normal text-muted-foreground">
          ({month.articles.length} 篇文章)
        </span>
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="ml-6 space-y-4"
          >
            {month.articles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function ArchivePage() {
  // 按年份分组
  const groupedByYear = archiveData.reduce((acc, item) => {
    if (!acc[item.year]) {
      acc[item.year] = [];
    }
    acc[item.year].push(item);
    return acc;
  }, {} as Record<number, ArchiveItem[]>);

  // 按年份排序
  const sortedYears = Object.keys(groupedByYear)
    .map(Number)
    .sort((a, b) => b - a);

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        {/* 页面标题 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">文章归档</h1>
          <p className="text-muted-foreground">
            按时间线浏览所有文章，回顾技术成长的足迹
          </p>
        </div>

        {/* 搜索栏 */}
        <div className="mb-8">
          <Suspense fallback={<div>加载中...</div>}>
            <SearchBar placeholder="搜索归档文章..." />
          </Suspense>
        </div>

        {/* 归档统计 */}
        <div className="mb-8">
          <div className="bg-card rounded-lg border p-6">
            <h2 className="text-xl font-semibold mb-4">归档统计</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">
                  {archiveData.reduce((total, item) => total + item.articles.length, 0)}
                </div>
                <div className="text-sm text-muted-foreground">总文章数</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">
                  {sortedYears.length}
                </div>
                <div className="text-sm text-muted-foreground">年份数</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">
                  {archiveData.length}
                </div>
                <div className="text-sm text-muted-foreground">月份数</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">
                  {Math.max(...archiveData.map(item => item.articles.length))}
                </div>
                <div className="text-sm text-muted-foreground">单月最多</div>
              </div>
            </div>
          </div>
        </div>

        {/* 时间线归档 */}
        <div>
          <h2 className="text-2xl font-bold mb-6">时间线</h2>
          <div className="space-y-8">
            {sortedYears.map((year) => (
              <ArchiveYear
                key={year}
                year={year}
                months={groupedByYear[year]}
              />
            ))}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
