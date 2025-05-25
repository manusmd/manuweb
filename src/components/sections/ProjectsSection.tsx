'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { AnimatedWrapper, StaggerContainer } from '@/components/animations';
import Image from 'next/image';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { motion } from 'framer-motion';
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
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTechs, setSelectedTechs] = useState<string[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

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

  const allTechs = Array.from(
    new Set(projects.flatMap(p => p.tech || p.technologies?.map(t => t.name) || []))
  );

  const toggleTech = (tech: string) => {
    setSelectedTechs(prev =>
      prev.includes(tech) ? prev.filter(t => t !== tech) : [...prev, tech]
    );
  };

  const filteredProjects = projects.filter(project => {
    const matchesSearch =
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase());

    const projectTechs = project.tech || project.technologies?.map(t => t.name) || [];
    const matchesTech =
      selectedTechs.length === 0 || selectedTechs.every(tech => projectTechs.includes(tech));

    return matchesSearch && matchesTech;
  });

  return (
    <AnimatedWrapper>
      <section id="projects" className="py-24">
        <div className="container mx-auto px-4">
          <StaggerContainer className="space-y-12">
            <div className="text-center">
              <h2 className="text-4xl font-display font-bold mb-4">{t('title')}</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">{t('subtitle')}</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[280px,1fr] gap-8">
              {/* Filter Sidebar */}
              <div className="rounded-lg border bg-card/50 p-4 backdrop-blur supports-[backdrop-filter]:bg-card/50">
                <div className="space-y-2">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder={t('searchPlaceholder')}
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      className="pl-8"
                    />
                  </div>
                </div>

                <div className="mt-6 space-y-2">
                  <h3 className="text-sm font-medium">{t('techStack')}</h3>
                  <div className="flex flex-wrap gap-2">
                    {allTechs.map(tech => {
                      const isSelected = selectedTechs.includes(tech);
                      const colors = techColors[tech] || {
                        bg: 'bg-primary/10',
                        text: 'text-primary',
                      };
                      return (
                        <button
                          key={tech}
                          onClick={() => toggleTech(tech)}
                          className={`rounded-full px-3 py-1 text-sm transition-colors ${
                            isSelected ? colors.bg : 'bg-muted hover:bg-muted/80'
                          } ${isSelected ? colors.text : 'text-muted-foreground'}`}
                        >
                          {tech}
                          {isSelected && <X className="ml-1 inline-block h-3 w-3" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Projects Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {filteredProjects.map(project => (
                  <motion.div
                    key={project.title}
                    layoutId={`project-${project.title}`}
                    onClick={() => setSelectedProject(project)}
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
            </div>
          </StaggerContainer>

          <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />
        </div>
      </section>
    </AnimatedWrapper>
  );
}
