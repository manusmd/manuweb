import { useTranslations } from 'next-intl';
import { Sparkles } from 'lucide-react';
import { SceneStep, StatTile } from '@/components/projects/applyx/SceneParts';

export function StatsScene() {
  const td = useTranslations('projects.applyxDetail');

  return (
    <section data-scene="stats" className="relative border-t border-border/30 px-4 py-24">
      <div className="mx-auto w-full max-w-5xl">
        <SceneStep>{td('stats.step')}</SceneStep>
        <h2
          data-fade
          className="mb-12 font-display text-3xl font-bold tracking-tight text-foreground md:text-5xl"
        >
          {td('stats.heading')}
        </h2>

        <div className="grid gap-4 sm:grid-cols-3">
          <StatTile value={342} label={td('stats.applications')} />
          <StatTile value={41} suffix="%" label={td('stats.replyRate')} accent="violet" />
          <StatTile value={18} label={td('stats.interviews')} accent="green" />
        </div>

        {/* Funnel */}
        <div className="mt-6 flex items-end justify-center gap-4 rounded-2xl border border-border/40 bg-card/40 p-8">
          {[1, 0.62, 0.34, 0.12].map((h, i) => (
            <div key={i} className="flex flex-1 flex-col items-center gap-2">
              <div className="flex h-48 w-full items-end">
                <div
                  data-bar={h}
                  className="w-full origin-bottom scale-y-0 rounded-t-lg bg-gradient-to-t from-primary/40 to-primary"
                  style={{ height: `${h * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Wrapped teaser */}
        <div
          data-wrapped
          data-fade
          className="mt-6 flex flex-col items-center justify-between gap-4 rounded-2xl border border-accent-violet/30 bg-gradient-to-br from-accent-violet/10 to-primary/5 p-8 text-center sm:flex-row sm:text-left"
        >
          <div className="flex items-center gap-3">
            <Sparkles className="h-6 w-6 text-accent-violet" />
            <span className="font-display text-xl font-bold text-foreground">
              {td('stats.wrapped')}
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span
              data-count-to="4.2"
              data-count-decimals="1"
              className="font-display text-4xl font-bold text-primary"
            >
              0.0
            </span>
            <span className="text-sm text-muted-foreground">{td('stats.medianReply')}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
