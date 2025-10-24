'use client';

import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  showPrevNext?: boolean;
  showFirstLast?: boolean;
  maxVisiblePages?: number;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  showPrevNext = true,
  showFirstLast = false,
  maxVisiblePages = 5
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const getVisiblePages = () => {
    const pages: (number | string)[] = [];
    const halfVisible = Math.floor(maxVisiblePages / 2);
    
    let startPage = Math.max(1, currentPage - halfVisible);
    let endPage = Math.min(totalPages, currentPage + halfVisible);
    
    // 调整范围以确保显示足够的页码
    if (endPage - startPage + 1 < maxVisiblePages) {
      if (startPage === 1) {
        endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
      } else {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
      }
    }
    
    // 添加第一页和省略号
    if (showFirstLast && startPage > 1) {
      pages.push(1);
      if (startPage > 2) {
        pages.push('...');
      }
    }
    
    // 添加可见页码
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    // 添加省略号和最后一页
    if (showFirstLast && endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push('...');
      }
      pages.push(totalPages);
    }
    
    return pages;
  };

  const visiblePages = getVisiblePages();

  return (
    <div className="flex items-center justify-center space-x-2">
      {/* 上一页按钮 */}
      {showPrevNext && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={cn(
            'flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors',
            currentPage === 1
              ? 'text-muted-foreground cursor-not-allowed'
              : 'text-foreground hover:bg-muted'
          )}
        >
          <ChevronLeft className="h-4 w-4" />
          <span>上一页</span>
        </motion.button>
      )}

      {/* 页码按钮 */}
      <div className="flex items-center space-x-1">
        {visiblePages.map((page, index) => (
          <div key={index}>
            {page === '...' ? (
              <div className="px-3 py-2 text-muted-foreground">
                <MoreHorizontal className="h-4 w-4" />
              </div>
            ) : (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onPageChange(page as number)}
                className={cn(
                  'px-3 py-2 rounded-md text-sm font-medium transition-colors',
                  currentPage === page
                    ? 'bg-primary text-primary-foreground'
                    : 'text-foreground hover:bg-muted'
                )}
              >
                {page}
              </motion.button>
            )}
          </div>
        ))}
      </div>

      {/* 下一页按钮 */}
      {showPrevNext && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={cn(
            'flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors',
            currentPage === totalPages
              ? 'text-muted-foreground cursor-not-allowed'
              : 'text-foreground hover:bg-muted'
          )}
        >
          <span>下一页</span>
          <ChevronRight className="h-4 w-4" />
        </motion.button>
      )}
    </div>
  );
}
