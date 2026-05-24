'use client';

import type { Project } from '@/types/project';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, Github } from 'lucide-react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';

interface FeaturedProjectShowcaseProps {
  project: Project;
}

export function FeaturedProjectShowcase({ project }: FeaturedProjectShowcaseProps) {
  const t = useTranslations('projects');

  const techItems = project.tech || project.technologies?.map(item => item.name) || [];

  return (
    <article className="overflow-hidden rounded-3xl border border-border/40 bg-card/55 shadow-[0_22px_64px_-32px_rgba(0,0,0,0.45)] backdrop-blur-xl ring-1 ring-white/[0.06]">
      <div className="grid lg:grid-cols-[1.05fr_1fr] lg:items-stretch">
        <div className="relative aspect-[16/10] overflow-hidden lg:aspect-auto lg:min-h-[22rem]">
          <Image
            src={project.image || project.thumbnail || '/placeholder-project.jpg'}
            alt={project.title}
            fill
            className="object-cover object-top"
            sizes="(max-width: 1024px) 100vw, 55vw"
            priority
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/50 via-transparent to-transparent lg:bg-gradient-to-r lg:from-transparent lg:via-transparent lg:to-background/20" />
        </div>

        <div className="flex flex-col justify-center gap-5 p-6 md:p-8 lg:p-10">
          <div className="space-y-3">
            <Badge
              variant="outline"
              className="w-fit border-accent-violet/30 bg-accent-violet/10 text-accent-violet"
            >
              {t(`categories.${project.category}`)}
            </Badge>
            <div className="space-y-2">
              <h3 className="font-display text-2xl font-bold tracking-tight text-foreground md:text-3xl">
                {project.title}
              </h3>
              {project.subtitle ? (
                <p className="text-sm font-medium text-primary md:text-base">{project.subtitle}</p>
              ) : null}
            </div>
          </div>

          <p className="text-sm leading-relaxed text-muted-foreground md:text-base">
            {project.longDescription || project.description}
          </p>

          {techItems.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {techItems.map(tech => (
                <Badge
                  key={tech}
                  variant="secondary"
                  className="border-border/50 bg-muted/40 px-2.5 py-1 text-xs font-normal"
                >
                  {tech}
                </Badge>
              ))}
            </div>
          ) : null}

          <div className="flex flex-col gap-3 pt-1 sm:flex-row">
            {project.liveUrl ? (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
              >
                <ExternalLink className="h-4 w-4" />
                {project.isApp ? t('viewApp') : t('liveDemo')}
              </a>
            ) : null}
            {project.githubUrl ? (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-border/60 bg-background/40 px-5 py-2.5 text-sm font-semibold text-foreground transition-colors hover:border-border hover:bg-accent/40"
              >
                <Github className="h-4 w-4" />
                {t('viewCode')}
              </a>
            ) : null}
          </div>
        </div>
      </div>
    </article>
  );
}
