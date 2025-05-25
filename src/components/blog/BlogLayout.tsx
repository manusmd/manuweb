'use client';

import { useRef } from 'react';
import { ReadingProgress } from '@/components/scroll/ReadingProgress';

interface BlogLayoutProps {
  children: React.ReactNode;
}

export function BlogLayout({ children }: BlogLayoutProps) {
  const articleRef = useRef<HTMLElement>(null);

  return (
    <div className="relative min-h-screen">
      <ReadingProgress target={articleRef} />
      <article ref={articleRef} className="container mx-auto px-4 max-w-4xl py-12">
        <div className="prose prose-lg dark:prose-invert mx-auto">{children}</div>
      </article>
    </div>
  );
}
