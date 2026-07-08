import { useTranslations } from 'next-intl';
import { Mail } from 'lucide-react';
import { PipelineRow, SceneStep } from '@/components/projects/applyx/SceneParts';

export function IngestScene() {
  const td = useTranslations('projects.applyxDetail');

  return (
    <section data-scene="ingest" className="relative">
      <div
        data-pin="ingest"
        className="flex min-h-[100svh] items-center border-t border-border/30 px-4 py-16"
      >
        <div className="mx-auto grid w-full max-w-6xl items-center gap-8 lg:grid-cols-[1fr_auto_1fr]">
          {/* Email card */}
          <div className="relative">
            <SceneStep>{td('ingest.step')}</SceneStep>
            <div className="relative overflow-hidden rounded-2xl border border-border/50 bg-card/70 p-5 shadow-2xl backdrop-blur">
              <div
                data-scanline
                className="pointer-events-none absolute inset-x-0 top-0 z-10 h-16 -translate-y-16 bg-gradient-to-b from-transparent via-primary/25 to-transparent opacity-0"
              />
              <div className="flex items-center gap-2 border-b border-border/40 pb-3">
                <Mail className="h-4 w-4 text-primary" />
                <span className="text-xs text-muted-foreground">{td('ingest.emailFrom')}</span>
              </div>
              <p className="mt-3 text-sm font-semibold text-foreground">
                {td('ingest.emailSubject')}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {td('ingest.emailBody')}
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
              <p className="mt-1 text-[11px] text-muted-foreground/70">{td('ingest.model')}</p>
            </div>
          </div>

          {/* Connector (desktop only) */}
          <div className="relative hidden h-40 w-40 lg:block">
            <svg viewBox="0 0 160 160" className="h-full w-full overflow-visible">
              <path
                data-connector
                d="M4 80 C 60 80, 100 80, 156 80"
                fill="none"
                stroke="hsl(var(--primary))"
                strokeWidth="2"
                strokeDasharray="5 6"
                opacity="0.5"
              />
              <circle data-packet r="6" fill="hsl(var(--primary))" opacity="0" />
            </svg>
          </div>

          {/* Pipeline preview + resulting app card */}
          <div className="relative">
            <div className="flex flex-col gap-2">
              <PipelineRow label={td('pipeline.stageApplied')} lit />
              <PipelineRow label={td('pipeline.stageReview')} />
              <PipelineRow label={td('pipeline.stageInterview')} />
              <PipelineRow label={td('pipeline.stageOffer')} />
            </div>
            <div
              data-appcard
              className="mt-4 rounded-xl border border-accent-green/40 bg-accent-green/5 p-4"
            >
              <div className="flex items-center justify-between">
                <span className="font-semibold text-foreground" data-extract>
                  {td('ingest.company')}
                </span>
                <span className="rounded-full bg-accent-green/15 px-2 py-0.5 text-[11px] text-accent-green">
                  {td('ingest.tracked')}
                </span>
              </div>
              <div className="mt-2 grid grid-cols-1 gap-1 text-sm text-muted-foreground">
                <span data-extract>
                  <span className="text-muted-foreground/60">{td('ingest.fieldRole')}: </span>
                  {td('ingest.role')}
                </span>
                <span data-extract>
                  <span className="text-muted-foreground/60">{td('ingest.fieldLocation')}: </span>
                  {td('ingest.location')}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
