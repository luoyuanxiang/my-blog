'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ChevronDown, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Category } from '@/types';

interface CategoryFilterProps {
  categories: Category[];
  selectedCategory?: string;
  onCategoryChange?: (categorySlug: string | null) => void;
}

export function CategoryFilter({ 
  categories, 
  selectedCategory,
  onCategoryChange 
}: Readonly<CategoryFilterProps>) {
  const [isOpen, setIsOpen] = useState(false);

  const selectedCategoryData = categories.find(cat => cat.slug === selectedCategory);

  const handleCategorySelect = (categorySlug: string) => {
    if (onCategoryChange) {
      onCategoryChange(categorySlug === selectedCategory ? null : categorySlug);
    }
    setIsOpen(false);
  };

  const clearSelection = () => {
    if (onCategoryChange) {
      onCategoryChange(null);
    }
  };

  return (
    <div className="relative">
      <div className="flex items-center space-x-2">
        <span className="text-sm font-medium text-muted-foreground">分类:</span>
        
        {/* 当前选中的分类 */}
        {selectedCategoryData ? (
          <div className="flex items-center space-x-2">
            <Link
              href={`/categories/${selectedCategoryData.slug}`}
              className="flex items-center space-x-2 px-3 py-1 bg-primary text-primary-foreground rounded-full text-sm hover:bg-primary/90 transition-colors"
            >
              <div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: selectedCategoryData.color }}
              />
              <span>{selectedCategoryData.name}</span>
            </Link>
            <button
              onClick={clearSelection}
              className="p-1 hover:bg-muted rounded transition-colors"
              aria-label="清除分类筛选"
            >
              <X className="h-4 w-4 text-muted-foreground" />
            </button>
          </div>
        ) : (
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center space-x-2 px-3 py-1 border border-input rounded-full text-sm hover:bg-muted transition-colors"
          >
            <span>选择分类</span>
            <ChevronDown className={cn('h-4 w-4 transition-transform', isOpen && 'rotate-180')} />
          </button>
        )}
      </div>

      {/* 分类下拉菜单 */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="absolute top-full left-0 mt-2 w-64 bg-card border rounded-lg shadow-lg z-50"
        >
          <div className="p-2">
            <div className="text-xs text-muted-foreground px-2 py-1 mb-2">
              选择分类
            </div>
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => handleCategorySelect(category.slug)}
                className={cn(
                  'w-full flex items-center space-x-3 px-2 py-2 rounded text-left hover:bg-muted transition-colors',
                  selectedCategory === category.slug && 'bg-muted'
                )}
              >
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: category.color }}
                />
                <div className="flex-1">
                  <div className="text-sm font-medium">{category.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {category.articleCount} 篇文章
                  </div>
                </div>
              </button>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
