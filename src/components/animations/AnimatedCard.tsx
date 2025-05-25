'use client';

import { motion } from 'framer-motion';
import { forwardRef, ReactNode } from 'react';
import { useAnimationVariants } from '@/hooks/useAnimations';

interface AnimatedCardProps {
  children: ReactNode;
  className?: string;
  enableHover?: boolean;
  glassEffect?: boolean;
  delay?: number;
  animation?: 'fadeInUp' | 'fadeInDown' | 'fadeInLeft' | 'fadeInRight' | 'scaleIn';
}

export const AnimatedCard = forwardRef<HTMLDivElement, AnimatedCardProps>(
  (
    {
      children,
      className = '',
      enableHover = true,
      glassEffect = false,
      delay = 0,
      animation = 'fadeInUp',
    },
    ref
  ) => {
    const animations = useAnimationVariants();
    const { cardHover, prefersReducedMotion } = animations;

    const baseClass = glassEffect ? 'glass' : '';
    const combinedClassName = `${baseClass} ${className}`.trim();

    // Get entrance animation
    const entranceAnimation = animations[animation];

    // Apply delay to entrance animation if provided
    const animationWithDelay =
      delay > 0
        ? {
            ...entranceAnimation,
            visible: {
              ...entranceAnimation.visible,
              transition: {
                ...entranceAnimation.visible.transition,
                delay,
              },
            },
          }
        : entranceAnimation;

    const hoverProps = enableHover && !prefersReducedMotion ? { whileHover: cardHover } : {};

    return (
      <motion.div
        ref={ref}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        variants={animationWithDelay}
        className={combinedClassName}
        {...hoverProps}
      >
        {children}
      </motion.div>
    );
  }
);

AnimatedCard.displayName = 'AnimatedCard';
