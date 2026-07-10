import type { ReactNode } from 'react';
import { useTranslations } from 'next-intl';
import { ArrowRight, Check, Cpu, Mail } from 'lucide-react';
import { SceneStep } from '@/components/projects/applyx/SceneParts';

export function IngestScene() {
  const td = useTranslations('projects.applyxDetail');

  // Entity highlight used inside the email — lights up as the model "reads" it.
  const highlight = (chunks: ReactNode) => (
    <mark
      data-highlight
      className="rounded bg-accent-violet/15 px-1 font-medium text-accent-violet [box-decoration-break:clone]"
    >
      {chunks}
    </mark>
  );

  return (
    <section data-scene="ingest" className="relative">
      <div data-pin="ingest" className="flex flex-col justify-center px-4 py-20 lg:min-h-[100svh]">
        <div className="mx-auto w-full max-w-5xl">
          <div className="text-center">
            <SceneStep>{td('ingest.step')}</SceneStep>
            <h2 className="mb-10 font-display text-3xl font-bold tracking-tight text-foreground md:mb-14 md:text-5xl">
              {td('ingest.heading')}
            </h2>
          </div>

          <div className="flex flex-col items-center gap-3 lg:flex-row lg:items-center lg:justify-center lg:gap-5">
            {/* Email card */}
            <div className="relative w-full max-w-md lg:flex-1">
              <div className="relative overflow-hidden rounded-2xl border border-border/50 bg-card/70 p-5 shadow-2xl backdrop-blur">
                <div
                  data-scanline
                  className="pointer-events-none absolute inset-x-0 top-0 z-10 h-16 -translate-y-16 bg-gradient-to-b from-transparent via-primary/25 to-transparent opacity-0"
                />
                <div className="flex items-center gap-2 border-b border-border/40 pb-3">
                  <Mail className="h-4 w-4 text-primary" />
                  <span className="text-xs text-muted-foreground">{td('ingest.emailFrom')}</span>
                </div>
                <p className="mt-3 text-sm font-semibold leading-relaxed text-foreground">
                  {td.rich('ingest.emailSubject', { company: highlight })}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {td.rich('ingest.emailBody', { role: highlight, location: highlight })}
                </p>
                <div className="mt-4 flex items-center gap-2 text-xs">
                  <span className="relative inline-grid">
                    <span data-status="reading" className="col-start-1 row-start-1 text-primary">
                      ● {td('ingest.reading')}
                    </span>
                    <span
                      data-status="classifying"
                      className="col-start-1 row-start-1 text-accent-violet opacity-0"
                    >
                      ◐ {td('ingest.classifying')}
                    </span>
                    <span
                      data-status="classified"
                      className="col-start-1 row-start-1 text-accent-green opacity-0"
                    >
                      ✓ {td('ingest.classified')}
                    </span>
                  </span>
                </div>
                <p className="mt-1 flex items-center gap-1.5 text-[11px] text-muted-foreground/70">
                  <Cpu className="h-3 w-3" />
                  {td('ingest.model')}
                </p>
              </div>
            </div>

            {/* Flow connector — points down on mobile, right on desktop */}
            <div className="flex shrink-0 items-center justify-center">
              <span className="flex size-9 items-center justify-center rounded-full border border-primary/30 bg-primary/10 text-primary shadow-[0_0_24px_-4px_hsl(var(--primary)/0.5)]">
                <ArrowRight className="h-4 w-4 rotate-90 lg:rotate-0" />
              </span>
            </div>

            {/* Extracted application card */}
            <div data-appcard className="w-full max-w-md lg:flex-1">
              <div className="rounded-2xl border border-accent-green/30 bg-accent-green/[0.06] p-5 shadow-2xl backdrop-blur">
                <div className="flex items-center justify-between gap-3 border-b border-border/30 pb-3">
                  <span data-extract className="text-lg font-semibold text-foreground">
                    {td('ingest.company')}
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-accent-green/15 px-2 py-0.5 text-[11px] font-medium text-accent-green">
                    <Check className="h-3 w-3" />
                    {td('ingest.tracked')}
                  </span>
                </div>
                <dl className="mt-3 space-y-2.5 text-sm">
                  <div data-extract className="flex items-baseline justify-between gap-4">
                    <dt className="text-muted-foreground/70">{td('ingest.fieldRole')}</dt>
                    <dd className="font-medium text-foreground">{td('ingest.role')}</dd>
                  </div>
                  <div data-extract className="flex items-baseline justify-between gap-4">
                    <dt className="text-muted-foreground/70">{td('ingest.fieldLocation')}</dt>
                    <dd className="font-medium text-foreground">{td('ingest.location')}</dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
