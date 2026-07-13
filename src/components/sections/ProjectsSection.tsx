'use client';

import { useTranslations } from 'next-intl';
import type { Project } from '@/types/project';
import { FullscreenSection } from '@/components/layout/FullscreenSection';
import { SectionHeader } from '@/components/layout/SectionHeader';
import { FeaturedProjectShowcase } from '@/components/projects/FeaturedProjectShowcase';
import { buildApplyxProject, buildFingermatchProject } from '@/data/projects';
import { Github } from 'lucide-react';

export function ProjectsSection() {
  const t = useTranslations('projects');
  const tc = useTranslations('projects.applyx');
  const tf = useTranslations('projects.fingermatch');

  const projects: Project[] = [
    buildApplyxProject({
      title: tc('title'),
      subtitle: tc('subtitle'),
      description: tc('description'),
      longDescription: tc('longDescription'),
    }),
    buildFingermatchProject({
      title: tf('title'),
      subtitle: tf('subtitle'),
      description: tf('description'),
      longDescription: tf('longDescription'),
    }),
  ];

  return (
    <FullscreenSection
      id="projects"
      centerContent={false}
      minHeight="auto"
      className="border-t border-border/30 py-20 md:py-28"
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="mx-auto flex max-w-6xl flex-col gap-10 md:gap-14">
          <SectionHeader
            label={t('homeSection.featuredBadge')}
            title={t('title')}
            description={t('subtitle')}
          />

          <div className="flex flex-col gap-10 md:gap-14">
            {projects.map(project => (
              <FeaturedProjectShowcase key={project.slug} project={project} />
            ))}
          </div>

          <div className="flex flex-col items-start gap-3 border-t border-border/30 pt-8 sm:flex-row sm:items-center sm:justify-between">
            <p className="max-w-xl text-sm text-muted-foreground md:text-base">
              {t('homeSection.moreProjects')}
            </p>
            <a
              href="https://github.com/manusmd"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/50 px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:border-border hover:bg-accent/40"
            >
              <Github className="h-4 w-4" />
              {t('homeSection.viewAllGithub')}
            </a>
          </div>
        </div>
      </div>
    </FullscreenSection>
  );
}
