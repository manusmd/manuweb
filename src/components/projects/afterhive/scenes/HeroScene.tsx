import { useTranslations } from 'next-intl';
import { ExternalLink, Github, Hexagon } from 'lucide-react';
import type { Project } from '@/types/project';
import { BrowserFrame } from '../parts';
import { ASSET } from '../tokens';

export function HeroScene({ project }: { project: Project }) {
  const t = useTranslations('projects');
  const td = useTranslations('projects.afterhiveDetail');
  const techItems = project.tech ?? project.technologies?.map(x => x.name) ?? [];

  return (
    <section
      data-scene="hero"
      className="relative flex min-h-[100svh] items-center overflow-hidden px-4 py-16"
    >
      {/* Liquid gradient field */}
      <div
        data-parallax="-0.15"
        className="pointer-events-none absolute -left-32 top-10 h-[28rem] w-[28rem] rounded-full bg-accent-violet/25 blur-[130px]"
      />
      <div
        data-parallax="0.2"
        className="pointer-events-none absolute -right-24 bottom-0 h-[26rem] w-[26rem] rounded-full bg-primary/20 blur-[130px]"
      />
      <div className="pointer-events-none absolute left-1/2 top-1/3 h-72 w-72 -translate-x-1/2 rounded-full bg-fuchsia-500/10 blur-[110px]" />

      <div className="relative z-10 mx-auto grid w-full max-w-6xl items-center gap-12 lg:grid-cols-[1fr_1.15fr]">
        {/* Pitch */}
        <div className="text-center lg:text-left">
          <span
            data-hero-eyebrow
            data-hero-hidden
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/50 px-4 py-1.5 text-xs font-medium uppercase tracking-widest text-muted-foreground backdrop-blur"
          >
            <Hexagon className="h-3.5 w-3.5 text-accent-violet" />
            {td('eyebrow')}
          </span>
          <h1
            data-hero-title
            data-hero-hidden
            className="font-display text-5xl font-bold tracking-tight text-foreground md:text-7xl"
          >
            {project.title}
          </h1>
          <p
            data-hero-lead
            data-hero-hidden
            className="mx-auto mt-6 max-w-xl text-lg text-muted-foreground md:text-xl lg:mx-0"
          >
            {td('heroLead')} <span className="text-foreground">{td('heroLeadEmphasis')}</span>
          </p>
          <div
            data-hero-actions
            data-hero-hidden
            className="mt-8 flex flex-wrap items-center justify-center gap-3 lg:justify-start"
          >
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
            {project.githubUrl ? (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl border border-border/60 bg-background/40 px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:border-border hover:bg-accent/40"
              >
                <Github className="h-4 w-4" />
                {t('viewCode')}
              </a>
            ) : null}
          </div>
          <div className="mt-6 flex flex-wrap justify-center gap-2 lg:justify-start">
            {techItems.map(tech => (
              <span
                key={tech}
                className="rounded-full border border-border/50 bg-muted/40 px-2.5 py-1 text-xs text-muted-foreground"
              >
                {tech}
              </span>
            ))}
          </div>
          <span
            data-hero-cue
            data-hero-hidden
            className="mt-12 inline-block text-xs uppercase tracking-[0.3em] text-muted-foreground/70"
          >
            {td('scrollCue')} ↓
          </span>
        </div>

        {/* Real dashboard */}
        <div data-hero-print data-hero-hidden>
          <BrowserFrame src={ASSET('dashboard.png')} alt="afterhive dashboard" />
        </div>
      </div>
    </section>
  );
}
