'use client';

import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface FullscreenSectionProps {
  children: ReactNode;
  className?: string;
  id?: string;
  background?: 'default' | 'muted' | 'gradient';
  centerContent?: boolean;
  overflow?: 'hidden' | 'auto' | 'visible';
  minHeight?: 'screen' | 'auto';
}

export function FullscreenSection({
  children,
  className,
  id,
  background = 'default',
  centerContent = true,
  overflow = 'hidden',
  minHeight = 'screen',
}: FullscreenSectionProps) {
  const backgroundClasses = {
    default: '',
    muted: 'bg-muted/30',
    gradient: 'bg-gradient-to-br from-background via-background to-accent/5',
  };

  const overflowClasses = {
    hidden: 'overflow-hidden',
    auto: 'overflow-auto',
    visible: 'overflow-visible',
  };

  return (
    <section
      id={id}
      className={cn(
        'relative w-full',
        minHeight === 'screen' ? 'min-h-screen' : 'min-h-0',
        overflowClasses[overflow],
        centerContent && 'flex items-center justify-center',
        backgroundClasses[background],
        className
      )}
    >
      {children}
    </section>
  );
}
