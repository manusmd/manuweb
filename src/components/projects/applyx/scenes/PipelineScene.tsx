import { useTranslations } from 'next-intl';
import { SceneStep } from '@/components/projects/applyx/SceneParts';

export function PipelineScene() {
  const td = useTranslations('projects.applyxDetail');

  return (
    <section data-scene="pipeline" className="relative">
      <div
        data-pin="pipeline"
        className="flex min-h-[100svh] flex-col justify-center border-t border-border/30 px-4 py-16"
      >
        <div className="mx-auto w-full max-w-4xl">
          <SceneStep>{td('pipeline.step')}</SceneStep>
          <h2 className="mb-12 font-display text-3xl font-bold tracking-tight text-foreground md:text-5xl">
            {td('pipeline.heading')}
          </h2>

          <div className="relative">
            <div className="relative flex justify-between">
              {(
                [
                  ['stageApplied', '0%'],
                  ['stageReview', '33.33%'],
                  ['stageInterview', '66.66%'],
                  ['stageOffer', '100%'],
                ] as const
              ).map(([key, pos]) => (
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
                      boxShadow: 'calc(var(--lit) * 12px) 0 0 transparent',
                      opacity: 'calc(0.4 + var(--lit) * 0.6)',
                    }}
                  />
                  <span className="text-xs font-medium text-muted-foreground md:text-sm">
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
              {(
                ['captionApplied', 'captionReview', 'captionInterview', 'captionOffer'] as const
              ).map(key => (
                <p
                  key={key}
                  data-caption
                  className="absolute inset-x-0 mx-auto max-w-xl text-center text-base text-muted-foreground md:text-lg"
                >
                  {td(`pipeline.${key}`)}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
