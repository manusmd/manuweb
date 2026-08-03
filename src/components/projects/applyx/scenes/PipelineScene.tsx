import { useTranslations } from 'next-intl';
import { CalendarClock, FileCheck2, Mail, MessageSquareReply, type LucideIcon } from 'lucide-react';
import { SceneStep, StatusPill } from '@/components/projects/applyx/SceneParts';
import { STATUS, type StatusKey } from '@/components/projects/applyx/tokens';

const STAGES = [
  {
    key: 'stageApplied',
    caption: 'captionApplied',
    signal: 'signalApplied',
    icon: Mail,
    pos: '0%',
    status: 'applied',
  },
  {
    key: 'stageReview',
    caption: 'captionReview',
    signal: 'signalReview',
    icon: MessageSquareReply,
    pos: '33.33%',
    status: 'review',
  },
  {
    key: 'stageInterview',
    caption: 'captionInterview',
    signal: 'signalInterview',
    icon: CalendarClock,
    pos: '66.66%',
    status: 'interview',
  },
  {
    key: 'stageOffer',
    caption: 'captionOffer',
    signal: 'signalOffer',
    icon: FileCheck2,
    pos: '100%',
    status: 'offer',
  },
] as const satisfies readonly {
  key: string;
  caption: string;
  signal: string;
  icon: LucideIcon;
  pos: string;
  status: StatusKey;
}[];

export function PipelineScene() {
  const td = useTranslations('projects.applyxDetail');

  return (
    <section data-scene="pipeline" className="relative">
      <div
        data-pin="pipeline"
        className="flex flex-col justify-center px-4 py-20 lg:min-h-[100svh]"
      >
        <div className="mx-auto w-full max-w-4xl">
          <div className="text-center lg:text-left">
            <SceneStep>{td('pipeline.step')}</SceneStep>
            <h2 className="mb-10 font-display text-3xl font-bold tracking-tight text-foreground md:mb-12 md:text-5xl">
              {td('pipeline.heading')}
            </h2>
          </div>

          {/* Desktop: horizontal track with a sliding marker + a progress fill,
              and a row of signal cards that accumulate as each stage lights */}
          <div className="relative hidden lg:block">
            <div className="relative flex justify-between">
              {STAGES.map(({ key, pos, status }) => (
                <div
                  key={key}
                  data-stage
                  data-pos={pos}
                  className="flex flex-col items-center gap-3"
                  style={
                    { '--lit': 0, '--stage-color': STATUS[status].color } as React.CSSProperties
                  }
                >
                  <div
                    data-dot
                    className="h-5 w-5 rounded-full border-2"
                    style={{
                      borderColor: 'var(--stage-color)',
                      background:
                        'color-mix(in srgb, var(--stage-color) calc(var(--lit) * 100%), transparent)',
                      opacity: 'calc(0.4 + var(--lit) * 0.6)',
                    }}
                  />
                  <span className="text-sm font-medium text-muted-foreground">
                    {td(`pipeline.${key}`)}
                  </span>
                </div>
              ))}
              {/* track line */}
              <div className="absolute left-0 right-0 top-[10px] -z-10 h-0.5 bg-border/60" />
              {/* progress fill — grows to the marker as it advances */}
              <div
                data-pipe-fill
                className="absolute left-0 right-0 top-[10px] -z-10 h-0.5 origin-left bg-primary"
                style={{ transform: 'scaleX(0)' }}
              />
              <div
                data-marker
                className="absolute top-[3px] h-4 w-4 -translate-x-1/2 rounded-full bg-primary shadow-[0_0_20px_hsl(var(--primary))]"
                style={{ left: '0%' }}
              />
            </div>

            <p className="mt-10 text-center text-sm text-muted-foreground lg:text-left">
              {td('pipeline.autoNote')}
            </p>

            <div className="mt-4 grid grid-cols-4 gap-3">
              {STAGES.map(({ key, caption, signal, icon: Icon, status }) => (
                <div
                  key={key}
                  data-stage-card
                  className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-4"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className="flex items-center gap-2"
                      style={{ color: STATUS[status].color }}
                    >
                      <Icon className="h-4 w-4 shrink-0" />
                      <span className="font-mono text-[11px] uppercase tracking-wide">
                        {td(`pipeline.${signal}`)}
                      </span>
                    </span>
                    <StatusPill status={status}>{td(`pipeline.${key}`)}</StatusPill>
                  </div>
                  <p className="mt-3 text-sm font-semibold text-foreground">
                    {td(`pipeline.${key}`)}
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                    {td(`pipeline.${caption}`)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Mobile: vertical stage list, each with its detected signal + caption */}
          <ol className="relative space-y-6 lg:hidden">
            <div className="absolute bottom-2 left-[9px] top-2 w-px bg-border/60" />
            {STAGES.map(({ key, caption, signal, icon: Icon, status }) => (
              <li key={key} data-fade className="relative flex gap-4">
                <span
                  className="relative z-10 mt-0.5 h-[18px] w-[18px] shrink-0 rounded-full border-2"
                  style={{
                    borderColor: STATUS[status].color,
                    backgroundColor: STATUS[status].tint,
                  }}
                />
                <div>
                  <div className="flex items-center gap-2">
                    <span
                      className="flex items-center gap-1.5"
                      style={{ color: STATUS[status].color }}
                    >
                      <Icon className="h-3.5 w-3.5 shrink-0" />
                      <span className="font-mono text-[10px] uppercase tracking-wide">
                        {td(`pipeline.${signal}`)}
                      </span>
                    </span>
                    <StatusPill status={status}>{td(`pipeline.${key}`)}</StatusPill>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">{td(`pipeline.${caption}`)}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
