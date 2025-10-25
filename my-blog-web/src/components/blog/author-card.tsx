'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { Github, Twitter, Mail, Globe, MapPin, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Author {
  name: string;
  avatar: string;
  bio: string;
  location?: string;
  website?: string;
  github?: string;
  twitter?: string;
  email?: string;
  joinDate?: string;
  stats?: {
    articles: number;
    views: number;
    likes: number;
  };
}

interface AuthorCardProps {
  author: Author;
  className?: string;
}

export function AuthorCard({ author, className }: AuthorCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={cn(
        'bg-card border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow',
        className
      )}
    >
      {/* 作者头像和基本信息 */}
      <div className="flex flex-col items-center text-center mb-6">
        <div className="relative mb-4">
          {author.avatar && author.avatar.trim() !== '' ? (
            <Image
              src={author.avatar}
              alt={author.name}
              width={80}
              height={80}
              className="rounded-full border-2 border-primary/20"
            />
          ) : (
            <div className="w-20 h-20 rounded-full border-2 border-primary/20 bg-gradient-to-br from-primary/20 to-primary/40 flex items-center justify-center">
              <span className="text-2xl font-bold text-primary">
                {author.name.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-background"></div>
        </div>
        
        <h3 className="text-xl font-bold text-foreground mb-2">{author.name}</h3>
        <p className="text-muted-foreground text-sm leading-relaxed mb-4">
          {author.bio}
        </p>
        
        {/* 位置和加入时间 */}
        <div className="flex flex-col sm:flex-row gap-4 text-xs text-muted-foreground mb-4">
          {author.location && (
            <div className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              <span>{author.location}</span>
            </div>
          )}
          {author.joinDate && (
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              <span>{author.joinDate}</span>
            </div>
          )}
        </div>
      </div>

      {/* 统计数据 */}
      {author.stats && (
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="text-center">
            <div className="text-lg font-bold text-primary">{author.stats.articles}</div>
            <div className="text-xs text-muted-foreground">文章</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-primary">{author.stats.views.toLocaleString()}</div>
            <div className="text-xs text-muted-foreground">浏览量</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-primary">{author.stats.likes}</div>
            <div className="text-xs text-muted-foreground">获赞</div>
          </div>
        </div>
      )}

      {/* 社交链接 */}
      <div className="flex justify-center gap-3">
        {author.github && (
          <motion.a
            href={author.github}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 rounded-full bg-muted hover:bg-primary hover:text-primary-foreground transition-colors"
            aria-label="GitHub"
          >
            <Github className="h-4 w-4" />
          </motion.a>
        )}
        
        {author.twitter && (
          <motion.a
            href={author.twitter}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 rounded-full bg-muted hover:bg-blue-500 hover:text-white transition-colors"
            aria-label="Twitter"
          >
            <Twitter className="h-4 w-4" />
          </motion.a>
        )}
        
        {author.email && (
          <motion.a
            href={`mailto:${author.email}`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 rounded-full bg-muted hover:bg-green-500 hover:text-white transition-colors"
            aria-label="Email"
          >
            <Mail className="h-4 w-4" />
          </motion.a>
        )}
        
        {author.website && (
          <motion.a
            href={author.website}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 rounded-full bg-muted hover:bg-purple-500 hover:text-white transition-colors"
            aria-label="Website"
          >
            <Globe className="h-4 w-4" />
          </motion.a>
        )}
      </div>
    </motion.div>
  );
}
