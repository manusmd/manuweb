'use client';

import { motion } from 'framer-motion';
import { useBodyScrollLock } from '@/hooks/useBodyScrollLock';
import { useMediaQuery } from '@/hooks/useMediaQuery';

interface LoadingScreenProps {
  isVisible: boolean;
  progress?: number;
  className?: string;
}

export function LoadingScreen({ isVisible, progress = 0, className = '' }: LoadingScreenProps) {
  // Lock body scroll when loading screen is visible
  useBodyScrollLock(isVisible);
  const reduceMotion = useMediaQuery('(prefers-reduced-motion: reduce)');

  return (
    <motion.div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur-sm ${className}`}
      initial={{ opacity: 1 }}
      animate={{ opacity: isVisible ? 1 : 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: 'easeInOut' }}
      style={{ pointerEvents: isVisible ? 'auto' : 'none' }}
    >
      <div className="flex flex-col items-center gap-6 px-4">
        <motion.span
          className="text-gradient font-display text-3xl font-bold tracking-tight sm:text-4xl"
          animate={
            reduceMotion || !isVisible ? {} : { opacity: [0.55, 1, 0.55], scale: [0.97, 1, 0.97] }
          }
          transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
        >
          manu
        </motion.span>

        <div className="h-[3px] w-40 overflow-hidden rounded-full bg-muted sm:w-48">
          <motion.div
            className="h-full rounded-full bg-primary"
            style={{ boxShadow: '0 0 10px hsla(var(--accent-blue), 0.55)' }}
            initial={{ width: '0%' }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          />
        </div>
      </div>
    </motion.div>
  );
}
