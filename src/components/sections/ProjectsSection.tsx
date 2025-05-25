'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { AnimatedWrapper, StaggerContainer } from '@/components/animations';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';
import type { Project } from '@/types/project';

// Lazy load the ProjectModal for better performance
const ProjectModal = dynamic(
  () => import('@/components/modals/ProjectModal').then(mod => ({ default: mod.ProjectModal })),
  {
    ssr: false,
    loading: () => null,
  }
);

// Tech stack color mapping
const techColors: Record<string, { bg: string; text: string }> = {
  'Next.js': { bg: 'bg-black', text: 'text-white' },
  TypeScript: { bg: 'bg-[#007ACC]', text: 'text-white' },
  'Tailwind CSS': { bg: 'bg-[#38B2AC]', text: 'text-white' },
  PWA: { bg: 'bg-[#5A0FC8]', text: 'text-white' },
  'Offline-First': { bg: 'bg-[#FF9900]', text: 'text-black' },
};

export function ProjectsSection() {
  const t = useTranslations('projects');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [hoveredProject, setHoveredProject] = useState<Project | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const projects: Project[] = [
    {
      title: 'ClubScan',
      description: t('clubscan.description'),
      image: '/clubscandashboard.png',
      liveUrl: 'https://www.clubscan.app',
      tech: ['Next.js', 'TypeScript', 'Tailwind CSS', 'PWA', 'Offline-First'],
      category: 'fullstack',
      isApp: true,
    },
  ];

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    if (hoveredProject) {
      document.addEventListener('mousemove', handleMouseMove);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, [hoveredProject]);

  return (
    <AnimatedWrapper>
      <section id="projects" className="py-24">
        <div className="container mx-auto px-4">
          <StaggerContainer className="space-y-12">
            <div className="text-center">
              <h2 className="text-4xl font-display font-bold mb-4">{t('title')}</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">{t('subtitle')}</p>
            </div>

            {/* Projects Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {projects.map(project => (
                <motion.div
                  key={project.title}
                  layoutId={`project-${project.title}`}
                  onClick={() => setSelectedProject(project)}
                  onMouseEnter={() => setHoveredProject(project)}
                  onMouseLeave={() => setHoveredProject(null)}
                  className="group relative aspect-video cursor-pointer overflow-hidden rounded-xl border bg-card"
                >
                  <Image
                    src={project.image || project.thumbnail || '/placeholder-project.jpg'}
                    alt={project.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105 rounded-xl"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-black/20 rounded-xl">
                    <div className="absolute inset-0 p-6 flex flex-col justify-end">
                      <div className="space-y-3">
                        <div>
                          <h3 className="text-xl font-semibold text-white">{project.title}</h3>
                          <p className="text-sm text-white/80 line-clamp-1 mt-1">
                            {project.description}
                          </p>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          {(project.tech || project.technologies?.map(t => t.name) || []).map(
                            tech => {
                              const colors = techColors[tech] || {
                                bg: 'bg-primary/10',
                                text: 'text-primary',
                              };
                              return (
                                <span
                                  key={tech}
                                  className={`rounded-full px-2 py-0.5 text-xs ${colors.bg} ${colors.text}`}
                                >
                                  {tech}
                                </span>
                              );
                            }
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </StaggerContainer>

          <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />
        </div>

        {/* Live Preview Iframe - Following Mouse */}
        <AnimatePresence>
          {hoveredProject && hoveredProject.liveUrl && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="fixed z-[9999] pointer-events-none"
              style={{
                left: mousePosition.x + 20,
                top: mousePosition.y - 200,
                width: '480px',
                height: '300px',
              }}
            >
              <div className="w-full h-full bg-white rounded-lg shadow-2xl border-2 border-gray-200 overflow-hidden relative">
                <div
                  className="overflow-hidden rounded-lg"
                  style={{
                    width: '480px',
                    height: '300px',
                  }}
                >
                  <iframe
                    src={hoveredProject.liveUrl}
                    className="border-0"
                    title={`Preview of ${hoveredProject.title}`}
                    loading="lazy"
                    sandbox="allow-scripts allow-same-origin"
                    style={{
                      width: '1920px',
                      height: '1200px',
                      transform: 'scale(0.25)',
                      transformOrigin: 'top left',
                    }}
                  />
                </div>
                <div className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded z-10">
                  Live Preview
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </AnimatedWrapper>
  );
}
