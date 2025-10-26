'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';
import { motion } from 'framer-motion';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  showInfo?: boolean;
  className?: string;
}

export function Pagination({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  showInfo = true,
  className = ''
}: PaginationProps) {
  // 计算显示的页码范围
  const getVisiblePages = () => {
    const delta = 2; // 当前页前后显示的页数
    const range = [];
    const rangeWithDots = [];

    for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages);
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  const visiblePages = getVisiblePages();

  // 计算显示信息
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  if (totalPages <= 1) {
    return showInfo ? (
      <div className={`flex items-center justify-between text-sm text-gray-600 ${className}`}>
        <span>共 {totalItems} 条记录</span>
      </div>
    ) : null;
  }

  return (
    <div className={`flex items-center justify-between ${className}`}>
      {/* 显示信息 */}
      {showInfo && (
        <div className="text-sm text-gray-600">
          显示第 {startItem} - {endItem} 条，共 {totalItems} 条记录
        </div>
      )}

      {/* 分页按钮 */}
      <div className="flex items-center space-x-1">
        {/* 上一页 */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
            currentPage === 1
              ? 'text-gray-400 cursor-not-allowed'
              : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
          }`}
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          上一页
        </motion.button>

        {/* 页码按钮 */}
        <div className="flex items-center space-x-1">
          {visiblePages.map((page, index) => {
            if (page === '...') {
              return (
                <span key={`dots-${index}`} className="px-3 py-2 text-gray-400">
                  <MoreHorizontal className="w-4 h-4" />
                </span>
              );
            }

            const pageNumber = page as number;
            const isCurrentPage = pageNumber === currentPage;

            return (
              <motion.button
                key={pageNumber}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onPageChange(pageNumber)}
                className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  isCurrentPage
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                {pageNumber}
              </motion.button>
            );
          })}
        </div>

        {/* 下一页 */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
            currentPage === totalPages
              ? 'text-gray-400 cursor-not-allowed'
              : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
          }`}
        >
          下一页
          <ChevronRight className="w-4 h-4 ml-1" />
        </motion.button>
      </div>
    </div>
  );
}

// 分页Hook - 支持两种模式
export function usePagination<T>(
  itemsOrItemsPerPage: T[] | number,
  itemsPerPage?: number
) {
  const [currentPage, setCurrentPage] = useState(1);

  // 判断是数组模式还是数字模式
  const isArrayMode = Array.isArray(itemsOrItemsPerPage);
  const items = isArrayMode ? itemsOrItemsPerPage as T[] : [];
  const pageSize = isArrayMode ? (itemsPerPage || 10) : (itemsOrItemsPerPage as number);

  const totalItems = items.length;
  const totalPages = Math.ceil(totalItems / pageSize);

  // 计算当前页显示的数据
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentItems = items.slice(startIndex, endIndex);

  // 重置到第一页当数据变化时
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(1);
    }
  }, [totalItems, currentPage, totalPages]);

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return {
    currentPage,
    totalPages,
    totalItems,
    currentItems,
    itemsPerPage: pageSize,
    goToPage,
    goToNextPage,
    goToPreviousPage,
    hasNextPage: currentPage < totalPages,
    hasPreviousPage: currentPage > 1,
  };
}