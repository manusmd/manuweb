'use client';

import { ReadingProgress } from '@/components/scroll/ReadingProgress';
import { useBlogReadingDetection } from '@/hooks/useBlogReadingDetection';

interface BlogLayoutProps {
  children: React.ReactNode;
}

export function BlogLayout({ children }: BlogLayoutProps) {
  useBlogReadingDetection();

  return <ReadingProgress>{children}</ReadingProgress>;
}
