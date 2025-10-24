'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import type { Tag } from '@/types';

interface TagCloudProps {
  tags: Tag[];
}

export function TagCloud({ tags }: TagCloudProps) {
  // 根据文章数量计算标签大小
  const getTagSize = (articleCount: number) => {
    if (articleCount >= 20) return 'text-lg';
    if (articleCount >= 15) return 'text-base';
    if (articleCount >= 10) return 'text-sm';
    return 'text-xs';
  };

  // 根据文章数量计算标签权重
  const getTagWeight = (articleCount: number) => {
    if (articleCount >= 20) return 'font-bold';
    if (articleCount >= 15) return 'font-semibold';
    if (articleCount >= 10) return 'font-medium';
    return 'font-normal';
  };

  return (
    <div className="flex flex-wrap gap-3">
      {tags.map((tag, index) => (
        <motion.div
          key={tag.id}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.1, duration: 0.3 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <Link
            href={`/tags/${tag.slug}`}
            className={cn(
              'inline-block px-3 py-2 rounded-full text-white hover:opacity-80 transition-all duration-300',
              getTagSize(tag.articleCount),
              getTagWeight(tag.articleCount)
            )}
            style={{ backgroundColor: tag.color }}
          >
            {tag.name}
            <span className="ml-1 text-xs opacity-75">
              ({tag.articleCount})
            </span>
          </Link>
        </motion.div>
      ))}
    </div>
  );
}
