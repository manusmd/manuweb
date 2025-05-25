'use client';

import { motion, HTMLMotionProps, Variants, Variant } from 'framer-motion';
import { forwardRef, ReactNode } from 'react';
import { useAnimationVariants } from '@/hooks/useAnimations';
import React from 'react';

interface AnimatedWrapperProps extends Omit<HTMLMotionProps<'div'>, 'children'> {
  children: ReactNode;
  animation?: 'fadeInUp' | 'fadeInDown' | 'fadeInLeft' | 'fadeInRight' | 'scaleIn' | 'slideInUp';
  delay?: number;
  duration?: number;
  once?: boolean;
  threshold?: number;
  className?: string;
  as?:
    | 'div'
    | 'section'
    | 'article'
    | 'header'
    | 'footer'
    | 'main'
    | 'aside'
    | 'nav'
    | 'span'
    | 'p'
    | 'h1'
    | 'h2'
    | 'h3'
    | 'h4'
    | 'h5'
    | 'h6';
  customVariants?: Variants;
}

export const AnimatedWrapper = forwardRef<HTMLDivElement, AnimatedWrapperProps>(
  (
    {
      children,
      animation = 'fadeInUp',
      delay = 0,
      duration,
      once = true,
      threshold = 0.1,
      className,
      as = 'div',
      customVariants,
      ...motionProps
    },
    ref
  ) => {
    const animations = useAnimationVariants();
    const { prefersReducedMotion } = animations;

    // If user prefers reduced motion, render without animations
    if (prefersReducedMotion) {
      const Component = as as keyof React.JSX.IntrinsicElements;
      return React.createElement(Component, { ref, className, ...motionProps }, children);
    }

    // Get the animation variant, defaulting to fadeInUp
    let variants = customVariants || animations[animation] || animations.fadeInUp;

    // Apply custom duration and delay if provided
    if (duration || delay > 0) {
      const originalVisible = variants.visible as Variant;
      const originalTransition =
        (originalVisible as Variant & { transition?: Record<string, unknown> })?.transition || {};

      variants = {
        ...variants,
        visible: {
          ...originalVisible,
          transition: {
            ...originalTransition,
            ...(duration && { duration }),
            ...(delay > 0 && { delay }),
          },
        },
      };
    }

    const MotionComponent = motion[as as keyof typeof motion] as React.ComponentType<
      HTMLMotionProps<typeof as>
    >;

    return (
      <MotionComponent
        ref={ref}
        initial="hidden"
        whileInView="visible"
        viewport={{ once, amount: threshold }}
        variants={variants}
        className={className}
        {...motionProps}
      >
        {children}
      </MotionComponent>
    );
  }
);

AnimatedWrapper.displayName = 'AnimatedWrapper';
