'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, FileText, Tag, FolderOpen } from 'lucide-react';
import type { SearchResult, Tag } from '@/types';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (query.trim()) {
      setIsSearching(true);
      // 模拟搜索延迟
      const timer = setTimeout(() => {
        // 模拟搜索结果
        setResults({
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
            }
          ],
          categories: [
            { id: '1', name: '前端开发', slug: 'frontend', description: '前端技术相关文章', color: '#3b82f6', articleCount: 25, createdAt: '2024-01-01' }
          ],
          tags: [
            { id: '1', name: 'React', slug: 'react', color: '#61dafb', articleCount: 20, createdAt: '2024-01-01' }
          ],
          total: 3
        });
        setIsSearching(false);
      }, 500);

      return () => clearTimeout(timer);
    } else {
      setResults(null);
    }
  }, [query]);

  const handleClose = () => {
    setQuery('');
    setResults(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -20 }}
          className="absolute top-20 left-1/2 transform -translate-x-1/2 w-full max-w-2xl mx-4"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="bg-card rounded-lg border shadow-xl">
            {/* 搜索输入框 */}
            <div className="p-4 border-b">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="搜索文章、分类、标签..."
                  className="w-full pl-10 pr-10 py-3 border border-input rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                  autoFocus
                />
                <button
                  onClick={handleClose}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-muted rounded transition-colors"
                >
                  <X className="h-4 w-4 text-muted-foreground" />
                </button>
              </div>
            </div>

            {/* 搜索结果 */}
            <div className="max-h-96 overflow-y-auto">
              {isSearching ? (
                <div className="p-8 text-center text-muted-foreground">
                  <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full mx-auto mb-2"></div>
                  搜索中...
                </div>
              ) : results ? (
                <div className="p-4">
                  {results.total === 0 ? (
                    <div className="text-center text-muted-foreground py-8">
                      没有找到相关结果
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {/* 文章结果 */}
                      {results.articles.length > 0 && (
                        <div>
                          <h3 className="text-sm font-semibold text-muted-foreground mb-2 flex items-center">
                            <FileText className="h-4 w-4 mr-2" />
                            文章 ({results.articles.length})
                          </h3>
                          <div className="space-y-2">
                            {results.articles.map((article) => (
                              <a
                                key={article.id}
                                href={`/articles/${article.slug}`}
                                className="block p-3 hover:bg-muted rounded-lg transition-colors"
                                onClick={handleClose}
                              >
                                <div className="font-medium">{article.title}</div>
                                <div className="text-sm text-muted-foreground mt-1">
                                  {article.excerpt}
                                </div>
                              </a>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* 分类结果 */}
                      {results.categories.length > 0 && (
                        <div>
                          <h3 className="text-sm font-semibold text-muted-foreground mb-2 flex items-center">
                            <FolderOpen className="h-4 w-4 mr-2" />
                            分类 ({results.categories.length})
                          </h3>
                          <div className="space-y-2">
                            {results.categories.map((category) => (
                              <a
                                key={category.id}
                                href={`/categories/${category.slug}`}
                                className="block p-3 hover:bg-muted rounded-lg transition-colors"
                                onClick={handleClose}
                              >
                                <div className="flex items-center space-x-2">
                                  <div
                                    className="w-3 h-3 rounded-full"
                                    style={{ backgroundColor: category.color }}
                                  />
                                  <span className="font-medium">{category.name}</span>
                                  <span className="text-sm text-muted-foreground">
                                    ({category.articleCount} 篇文章)
                                  </span>
                                </div>
                              </a>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* 标签结果 */}
                      {results.tags.length > 0 && (
                        <div>
                          <h3 className="text-sm font-semibold text-muted-foreground mb-2 flex items-center">
                            <Tag className="h-4 w-4 mr-2" />
                            标签 ({results.tags.length})
                          </h3>
                          <div className="space-y-2">
                            {results.tags.map((tag) => (
                              <a
                                key={tag.id}
                                href={`/tags/${tag.slug}`}
                                className="block p-3 hover:bg-muted rounded-lg transition-colors"
                                onClick={handleClose}
                              >
                                <div className="flex items-center space-x-2">
                                  <div
                                    className="w-3 h-3 rounded-full"
                                    style={{ backgroundColor: tag.color }}
                                  />
                                  <span className="font-medium">#{tag.name}</span>
                                  <span className="text-sm text-muted-foreground">
                                    ({tag.articleCount} 篇文章)
                                  </span>
                                </div>
                              </a>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-8 text-center text-muted-foreground">
                  输入关键词开始搜索
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
