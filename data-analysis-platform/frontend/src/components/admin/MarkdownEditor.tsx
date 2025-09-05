import React, { useState, useRef } from 'react';
import {
  Box,
  Paper,
  Toolbar,
  IconButton,
  Divider,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material';
import {
  FormatBold as BoldIcon,
  FormatItalic as ItalicIcon,
  FormatUnderlined as UnderlineIcon,
  FormatQuote as QuoteIcon,
  FormatListBulleted as ListIcon,
  FormatListNumbered as NumberedListIcon,
  Code as CodeIcon,
  Link as LinkIcon,
  Image as ImageIcon,
  Visibility as PreviewIcon,
  VisibilityOff as EditIcon,
  Save as SaveIcon,
} from '@mui/icons-material';

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  onSave?: () => void;
  height?: number | string;
  showToolbar?: boolean;
  showPreview?: boolean;
  placeholder?: string;
}

const MarkdownEditor: React.FC<MarkdownEditorProps> = ({
  value,
  onChange,
  onSave,
  height = 500,
  showToolbar = true,
  showPreview = true,
  placeholder = '开始编写您的内容...',
}) => {
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [showLinkDialog, setShowLinkDialog] = useState(false);
  const [showImageDialog, setShowImageDialog] = useState(false);
  const [linkText, setLinkText] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [imageAlt, setImageAlt] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // 获取选中的文本
  const getSelectedText = () => {
    const textarea = textareaRef.current;
    if (!textarea) return { start: 0, end: 0, text: '' };
    
    return {
      start: textarea.selectionStart,
      end: textarea.selectionEnd,
      text: textarea.value.substring(textarea.selectionStart, textarea.selectionEnd),
    };
  };

  // 插入文本
  const insertText = (before: string, after: string = '', defaultText: string = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const { start, end, text } = getSelectedText();
    const selectedText = text || defaultText;
    const newText = before + selectedText + after;
    
    const newValue = value.substring(0, start) + newText + value.substring(end);
    onChange(newValue);

    // 重新聚焦并设置光标位置
    setTimeout(() => {
      textarea.focus();
      const newCursorPos = start + before.length + selectedText.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };

  // 工具栏按钮处理函数
  const handleBold = () => insertText('**', '**', '粗体文本');
  const handleItalic = () => insertText('*', '*', '斜体文本');
  const handleUnderline = () => insertText('<u>', '</u>', '下划线文本');
  const handleQuote = () => insertText('> ', '', '引用文本');
  const handleList = () => insertText('- ', '', '列表项');
  const handleNumberedList = () => insertText('1. ', '', '编号列表项');
  const handleCode = () => {
    const { text } = getSelectedText();
    if (text.includes('\n')) {
      insertText('```\n', '\n```', '代码块');
    } else {
      insertText('`', '`', '行内代码');
    }
  };

  const handleLink = () => {
    const { text } = getSelectedText();
    setLinkText(text || '链接文本');
    setLinkUrl('https://');
    setShowLinkDialog(true);
  };

  const handleImage = () => {
    setImageAlt('图片描述');
    setImageUrl('https://');
    setShowImageDialog(true);
  };

  const insertLink = () => {
    insertText(`[${linkText}](${linkUrl})`);
    setShowLinkDialog(false);
    setLinkText('');
    setLinkUrl('');
  };

  const insertImage = () => {
    insertText(`![${imageAlt}](${imageUrl})`);
    setShowImageDialog(false);
    setImageAlt('');
    setImageUrl('');
  };

  // 简单的Markdown渲染（用于预览）
  const renderMarkdown = (text: string) => {
    return text
      .replace(/^### (.*$)/gm, '<h3>$1</h3>')
      .replace(/^## (.*$)/gm, '<h2>$1</h2>')
      .replace(/^# (.*$)/gm, '<h1>$1</h1>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`(.*?)`/g, '<code>$1</code>')
      .replace(/^> (.*$)/gm, '<blockquote>$1</blockquote>')
      .replace(/^- (.*$)/gm, '<li>$1</li>')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>')
      .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" style="max-width: 100%; height: auto;" />')
      .replace(/\n/g, '<br>');
  };

  return (
    <Paper sx={{ height, display: 'flex', flexDirection: 'column' }}>
      {/* 工具栏 */}
      {showToolbar && (
        <Toolbar sx={{ minHeight: '48px !important', px: 2, borderBottom: 1, borderColor: 'divider' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
            <IconButton size="small" onClick={handleBold} title="粗体 (Ctrl+B)">
              <BoldIcon fontSize="small" />
            </IconButton>
            <IconButton size="small" onClick={handleItalic} title="斜体 (Ctrl+I)">
              <ItalicIcon fontSize="small" />
            </IconButton>
            <IconButton size="small" onClick={handleUnderline} title="下划线">
              <UnderlineIcon fontSize="small" />
            </IconButton>
            
            <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />
            
            <IconButton size="small" onClick={handleQuote} title="引用">
              <QuoteIcon fontSize="small" />
            </IconButton>
            <IconButton size="small" onClick={handleList} title="无序列表">
              <ListIcon fontSize="small" />
            </IconButton>
            <IconButton size="small" onClick={handleNumberedList} title="有序列表">
              <NumberedListIcon fontSize="small" />
            </IconButton>
            <IconButton size="small" onClick={handleCode} title="代码">
              <CodeIcon fontSize="small" />
            </IconButton>
            
            <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />
            
            <IconButton size="small" onClick={handleLink} title="插入链接">
              <LinkIcon fontSize="small" />
            </IconButton>
            <IconButton size="small" onClick={handleImage} title="插入图片">
              <ImageIcon fontSize="small" />
            </IconButton>
            
            <Box sx={{ flexGrow: 1 }} />
            
            {showPreview && (
              <IconButton
                size="small"
                onClick={() => setIsPreviewMode(!isPreviewMode)}
                color={isPreviewMode ? 'primary' : 'default'}
                title={isPreviewMode ? '编辑模式' : '预览模式'}
              >
                {isPreviewMode ? <EditIcon fontSize="small" /> : <PreviewIcon fontSize="small" />}
              </IconButton>
            )}
            
            {onSave && (
              <Button
                size="small"
                startIcon={<SaveIcon />}
                onClick={onSave}
                variant="contained"
                sx={{ ml: 1 }}
              >
                保存
              </Button>
            )}
          </Box>
        </Toolbar>
      )}

      {/* 编辑器内容 */}
      <Box sx={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {!isPreviewMode ? (
          // 编辑模式
          <Box
            component="textarea"
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            sx={{
              flex: 1,
              border: 'none',
              outline: 'none',
              resize: 'none',
              p: 2,
              fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
              fontSize: '14px',
              lineHeight: 1.5,
              backgroundColor: 'transparent',
              color: 'text.primary',
              '&::placeholder': {
                color: 'text.secondary',
              },
            }}
          />
        ) : (
          // 预览模式
          <Box
            sx={{
              flex: 1,
              p: 2,
              overflow: 'auto',
              backgroundColor: 'background.paper',
              '& h1': { fontSize: '2rem', fontWeight: 700, mb: 2 },
              '& h2': { fontSize: '1.5rem', fontWeight: 600, mb: 2 },
              '& h3': { fontSize: '1.25rem', fontWeight: 600, mb: 1.5 },
              '& p': { mb: 2, lineHeight: 1.6 },
              '& blockquote': {
                borderLeft: '4px solid',
                borderColor: 'primary.main',
                pl: 2,
                py: 1,
                my: 2,
                backgroundColor: 'action.hover',
                fontStyle: 'italic',
              },
              '& code': {
                backgroundColor: 'action.hover',
                px: 1,
                py: 0.5,
                borderRadius: 1,
                fontSize: '0.875rem',
                fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
              },
              '& pre': {
                backgroundColor: 'action.hover',
                p: 2,
                borderRadius: 1,
                overflow: 'auto',
                my: 2,
              },
              '& ul, & ol': { pl: 3, mb: 2 },
              '& li': { mb: 0.5 },
              '& a': { color: 'primary.main', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } },
            }}
            dangerouslySetInnerHTML={{
              __html: renderMarkdown(value || '暂无内容'),
            }}
          />
        )}
      </Box>

      {/* 链接插入对话框 */}
      <Dialog open={showLinkDialog} onClose={() => setShowLinkDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>插入链接</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="链接文本"
            value={linkText}
            onChange={(e) => setLinkText(e.target.value)}
            sx={{ mb: 2, mt: 1 }}
          />
          <TextField
            fullWidth
            label="链接地址"
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowLinkDialog(false)}>取消</Button>
          <Button onClick={insertLink} variant="contained">插入</Button>
        </DialogActions>
      </Dialog>

      {/* 图片插入对话框 */}
      <Dialog open={showImageDialog} onClose={() => setShowImageDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>插入图片</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="图片描述"
            value={imageAlt}
            onChange={(e) => setImageAlt(e.target.value)}
            sx={{ mb: 2, mt: 1 }}
          />
          <TextField
            fullWidth
            label="图片地址"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowImageDialog(false)}>取消</Button>
          <Button onClick={insertImage} variant="contained">插入</Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default MarkdownEditor;
