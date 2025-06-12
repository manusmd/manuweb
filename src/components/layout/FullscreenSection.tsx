'use client';

import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface FullscreenSectionProps {
  children: ReactNode;
  className?: string;
  id?: string;
  background?: 'default' | 'muted' | 'gradient';
  centerContent?: boolean;
}

export function FullscreenSection({
  children,
  className,
  id,
  background = 'default',
  centerContent = true,
}: FullscreenSectionProps) {
  const backgroundClasses = {
    default: '',
    muted: 'bg-muted/30',
    gradient: 'bg-gradient-to-br from-background via-background to-accent/5',
  };

  return (
    <section
      id={id}
      className={cn(
        'relative min-h-screen w-full overflow-hidden',
        centerContent && 'flex items-center justify-center',
        backgroundClasses[background],
        className
      )}
    >
      {children}
    </section>
  );
}
