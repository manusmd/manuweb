'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { useEffect } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ExternalLink, Github, X } from 'lucide-react';
import type { Project } from '@/types/project';

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
}

export function ProjectModal({ project, onClose }: ProjectModalProps) {
  const t = useTranslations('projects');

  // Lock body scroll when modal is open
  useEffect(() => {
    if (project) {
      // Save current scroll position
      const scrollY = window.scrollY;

      // Lock scroll
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';

      return () => {
        // Restore scroll
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        window.scrollTo(0, scrollY);
      };
    }
  }, [project]);

  // Handle Escape key to close modal
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && project) {
        onClose();
      }
    };

    if (project) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [project, onClose]);

  return (
    <AnimatePresence>
      {project && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/90 backdrop-blur-md z-50"
          />
          <motion.div
            layoutId={`project-${project.title}`}
            initial={{ borderRadius: 8 }}
            className="fixed left-[50%] top-[50%] z-50 w-[95%] max-w-3xl translate-x-[-50%] translate-y-[-50%] bg-card border border-border shadow-lg max-h-[90vh] overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            <motion.div className="relative aspect-video overflow-hidden">
              <Image
                src={project.image || project.thumbnail || '/placeholder-project.jpg'}
                alt={project.title}
                fill
                className="object-cover"
              />
              <button
                onClick={onClose}
                className="absolute right-3 top-3 md:right-4 md:top-4 rounded-full bg-background/80 p-1.5 md:p-2 backdrop-blur-sm hover:bg-background/90 transition-colors"
              >
                <X className="h-4 w-4 md:h-5 md:w-5" />
              </button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="p-4 md:p-6 overflow-y-auto max-h-[50vh]"
            >
              <h2 className="text-xl md:text-2xl font-semibold mb-3 md:mb-4">{project.title}</h2>
              <p className="text-sm md:text-base text-muted-foreground mb-4 md:mb-6">
                {project.description}
              </p>

              <div className="mb-4 md:mb-6">
                <h3 className="text-sm font-medium mb-2">{t('techStack')}</h3>
                <div className="flex flex-wrap gap-1.5 md:gap-2">
                  {(project.tech || project.technologies?.map(t => t.name) || []).map(tech => (
                    <span
                      key={tech}
                      className="rounded-full px-2 py-1 md:px-3 md:py-1 text-xs md:text-sm bg-primary/10 text-primary"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-2 md:gap-3">
                <Button asChild className="text-sm">
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center"
                  >
                    <ExternalLink className="mr-2 h-3 w-3 md:h-4 md:w-4" />
                    {project.isApp ? t('viewApp') : t('liveDemo')}
                  </a>
                </Button>
                {project.githubUrl && (
                  <Button variant="outline" asChild className="text-sm">
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center"
                    >
                      <Github className="mr-2 h-3 w-3 md:h-4 md:w-4" />
                      GitHub
                    </a>
                  </Button>
                )}
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
