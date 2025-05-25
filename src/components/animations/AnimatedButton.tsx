'use client';

import { motion } from 'framer-motion';
import { Button, buttonVariants } from '@/components/ui/button';
import { useAnimationVariants } from '@/hooks/useAnimationVariants';
import { forwardRef } from 'react';
import { VariantProps } from 'class-variance-authority';

interface AnimatedButtonProps
  extends React.ComponentProps<'button'>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  glowColor?: 'blue' | 'violet' | 'green';
  enableGlow?: boolean;
}

export const AnimatedButton = forwardRef<HTMLButtonElement, AnimatedButtonProps>(
  ({ children, glowColor, enableGlow, className, ...props }, ref) => {
    const { buttonHover, buttonTap, prefersReducedMotion } = useAnimationVariants();

    const glowClass = enableGlow && glowColor ? `glow-${glowColor}` : '';
    const combinedClassName = `${className || ''} ${glowClass}`.trim();

    if (prefersReducedMotion) {
      return (
        <Button ref={ref} className={combinedClassName} {...props}>
          {children}
        </Button>
      );
    }

    return (
      <motion.div whileHover={buttonHover} whileTap={buttonTap} style={{ display: 'inline-block' }}>
        <Button ref={ref} className={combinedClassName} {...props}>
          {children}
        </Button>
      </motion.div>
    );
  }
);

AnimatedButton.displayName = 'AnimatedButton';
