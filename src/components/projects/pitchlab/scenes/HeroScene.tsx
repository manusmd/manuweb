import { useLocale, useTranslations } from 'next-intl';
import { ExternalLink, Github, Trophy } from 'lucide-react';
import type { Project } from '@/types/project';
import { TeamBadge } from '../parts';
import { DEMO, OUTCOME, teamName } from '../tokens';

export function HeroScene({ project }: { project: Project }) {
  const t = useTranslations('projects');
  const td = useTranslations('projects.pitchlabDetail');
  const locale = useLocale();
  const techItems = project.tech ?? project.technologies?.map(x => x.name) ?? [];
  const f = DEMO.featured;
  const segs = [
    { key: 'home', w: f.p[0], color: OUTCOME.home, label: f.home.code },
    { key: 'draw', w: f.p[1], color: OUTCOME.draw, label: td('draw') },
    { key: 'away', w: f.p[2], color: OUTCOME.away, label: f.away.code },
  ];

  return (
    <section
      data-scene="hero"
      className="relative flex min-h-[100svh] items-center overflow-hidden px-4 py-16"
    >
      <div
        data-parallax="-0.15"
        className="pointer-events-none absolute -left-32 top-10 h-96 w-96 rounded-full bg-primary/20 blur-[120px]"
      />
      <div
        data-parallax="0.2"
        className="pointer-events-none absolute -right-24 bottom-0 h-96 w-96 rounded-full bg-accent-violet/20 blur-[120px]"
      />

      <div className="relative z-10 mx-auto grid w-full max-w-6xl items-center gap-12 lg:grid-cols-2">
        {/* Featured match prediction card */}
        <div data-hero-print data-hero-hidden className="order-2 lg:order-1">
          <div className="relative mx-auto w-full max-w-[460px] rounded-2xl border border-border/50 bg-card/60 p-6 shadow-[0_30px_80px_-24px_rgba(0,0,0,0.8)] backdrop-blur">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1.5 font-mono uppercase tracking-widest text-primary">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />
                {td('heroTag')}
              </span>
              <span className="font-mono">World Cup 2026</span>
            </div>

            <div className="mt-5 flex items-center justify-between">
              <div className="flex flex-col items-center gap-2">
                <TeamBadge team={f.home} size="lg" />
                <span className="text-sm font-semibold text-foreground">
                  {teamName(f.home, locale)}
                </span>
              </div>
              <span className="font-mono text-xs text-muted-foreground">vs</span>
              <div className="flex flex-col items-center gap-2">
                <TeamBadge team={f.away} size="lg" />
                <span className="text-sm font-semibold text-foreground">
                  {teamName(f.away, locale)}
                </span>
              </div>
            </div>

            {/* win / draw / loss bar */}
            <div className="mt-6">
              <div className="flex h-3 w-full overflow-hidden rounded-full bg-muted">
                {segs.map(s => (
                  <div
                    key={s.key}
                    data-hero-seg
                    className="h-full origin-left"
                    style={{ width: `${s.w}%`, backgroundColor: s.color }}
                  />
                ))}
              </div>
              <div className="mt-2 flex justify-between font-mono text-xs">
                {segs.map(s => (
                  <span key={s.key} style={{ color: s.color }}>
                    {s.label} {s.w}%
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-5 flex items-center justify-between rounded-xl border border-border/40 bg-background/40 px-4 py-3">
              <div className="text-center">
                <div className="font-mono text-lg font-bold text-foreground">
                  {f.xg[0]} : {f.xg[1]}
                </div>
                <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
                  {td('xgLabel')}
                </div>
              </div>
              <div className="text-center">
                <div className="font-mono text-lg font-bold text-primary">
                  {td(`conf${f.conf}`)}
                </div>
                <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
                  {td('confidence')}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Pitch */}
        <div className="order-1 text-center lg:order-2 lg:text-left">
          <span
            data-hero-eyebrow
            data-hero-hidden
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/50 px-4 py-1.5 text-xs font-medium uppercase tracking-widest text-muted-foreground backdrop-blur"
          >
            <Trophy className="h-3.5 w-3.5 text-primary" />
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
      </div>
    </section>
  );
}
