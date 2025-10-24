'use client';

import { useState, useRef } from 'react';
import { MarkdownRenderer } from './markdown-renderer';
import { ImageUploadModal } from './image-upload-modal';
import { CodeInsertModal } from './code-insert-modal';
import { 
  Eye, 
  EyeOff, 
  FileText, 
  Maximize2, 
  Minimize2,
  Image as ImageIcon,
  Code,
  Bold,
  Italic,
  Link as LinkIcon,
  List,
  ListOrdered,
  Quote,
  Heading1,
  Heading2,
  Heading3,
  Type,
  Upload
} from 'lucide-react';
import { FileImportModal } from './file-import-modal';

interface MarkdownEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

interface ToolbarButtonProps {
  onClick: () => void;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  active?: boolean;
}

const ToolbarButton = ({ onClick, icon: Icon, title, active = false }: ToolbarButtonProps) => (
  <button
    type="button"
    onClick={onClick}
    className={`p-2 rounded hover:bg-muted transition-colors ${
      active ? 'bg-muted text-primary' : ''
    }`}
    title={title}
  >
    <Icon className="h-4 w-4" />
  </button>
);

export function MarkdownEditor({ content, onChange, placeholder = '开始写作...' }: Readonly<MarkdownEditorProps>) {
  const [isPreview, setIsPreview] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLiveRender, setIsLiveRender] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [showCodeModal, setShowCodeModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };

  const insertAtCursor = (text: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const before = content.substring(0, start);
    const after = content.substring(end);
    const newContent = before + text + after;
    
    onChange(newContent);
    
    // 设置光标位置
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + text.length, start + text.length);
    }, 0);
  };

  const insertImage = (imageMarkdown: string) => {
    insertAtCursor(imageMarkdown);
  };

  const insertCode = (codeMarkdown: string) => {
    insertAtCursor(codeMarkdown);
  };

  const handleImport = (importedContent: string, type: 'html' | 'markdown' | 'json') => {
    if (type === 'markdown') {
      onChange(importedContent);
    } else if (type === 'html') {
      // 简单的HTML到Markdown转换
      const markdownContent = importedContent
        .replace(/<h1>(.*?)<\/h1>/gim, '# $1\n')
        .replace(/<h2>(.*?)<\/h2>/gim, '## $1\n')
        .replace(/<h3>(.*?)<\/h3>/gim, '### $1\n')
        .replace(/<strong>(.*?)<\/strong>/gim, '**$1**')
        .replace(/<em>(.*?)<\/em>/gim, '*$1*')
        .replace(/<li>(.*?)<\/li>/gim, '- $1\n')
        .replace(/<br\s*\/?>/gim, '\n')
        .replace(/<[^>]*>/gim, '') // 移除其他HTML标签
        .replace(/\n\s*\n/gim, '\n\n') // 清理多余的空行
        .trim();
      onChange(markdownContent);
    } else if (type === 'json') {
      onChange(importedContent);
    }
  };

  const insertMarkdown = (before: string, after: string = '', placeholder: string = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);
    const text = selectedText || placeholder;
    const markdown = before + text + after;
    
    const beforeText = content.substring(0, start);
    const afterText = content.substring(end);
    const newContent = beforeText + markdown + afterText;
    
    onChange(newContent);
    
    // 设置选中文本
    setTimeout(() => {
      textarea.focus();
      if (!selectedText) {
        textarea.setSelectionRange(start + before.length, start + before.length + text.length);
      } else {
        textarea.setSelectionRange(start + before.length, start + before.length + selectedText.length);
      }
    }, 0);
  };

  return (
    <div className={`border border-input rounded-lg overflow-hidden ${isFullscreen ? 'fixed inset-0 z-50 bg-background' : ''}`}>
      {/* 工具栏 */}
      <div className="flex items-center justify-between p-2 border-b border-input bg-muted/50">
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">Markdown 编辑器</span>
        </div>
        
        <div className="flex items-center gap-1">
          {/* 编辑器模式切换 */}
          <div className="flex items-center bg-muted rounded-lg p-1 mr-2">
            <button
              onClick={() => setIsPreview(false)}
              className={`px-2 py-1 rounded text-xs transition-colors ${
                !isPreview 
                  ? 'bg-background text-foreground shadow-sm' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Type className="h-3 w-3 inline mr-1" />
              编辑
            </button>
            <button
              onClick={() => setIsPreview(true)}
              className={`px-2 py-1 rounded text-xs transition-colors ${
                isPreview 
                  ? 'bg-background text-foreground shadow-sm' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Eye className="h-3 w-3 inline mr-1" />
              预览
            </button>
            <button
              onClick={() => setIsLiveRender(!isLiveRender)}
              className={`px-2 py-1 rounded text-xs transition-colors ${
                isLiveRender 
                  ? 'bg-background text-foreground shadow-sm' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <EyeOff className="h-3 w-3 inline mr-1" />
              实时
            </button>
          </div>

          {/* 格式化工具 */}
          {!isPreview && (
            <div className="flex items-center gap-1 border-r border-border pr-2 mr-2">
              <ToolbarButton
                onClick={() => insertMarkdown('**', '**', '粗体文本')}
                icon={Bold}
                title="粗体"
              />
              <ToolbarButton
                onClick={() => insertMarkdown('*', '*', '斜体文本')}
                icon={Italic}
                title="斜体"
              />
              <div className="w-px h-4 bg-border mx-1" />
              <ToolbarButton
                onClick={() => insertMarkdown('# ', '', '标题')}
                icon={Heading1}
                title="标题1"
              />
              <ToolbarButton
                onClick={() => insertMarkdown('## ', '', '标题')}
                icon={Heading2}
                title="标题2"
              />
              <ToolbarButton
                onClick={() => insertMarkdown('### ', '', '标题')}
                icon={Heading3}
                title="标题3"
              />
              <div className="w-px h-4 bg-border mx-1" />
              <ToolbarButton
                onClick={() => insertMarkdown('- ', '', '列表项')}
                icon={List}
                title="无序列表"
              />
              <ToolbarButton
                onClick={() => insertMarkdown('1. ', '', '列表项')}
                icon={ListOrdered}
                title="有序列表"
              />
              <ToolbarButton
                onClick={() => insertMarkdown('> ', '', '引用文本')}
                icon={Quote}
                title="引用"
              />
              <div className="w-px h-4 bg-border mx-1" />
              <ToolbarButton
                onClick={() => setShowImageModal(true)}
                icon={ImageIcon}
                title="插入图片"
              />
              <ToolbarButton
                onClick={() => setShowCodeModal(true)}
                icon={Code}
                title="插入代码"
              />
              <ToolbarButton
                onClick={() => insertMarkdown('[', '](url)', '链接文本')}
                icon={LinkIcon}
                title="插入链接"
              />
            </div>
          )}

          <div className="w-px h-6 bg-border mx-1" />

          <button
            type="button"
            onClick={() => setShowImportModal(true)}
            className="p-2 rounded hover:bg-muted transition-colors"
            title="导入文档"
          >
            <Upload className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2 rounded hover:bg-muted transition-colors"
            title={isFullscreen ? '退出全屏' : '全屏'}
          >
            {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* 编辑器内容 */}
      <div className="bg-background">
        {isPreview ? (
          <div className="p-4 min-h-[400px]">
            <MarkdownRenderer content={content} />
          </div>
        ) : (
          <div className="relative flex">
            {/* 编辑器 */}
            <div className={`${isLiveRender ? 'w-1/2' : 'w-full'} relative`}>
              <textarea
                ref={textareaRef}
                value={content}
                onChange={handleTextareaChange}
                placeholder={placeholder}
                className="w-full min-h-[400px] p-4 border-0 resize-none focus:outline-none bg-transparent text-foreground font-mono text-sm leading-relaxed"
                style={{ fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace' }}
              />
              
              {/* Markdown 快捷提示 */}
              <div className="absolute bottom-4 right-4 text-xs text-muted-foreground bg-muted/80 px-2 py-1 rounded">
                Markdown 支持
              </div>
            </div>

            {/* 实时预览 */}
            {isLiveRender && (
              <>
                <div className="w-px bg-border" />
                <div className="w-1/2 p-4 min-h-[400px] overflow-y-auto">
                  <div className="text-xs text-muted-foreground mb-2">实时预览</div>
                  <MarkdownRenderer content={content} />
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* 弹窗 */}
      <ImageUploadModal
        isOpen={showImageModal}
        onClose={() => setShowImageModal(false)}
        onInsert={insertImage}
      />

      <CodeInsertModal
        isOpen={showCodeModal}
        onClose={() => setShowCodeModal(false)}
        onInsert={insertCode}
      />

      <FileImportModal
        isOpen={showImportModal}
        onClose={() => setShowImportModal(false)}
        onImport={handleImport}
        editorType="markdown"
      />
    </div>
  );
}
