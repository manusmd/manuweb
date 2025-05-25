'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations } from 'next-intl';

interface Section {
  id: string;
  name: string;
  progress: number;
}

export function SectionProgress() {
  const t = useTranslations('navigation');
  const [activeSection, setActiveSection] = useState('home');
  const [sections, setSections] = useState<Section[]>([]);

  const sectionNames = {
    home: t('home'),
    about: t('about'),
    projects: t('projects'),
    blog: t('blog'),
    contact: t('contact')
  };

  useEffect(() => {
    const sectionElements = ['home', 'about', 'projects', 'blog', 'contact']
      .map(id => ({ id, element: document.getElementById(id) }))
      .filter(({ element }) => element !== null);

    const updateProgress = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      
      // Check if we're at the bottom of the page
      const isAtBottom = scrollY + windowHeight >= documentHeight - 10;
      // Check if we're at the top of the page
      const isAtTop = scrollY <= 50;

      let currentActiveSection = 'home';
      
      const updatedSections = sectionElements.map(({ id, element }, index) => {
        if (!element) return { id, name: sectionNames[id as keyof typeof sectionNames], progress: 0 };

        const rect = element.getBoundingClientRect();
        const elementTop = scrollY + rect.top;
        const elementHeight = rect.height;
        const elementBottom = elementTop + elementHeight;
        const viewportCenter = scrollY + windowHeight / 2;

        let progress = 0;
        
        // If we're at the top of the page, mark the first section as active
        if (isAtTop && index === 0) {
          progress = Math.min(100, Math.max(0, (scrollY / Math.min(elementHeight, windowHeight)) * 100));
          currentActiveSection = id;
        }
        // If we're at the bottom of the page, mark the last section as active with 100% progress
        else if (isAtBottom && index === sectionElements.length - 1) {
          progress = 100;
          currentActiveSection = id;
        }
        // Check if the viewport center is within this section
        else if (viewportCenter >= elementTop && viewportCenter <= elementBottom) {
          progress = Math.min(100, Math.max(0, ((viewportCenter - elementTop) / elementHeight) * 100));
          currentActiveSection = id;
        }
        // If we've scrolled past this section completely
        else if (viewportCenter > elementBottom) {
          progress = 100;
        }
        // If we haven't reached this section yet
        else if (viewportCenter < elementTop) {
          progress = 0;
        }

        return {
          id,
          name: sectionNames[id as keyof typeof sectionNames],
          progress
        };
      });

      // Set the active section
      setActiveSection(currentActiveSection);
      setSections(updatedSections);
    };

    updateProgress();
    window.addEventListener('scroll', updateProgress);
    window.addEventListener('resize', updateProgress);

    return () => {
      window.removeEventListener('scroll', updateProgress);
      window.removeEventListener('resize', updateProgress);
    };
  }, [t]);

  return (
    <div className="fixed right-8 top-1/2 -translate-y-1/2 z-40 hidden xl:block">
      <div className="flex flex-col space-y-6">
        {sections.map((section) => (
          <motion.div
            key={section.id}
            className="relative group cursor-pointer"
            onClick={() => {
              const element = document.getElementById(section.id);
              element?.scrollIntoView({ behavior: 'smooth' });
            }}
            whileHover={{ scale: 1.1 }}
          >
            {/* Progress Circle */}
            <div className="relative w-12 h-12">
              {/* Background Circle */}
              <svg className="w-full h-full -rotate-90" viewBox="0 0 48 48">
                <circle
                  cx="24"
                  cy="24"
                  r="20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="text-muted-foreground/20"
                />
                {/* Progress Circle */}
                <motion.circle
                  cx="24"
                  cy="24"
                  r="20"
                  fill="none"
                  stroke="url(#sectionGradient)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 20}`}
                  initial={{ strokeDashoffset: 2 * Math.PI * 20 }}
                  animate={{
                    strokeDashoffset: 2 * Math.PI * 20 * (1 - section.progress / 100)
                  }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                />
                <defs>
                  <linearGradient id="sectionGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#3b82f6" />
                    <stop offset="50%" stopColor="#8b5cf6" />
                    <stop offset="100%" stopColor="#10b981" />
                  </linearGradient>
                </defs>
              </svg>

              {/* Center Dot */}
              <motion.div
                className="absolute inset-0 flex items-center justify-center"
                animate={{
                  scale: activeSection === section.id ? 1.2 : 1,
                }}
                transition={{ duration: 0.3 }}
              >
                <div
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    activeSection === section.id
                      ? 'bg-gradient-to-r from-blue-500 to-purple-500 shadow-lg'
                      : 'bg-muted-foreground/40'
                  }`}
                />
              </motion.div>
            </div>

            {/* Section Label */}
            <AnimatePresence>
              <motion.div
                className="absolute right-16 top-1/2 -translate-y-1/2 px-3 py-1 bg-background/90 backdrop-blur-sm border rounded-lg text-sm font-medium shadow-lg whitespace-nowrap"
                initial={{ opacity: 0, x: 10, scale: 0.8 }}
                animate={{ 
                  opacity: activeSection === section.id ? 1 : 0,
                  x: activeSection === section.id ? 0 : 10,
                  scale: activeSection === section.id ? 1 : 0.8
                }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex items-center space-x-2">
                  <span>{section.name}</span>
                  <div className="w-8 h-1 bg-muted rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                      initial={{ width: '0%' }}
                      animate={{ width: `${section.progress}%` }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Hover Tooltip */}
            <motion.div
              className="absolute right-16 top-1/2 -translate-y-1/2 px-2 py-1 bg-background/80 backdrop-blur-sm border rounded text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none"
              style={{
                display: activeSection === section.id ? 'none' : 'block'
              }}
            >
              {section.name}
            </motion.div>
          </motion.div>
        ))}
      </div>
    </div>
  );
} 