import { useLocale, useTranslations } from 'next-intl';
import { SceneStep, TeamBadge } from '../parts';
import { DEMO, teamName } from '../tokens';

const ATK = '#4f7cff';
const DEF = '#22c55e';

export function StrengthsScene() {
  const td = useTranslations('projects.pitchlabDetail');
  const locale = useLocale();
  const rows = DEMO.strengths;

  return (
    <section data-scene="strengths" className="relative">
      <div
        data-pin="strengths"
        className="flex flex-col justify-center px-4 py-14 lg:min-h-[100svh]"
      >
        <div className="mx-auto w-full max-w-4xl">
          <div className="text-center lg:text-left">
            <SceneStep>{td('strengths.step')}</SceneStep>
            <h2 className="font-display text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              {td('strengths.heading')}
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm text-muted-foreground md:text-base lg:mx-0">
              {td('strengths.sub')}
            </p>
          </div>

          <div className="mt-6 space-y-2">
            <div className="grid grid-cols-[1fr_auto] items-center gap-4 px-4 font-mono text-[10px] uppercase tracking-widest text-muted-foreground sm:grid-cols-[minmax(0,1.6fr)_1fr_1fr_auto]">
              <span>{td('strengths.team')}</span>
              <span className="hidden sm:block" style={{ color: ATK }}>
                {td('strengths.attack')}
              </span>
              <span className="hidden sm:block" style={{ color: DEF }}>
                {td('strengths.defence')}
              </span>
              <span className="text-right">Elo</span>
            </div>
            {rows.map(r => (
              <div
                key={r.code}
                className="grid grid-cols-[1fr_auto] items-center gap-4 rounded-xl border border-border/50 bg-card/40 px-4 py-2.5 sm:grid-cols-[minmax(0,1.6fr)_1fr_1fr_auto]"
              >
                <div className="flex items-center gap-3">
                  <TeamBadge team={r} size="sm" />
                  <span className="truncate text-sm font-medium text-foreground">
                    {teamName(r, locale)}
                  </span>
                </div>
                {(
                  [
                    ['atk', r.attack, ATK],
                    ['def', r.defence, DEF],
                  ] as const
                ).map(([k, val, color]) => (
                  <div key={k} className="hidden items-center gap-2 sm:flex">
                    <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
                      <div
                        data-str-bar
                        className="h-full origin-left rounded-full"
                        style={{ width: `${val}%`, backgroundColor: color }}
                      />
                    </div>
                    <span className="w-6 text-right font-mono text-xs text-muted-foreground">
                      {val}
                    </span>
                  </div>
                ))}
                <span className="text-right font-mono text-sm font-semibold text-foreground">
                  {r.elo}
                </span>
              </div>
            ))}
          </div>
          <p className="mt-4 text-center font-mono text-xs text-muted-foreground lg:text-left">
            {td('strengths.note')}
          </p>
        </div>
      </div>
    </section>
  );
}
