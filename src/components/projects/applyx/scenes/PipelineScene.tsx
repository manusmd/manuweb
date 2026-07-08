import { useTranslations } from 'next-intl';
import { SceneStep } from '@/components/projects/applyx/SceneParts';

const STAGES = [
  { key: 'stageApplied', caption: 'captionApplied', pos: '0%' },
  { key: 'stageReview', caption: 'captionReview', pos: '33.33%' },
  { key: 'stageInterview', caption: 'captionInterview', pos: '66.66%' },
  { key: 'stageOffer', caption: 'captionOffer', pos: '100%' },
] as const;

export function PipelineScene() {
  const td = useTranslations('projects.applyxDetail');

  return (
    <section data-scene="pipeline" className="relative">
      <div
        data-pin="pipeline"
        className="flex flex-col justify-center border-t border-border/30 px-4 py-20 lg:min-h-[100svh]"
      >
        <div className="mx-auto w-full max-w-4xl">
          <div className="text-center lg:text-left">
            <SceneStep>{td('pipeline.step')}</SceneStep>
            <h2 className="mb-10 font-display text-3xl font-bold tracking-tight text-foreground md:mb-12 md:text-5xl">
              {td('pipeline.heading')}
            </h2>
          </div>

          {/* Desktop: horizontal track with a sliding marker + swapping captions */}
          <div className="relative hidden lg:block">
            <div className="relative flex justify-between">
              {STAGES.map(({ key, pos }) => (
                <div
                  key={key}
                  data-stage
                  data-pos={pos}
                  className="flex flex-col items-center gap-3"
                  style={{ '--lit': 0 } as React.CSSProperties}
                >
                  <div
                    data-dot
                    className="h-5 w-5 rounded-full border-2"
                    style={{
                      borderColor: 'hsl(var(--primary))',
                      background:
                        'color-mix(in srgb, hsl(var(--primary)) calc(var(--lit) * 100%), transparent)',
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
              <div
                data-marker
                className="absolute top-[3px] h-4 w-4 -translate-x-1/2 rounded-full bg-primary shadow-[0_0_20px_hsl(var(--primary))]"
                style={{ left: '0%' }}
              />
            </div>

            <div className="relative mt-12 h-24">
              {STAGES.map(({ caption }) => (
                <p
                  key={caption}
                  data-caption
                  className="absolute inset-x-0 mx-auto max-w-xl text-center text-lg text-muted-foreground"
                >
                  {td(`pipeline.${caption}`)}
                </p>
              ))}
            </div>
          </div>

          {/* Mobile: vertical stage list, each with its own caption */}
          <ol className="relative space-y-6 lg:hidden">
            <div className="absolute bottom-2 left-[9px] top-2 w-px bg-border/60" />
            {STAGES.map(({ key, caption }) => (
              <li key={key} data-fade className="relative flex gap-4">
                <span className="relative z-10 mt-0.5 h-[18px] w-[18px] shrink-0 rounded-full border-2 border-primary bg-primary/30" />
                <div>
                  <p className="text-sm font-semibold text-foreground">{td(`pipeline.${key}`)}</p>
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
