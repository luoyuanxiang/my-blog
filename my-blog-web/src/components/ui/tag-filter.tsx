'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ChevronDown, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Tag } from '@/types';

interface TagFilterProps {
  tags: Tag[];
  selectedTags?: string[];
  onTagsChange?: (tagSlugs: string[]) => void;
}

export function TagFilter({ 
  tags, 
  selectedTags = [],
  onTagsChange 
}: Readonly<TagFilterProps>) {
  const [isOpen, setIsOpen] = useState(false);

  const handleTagToggle = (tagSlug: string) => {
    if (!onTagsChange) return;
    
    const newSelectedTags = selectedTags.includes(tagSlug)
      ? selectedTags.filter(slug => slug !== tagSlug)
      : [...selectedTags, tagSlug];
    
    onTagsChange(newSelectedTags);
  };

  const clearAllTags = () => {
    if (onTagsChange) {
      onTagsChange([]);
    }
  };

  const selectedTagsData = tags.filter(tag => selectedTags.includes(tag.slug));

  return (
    <div className="relative">
      <div className="flex items-center space-x-2">
        <span className="text-sm font-medium text-muted-foreground">标签:</span>
        
        {/* 当前选中的标签 */}
        {selectedTagsData.length > 0 ? (
          <div className="flex items-center space-x-2">
            <div className="flex flex-wrap gap-1">
              {selectedTagsData.map((tag) => (
                <Link
                  key={tag.id}
                  href={`/tags/${tag.slug}`}
                  className="flex items-center space-x-1 px-2 py-1 text-white rounded-full text-xs hover:opacity-80 transition-opacity"
                  style={{ backgroundColor: tag.color }}
                >
                  <span>#{tag.name}</span>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      handleTagToggle(tag.slug);
                    }}
                    className="hover:bg-white/20 rounded-full p-0.5"
                    aria-label={`移除 ${tag.name} 标签`}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Link>
              ))}
            </div>
            <button
              onClick={clearAllTags}
              className="p-1 hover:bg-muted rounded transition-colors"
              aria-label="清除所有标签筛选"
            >
              <X className="h-4 w-4 text-muted-foreground" />
            </button>
          </div>
        ) : (
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center space-x-2 px-3 py-1 border border-input rounded-full text-sm hover:bg-muted transition-colors"
          >
            <span>选择标签</span>
            <ChevronDown className={cn('h-4 w-4 transition-transform', isOpen && 'rotate-180')} />
          </button>
        )}
      </div>

      {/* 标签下拉菜单 */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="absolute top-full left-0 mt-2 w-80 bg-card border rounded-lg shadow-lg z-50"
        >
          <div className="p-2">
            <div className="text-xs text-muted-foreground px-2 py-1 mb-2">
              选择标签 (可多选)
            </div>
            <div className="max-h-60 overflow-y-auto">
              {tags.map((tag) => (
                <button
                  key={tag.id}
                  onClick={() => handleTagToggle(tag.slug)}
                  className={cn(
                    'w-full flex items-center space-x-3 px-2 py-2 rounded text-left hover:bg-muted transition-colors',
                    selectedTags.includes(tag.slug) && 'bg-muted'
                  )}
                >
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: tag.color }}
                  />
                  <div className="flex-1">
                    <div className="text-sm font-medium">#{tag.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {tag.articleCount} 篇文章
                    </div>
                  </div>
                  {selectedTags.includes(tag.slug) && (
                    <div className="w-2 h-2 bg-primary rounded-full" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
