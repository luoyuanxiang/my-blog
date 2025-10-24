'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Code, Copy, Languages } from 'lucide-react';

interface CodeInsertModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInsert: (codeMarkdown: string) => void;
}

const languages = [
  { value: '', label: '纯文本' },
  { value: 'javascript', label: 'JavaScript' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'python', label: 'Python' },
  { value: 'java', label: 'Java' },
  { value: 'cpp', label: 'C++' },
  { value: 'csharp', label: 'C#' },
  { value: 'go', label: 'Go' },
  { value: 'rust', label: 'Rust' },
  { value: 'php', label: 'PHP' },
  { value: 'ruby', label: 'Ruby' },
  { value: 'swift', label: 'Swift' },
  { value: 'kotlin', label: 'Kotlin' },
  { value: 'html', label: 'HTML' },
  { value: 'css', label: 'CSS' },
  { value: 'scss', label: 'SCSS' },
  { value: 'json', label: 'JSON' },
  { value: 'xml', label: 'XML' },
  { value: 'yaml', label: 'YAML' },
  { value: 'sql', label: 'SQL' },
  { value: 'bash', label: 'Bash' },
  { value: 'powershell', label: 'PowerShell' },
  { value: 'dockerfile', label: 'Dockerfile' },
  { value: 'markdown', label: 'Markdown' },
];

export function CodeInsertModal({ isOpen, onClose, onInsert }: CodeInsertModalProps) {
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('');
  const [filename, setFilename] = useState('');

  const handleInsert = () => {
    if (!code.trim()) return;
    
    let markdown = '';
    
    if (language) {
      // 代码块
      markdown = `\`\`\`${language}${filename ? ` ${filename}` : ''}\n${code}\n\`\`\``;
    } else {
      // 行内代码
      markdown = `\`${code}\``;
    }
    
    onInsert(markdown);
    onClose();
    
    // 重置表单
    setCode('');
    setLanguage('');
    setFilename('');
  };

  const copyCode = () => {
    navigator.clipboard.writeText(code);
  };

  const getPreviewMarkdown = () => {
    if (!code.trim()) return '';
    
    if (language) {
      return `\`\`\`${language}${filename ? ` ${filename}` : ''}\n${code}\n\`\`\``;
    } else {
      return `\`${code}\``;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-background rounded-xl border shadow-xl w-full max-w-4xl mx-4 max-h-[90vh] flex flex-col"
          >
            {/* 头部 */}
            <div className="flex items-center justify-between p-4 border-b">
              <div className="flex items-center space-x-2">
                <Code className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-semibold">插入代码</h3>
              </div>
              <button
                onClick={onClose}
                className="p-1 hover:bg-muted rounded-lg transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* 内容 */}
            <div className="flex-1 overflow-hidden flex">
              {/* 左侧：输入区域 */}
              <div className="flex-1 p-4 space-y-4 overflow-y-auto">
                {/* 语言选择 */}
                <div>
                  <label className="block text-sm font-medium mb-2">编程语言</label>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="w-full p-3 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                  >
                    {languages.map((lang) => (
                      <option key={lang.value} value={lang.value}>
                        {lang.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* 文件名 */}
                {language && (
                  <div>
                    <label className="block text-sm font-medium mb-2">文件名（可选）</label>
                    <input
                      type="text"
                      value={filename}
                      onChange={(e) => setFilename(e.target.value)}
                      placeholder="example.js"
                      className="w-full p-3 border border-input rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                    />
                  </div>
                )}

                {/* 代码输入 */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium">代码内容</label>
                    <button
                      onClick={copyCode}
                      className="flex items-center space-x-1 px-2 py-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <Copy className="h-3 w-3" />
                      <span>复制</span>
                    </button>
                  </div>
                  <textarea
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="输入你的代码..."
                    className="w-full h-64 p-3 border border-input rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent resize-none font-mono text-sm"
                  />
                </div>
              </div>

              {/* 右侧：预览区域 */}
              <div className="w-px bg-border" />
              <div className="flex-1 p-4">
                <div className="flex items-center space-x-2 mb-3">
                  <Languages className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">预览</span>
                </div>
                <div className="border border-input rounded-lg p-4 bg-muted/30 h-64 overflow-y-auto">
                  <pre className="text-sm font-mono whitespace-pre-wrap">
                    <code>{getPreviewMarkdown()}</code>
                  </pre>
                </div>
              </div>
            </div>

            {/* 底部按钮 */}
            <div className="flex justify-end space-x-2 p-4 border-t">
              <button
                onClick={onClose}
                className="px-4 py-2 border border-input rounded-lg hover:bg-muted transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleInsert}
                disabled={!code.trim()}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                插入代码
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
