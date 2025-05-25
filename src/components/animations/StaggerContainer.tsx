'use client';

import { motion, HTMLMotionProps } from 'framer-motion';
import { forwardRef, ReactNode, createElement } from 'react';
import { useAnimationVariants } from '@/hooks/useAnimations';
import React from 'react';

interface StaggerContainerProps {
  children: ReactNode;
  className?: string;
  staggerDelay?: number;
  as?: 'div' | 'section' | 'article' | 'ul' | 'ol';
}

export const StaggerContainer = forwardRef<HTMLDivElement, StaggerContainerProps>(
  ({ children, className, staggerDelay, as = 'div' }, ref) => {
    const { stagger, prefersReducedMotion } = useAnimationVariants();

    // Apply custom stagger delay if provided
    const customStagger = staggerDelay
      ? {
          visible: {
            transition: {
              staggerChildren: staggerDelay,
              delayChildren: staggerDelay,
            },
          },
        }
      : stagger;

    const MotionComponent = motion[as as keyof typeof motion] as React.ComponentType<
      HTMLMotionProps<typeof as>
    >;

    if (prefersReducedMotion) {
      return createElement(as, { ref, className }, children);
    }

    return (
      <MotionComponent
        ref={ref}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        variants={customStagger}
        className={className}
      >
        {children}
      </MotionComponent>
    );
  }
);

StaggerContainer.displayName = 'StaggerContainer';
