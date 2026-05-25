'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCallback } from 'react';
import { useBlogTransition } from '@/components/transitions/BlogTransitionProvider';

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

export function BlogLink({ href, children, className = '', onClick, title }: BlogLinkProps) {
  const pathname = usePathname();
  const { startBlogTransition, isTransitioning } = useBlogTransition();

  const isBlogLink = href.includes('/blog');
  const isCurrentPage = pathname === href;

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      if (!isBlogLink || isCurrentPage || isTransitioning) {
        onClick?.();
        return;
      }

      e.preventDefault();
      onClick?.();

      const rect = e.currentTarget.getBoundingClientRect();
      const origin = {
        x: e.clientX || rect.left + rect.width / 2,
        y: e.clientY || rect.top + rect.height / 2,
      };

      startBlogTransition(href, origin);
    },
    [href, isBlogLink, isCurrentPage, isTransitioning, onClick, startBlogTransition]
  );

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
      className="relative"
    >
      <Link
        href={href}
        scroll={false}
        className={`${className} ${isTransitioning ? 'pointer-events-none' : ''} relative block`}
        onClick={handleClick}
        aria-busy={isTransitioning}
        aria-label={title}
      >
        {children}
      </Link>

      {isBlogLink && !isCurrentPage && !isTransitioning ? (
        <motion.div
          className="pointer-events-none absolute inset-0 rounded-lg bg-primary/5 opacity-0"
          whileHover={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
        />
      ) : null}
    </motion.div>
  );
}
