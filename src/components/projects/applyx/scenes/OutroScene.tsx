import { useTranslations } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import type { Project } from '@/types/project';

export function OutroScene({ project, locale }: { project: Project; locale: string }) {
  const t = useTranslations('projects');
  const td = useTranslations('projects.applyxDetail');

  return (
    <section data-scene="outro" className="relative px-4 py-24">
      <div className="mx-auto w-full max-w-5xl">
        <h2
          data-fade
          className="text-center font-display text-3xl font-bold tracking-tight text-foreground md:text-5xl"
        >
          {td('outro.heading')}
        </h2>
        <p data-fade className="mx-auto mt-4 max-w-md text-center text-muted-foreground">
          {td('outro.sub')}
        </p>

        {/* Device frame with live demo */}
        <div
          data-fade
          className="mx-auto mt-10 max-w-4xl overflow-hidden rounded-2xl border border-border/50 bg-card/60 shadow-2xl"
        >
          <div className="flex items-center gap-1.5 border-b border-border/40 bg-muted/40 px-4 py-3">
            <span className="h-3 w-3 rounded-full bg-red-500/70" />
            <span className="h-3 w-3 rounded-full bg-yellow-500/70" />
            <span className="h-3 w-3 rounded-full bg-green-500/70" />
            <span className="ml-3 truncate text-xs text-muted-foreground">{project.liveUrl}</span>
          </div>
          <div className="relative aspect-[16/10] w-full">
            <Image
              src={project.image ?? '/applyxdashboard.png'}
              alt={project.title}
              fill
              className="object-cover object-top"
              sizes="(max-width: 1024px) 100vw, 60vw"
            />
          </div>
        </div>

        <div data-fade className="mt-10 flex flex-wrap items-center justify-center gap-3">
          {project.liveUrl ? (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
            >
              <ExternalLink className="h-4 w-4" />
              {t('viewApp')}
            </a>
          ) : null}
          <Link
            href={`/${locale}#projects`}
            className="inline-flex items-center gap-2 rounded-xl border border-border/60 bg-background/40 px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:border-border hover:bg-accent/40"
          >
            <ArrowLeft className="h-4 w-4" />
            {t('backToProjects')}
          </Link>
        </div>
      </div>
    </section>
  );
}
