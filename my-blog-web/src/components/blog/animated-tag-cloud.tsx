'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, useAnimation } from 'framer-motion';
import Link from 'next/link';
import type { Tag } from '@/types';

interface AnimatedTagCloudProps {
  tags: Tag[];
  className?: string;
}

interface TagItemProps {
  tag: Tag;
  index: number;
  total: number;
  isHovered: boolean;
  onHover: (hovered: boolean) => void;
}

function TagItem({ tag, index, isHovered, onHover }: Omit<TagItemProps, 'total'>) {
  const controls = useAnimation();
  
  // 计算标签位置（网格布局）
  const row = Math.floor(index / 4); // 每行4个标签卡片
  const col = index % 4;
  
  // 计算标签大小（基于文章数量）
  // const maxCount = Math.max(...Array.from({ length: total }, (_, i) => i + 1));
  
  // 动画配置
  const animationDuration = 20 + (index * 0.5); // 每个标签不同的动画时长
  const delay = index * 0.1; // 错开动画开始时间
  
  useEffect(() => {
    if (!isHovered) {
      // 从左到右的匀速运动
      controls.start({
        x: [0, 100],
        transition: {
          duration: animationDuration,
          delay: delay,
          repeat: Infinity,
          repeatType: 'loop',
          ease: 'linear'
        }
      });
    } else {
      // 鼠标悬停时停止运动
      controls.stop();
    }
  }, [isHovered, controls, animationDuration, delay]);

  return (
    <motion.div
      animate={controls}
      className="absolute"
      style={{
        left: `${col * 25}%`, // 4列布局
        top: `${row * 100 + 20}px`, // 行间距100px，卡片更高
        zIndex: isHovered ? 10 : 1,
      }}
      onMouseEnter={() => onHover(true)}
      onMouseLeave={() => onHover(false)}
    >
      <Link href={`/tags/${tag.slug}`}>
        <motion.div
          className="relative cursor-pointer"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.2 }}
        >
          {/* 标签卡片 */}
          <motion.div
            className="bg-gradient-to-br from-card/90 to-card/70 rounded-xl border border-border/50 p-4 shadow-lg backdrop-blur-sm w-[140px] h-[100px] hover:shadow-2xl"
            style={{
              fontSize: '0.9rem',
            }}
            animate={{
              backgroundColor: isHovered ? 'hsl(var(--card))' : 'hsl(var(--card))',
              borderColor: isHovered ? tag.color : 'hsl(var(--border))',
              boxShadow: isHovered 
                ? `0 20px 40px ${tag.color}30, 0 0 0 1px ${tag.color}20` 
                : '0 8px 16px hsl(var(--shadow))',
              transform: isHovered ? 'translateY(-2px)' : 'translateY(0px)',
            }}
            transition={{ duration: 0.3 }}
          >
            {/* 标签头部 */}
            <div className="flex items-center space-x-2 mb-2">
              <div
                className="w-3 h-3 rounded-full flex-shrink-0 shadow-sm"
                style={{ 
                  backgroundColor: tag.color,
                  boxShadow: `0 0 8px ${tag.color}40`
                }}
              />
              <span 
                className="font-bold text-foreground text-sm truncate"
                style={{ color: tag.color }}
              >
                #{tag.name}
              </span>
            </div>
            
            {/* 文章数量 */}
            <div className="text-xs text-muted-foreground mb-1 font-medium">
              {tag.articleCount} 篇文章
            </div>
            
            {/* 标签描述 */}
            <div className="text-xs text-muted-foreground opacity-70 truncate">
              探索更多 →
            </div>
          </motion.div>
          
          {/* 悬停时的光晕效果 */}
          {isHovered && (
            <motion.div
              className="absolute inset-0 rounded-xl"
              style={{
                background: `radial-gradient(circle at center, ${tag.color}20 0%, transparent 70%)`,
                filter: 'blur(8px)',
              }}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1.1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
            />
          )}
        </motion.div>
      </Link>
    </motion.div>
  );
}

export function AnimatedTagCloud({ tags, className }: AnimatedTagCloudProps) {
  const [hoveredTag, setHoveredTag] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // 背景动画
  const backgroundControls = useAnimation();
  
  useEffect(() => {
    // 背景从左到右的渐变动画
    backgroundControls.start({
      backgroundPosition: ['0% 50%', '100% 50%'],
      transition: {
        duration: 15,
        repeat: Infinity,
        repeatType: 'loop',
        ease: 'linear'
      }
    });
  }, [backgroundControls]);

  return (
    <div className={`relative w-full overflow-hidden rounded-2xl bg-gradient-to-br from-card/50 to-card/30 backdrop-blur-sm border border-border/50 shadow-2xl ${className}`}>
      {/* 动态背景 */}
      <motion.div
        className="absolute inset-0 opacity-30"
        animate={backgroundControls}
        style={{
          background: `
            linear-gradient(
              45deg,
              hsl(var(--primary)) 0%,
              hsl(var(--secondary)) 25%,
              hsl(var(--accent)) 50%,
              hsl(var(--muted)) 75%,
              hsl(var(--primary)) 100%
            )
          `,
          backgroundSize: '200% 200%',
          filter: 'blur(40px)',
        }}
      />
      
      {/* 静态背景层 */}
      <div className="absolute inset-0 bg-gradient-to-br from-background/80 to-background/60 backdrop-blur-md" />
      
      {/* 装饰性元素 */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-secondary to-accent" />
      <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-primary/20 to-transparent rounded-full blur-2xl" />
      
      {/* 标签容器 */}
      <div 
        ref={containerRef}
        className="relative w-full p-8"
        style={{ minHeight: `${Math.ceil(tags.length / 4) * 120 + 80}px` }}
      >
        {tags.map((tag, index) => (
          <TagItem
            key={tag.id}
            tag={tag}
            index={index}
            isHovered={hoveredTag === tag.id}
            onHover={(hovered) => setHoveredTag(hovered ? tag.id : null)}
          />
        ))}
      </div>
    </div>
  );
}
