'use client';

import { useEffect, useState } from 'react';
import { motion, useScroll, useSpring, useTransform } from 'framer-motion';
import { ChevronUp } from 'lucide-react';
import { usePathname } from 'next/navigation';

export function ScrollProgress() {
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(false);
  const [activeSection, setActiveSection] = useState(0);
  const { scrollYProgress } = useScroll();

  // Smooth spring animation for the progress
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  // Transform for circular progress
  const strokeDashoffset = useTransform(scrollYProgress, [0, 1], [2 * Math.PI * 24, 0]);

  // Check if we're on any blog page (listing or individual post)
  const isBlogPage = pathname.includes('/blog');

  useEffect(() => {
    // Only set up section tracking for non-blog pages
    if (isBlogPage) {
      // For blog pages, just handle back-to-top visibility
      const toggleVisibility = () => {
        if (window.pageYOffset > 300) {
          setIsVisible(true);
        } else {
          setIsVisible(false);
        }
      };

      window.addEventListener('scroll', toggleVisibility);
      return () => window.removeEventListener('scroll', toggleVisibility);
    }

    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    const updateActiveSection = () => {
      const sections = ['home', 'about', 'projects', 'blog', 'contact'];
      const scrollPosition = window.scrollY + window.innerHeight / 2;

      for (let i = sections.length - 1; i >= 0; i--) {
        const element = document.getElementById(sections[i]);
        if (element && element.offsetTop <= scrollPosition) {
          setActiveSection(i);
          break;
        }
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    window.addEventListener('scroll', updateActiveSection);
    updateActiveSection(); // Initial call

    return () => {
      window.removeEventListener('scroll', toggleVisibility);
      window.removeEventListener('scroll', updateActiveSection);
    };
  }, [isBlogPage]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <>
      {/* Top Progress Bar - Always show */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-green-500 origin-left z-50"
        style={{ scaleX }}
      />

      {/* Circular Progress Indicator with Back to Top - Show on all pages */}
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
          onClick={scrollToTop}
          className="relative w-14 h-14 rounded-full bg-background/80 backdrop-blur-md border border-border shadow-lg hover:shadow-xl transition-all duration-300 group"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          {/* Circular Progress Ring */}
          <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 56 56">
            {/* Background circle */}
            <circle
              cx="28"
              cy="28"
              r="24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="text-muted-foreground/20"
            />
            {/* Progress circle */}
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
            {/* Gradient definition */}
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#3b82f6" />
                <stop offset="50%" stopColor="#8b5cf6" />
                <stop offset="100%" stopColor="#10b981" />
              </linearGradient>
            </defs>
          </svg>

          {/* Arrow Icon */}
          <ChevronUp className="w-5 h-5 text-foreground group-hover:text-primary transition-colors absolute inset-0 m-auto" />
        </motion.button>
      </motion.div>

      {/* Floating Progress Dots - Only show on non-blog pages */}
      {!isBlogPage && (
        <div className="fixed left-8 top-1/2 -translate-y-1/2 z-40 hidden lg:block">
          <div className="flex flex-col space-y-6">
            {['home', 'about', 'projects', 'blog', 'contact'].map((section, index) => (
              <motion.button
                key={section}
                onClick={() => {
                  const element = document.getElementById(section);
                  element?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="w-4 h-4 rounded-full border-2 border-muted-foreground/30 hover:border-primary transition-all duration-300 relative group cursor-pointer"
                whileHover={{ scale: 1.3 }}
                whileTap={{ scale: 0.9 }}
                aria-label={`Navigate to ${section.charAt(0).toUpperCase() + section.slice(1)} section`}
              >
                <motion.div
                  className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 to-purple-500"
                  initial={{ scale: 0 }}
                  animate={{
                    scale: index <= activeSection ? 1 : 0,
                  }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                />

                {/* Enhanced hover effect */}
                <motion.div
                  className="absolute inset-0 rounded-full bg-primary/20"
                  initial={{ scale: 0, opacity: 0 }}
                  whileHover={{ scale: 1.2, opacity: 1 }}
                  transition={{ duration: 0.2 }}
                />

                {/* Tooltip */}
                <div className="absolute left-8 top-1/2 -translate-y-1/2 px-3 py-2 bg-background/95 backdrop-blur-sm border rounded-lg text-sm font-medium opacity-0 group-hover:opacity-100 transition-all duration-200 whitespace-nowrap shadow-lg">
                  {section.charAt(0).toUpperCase() + section.slice(1)}
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
