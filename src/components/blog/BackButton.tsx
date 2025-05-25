'use client';

import { ArrowLeft } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

interface BackButtonProps {
  locale: string;
  href?: string;
  label?: string;
  showOnBlogListing?: boolean;
}

const containerVariants = {
  initial: { opacity: 0, y: -10 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.4,
      ease: 'easeOut',
      delay: 0.1,
    },
  },
};

const buttonVariants = {
  initial: { x: 0 },
  hover: {
    x: -4,
    transition: {
      duration: 0.2,
      ease: 'easeOut',
    },
  },
  tap: {
    scale: 0.98,
    transition: {
      duration: 0.1,
    },
  },
};

const iconVariants = {
  initial: { x: 0 },
  hover: {
    x: -2,
    transition: {
      duration: 0.2,
      ease: 'easeOut',
    },
  },
};

export function BackButton({ 
  locale, 
  href, 
  label, 
  showOnBlogListing = false 
}: BackButtonProps) {
  const t = useTranslations('blog');
  const tCommon = useTranslations('common');
  const router = useRouter();
  const [previousPath, setPreviousPath] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Get the stored previous path
      const storedPreviousPath = localStorage.getItem('previousPath');
      setPreviousPath(storedPreviousPath);
    }
  }, []);

  // Function to get the appropriate label based on the previous path
  const getButtonLabel = useCallback(() => {
    if (label) return label; // If custom label is provided, use it
    
    // If we have a previous path, determine the label based on it
    if (previousPath) {
      if (previousPath === `/${locale}` || previousPath === '/') {
        return t('backToHome');
      } else if (previousPath.endsWith('/blog')) {
        return t('backToBlog');
      } else {
        // For other pages, use a generic "Back" label
        return tCommon('back');
      }
    }
    
    // Default fallback based on context
    if (showOnBlogListing) {
      return t('backToHome');
    }
    
    return t('backToBlog');
  }, [label, showOnBlogListing, previousPath, locale, t, tCommon]);

  // Default fallback URLs
  const defaultHref = `/${locale}/blog`;
  
  // For blog listing page, go back to home
  const blogListingHref = `/${locale}`;

  const finalHref = href || (showOnBlogListing ? blogListingHref : defaultHref);
  const finalLabel = getButtonLabel();

  const handleBackClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    
    if (previousPath && previousPath !== window.location.pathname) {
      // Clear the stored path since we're using it
      localStorage.removeItem('previousPath');
      // Navigate to the stored previous path
      router.push(previousPath);
    } else {
      // Fallback to the appropriate default page
      router.push(finalHref);
    }
  }, [router, finalHref, previousPath]);

  return (
    <motion.div
      variants={containerVariants}
      initial="initial"
      animate="animate"
      className="mb-8"
    >
      <motion.div
        variants={buttonVariants}
        initial="initial"
        whileHover="hover"
        whileTap="tap"
      >
        <button
          onClick={handleBackClick}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-all duration-200 rounded-lg hover:bg-muted/50 border border-transparent hover:border-border/50 group cursor-pointer"
        >
          <motion.div 
            variants={iconVariants}
            className="flex items-center justify-center"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
          </motion.div>
          <span className="font-medium">{finalLabel}</span>
        </button>
      </motion.div>
    </motion.div>
  );
} 