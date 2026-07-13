'use client';

import type { Project } from '@/types/project';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, ExternalLink, Github } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';

interface ProjectCardProps {
  project: Project;
}

/**
 * A compact, vertical project card: screenshot on top, condensed meta below.
 * The whole card links to the detail page (the "take the tour" cue labels it);
 * the live/code buttons sit above the stretched link at a higher z-index.
 */
export function ProjectCard({ project }: ProjectCardProps) {
  const t = useTranslations('projects');
  const locale = useLocale();

  const techItems = (project.tech || project.technologies?.map(i => i.name) || []).slice(0, 4);
  const detailHref = project.slug ? `/${locale}/projects/${project.slug}` : undefined;

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl border border-border/40 bg-card/55 ring-1 ring-white/[0.05] backdrop-blur-xl transition-[box-shadow,border-color,transform] duration-300 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-[0_24px_60px_-30px_rgba(0,0,0,0.7)]">
      {detailHref ? (
        <Link
          href={detailHref}
          aria-label={t('takeTour')}
          className="absolute inset-0 z-10 rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        />
      ) : null}

      <div className="relative aspect-[16/9] overflow-hidden border-b border-border/40">
        <Image
          src={project.image || project.thumbnail || '/placeholder-project.jpg'}
          alt={project.title}
          fill
          className="object-cover object-top transition-transform duration-500 group-hover:scale-[1.04]"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-card/80 via-transparent to-transparent" />
        <Badge
          variant="outline"
          className="absolute left-3 top-3 border-accent-violet/30 bg-background/70 text-accent-violet backdrop-blur"
        >
          {t(`categories.${project.category}`)}
        </Badge>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div>
          <h3 className="font-display text-xl font-bold tracking-tight text-foreground transition-colors group-hover:text-primary">
            {project.title}
          </h3>
          {project.subtitle ? (
            <p className="mt-0.5 text-sm font-medium text-primary">{project.subtitle}</p>
          ) : null}
        </div>

        <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
          {project.description}
        </p>

        {techItems.length > 0 ? (
          <div className="flex flex-wrap gap-1.5">
            {techItems.map(tech => (
              <Badge
                key={tech}
                variant="secondary"
                className="border-border/50 bg-muted/40 px-2 py-0.5 text-[11px] font-normal"
              >
                {tech}
              </Badge>
            ))}
          </div>
        ) : null}

        <div className="mt-auto flex items-center justify-between gap-3 pt-2">
          {detailHref ? (
            <span
              aria-hidden="true"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary underline-offset-4 group-hover:underline"
            >
              {t('takeTour')}
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </span>
          ) : (
            <span />
          )}

          <div className="relative z-20 flex items-center gap-1.5">
            {project.liveUrl ? (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={project.isApp ? t('viewApp') : t('liveDemo')}
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground transition-colors hover:bg-primary/90"
              >
                <ExternalLink className="h-4 w-4" />
              </a>
            ) : null}
            {project.githubUrl ? (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={t('viewCode')}
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border/60 bg-background/40 text-foreground transition-colors hover:border-border hover:bg-accent/40"
              >
                <Github className="h-4 w-4" />
              </a>
            ) : null}
          </div>
        </div>
      </div>
    </article>
  );
}
