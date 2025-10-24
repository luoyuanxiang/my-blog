import Link from 'next/link';
import Image from 'next/image';
import { Calendar, Clock, Eye, Heart, User, Flame } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import type { Article } from '@/types';

interface ArticleCardProps {
  article: Article;
}

export function ArticleCard({ article }: ArticleCardProps) {
  return (
    <article className="group bg-card rounded-lg border shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
      {/* 封面图片 */}
      {article.coverImage && (
        <div className="relative h-48 overflow-hidden">
          <Image
            src={article.coverImage}
            alt={article.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {/* 置顶徽标 */}
          {article.isPinned && (
            <div className="absolute top-4 left-4 z-10">
              <div className="flex items-center justify-center w-8 h-8 bg-red-500 text-white rounded-full shadow-lg">
                <Flame className="h-4 w-4" />
              </div>
            </div>
          )}
          {/* 分类标签 */}
          <div className={`absolute top-4 ${article.isPinned ? 'left-16' : 'left-4'}`}>
            <span
              className="px-2 py-1 text-xs font-medium text-white rounded-full"
              style={{ backgroundColor: article.category.color }}
            >
              {article.category.name}
            </span>
          </div>
        </div>
      )}

      <div className="p-6">
        {/* 标题 */}
        <h3 className="text-xl font-semibold mb-3 group-hover:text-primary transition-colors">
          <Link href={`/articles/${article.slug}`}>
            {article.title}
          </Link>
        </h3>

        {/* 摘要 */}
        <p className="text-muted-foreground mb-4 line-clamp-3">
          {article.excerpt}
        </p>

        {/* 标签 */}
        <div className="flex flex-wrap gap-2 mb-4">
          {article.tags.slice(0, 3).map((tag) => (
            <Link
              key={tag.id}
              href={`/tags/${tag.slug}`}
              className="text-xs px-2 py-1 rounded-full bg-muted hover:bg-muted/80 transition-colors"
            >
              #{tag.name}
            </Link>
          ))}
          {article.tags.length > 3 && (
            <span className="text-xs px-2 py-1 text-muted-foreground">
              +{article.tags.length - 3}
            </span>
          )}
        </div>

        {/* 元信息 */}
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <User className="h-4 w-4" />
              <span>{article.author.name}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Calendar className="h-4 w-4" />
              <span>{formatDate(article.publishedAt)}</span>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-1">
              <Clock className="h-4 w-4" />
              <span>{article.readTime}分钟</span>
            </div>
            <div className="flex items-center space-x-1">
              <Eye className="h-4 w-4" />
              <span>{article.views}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Heart className="h-4 w-4" />
              <span>{article.likes}</span>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
