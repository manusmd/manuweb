'use client';

import { useRef } from 'react';
import { ReadingProgress } from '@/components/scroll/ReadingProgress';
import { useBlogReadingDetection } from '@/hooks/useBlogReadingDetection';

interface BlogLayoutProps {
  children: React.ReactNode;
}

export function BlogLayout({ children }: BlogLayoutProps) {
  const articleRef = useRef<HTMLElement>(null);
  
  // Initialize blog reading detection
  const { hasReadFirstBlog, currentProgress, isReading, readingTime } = useBlogReadingDetection();

  return (
    <div className="relative min-h-screen">
      <ReadingProgress target={articleRef} />
      <article ref={articleRef} className="container mx-auto px-4 max-w-4xl py-12">
        <div className="prose prose-lg dark:prose-invert mx-auto">{children}</div>
      </article>
    </div>
  );
}
