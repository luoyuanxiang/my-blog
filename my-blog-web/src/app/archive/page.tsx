'use client';

import { Suspense, useState, useEffect } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArticleCard } from '@/components/blog/article-card';
import { SearchBar } from '@/components/ui/search-bar';
import { MainLayout } from '@/components/layout/main-layout';
import { articleApiService } from '@/lib/api/articles';
import type { ArchiveItem, Article } from '@/types';

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
  const [archiveData, setArchiveData] = useState<ArchiveItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // 获取归档数据
  useEffect(() => {
    const fetchArchiveData = async () => {
      try {
        setLoading(true);
        setError(null);

        // 获取所有已发布的文章
        const response = await articleApiService.getPublishedArticles(0, 1000);
        
        if (response.code === 200 && response.data && response.data.content) {
          const articles = response.data.content;
          
          // 按年月分组文章
          const groupedData = groupArticlesByMonth(articles);
          setArchiveData(groupedData);
        } else {
          // 如果API失败，使用示例数据
          const sampleArchiveData: ArchiveItem[] = [
            {
              year: 2024,
              month: 1,
              articles: [
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
                  title: 'TypeScript 高级类型技巧',
                  slug: 'typescript-advanced-types',
                  content: 'TypeScript 的高级类型系统提供了强大的类型安全...',
                  summary: '学习 TypeScript 的高级类型技巧，提升代码质量和开发效率',
                  coverImage: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800&h=400&fit=crop',
                  publishedAt: '2024-01-10',
                  updatedAt: '2024-01-10',
                  createdAt: '2024-01-10',
                  viewCount: 980,
                  likeCount: 32,
                  commentCount: 8,
                  isPublished: true,
                  isPinned: false,
                  category: { id: '2', name: 'TypeScript', slug: 'typescript', color: '#3178c6', articleCount: 18, createdAt: '2024-01-01' },
                  tags: [
                    { id: '3', name: 'TypeScript', slug: 'typescript', color: '#3178c6', articleCount: 18, createdAt: '2024-01-01' },
                    { id: '4', name: 'JavaScript', slug: 'javascript', color: '#f7df1e', articleCount: 30, createdAt: '2024-01-01' }
                  ]
                }
              ]
            },
            {
              year: 2023,
              month: 12,
              articles: [
                {
                  id: 3,
                  title: 'Node.js 性能优化指南',
                  slug: 'nodejs-performance-optimization',
                  content: 'Node.js 性能优化是后端开发中的重要话题...',
                  summary: '学习 Node.js 性能优化的各种技巧和最佳实践，提升应用性能',
                  coverImage: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=800&h=400&fit=crop',
                  publishedAt: '2023-12-28',
                  updatedAt: '2023-12-28',
                  createdAt: '2023-12-28',
                  viewCount: 980,
                  likeCount: 32,
                  commentCount: 8,
                  isPublished: true,
                  isPinned: false,
                  category: { id: '2', name: '后端开发', slug: 'backend', color: '#10b981', articleCount: 18, createdAt: '2024-01-01' },
                  tags: [
                    { id: '6', name: 'Node.js', slug: 'nodejs', color: '#339933', articleCount: 12, createdAt: '2024-01-01' },
                    { id: '7', name: '性能优化', slug: 'performance', color: '#f59e0b', articleCount: 8, createdAt: '2024-01-01' }
                  ]
                }
              ]
            }
          ];
          setArchiveData(sampleArchiveData);
        }
      } catch (err: any) {
        console.error('获取归档数据失败:', err);
        setError(err.message || '获取归档数据失败');
        
        // 使用示例数据作为降级方案
        const sampleArchiveData: ArchiveItem[] = [
          {
            year: 2024,
            month: 1,
            articles: [
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
                title: 'TypeScript 高级类型技巧',
                slug: 'typescript-advanced-types',
                content: 'TypeScript 的高级类型系统提供了强大的类型安全...',
                summary: '学习 TypeScript 的高级类型技巧，提升代码质量和开发效率',
                coverImage: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800&h=400&fit=crop',
                publishedAt: '2024-01-10',
                updatedAt: '2024-01-10',
                createdAt: '2024-01-10',
                viewCount: 980,
                likeCount: 32,
                commentCount: 8,
                isPublished: true,
                isPinned: false,
                category: { id: '2', name: 'TypeScript', slug: 'typescript', color: '#3178c6', articleCount: 18, createdAt: '2024-01-01' },
                tags: [
                  { id: '3', name: 'TypeScript', slug: 'typescript', color: '#3178c6', articleCount: 18, createdAt: '2024-01-01' },
                  { id: '4', name: 'JavaScript', slug: 'javascript', color: '#f7df1e', articleCount: 30, createdAt: '2024-01-01' }
                ]
              }
            ]
          },
          {
            year: 2023,
            month: 12,
            articles: [
              {
                id: 3,
                title: 'Node.js 性能优化指南',
                slug: 'nodejs-performance-optimization',
                content: 'Node.js 性能优化是后端开发中的重要话题...',
                summary: '学习 Node.js 性能优化的各种技巧和最佳实践，提升应用性能',
                coverImage: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=800&h=400&fit=crop',
                publishedAt: '2023-12-28',
                updatedAt: '2023-12-28',
                createdAt: '2023-12-28',
                viewCount: 980,
                likeCount: 32,
                commentCount: 8,
                isPublished: true,
                isPinned: false,
                category: { id: '2', name: '后端开发', slug: 'backend', color: '#10b981', articleCount: 18, createdAt: '2024-01-01' },
                tags: [
                  { id: '6', name: 'Node.js', slug: 'nodejs', color: '#339933', articleCount: 12, createdAt: '2024-01-01' },
                  { id: '7', name: '性能优化', slug: 'performance', color: '#f59e0b', articleCount: 8, createdAt: '2024-01-01' }
                ]
              }
            ]
          }
        ];
        setArchiveData(sampleArchiveData);
      } finally {
        setLoading(false);
      }
    };

    fetchArchiveData();
  }, []);

  // 按年月分组文章的函数
  const groupArticlesByMonth = (articles: Article[]): ArchiveItem[] => {
    const grouped = new Map<string, Article[]>();
    
    articles.forEach(article => {
      const publishDate = article.publishedAt || article.createdAt;
      const date = new Date(publishDate);
      const year = date.getFullYear();
      const month = date.getMonth() + 1; // getMonth() 返回 0-11，需要 +1
      const key = `${year}-${month}`;
      
      if (!grouped.has(key)) {
        grouped.set(key, []);
      }
      grouped.get(key)!.push(article);
    });
    
    // 转换为 ArchiveItem 格式
    const archiveItems: ArchiveItem[] = [];
    grouped.forEach((articles, key) => {
      const [year, month] = key.split('-').map(Number);
      archiveItems.push({
        year,
        month,
        articles: articles.sort((a, b) => {
          const dateA = new Date(a.publishedAt || a.createdAt);
          const dateB = new Date(b.publishedAt || b.createdAt);
          return dateB.getTime() - dateA.getTime(); // 按时间倒序排列
        })
      });
    });
    
    // 按年月排序
    return archiveItems.sort((a, b) => {
      if (a.year !== b.year) {
        return b.year - a.year; // 年份倒序
      }
      return b.month - a.month; // 月份倒序
    });
  };

  // 过滤归档数据
  const filteredArchiveData = archiveData.map(item => ({
    ...item,
    articles: item.articles.filter(article =>
      article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.tags.some(tag => tag.name.toLowerCase().includes(searchTerm.toLowerCase()))
    )
  })).filter(item => item.articles.length > 0);

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

  // 按年份分组
  const groupedByYear = filteredArchiveData.reduce((acc, item) => {
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
            <SearchBar 
              placeholder="搜索归档文章..." 
              onSearch={setSearchTerm}
            />
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
                  {archiveData.length > 0 ? Math.max(...archiveData.map(item => item.articles.length)) : 0}
                </div>
                <div className="text-sm text-muted-foreground">单月最多</div>
              </div>
            </div>
          </div>
        </div>

        {/* 时间线归档 */}
        <div>
          <h2 className="text-2xl font-bold mb-6">时间线</h2>
          {sortedYears.length > 0 ? (
          <div className="space-y-8">
            {sortedYears.map((year) => (
              <ArchiveYear
                key={year}
                year={year}
                months={groupedByYear[year]}
              />
            ))}
          </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                {searchTerm ? '没有找到匹配的文章' : '暂无归档数据'}
              </p>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
