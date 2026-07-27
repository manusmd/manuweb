import { useTranslations } from 'next-intl';
import { ExternalLink, Github, Hexagon, Users, Wallet, CalendarCheck } from 'lucide-react';
import type { Project } from '@/types/project';
import { BrowserFrame } from '../parts';
import { ASSET } from '../tokens';

/** Floating glass stat, layered over the hero dashboard for depth. */
function FloatChip({
  icon: Icon,
  value,
  label,
  className,
  parallax,
}: {
  icon: typeof Users;
  value: string;
  label: string;
  className: string;
  parallax: string;
}) {
  return (
    <div
      data-hero-chip
      data-parallax={parallax}
      className={`absolute z-20 flex items-center gap-3 rounded-2xl border border-white/10 bg-[#0b0e13]/95 px-4 py-3 shadow-[0_24px_60px_-16px_rgba(0,0,0,0.9)] ring-1 ring-white/[0.06] ${className}`}
    >
      <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-accent-violet/25 text-accent-violet">
        <Icon className="h-4 w-4" />
      </span>
      <div className="text-left">
        <p className="font-display text-lg font-bold leading-none text-white">{value}</p>
        <p className="mt-0.5 text-[11px] text-white/60">{label}</p>
      </div>
    </div>
  );
}

export function HeroScene({ project }: { project: Project }) {
  const t = useTranslations('projects');
  const td = useTranslations('projects.afterhiveDetail');
  const techItems = project.tech ?? project.technologies?.map(x => x.name) ?? [];

  return (
    <section
      data-scene="hero"
      className="relative flex min-h-[100svh] items-center overflow-hidden px-4 py-16"
    >
      {/* Extra hero-local gradient accents on top of the page-wide Liquid field. */}
      <div
        data-parallax="-0.18"
        className="pointer-events-none absolute -left-24 top-4 h-[30rem] w-[30rem] rounded-full bg-accent-violet/25 blur-[130px]"
      />
      <div
        data-parallax="0.22"
        className="pointer-events-none absolute -right-16 bottom-0 h-[28rem] w-[28rem] rounded-full bg-fuchsia-500/20 blur-[130px]"
      />

      <div className="relative z-10 mx-auto grid w-full max-w-6xl items-center gap-12 lg:grid-cols-[1fr_1.2fr]">
        {/* Pitch */}
        <div className="text-center lg:text-left">
          <span
            data-hero-eyebrow
            data-hero-hidden
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-accent-violet/30 bg-accent-violet/[0.08] px-4 py-1.5 text-xs font-medium uppercase tracking-widest text-foreground/80 backdrop-blur"
          >
            <Hexagon className="h-3.5 w-3.5 text-accent-violet" />
            {td('eyebrow')}
          </span>
          <h1
            data-hero-title
            data-hero-hidden
            className="font-display text-6xl font-bold leading-[0.95] tracking-tight text-foreground md:text-8xl"
          >
            {project.title}
          </h1>
          <p
            data-hero-lead
            data-hero-hidden
            className="mx-auto mt-6 max-w-xl text-lg text-muted-foreground md:text-xl lg:mx-0"
          >
            {td('heroLead')}{' '}
            <span className="font-semibold text-foreground">{td('heroLeadEmphasis')}</span>
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

        {/* Real dashboard, art-directed with floating glass stats. */}
        <div data-hero-print data-hero-hidden className="relative">
          <div className="lg:pr-10">
            <BrowserFrame src={ASSET('dashboard.png')} alt="afterhive dashboard" />
          </div>
          <FloatChip
            icon={Users}
            value={td('heroStatMembersValue')}
            label={td('heroStatMembersLabel')}
            className="-left-4 top-10 hidden lg:flex"
            parallax="-0.35"
          />
          <FloatChip
            icon={Wallet}
            value={td('heroStatDuesValue')}
            label={td('heroStatDuesLabel')}
            className="-right-2 top-1/2 hidden lg:flex"
            parallax="0.4"
          />
          <FloatChip
            icon={CalendarCheck}
            value={td('heroStatAttendanceValue')}
            label={td('heroStatAttendanceLabel')}
            className="-left-2 bottom-8 hidden lg:flex"
            parallax="0.28"
          />
        </div>
      </div>
    </section>
  );
}
