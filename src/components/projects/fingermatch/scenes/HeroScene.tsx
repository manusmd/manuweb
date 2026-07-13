/* eslint-disable @next/next/no-img-element -- layered scanner image with SVG overlay; next/image is unsuitable here */
import { useTranslations } from 'next-intl';
import { ExternalLink, Github, Fingerprint } from 'lucide-react';
import type { Project } from '@/types/project';
import { MinutiaMarker } from '../parts';
import { ASSET, DEMO } from '../tokens';

// A spread-out handful of real minutiae to pulse over the hero scanner.
const HERO_MARKERS = (() => {
  const ms = DEMO.A.minutiae;
  const step = Math.max(1, Math.floor(ms.length / 14));
  return ms.filter((_, i) => i % step === 0).slice(0, 14);
})();

function Corner({ className }: { className: string }) {
  return <span className={`absolute h-5 w-5 border-primary/70 ${className}`} />;
}

export function HeroScene({ project }: { project: Project }) {
  const t = useTranslations('projects');
  const td = useTranslations('projects.fingermatchDetail');
  const techItems = project.tech ?? project.technologies?.map(x => x.name) ?? [];

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
        {/* The biometric scanner */}
        <div data-hero-print data-hero-hidden className="order-2 lg:order-1">
          <div className="relative mx-auto aspect-square w-full max-w-[420px]">
            <div className="absolute inset-8 rounded-full bg-primary/25 blur-[80px]" />
            <div className="relative h-full w-full overflow-hidden rounded-[2rem] border border-primary/25 bg-black shadow-[0_0_70px_-18px_hsl(var(--primary))]">
              <img
                src={ASSET('raw-a.png')}
                alt="Fingerprint scan"
                className="absolute inset-0 h-full w-full object-cover opacity-80"
              />
              {/* subtle scan grid */}
              <div
                className="pointer-events-none absolute inset-0 opacity-[0.12]"
                style={{
                  backgroundImage:
                    'linear-gradient(hsl(var(--primary)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--primary)) 1px, transparent 1px)',
                  backgroundSize: '28px 28px',
                }}
              />
              {/* real minutiae, gently pulsing */}
              <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full">
                {HERO_MARKERS.map((m, i) => (
                  <g
                    key={m.id}
                    className="fm-minutia"
                    style={{ animationDelay: `${(i % 7) * 0.25}s` }}
                  >
                    <MinutiaMarker m={m} size={3} />
                  </g>
                ))}
              </svg>
              {/* sweeping scan line */}
              <div className="fm-scanline pointer-events-none absolute inset-x-0 h-px bg-primary shadow-[0_0_18px_3px_hsl(var(--primary))]" />
              {/* corner reticle */}
              <Corner className="left-3 top-3 border-l-2 border-t-2 rounded-tl" />
              <Corner className="right-3 top-3 border-r-2 border-t-2 rounded-tr" />
              <Corner className="bottom-3 left-3 border-b-2 border-l-2 rounded-bl" />
              <Corner className="bottom-3 right-3 border-b-2 border-r-2 rounded-br" />
            </div>
            {/* status chip */}
            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-black/85 px-3.5 py-1.5 font-mono text-[10px] uppercase tracking-widest text-primary backdrop-blur">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />
              {td('heroScanLabel')}
            </div>
          </div>
        </div>

        {/* The pitch */}
        <div className="order-1 text-center lg:order-2 lg:text-left">
          <span
            data-hero-eyebrow
            data-hero-hidden
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/50 px-4 py-1.5 text-xs font-medium uppercase tracking-widest text-muted-foreground backdrop-blur"
          >
            <Fingerprint className="h-3.5 w-3.5 text-primary" />
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
