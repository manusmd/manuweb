import { useTranslations } from 'next-intl';
import { Check, X, Dumbbell } from 'lucide-react';
import { SceneStep, GlassCard } from '../parts';

/**
 * Attendance gets its own pinned scene: a recreated training check-in where
 * the members get ticked off one by one as you scroll and the counter climbs.
 * Names echo the demo club (including Nina Kessler, freshly admitted in the
 * Anfragen tour stop).
 */
const ROSTER = [
  { name: 'Emre Kaya', present: true },
  { name: 'Lea Lang', present: true },
  { name: 'Tim Meyer', present: false },
  { name: 'Miriam Vogel', present: true },
  { name: 'Ben Frank', present: true },
  { name: 'Nina Kessler', present: true },
] as const;

export function AttendanceScene() {
  const td = useTranslations('projects.afterhiveDetail');

  return (
    <section data-scene="attendance" className="relative px-4 py-20 lg:py-0">
      <div data-pin="attendance" className="lg:flex lg:h-screen lg:flex-col lg:justify-center">
        <div className="mx-auto grid w-full max-w-5xl items-center gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <SceneStep>{td('attendance.step')}</SceneStep>
            <h2 className="font-display text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              {td('attendance.heading')}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground md:text-base">
              {td('attendance.sub')}
            </p>
            <p className="mt-6 text-xs text-muted-foreground/80">{td('attendance.note')}</p>
          </div>

          <GlassCard className="p-5 md:p-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <span className="inline-flex items-center gap-2 text-sm font-semibold text-foreground">
                <Dumbbell className="h-4 w-4 text-accent-violet" />
                {td('attendance.session')}
              </span>
              <span className="rounded-full border border-accent-violet/25 bg-accent-violet/[0.08] px-3 py-1 font-mono text-xs text-foreground">
                <span data-att-num>0</span> {td('attendance.countSuffix')}
              </span>
            </div>
            <ul className="mt-2 divide-y divide-white/[0.06]">
              {ROSTER.map(({ name, present }, i) => (
                <li key={name} data-att-row={i} className="flex items-center justify-between py-3">
                  <span className="flex items-center gap-3">
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-accent-violet/[0.14] font-mono text-[11px] font-semibold text-accent-violet">
                      {name
                        .split(' ')
                        .map(p => p[0])
                        .join('')}
                    </span>
                    <span className="text-sm text-foreground">{name}</span>
                  </span>
                  <span
                    data-att-check
                    data-present={present ? 'true' : undefined}
                    className={`inline-flex h-6 w-6 items-center justify-center rounded-full ${
                      present
                        ? 'bg-emerald-400/15 text-emerald-300 ring-1 ring-emerald-400/40'
                        : 'bg-red-400/10 text-red-300 ring-1 ring-red-400/30'
                    }`}
                  >
                    {present ? <Check className="h-3.5 w-3.5" /> : <X className="h-3.5 w-3.5" />}
                  </span>
                </li>
              ))}
            </ul>
          </GlassCard>
        </div>
      </div>
    </section>
  );
}
