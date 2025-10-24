'use client';

import { ArticleEditor } from '@/components/admin/article-editor';

// 模拟文章数据
const mockArticle = {
  title: 'Next.js 14 新特性详解',
  slug: 'nextjs-14-features',
  excerpt: 'Next.js 14 带来了许多令人兴奋的新特性，包括改进的 App Router、更好的性能优化和增强的开发体验。',
  content: '<h1>Next.js 14 新特性详解</h1><p>Next.js 14 是一个重要的版本更新...</p>',
  coverImage: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800&h=400&fit=crop',
  category: '1',
  tags: ['Next.js', 'React', 'JavaScript'],
  isPublished: true,
  isPinned: true,
};

export default function EditArticlePage() {
  return <ArticleEditor article={mockArticle} mode="edit" />;
}
