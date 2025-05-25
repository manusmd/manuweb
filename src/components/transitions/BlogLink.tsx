'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useState, useCallback } from 'react';
import { Loader2 } from 'lucide-react';

interface BlogLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
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
  loading: {
    scale: 0.98,
    opacity: 0.8,
    transition: {
      duration: 0.2,
    },
  },
};

const shimmerVariants = {
  initial: { x: '-100%' },
  animate: {
    x: '100%',
    transition: {
      duration: 1.2,
      ease: 'easeInOut',
      repeat: Infinity,
      repeatDelay: 0.5,
    },
  },
};

const loadingOverlayVariants = {
  initial: { opacity: 0 },
  animate: { 
    opacity: 1,
    transition: {
      duration: 0.2,
    },
  },
};

export function BlogLink({ href, children, className = '', onClick }: BlogLinkProps) {
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
    }, 200);
  }, [href, isBlogLink, isCurrentPage, router, onClick]);

  if (!isBlogLink) {
    return (
      <Link href={href} className={className} onClick={onClick}>
        {children}
      </Link>
    );
  }

  return (
    <motion.div
      variants={linkVariants}
      initial="initial"
      whileHover="hover"
      whileTap="tap"
      animate={isNavigating ? "loading" : "initial"}
      className="relative overflow-hidden"
    >
      <Link
        href={href}
        className={`${className} ${isNavigating ? 'pointer-events-none' : ''} relative block`}
        onClick={handleClick}
      >
        {children}
        
        {isNavigating && (
          <>
            <motion.div
              variants={shimmerVariants}
              initial="initial"
              animate="animate"
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none"
              style={{
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
              }}
            />
            
            <motion.div
              variants={loadingOverlayVariants}
              initial="initial"
              animate="animate"
              className="absolute inset-0 bg-background/20 backdrop-blur-[1px] flex items-center justify-center pointer-events-none"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className="w-6 h-6 text-primary"
              >
                <Loader2 className="w-full h-full" />
              </motion.div>
            </motion.div>
          </>
        )}
      </Link>
      
      {isBlogLink && !isCurrentPage && !isNavigating && (
        <motion.div
          className="absolute inset-0 bg-primary/5 rounded-lg opacity-0 pointer-events-none"
          whileHover={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
        />
      )}
    </motion.div>
  );
} 