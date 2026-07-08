'use client';

import { motion } from 'framer-motion';
import { usePathname } from 'next/navigation';

interface PageTransitionProps {
  children: React.ReactNode;
  className?: string;
}

const pageVariants = {
  initial: {
    opacity: 0,
    y: 20,
    scale: 0.98,
  },
  in: {
    opacity: 1,
    y: 0,
    scale: 1,
  },
};

const pageTransition = {
  type: 'tween',
  ease: 'anticipate',
  duration: 0.4,
} as const;

export function PageTransition({ children, className = '' }: PageTransitionProps) {
  const pathname = usePathname();

  // Blog routes run their own bubble transition.
  const isBlogRoute = pathname.includes('/blog');

  if (isBlogRoute) {
    return <div className={className}>{children}</div>;
  }

  // A keyed enter-only animation: each navigation remounts this element, which
  // animates from `initial` to `in`. There is deliberately no exit/AnimatePresence
  // "wait" handoff — that combination could strand the incoming page in its exit
  // state (invisible) when navigating between non-blog pages.
  return (
    <motion.div
      key={pathname}
      initial="initial"
      animate="in"
      variants={pageVariants}
      transition={pageTransition}
      className={className}
      style={{
        position: 'relative',
        width: '100%',
      }}
    >
      {children}
    </motion.div>
  );
}
