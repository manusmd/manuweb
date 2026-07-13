import { useLocale, useTranslations } from 'next-intl';
import { SceneStep, TeamBadge } from '../parts';
import { DEMO, teamName } from '../tokens';

const title = DEMO.sim.title;
const MAXPCT = Math.max(...title.map(t => t.pct));

export function MonteCarloScene() {
  const td = useTranslations('projects.pitchlabDetail');
  const locale = useLocale();

  return (
    <section data-scene="montecarlo" className="relative">
      <div
        data-pin="montecarlo"
        className="flex flex-col justify-center px-4 py-14 lg:min-h-[100svh]"
      >
        <div className="mx-auto w-full max-w-4xl">
          <div className="grid items-center gap-6 lg:grid-cols-[auto_1fr]">
            <div>
              <SceneStep>{td('montecarlo.step')}</SceneStep>
              <h2 className="font-display text-3xl font-bold tracking-tight text-foreground md:text-4xl">
                {td('montecarlo.heading')}
              </h2>
              <p className="mt-3 max-w-sm text-sm text-muted-foreground md:text-base">
                {td('montecarlo.sub')}
              </p>
              <div className="mt-5 rounded-xl border border-primary/30 bg-primary/5 px-5 py-4">
                <div className="font-mono text-4xl font-bold tracking-tight text-primary">
                  <span data-mc-iter>0</span>
                </div>
                <div className="mt-1 text-xs uppercase tracking-widest text-muted-foreground">
                  {td('montecarlo.simulations')}
                </div>
              </div>
            </div>

            {/* title-odds bars */}
            <div className="space-y-2.5">
              <div className="mb-1 flex items-center justify-between px-1 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                <span>{td('montecarlo.team')}</span>
                <span>{td('montecarlo.titleOdds')}</span>
              </div>
              {title.map(t => (
                <div key={t.code} className="flex items-center gap-3">
                  <TeamBadge team={t} size="sm" />
                  <span className="w-24 shrink-0 truncate text-sm font-medium text-foreground">
                    {teamName(t, locale)}
                  </span>
                  <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-muted">
                    <div
                      data-mc-bar
                      className="h-full origin-left rounded-full"
                      style={{ width: `${(t.pct / MAXPCT) * 100}%`, backgroundColor: t.bg }}
                    />
                  </div>
                  <span
                    data-mc-pct
                    data-to={t.pct}
                    className="w-14 shrink-0 text-right font-mono text-sm font-semibold text-foreground"
                  >
                    0%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
