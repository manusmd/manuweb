'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useState, useCallback, useEffect } from 'react';
import { createPortal } from 'react-dom';

interface BlogLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  title?: string;
}

const linkVariants = {
  initial: { scale: 1 },
  hover: { 
    scale: 1.02,
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 25,
    },
  },
  tap: { 
    scale: 0.98,
    transition: {
      duration: 0.1,
    },
  },
};

const fullScreenOverlayVariants = {
  initial: { 
    opacity: 0,
  },
  animate: { 
    opacity: 1,
    transition: {
      duration: 0.4,
      ease: 'easeOut',
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.3,
    },
  },
};

const centerContentVariants = {
  initial: { 
    scale: 0.8,
    opacity: 0,
  },
  animate: { 
    scale: 1,
    opacity: 1,
    transition: {
      delay: 0.1,
      duration: 0.5,
      ease: 'easeOut',
    },
  },
};

const pulseRingVariants = {
  initial: { scale: 0.8 },
  animate: { 
    scale: [0.8, 1.2, 0.8],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
};

const orbitVariants = {
  animate: {
    rotate: 360,
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: 'linear',
    },
  },
};

const dotVariants = {
  animate: {
    scale: [1, 1.5, 1],
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
};

function FullScreenLoader({ title }: { title?: string }) {
  const [mounted, setMounted] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    setMounted(true);
    
    // Prevent body scroll during loading
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    
    // Animate progress
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 2;
      });
    }, 24); // Complete in ~1.2 seconds
    
    return () => {
      document.body.style.overflow = 'unset';
      document.documentElement.style.overflow = 'unset';
      clearInterval(interval);
    };
  }, []);

  if (!mounted) {
    return null;
  }

  const portalRoot = document.getElementById('__next') || document.body;

  return createPortal(
    <div className="fixed inset-0 z-[9999]" style={{ width: '100vw', height: '100vh', top: 0, left: 0 }}>
      <motion.div
        variants={fullScreenOverlayVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        className="absolute inset-0 bg-background/95 backdrop-blur-sm flex items-center justify-center"
        style={{ 
          pointerEvents: 'auto',
          width: '100%',
          height: '100%'
        }}
      >
        <div className="flex flex-col items-center space-y-4 sm:space-y-6 px-4">
          {/* Animated Logo/Icon */}
          <motion.div
            className="relative"
            animate={{
              rotate: 360,
              scale: [1, 1.1, 1],
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

          {/* Loading Text */}
          <motion.div
            className="text-center space-y-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <p className="text-sm text-muted-foreground">Loading</p>
            {title && (
              <h3 className="text-lg sm:text-xl font-semibold text-foreground max-w-md truncate">
                {title}
              </h3>
            )}
          </motion.div>

          {/* Progress Bar */}
          <motion.div
            className="w-48 sm:w-64 h-1 bg-muted rounded-full overflow-hidden"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <motion.div
              className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-green-500 rounded-full"
              initial={{ width: '0%' }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.1, ease: 'easeOut' }}
            />
          </motion.div>

          {/* Floating Dots Animation */}
          <div className="flex space-x-1 sm:space-x-2">
            {[0, 1, 2].map(i => (
              <motion.div
                key={i}
                className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-primary rounded-full"
                animate={{
                  y: [0, -8, 0],
                  opacity: [0.5, 1, 0.5],
                }}
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
    </div>,
    portalRoot
  );
}

export function BlogLink({ href, children, className = '', onClick, title }: BlogLinkProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isNavigating, setIsNavigating] = useState(false);

  const isBlogLink = href.includes('/blog');
  const isCurrentPage = pathname === href;

  const handleClick = useCallback((e: React.MouseEvent) => {
    if (!isBlogLink || isCurrentPage) {
      onClick?.();
      return;
    }

    e.preventDefault();
    setIsNavigating(true);
    onClick?.();

    setTimeout(() => {
      router.push(href);
    }, 1200);
  }, [href, isBlogLink, isCurrentPage, router, onClick]);

  if (!isBlogLink) {
    return (
      <Link href={href} className={className} onClick={onClick}>
        {children}
      </Link>
    );
  }

  return (
    <>
      <motion.div
        variants={linkVariants}
        initial="initial"
        whileHover="hover"
        whileTap="tap"
        className="relative"
      >
        <Link
          href={href}
          className={`${className} ${isNavigating ? 'pointer-events-none' : ''} relative block`}
          onClick={handleClick}
        >
          {children}
        </Link>
        
        {isBlogLink && !isCurrentPage && !isNavigating && (
          <motion.div
            className="absolute inset-0 bg-primary/5 rounded-lg opacity-0 pointer-events-none"
            whileHover={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
          />
        )}
      </motion.div>
      
      {isNavigating && <FullScreenLoader title={title} />}
    </>
  );
} 