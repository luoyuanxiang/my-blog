'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronRight } from 'lucide-react';

interface TocItem {
  id: string;
  text: string;
  level: number;
  children?: TocItem[];
}

interface TableOfContentsProps {
  content: string;
  className?: string;
}

export function TableOfContents({ content, className }: TableOfContentsProps) {
  const [tocItems, setTocItems] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState<string>('');
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  // 解析 Markdown 内容生成目录
  useEffect(() => {
    const generateTocItems = () => {
      const headings = content.match(/^(#{1,6})\s+(.+)$/gm);
      if (!headings) {
        return [];
      }

      const items: TocItem[] = [];
      const stack: TocItem[] = [];

      headings.forEach((heading) => {
        const match = heading.match(/^(#{1,6})\s+(.+)$/);
        if (!match) return;

        const level = match[1].length;
        const text = match[2].trim();
        const id = text.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');

        const item: TocItem = {
          id,
          text,
          level,
        };

        // 构建层级结构
        while (stack.length > 0 && stack[stack.length - 1].level >= level) {
          stack.pop();
        }

        if (stack.length === 0) {
          items.push(item);
        } else {
          const parent = stack[stack.length - 1];
          if (!parent.children) {
            parent.children = [];
          }
          parent.children.push(item);
        }

        stack.push(item);
      });

      return items;
    };

    const newTocItems = generateTocItems();
    
    // 使用 setTimeout 来避免在 effect 中直接调用 setState
    const timer = setTimeout(() => {
      setTocItems(newTocItems);
      
      // 默认展开所有项目
      const allIds = new Set<string>();
      const collectIds = (items: TocItem[]) => {
        items.forEach(item => {
          allIds.add(item.id);
          if (item.children) {
            collectIds(item.children);
          }
        });
      };
      collectIds(newTocItems);
      setExpandedItems(allIds);
    }, 0);
    
    return () => clearTimeout(timer);
  }, [content]);

  // 监听滚动，更新当前活跃的标题
  useEffect(() => {
    const handleScroll = () => {
      const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
      let current = '';

      headings.forEach((heading) => {
        const rect = heading.getBoundingClientRect();
        if (rect.top <= 100) {
          current = heading.id;
        }
      });

      setActiveId(current);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 切换展开/收起状态
  const toggleExpanded = (id: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedItems(newExpanded);
  };

  // 滚动到指定标题
  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // 渲染目录项
  const renderTocItem = (item: TocItem, depth = 0, parentPath = '') => {
    const isExpanded = expandedItems.has(item.id);
    const isActive = activeId === item.id;
    const hasChildren = item.children && item.children.length > 0;
    const uniqueKey = parentPath ? `${parentPath}-${item.id}` : item.id;

    return (
      <div key={uniqueKey} className="mb-1">
        <motion.div
          className={`flex items-center cursor-pointer rounded-lg px-3 py-2 text-sm transition-all duration-200 ${
            isActive
              ? 'bg-primary text-primary-foreground shadow-sm'
              : 'hover:bg-muted text-muted-foreground hover:text-foreground'
          }`}
          style={{ paddingLeft: `${depth * 12 + 12}px` }}
          onClick={() => scrollToHeading(item.id)}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {hasChildren && (
            <button
              className="mr-2 p-0.5 hover:bg-background/20 rounded"
              onClick={(e) => {
                e.stopPropagation();
                toggleExpanded(item.id);
              }}
            >
              {isExpanded ? (
                <ChevronDown className="h-3 w-3" />
              ) : (
                <ChevronRight className="h-3 w-3" />
              )}
            </button>
          )}
          <span className="truncate">{item.text}</span>
        </motion.div>

        <AnimatePresence>
          {hasChildren && isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              {item.children!.map((child, index) => renderTocItem(child, depth + 1, `${uniqueKey}-${index}`))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  if (tocItems.length === 0) {
    return null;
  }

  return (
    <div className={`bg-card rounded-lg border border-border p-6 shadow-sm sticky top-4 max-h-[calc(100vh-2rem)] overflow-hidden ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">目录</h3>
        <div className="text-xs text-muted-foreground">
          {tocItems.length} 个章节
        </div>
      </div>
      
      <div className="space-y-1 overflow-y-auto max-h-[calc(100vh-8rem)]">
        {tocItems.map((item, index) => renderTocItem(item, 0, `root-${index}`))}
      </div>
      
      <div className="mt-4 pt-4 border-t border-border">
        <div className="text-xs text-muted-foreground">
          点击章节快速跳转
        </div>
      </div>
    </div>
  );
}
