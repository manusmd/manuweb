'use client';

import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { CopyButton } from '@/components/CopyButton';

interface CodeBlockProps {
  children: string;
  className?: string;
  language?: string;
}

export function CodeBlock({ children, className, language }: CodeBlockProps) {
  const match = /language-(\w+)/.exec(className || '');
  const lang = language || match?.[1] || 'text';

  return (
    <div className="relative group my-6">
      <div className="flex items-center justify-between bg-muted border border-border rounded-t-lg px-4 py-2">
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
          {lang}
        </span>
        <CopyButton content={children} />
      </div>
      <SyntaxHighlighter
        style={oneDark}
        language={lang}
        PreTag="div"
        className="!mt-0 !rounded-t-none border border-t-0 border-border"
        customStyle={{
          margin: 0,
          borderTopLeftRadius: 0,
          borderTopRightRadius: 0,
          background: 'hsl(var(--muted))',
        }}
      >
        {children}
      </SyntaxHighlighter>
    </div>
  );
}
