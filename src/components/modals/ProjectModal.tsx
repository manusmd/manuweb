'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations } from 'next-intl';
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

  return (
    <AnimatePresence>
      {project && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.8 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
          />
          <motion.div
            layoutId={`project-${project.title}`}
            initial={{ borderRadius: 8 }}
            className="fixed left-[50%] top-[50%] z-50 w-full max-w-3xl translate-x-[-50%] translate-y-[-50%] bg-card border border-border shadow-lg"
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
                className="absolute right-4 top-4 rounded-full bg-background/80 p-2 backdrop-blur-sm hover:bg-background/90 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="p-6"
            >
              <h2 className="text-2xl font-semibold mb-4">{project.title}</h2>
              <p className="text-muted-foreground mb-6">{project.description}</p>

              <div className="mb-6">
                <h3 className="text-sm font-medium mb-2">{t('techStack')}</h3>
                <div className="flex flex-wrap gap-2">
                  {(project.tech || project.technologies?.map(t => t.name) || []).map(tech => (
                    <span
                      key={tech}
                      className="rounded-full px-3 py-1 text-sm bg-primary/10 text-primary"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                <Button asChild>
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center"
                  >
                    <ExternalLink className="mr-2 h-4 w-4" />
                    {project.isApp ? t('viewApp') : t('liveDemo')}
                  </a>
                </Button>
                {project.githubUrl && (
                  <Button variant="outline" asChild>
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center"
                    >
                      <Github className="mr-2 h-4 w-4" />
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
