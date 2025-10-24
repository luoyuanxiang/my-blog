'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy, Check, ChevronDown, ChevronUp } from 'lucide-react';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';
import hljs from 'highlight.js/lib/core';
import javascript from 'highlight.js/lib/languages/javascript';
import typescript from 'highlight.js/lib/languages/typescript';
import python from 'highlight.js/lib/languages/python';
import java from 'highlight.js/lib/languages/java';
import css from 'highlight.js/lib/languages/css';
import html from 'highlight.js/lib/languages/xml';
import json from 'highlight.js/lib/languages/json';
import bash from 'highlight.js/lib/languages/bash';
import sql from 'highlight.js/lib/languages/sql';
import 'highlight.js/styles/github.css';
import 'highlight.js/styles/github-dark.css';

// 注册语言
hljs.registerLanguage('javascript', javascript);
hljs.registerLanguage('typescript', typescript);
hljs.registerLanguage('python', python);
hljs.registerLanguage('java', java);
hljs.registerLanguage('css', css);
hljs.registerLanguage('html', html);
hljs.registerLanguage('xml', html);
hljs.registerLanguage('json', json);
hljs.registerLanguage('bash', bash);
hljs.registerLanguage('shell', bash);
hljs.registerLanguage('sql', sql);

interface CodeBlockProps {
  code: string;
  language: string;
  filename?: string;
  showLineNumbers?: boolean;
  maxHeight?: number;
}

export function CodeBlock({ 
  code, 
  language, 
  filename, 
  maxHeight = 400 
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [highlightedCode, setHighlightedCode] = useState('');
  const [shouldCollapse, setShouldCollapse] = useState(false);
  const { theme } = useTheme();
  const codeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const highlightCode = () => {
      try {
        const result = hljs.highlight(code, { language: language || 'text' });
        setHighlightedCode(result.value);
      } catch {
        // 如果高亮失败，使用原始代码
        setHighlightedCode(code);
      }
    };
    
    // 使用 setTimeout 来避免在 effect 中直接调用 setState
    const timer = setTimeout(highlightCode, 0);
    return () => clearTimeout(timer);
  }, [code, language]);

  useEffect(() => {
    const checkShouldCollapse = () => {
      if (codeRef.current) {
        setShouldCollapse(codeRef.current.scrollHeight > maxHeight);
      }
    };
    
    checkShouldCollapse();
    
    // 监听窗口大小变化
    window.addEventListener('resize', checkShouldCollapse);
    return () => window.removeEventListener('resize', checkShouldCollapse);
  }, [maxHeight, highlightedCode]);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className="relative my-6 rounded-lg overflow-hidden border bg-card">
      {/* Mac 样式标题栏 */}
      <div className="flex items-center justify-between px-4 py-2 bg-muted border-b">
        <div className="flex items-center space-x-2">
          {/* Mac 按钮 */}
          <div className="flex space-x-1">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
          {/* 文件名 */}
          {filename && (
            <span className="text-sm text-muted-foreground font-mono">
              {filename}
            </span>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          {/* 折叠按钮 */}
          {shouldCollapse && (
            <button
              onClick={toggleCollapse}
              className="p-1 hover:bg-muted-foreground/10 rounded transition-colors"
              aria-label={isCollapsed ? '展开代码' : '折叠代码'}
            >
              {isCollapsed ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronUp className="h-4 w-4" />
              )}
            </button>
          )}
          
          {/* 复制按钮 */}
          <button
            onClick={copyToClipboard}
            className="flex items-center space-x-1 px-2 py-1 text-xs bg-muted-foreground/10 hover:bg-muted-foreground/20 rounded transition-colors"
          >
            {copied ? (
              <>
                <Check className="h-3 w-3" />
                <span>已复制</span>
              </>
            ) : (
              <>
                <Copy className="h-3 w-3" />
                <span>复制</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 代码内容 */}
      <div className="relative">
        <AnimatePresence>
          <motion.div
            ref={codeRef}
            initial={false}
            animate={{ 
              height: isCollapsed ? maxHeight : 'auto',
              overflow: isCollapsed ? 'hidden' : 'visible'
            }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className={cn(
              'relative',
              isCollapsed && 'overflow-hidden'
            )}
          >
            <pre className={cn(
              'hljs',
              'p-4 m-0 overflow-x-auto',
              'text-sm leading-relaxed',
              'bg-transparent',
              theme === 'dark' ? 'hljs-dark' : 'hljs-light'
            )}>
              <code 
                className="hljs"
                dangerouslySetInnerHTML={{ __html: highlightedCode }}
              />
            </pre>
            
            {/* 渐变遮罩（折叠时显示） */}
            {isCollapsed && (
              <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-card to-transparent pointer-events-none" />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

// Markdown 代码块组件
interface MarkdownCodeBlockProps {
  children: string;
  className?: string;
}

export function MarkdownCodeBlock({ children, className }: MarkdownCodeBlockProps) {
  const match = /language-(\w+)/.exec(className || '');
  const language = match ? match[1] : 'text';
  
  return (
    <CodeBlock
      code={children.trim()}
      language={language}
      showLineNumbers={true}
    />
  );
}
