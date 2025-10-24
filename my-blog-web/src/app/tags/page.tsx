import { AnimatedTagCloud } from '@/components/blog/animated-tag-cloud';
import { ArticleCard } from '@/components/blog/article-card';
import { MainLayout } from '@/components/layout/main-layout';
import type { Tag, Article } from '@/types';

// 模拟数据 - 实际项目中这些数据应该来自API
const tags: Tag[] = [
  { id: '1', name: 'React', slug: 'react', color: '#61dafb', articleCount: 20, createdAt: '2024-01-01' },
  { id: '2', name: 'Next.js', slug: 'nextjs', color: '#000000', articleCount: 15, createdAt: '2024-01-01' },
  { id: '3', name: 'TypeScript', slug: 'typescript', color: '#3178c6', articleCount: 18, createdAt: '2024-01-01' },
  { id: '4', name: 'Node.js', slug: 'nodejs', color: '#339933', articleCount: 12, createdAt: '2024-01-01' },
  { id: '5', name: 'MongoDB', slug: 'mongodb', color: '#47a248', articleCount: 8, createdAt: '2024-01-01' },
  { id: '6', name: 'Docker', slug: 'docker', color: '#2496ed', articleCount: 6, createdAt: '2024-01-01' },
  { id: '7', name: 'JavaScript', slug: 'javascript', color: '#f7df1e', articleCount: 30, createdAt: '2024-01-01' },
  { id: '8', name: 'Vue.js', slug: 'vuejs', color: '#4fc08d', articleCount: 10, createdAt: '2024-01-01' },
  { id: '9', name: 'Python', slug: 'python', color: '#3776ab', articleCount: 14, createdAt: '2024-01-01' },
  { id: '10', name: 'MySQL', slug: 'mysql', color: '#4479a1', articleCount: 9, createdAt: '2024-01-01' },
  { id: '11', name: 'Redis', slug: 'redis', color: '#dc382d', articleCount: 7, createdAt: '2024-01-01' },
  { id: '12', name: 'Kubernetes', slug: 'kubernetes', color: '#326ce5', articleCount: 5, createdAt: '2024-01-01' },
  { id: '13', name: 'AWS', slug: 'aws', color: '#ff9900', articleCount: 11, createdAt: '2024-01-01' },
  { id: '14', name: 'GraphQL', slug: 'graphql', color: '#e10098', articleCount: 4, createdAt: '2024-01-01' },
  { id: '15', name: 'Webpack', slug: 'webpack', color: '#8dd6f9', articleCount: 6, createdAt: '2024-01-01' }
];

const featuredArticles: Article[] = [
  {
    id: '1',
    title: 'React Hooks 最佳实践',
    slug: 'react-hooks-best-practices',
    content: 'React Hooks 是现代 React 开发的核心...',
    excerpt: '学习 React Hooks 的最佳实践，提升组件开发效率',
    coverImage: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=400&fit=crop',
    publishedAt: '2024-01-14',
    updatedAt: '2024-01-14',
    readTime: 10,
    views: 1500,
    likes: 56,
    category: { id: 1, name: '前端开发', slug: 'frontend', color: '#3b82f6', articleCount: 25, createdAt: '2024-01-01' },
    tags: [
      { id: 1, name: 'React', slug: 'react', color: '#61dafb', articleCount: 20, createdAt: '2024-01-01' },
      { id: 7, name: 'JavaScript', slug: 'javascript', color: '#f7df1e', articleCount: 30, createdAt: '2024-01-01' }
    ],
    author: { id: 1, name: '作者', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop' },
    comments: [],
    isPublished: true
  },
  {
    id: '2',
    title: 'TypeScript 高级类型系统',
    slug: 'typescript-advanced-types',
    content: 'TypeScript 的高级类型系统提供了强大的类型安全...',
    excerpt: '深入学习 TypeScript 的高级类型系统，掌握类型编程技巧',
    coverImage: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800&h=400&fit=crop',
    publishedAt: '2024-01-10',
    updatedAt: '2024-01-10',
    readTime: 15,
    views: 1200,
    likes: 42,
    category: { id: 2, name: 'TypeScript', slug: 'typescript', color: '#3178c6', articleCount: 18, createdAt: '2024-01-01' },
    tags: [
      { id: 3, name: 'TypeScript', slug: 'typescript', color: '#3178c6', articleCount: 18, createdAt: '2024-01-01' },
      { id: 7, name: 'JavaScript', slug: 'javascript', color: '#f7df1e', articleCount: 30, createdAt: '2024-01-01' }
    ],
    author: { id: 1, name: '作者', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop' },
    comments: [],
    isPublished: true
  }
];

export default function TagsPage() {
  return (
    <MainLayout>
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
        {/* 页面头部 */}
        <div className="relative overflow-hidden">
          {/* 背景装饰 */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-secondary/5" />
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />
          
          <div className="container mx-auto px-4 py-16 relative z-10">
            {/* 页面标题 */}
            <div className="text-center mb-12">
              <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                标签云
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                通过标签快速找到相关文章，探索技术话题的无限可能
              </p>
            </div>

          </div>
        </div>

        {/* 主要内容区域 */}
        <div className="container mx-auto px-4 pb-16">
          {/* 动画标签云 */}
          <div className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4 text-foreground">所有标签</h2>
              <p className="text-muted-foreground">
                发现所有技术标签，点击探索相关内容
              </p>
            </div>
            <AnimatedTagCloud tags={tags} />
          </div>

          {/* 精选文章 */}
          <div className="w-full">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4 text-foreground">精选文章</h2>
              <p className="text-muted-foreground">
                精选优质技术文章，深度探索技术世界
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredArticles.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
