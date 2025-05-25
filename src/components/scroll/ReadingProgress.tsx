'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, useScroll, useSpring, useTransform } from 'framer-motion';
import { useTranslations } from 'next-intl';
import confetti from 'canvas-confetti';

interface ReadingProgressProps {
  target?: React.RefObject<HTMLElement | null>;
  className?: string;
}

export function ReadingProgress({ target, className = '' }: ReadingProgressProps) {
  const t = useTranslations('blog.readingProgress');
  const [readingTime, setReadingTime] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const hasTriggeredConfetti = useRef(false);
  
  const { scrollYProgress } = useScroll({
    target: target?.current ? target : undefined,
    offset: target ? ["start end", "end start"] : undefined
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const opacity = useTransform(smoothProgress, [0, 0.1, 0.9, 1], [0, 1, 1, 0]);

  useEffect(() => {
    if (target?.current) {
      const text = target.current.textContent || '';
      const wordsPerMinute = 200;
      const words = text.trim().split(/\s+/).length;
      const time = Math.ceil(words / wordsPerMinute);
      setReadingTime(time);
    }
  }, [target]);

  const triggerConfetti = () => {
    // Multiple confetti bursts for celebration
    const duration = 3000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    function randomInRange(min: number, max: number) {
      return Math.random() * (max - min) + min;
    }

    const interval = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      
      // Left side
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
      });
      
      // Right side
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
      });
    }, 250);
  };

  useEffect(() => {
    const unsubscribe = smoothProgress.on('change', (latest) => {
      if (readingTime > 0) {
        // Check if we're at the bottom of the page
        const scrollY = window.scrollY;
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;
        const isAtBottom = scrollY + windowHeight >= documentHeight - 10;
        
        // More accurate completion detection
        const isNearEnd = latest >= 0.95; // Consider 95% as complete
        const remaining = Math.ceil(readingTime * (1 - latest));
        
        if (isAtBottom || isNearEnd || remaining <= 0) {
          setTimeLeft(0);
          if (!isComplete) {
            setIsComplete(true);
            // Trigger confetti only once
            if (!hasTriggeredConfetti.current) {
              hasTriggeredConfetti.current = true;
              setTimeout(() => triggerConfetti(), 500); // Small delay for better UX
            }
          }
        } else {
          setTimeLeft(remaining);
          setIsComplete(false);
          // Reset confetti trigger if user scrolls back up
          if (latest < 0.8 && !isAtBottom) {
            hasTriggeredConfetti.current = false;
          }
        }
      }
    });

    return unsubscribe;
  }, [smoothProgress, readingTime, isComplete]);

  return (
    <motion.div
      className={`fixed top-20 right-4 z-40 ${className}`}
      style={{ opacity }}
    >
      {/* Reading Time Indicator */}
      {readingTime > 0 && (
        <motion.div
          className={`px-3 py-1 backdrop-blur-sm border rounded-full text-xs font-medium shadow-lg transition-all duration-500 ${
            isComplete 
              ? 'bg-green-500/90 text-white border-green-400' 
              : 'bg-background/90 border-border'
          }`}
          initial={{ opacity: 0, y: -10 }}
          animate={{ 
            opacity: 1, 
            y: 0,
            scale: isComplete ? [1, 1.1, 1] : 1
          }}
          transition={{ 
            delay: 0.5,
            scale: { duration: 0.6, ease: "easeInOut" }
          }}
        >
          <motion.span
            key={isComplete ? 'complete' : timeLeft}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.3 }}
          >
            {isComplete ? t('finished') : t('timeLeft', { time: timeLeft })}
          </motion.span>
        </motion.div>
      )}
    </motion.div>
  );
} 