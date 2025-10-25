'use client';

import { useState, useEffect } from 'react';
import { ArticleCard } from '@/components/blog/article-card';
import { SearchBar } from '@/components/ui/search-bar';
import { CategoryFilter } from '@/components/ui/category-filter';
import { TagFilter } from '@/components/ui/tag-filter';
import { Pagination } from '@/components/ui/pagination';
import { MainLayout } from '@/components/layout/main-layout';
import type { Article, Category, Tag, ArticleQueryParams } from '@/types';
import { articleApiService, categoryApiService, tagApiService } from '@/lib/api';

// 模拟数据 - 实际项目中这些数据应该来自API
const mockArticles: Article[] = [
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
  },
  {
    id: 3,
    title: 'React 18 并发特性深度解析',
    slug: 'react-18-concurrent-features',
    content: 'React 18 引入了并发特性，改变了组件的渲染方式...',
    summary: '深入了解 React 18 的并发特性，包括 Suspense、useTransition 等新 API',
    coverImage: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=400&fit=crop',
    publishedAt: '2024-01-05',
    updatedAt: '2024-01-05',
    createdAt: '2024-01-05',
    viewCount: 2100,
    likeCount: 78,
    commentCount: 15,
    isPublished: true,
    isPinned: false,
    category: { id: '1', name: '前端开发', slug: 'frontend', color: '#3b82f6', articleCount: 25, createdAt: '2024-01-01' },
    tags: [
      { id: '2', name: 'React', slug: 'react', color: '#61dafb', articleCount: 20, createdAt: '2024-01-01' },
      { id: '5', name: '并发', slug: 'concurrent', color: '#8b5cf6', articleCount: 5, createdAt: '2024-01-01' }
    ]
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
  const [articles, setArticles] = useState<Article[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // 查询参数
  const [queryParams, setQueryParams] = useState<ArticleQueryParams>({
    page: 1,
    limit: 10,
    search: '',
    category: '',
    tag: '',
  });

  // 分页信息
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  // 获取数据
  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      let articlesResponse;
      
      // 根据查询参数选择不同的API调用
      if (queryParams.search) {
        // 搜索文章
        articlesResponse = await articleApiService.searchArticles(
          queryParams.search,
          queryParams.page - 1,
          queryParams.limit
        );
      } else if (queryParams.category) {
        // 按分类筛选
        articlesResponse = await articleApiService.getArticlesByCategory(
          parseInt(queryParams.category),
          queryParams.page - 1,
          queryParams.limit
        );
      } else if (queryParams.tag) {
        // 按标签筛选
        articlesResponse = await articleApiService.getArticlesByTag(
          parseInt(queryParams.tag),
          queryParams.page - 1,
          queryParams.limit
        );
      } else {
        // 获取已发布文章
        articlesResponse = await articleApiService.getPublishedArticles(
          queryParams.page - 1,
          queryParams.limit
        );
      }

      // 并行获取分类和标签数据
      const [categoriesResponse, tagsResponse] = await Promise.all([
        categoryApiService.getAllCategories(),
        tagApiService.getAllTags(),
      ]);

      if (articlesResponse.code === 200 && articlesResponse.data) {
        setArticles(articlesResponse.data.content || []);
        
        // 更新分页信息
        setPagination({
          page: articlesResponse.data.page + 1,
          limit: articlesResponse.data.size,
          total: articlesResponse.data.totalElements,
          totalPages: articlesResponse.data.totalPages,
        });
      } else {
        setArticles([]);
      }

      if (categoriesResponse.code === 200 && categoriesResponse.data) {
        setCategories(categoriesResponse.data);
      } else {
        setCategories([]);
      }

      if (tagsResponse.code === 200 && tagsResponse.data) {
        setTags(tagsResponse.data);
      } else {
        setTags([]);
      }
    } catch (err) {
      console.error('获取数据失败:', err);
      setError('获取数据失败，请稍后重试');
      setArticles([]);
      setCategories([]);
      setTags([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [queryParams]);

  // 处理搜索
  const handleSearch = (searchTerm: string) => {
    setQueryParams(prev => ({
      ...prev,
      search: searchTerm,
      page: 1, // 重置到第一页
    }));
  };

  // 处理分类筛选
  const handleCategoryFilter = (categoryId: string | null) => {
    setQueryParams(prev => ({
      ...prev,
      category: categoryId || '',
      page: 1, // 重置到第一页
    }));
  };

  // 处理标签筛选
  const handleTagFilter = (tagIds: string[]) => {
    setQueryParams(prev => ({
      ...prev,
      tag: tagIds.length > 0 ? tagIds[0] : '', // 取第一个标签，或者空字符串
      page: 1, // 重置到第一页
    }));
  };

  // 处理分页
  const handlePageChange = (page: number) => {
    setQueryParams(prev => ({
      ...prev,
      page,
    }));
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center">
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
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center">
            <p className="text-destructive mb-4">{error}</p>
            <button 
              onClick={() => fetchData()} 
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
            >
              重新加载
            </button>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">文章列表</h1>
            <p className="text-muted-foreground">探索我们的技术文章和见解</p>
          </div>

          {/* 搜索和筛选 */}
          <div className="mb-8 space-y-4">
            <SearchBar onSearch={handleSearch} placeholder="搜索文章..." />
            
            <div className="flex flex-wrap gap-4">
              <CategoryFilter 
                categories={categories} 
                selectedCategory={queryParams.category}
                onCategoryChange={handleCategoryFilter}
              />
              <TagFilter 
                tags={tags} 
                selectedTags={queryParams.tag ? [queryParams.tag] : []}
                onTagsChange={handleTagFilter}
              />
            </div>
          </div>

          {/* 文章列表 */}
          <div className="space-y-6">
            {articles.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg">暂无文章</p>
                <p className="text-muted-foreground">请尝试调整搜索条件或筛选器</p>
              </div>
            ) : (
              articles.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))
            )}
          </div>

          {/* 分页 */}
          {pagination.totalPages > 1 && (
            <div className="mt-8 flex justify-center">
              <Pagination
                currentPage={pagination.page}
                totalPages={pagination.totalPages}
                totalItems={pagination.total}
                itemsPerPage={pagination.limit}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
