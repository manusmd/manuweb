'use client';

import type { Project } from '@/types/project';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, ExternalLink, Github } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';

interface FeaturedProjectShowcaseProps {
  project: Project;
}

export function FeaturedProjectShowcase({ project }: FeaturedProjectShowcaseProps) {
  const t = useTranslations('projects');
  const locale = useLocale();

  const techItems = project.tech || project.technologies?.map(item => item.name) || [];
  const detailHref = project.slug ? `/${locale}/projects/${project.slug}` : undefined;

  return (
    <article className="group relative overflow-hidden rounded-3xl border border-border/40 bg-card/55 shadow-[0_22px_64px_-32px_rgba(0,0,0,0.45)] ring-1 ring-white/[0.06] backdrop-blur-xl transition-[box-shadow,border-color] duration-300 hover:border-primary/40 hover:shadow-[0_28px_80px_-32px_rgba(0,0,0,0.6)]">
      {/* Stretched link: clicking anywhere on the card (except the action
          buttons below, which sit at a higher z-index) opens the detail page.
          The visible "take the tour" cues below label where it leads. */}
      {detailHref ? (
        <Link
          href={detailHref}
          aria-label={t('takeTour')}
          className="absolute inset-0 z-10 rounded-3xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        />
      ) : null}

      <div className="grid lg:grid-cols-[1.05fr_1fr] lg:items-stretch">
        <div className="relative aspect-[16/10] overflow-hidden lg:aspect-auto lg:min-h-[22rem]">
          <Image
            src={project.image || project.thumbnail || '/placeholder-project.jpg'}
            alt={project.title}
            fill
            className="object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]"
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
              <h3 className="font-display text-2xl font-bold tracking-tight text-foreground transition-colors group-hover:text-primary md:text-3xl">
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

          {/* Persistent, visible cue that labels the whole-card link. It sits in
              normal flow (below the stretched link), so it isn't a separate
              click target — clicking it still triggers the card link. */}
          {detailHref ? (
            <span
              aria-hidden="true"
              className="inline-flex w-fit items-center gap-1.5 text-sm font-semibold text-primary decoration-primary/40 underline-offset-4 group-hover:underline"
            >
              {t('takeTour')}
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </span>
          ) : null}

          <div className="relative z-20 flex flex-col gap-3 pt-1 sm:flex-row">
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
