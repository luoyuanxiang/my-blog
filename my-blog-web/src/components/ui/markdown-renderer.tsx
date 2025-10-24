'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { CodeBlock } from './code-block';
import Image from "next/image";

interface MarkdownRendererProps {
  content: string;
}

export function MarkdownRenderer({ content }: Readonly<MarkdownRendererProps>) {
  return (
    <div className="prose prose-slate dark:prose-invert max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          code({ className, children, ...props }: React.HTMLAttributes<HTMLElement> & { node?: unknown }) {
            const match = /language-(\w+)/.exec(className || '');
            const language = match ? match[1] : '';
            const inline = !match;
            
            if (!inline && language) {
              return (
                <CodeBlock
                  code={String(children).replace(/\n$/, '')}
                  language={language}
                  showLineNumbers={true}
                />
              );
            }
            
            return (
              <code className={className} {...props}>
                {children}
              </code>
            );
          },
          h1: ({ children }) => {
            const text = String(children).replace(/[^\w\s-]/g, '').replace(/\s+/g, '-').toLowerCase();
            return (
              <h1 id={text} className="text-3xl font-bold mb-6 text-foreground border-b border-border pb-2 scroll-mt-24">
                {children}
              </h1>
            );
          },
          h2: ({ children }) => {
            const text = String(children).replace(/[^\w\s-]/g, '').replace(/\s+/g, '-').toLowerCase();
            return (
              <h2 id={text} className="text-2xl font-semibold mb-4 mt-8 text-foreground scroll-mt-24">
                {children}
              </h2>
            );
          },
          h3: ({ children }) => {
            const text = String(children).replace(/[^\w\s-]/g, '').replace(/\s+/g, '-').toLowerCase();
            return (
              <h3 id={text} className="text-xl font-semibold mb-3 mt-6 text-foreground scroll-mt-24">
                {children}
              </h3>
            );
          },
          p: ({ children }) => (
            <p className="mb-4 text-foreground leading-relaxed">
              {children}
            </p>
          ),
          ul: ({ children }) => (
            <ul className="mb-4 pl-6 list-disc text-foreground">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="mb-4 pl-6 list-decimal text-foreground">
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li className="mb-2 text-foreground">
              {children}
            </li>
          ),
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-primary pl-4 py-2 mb-4 bg-muted/50 italic text-muted-foreground">
              {children}
            </blockquote>
          ),
          a: ({ children, href }) => (
            <a 
              href={href} 
              className="text-primary hover:text-primary/80 underline transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              {children}
            </a>
          ),
          img: ({ src, alt }) => {
            const imageSrc = typeof src === 'string' ? src : src ? URL.createObjectURL(src) : '';
            return (
              <Image
                src={imageSrc} 
                alt={alt || ''} 
                width={800}
                height={400}
                className="rounded-lg shadow-md mb-4 max-w-full h-auto"
              />
            );
          },
          table: ({ children }) => (
            <div className="overflow-x-auto mb-4">
              <table className="min-w-full border-collapse border border-border">
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-muted">
              {children}
            </thead>
          ),
          th: ({ children }) => (
            <th className="border border-border px-4 py-2 text-left font-semibold text-foreground">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="border border-border px-4 py-2 text-foreground">
              {children}
            </td>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
