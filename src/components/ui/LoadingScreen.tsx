'use client';

import { motion } from 'framer-motion';

interface LoadingScreenProps {
  isVisible: boolean;
  progress?: number;
  className?: string;
}

export function LoadingScreen({ isVisible, progress = 0, className = '' }: LoadingScreenProps) {
  return (
    <motion.div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur-sm ${className}`}
      initial={{ opacity: 1 }}
      animate={{ opacity: isVisible ? 1 : 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: 'easeInOut' }}
      style={{ pointerEvents: isVisible ? 'auto' : 'none' }}
    >
      <div className="flex flex-col items-center space-y-4 sm:space-y-6 px-4">
        {/* Animated Logo/Icon */}
        <motion.div
          className="relative"
          animate={{
            rotate: isVisible ? 360 : 0,
            scale: isVisible ? [1, 1.1, 1] : 1,
          }}
          transition={{
            rotate: { duration: 2, repeat: Infinity, ease: 'linear' },
            scale: { duration: 1.5, repeat: Infinity, ease: 'easeInOut' },
          }}
        >
          <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-green-500 p-1">
            <div className="w-full h-full rounded-full bg-background flex items-center justify-center">
              <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-green-500" />
            </div>
          </div>
        </motion.div>

        {/* Progress Bar */}
        <motion.div
          className="w-48 sm:w-64 h-1 bg-muted rounded-full overflow-hidden"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: isVisible ? 1 : 0, scale: isVisible ? 1 : 0.8 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <motion.div
            className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-green-500 rounded-full"
            initial={{ width: '0%' }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
        </motion.div>

        {/* Floating Dots Animation */}
        <div className="flex space-x-1 sm:space-x-2">
          {[0, 1, 2].map(i => (
            <motion.div
              key={i}
              className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-primary rounded-full"
              animate={
                isVisible
                  ? {
                      y: [0, -8, 0],
                      opacity: [0.5, 1, 0.5],
                    }
                  : {}
              }
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.2,
                ease: 'easeInOut',
              }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}
