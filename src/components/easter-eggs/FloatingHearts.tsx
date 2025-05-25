'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Heart } from 'lucide-react';

interface FloatingHeartsProps {
  showHearts: boolean;
}

export function FloatingHearts({ showHearts }: FloatingHeartsProps) {
  return (
    <AnimatePresence>
      {showHearts && (
        <div className="fixed inset-0 pointer-events-none z-50">
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              initial={{
                x: Math.random() * window.innerWidth,
                y: window.innerHeight + 50,
                scale: 0,
                rotate: 0,
              }}
              animate={{
                y: -100,
                scale: [0, 1, 0.8, 1, 0],
                rotate: 360,
              }}
              transition={{
                duration: 3,
                delay: i * 0.1,
                ease: 'easeOut',
              }}
              className="absolute"
            >
              <Heart className="w-8 h-8 text-pink-500 fill-current" />
            </motion.div>
          ))}
        </div>
      )}
    </AnimatePresence>
  );
} 