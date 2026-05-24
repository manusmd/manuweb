'use client';

import { usePathname } from 'next/navigation';
import { motion, useScroll, useSpring, useTransform } from 'framer-motion';
import { ChevronUp } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { SECTION_IDS } from '@/constants/sections';
import { useActiveHomeSection, useBackToTopVisible } from '@/hooks/useSectionScroll';

export function ScrollProgress() {
  const pathname = usePathname();
  const tNav = useTranslations('navigation');
  const isBlogPage = pathname.includes('/blog');

  const { activeIndex } = useActiveHomeSection(!isBlogPage, 'midpoint');
  const isVisible = useBackToTopVisible(true);

  const { scrollYProgress } = useScroll();

  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  const strokeDashoffset = useTransform(scrollYProgress, [0, 1], [2 * Math.PI * 24, 0]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-green-500 origin-left z-50"
        style={{ scaleX }}
      />

      <motion.div
        className="fixed bottom-8 right-8 z-50"
        initial={{ opacity: 0, scale: 0 }}
        animate={{
          opacity: isVisible ? 1 : 0,
          scale: isVisible ? 1 : 0,
        }}
        transition={{ duration: 0.3 }}
      >
        <motion.button
          type="button"
          onClick={scrollToTop}
          className="relative w-14 h-14 rounded-full bg-background/80 backdrop-blur-md border border-border shadow-lg hover:shadow-xl transition-all duration-300 group"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          aria-label={tNav('backToTop')}
        >
          <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 56 56">
            <circle
              cx="28"
              cy="28"
              r="24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="text-muted-foreground/20"
            />
            <motion.circle
              cx="28"
              cy="28"
              r="24"
              fill="none"
              stroke="url(#gradient)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 24}`}
              style={{
                strokeDashoffset,
              }}
            />
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#3b82f6" />
                <stop offset="50%" stopColor="#8b5cf6" />
                <stop offset="100%" stopColor="#10b981" />
              </linearGradient>
            </defs>
          </svg>

          <ChevronUp className="w-5 h-5 text-foreground group-hover:text-primary transition-colors absolute inset-0 m-auto" />
        </motion.button>
      </motion.div>

      {!isBlogPage && (
        <div className="fixed right-8 top-1/2 -translate-y-1/2 z-40 hidden lg:block">
          <div className="flex flex-col space-y-6">
            {SECTION_IDS.map((sectionId, index) => {
              const label = tNav(sectionId);

              return (
                <motion.button
                  key={sectionId}
                  type="button"
                  onClick={() => {
                    const element = document.getElementById(sectionId);
                    element?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="w-4 h-4 rounded-full border-2 border-muted-foreground/30 hover:border-primary transition-all duration-300 relative group cursor-pointer"
                  whileHover={{ scale: 1.3 }}
                  whileTap={{ scale: 0.9 }}
                  aria-label={tNav('dotsNavigateAria', { section: label })}
                >
                  <motion.div
                    className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 to-purple-500"
                    initial={{ scale: 0 }}
                    animate={{
                      scale: index <= activeIndex ? 1 : 0,
                    }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  />

                  <motion.div
                    className="absolute inset-0 rounded-full bg-primary/20"
                    initial={{ scale: 0, opacity: 0 }}
                    whileHover={{ scale: 1.2, opacity: 1 }}
                    transition={{ duration: 0.2 }}
                  />

                  <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 px-3 py-2 bg-background/95 backdrop-blur-sm border rounded-lg text-sm font-medium opacity-0 group-hover:opacity-100 transition-all duration-200 whitespace-nowrap shadow-lg">
                    {label}
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
}
