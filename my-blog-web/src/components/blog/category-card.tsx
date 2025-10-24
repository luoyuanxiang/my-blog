'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import type { Category } from '@/types';

interface CategoryCardProps {
  category: Category;
}

export function CategoryCard({ category }: CategoryCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
    >
      <Link
        href={`/categories/${category.slug}`}
        className="block p-6 bg-card rounded-lg border hover:shadow-md transition-all duration-300 group"
      >
        <div className="flex items-center space-x-4">
          <div
            className="w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold text-lg"
            style={{ backgroundColor: category.color }}
          >
            {category.name.charAt(0)}
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold group-hover:text-primary transition-colors">
              {category.name}
            </h3>
            <p className="text-sm text-muted-foreground mb-2">
              {category.description}
            </p>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <span>{category.articleCount} 篇文章</span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
