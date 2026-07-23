import { useTranslations } from 'next-intl';
import { LayoutDashboard, Users, Inbox, CalendarDays, Megaphone, ListChecks } from 'lucide-react';
import { SceneStep, BrowserFrame } from '../parts';
import { ASSET } from '../tokens';

/** The six stations of the guided product tour — real captures of the public demo. */
export const TOUR_STOPS = [
  { key: 'dashboard', img: 'dashboard.png', icon: LayoutDashboard },
  { key: 'members', img: 'mitglieder.png', icon: Users },
  { key: 'applications', img: 'anfragen.png', icon: Inbox },
  { key: 'calendar', img: 'kalender.png', icon: CalendarDays },
  { key: 'communication', img: 'kommunikation.png', icon: Megaphone },
  { key: 'tasks', img: 'aufgaben.png', icon: ListChecks },
] as const;

/**
 * Signature scene: a pinned product tour. On desktop the stage is pinned and
 * the stops crossfade as you scroll; on mobile the stops simply stack.
 */
export function TourScene() {
  const td = useTranslations('projects.afterhiveDetail');

  return (
    <section data-scene="tour" className="relative px-4 py-20 lg:py-0">
      <div data-pin="tour" className="lg:flex lg:h-screen lg:flex-col lg:justify-center">
        <div className="mx-auto w-full max-w-6xl">
          <div className="text-center">
            <SceneStep>{td('tour.step')}</SceneStep>
            <h2 className="mx-auto max-w-2xl font-display text-3xl font-bold tracking-tight text-foreground md:text-5xl">
              {td('tour.heading')}
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm text-muted-foreground md:text-base">
              {td('tour.sub')}
            </p>
          </div>

          {/* Stop labels — active one is highlighted by the scroll timeline. */}
          <div className="mt-8 hidden flex-wrap items-center justify-center gap-2 lg:flex">
            {TOUR_STOPS.map(({ key, icon: Icon }, i) => (
              <span
                key={key}
                data-tour-tab={i}
                className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-1.5 text-xs font-medium text-foreground"
              >
                <Icon className="h-3.5 w-3.5 text-accent-violet" />
                {td(`tour.${key}.title`)}
              </span>
            ))}
          </div>

          {/* Stage: stacked layers on desktop, stacked flow on mobile. */}
          <div className="relative mt-10 lg:mt-8 lg:min-h-[540px]">
            {TOUR_STOPS.map(({ key, img, icon: Icon }, i) => (
              <div
                key={key}
                data-tour-stop={i}
                className="mb-16 grid items-center gap-6 last:mb-0 lg:absolute lg:inset-0 lg:mb-0 lg:grid-cols-[0.75fr_1.5fr] lg:gap-10"
              >
                <div>
                  <span className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/[0.05] lg:hidden">
                    <Icon className="h-5 w-5 text-accent-violet" />
                  </span>
                  <h3 className="font-display text-xl font-bold text-foreground md:text-2xl">
                    {td(`tour.${key}.title`)}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground md:text-[15px]">
                    {td(`tour.${key}.desc`)}
                  </p>
                  <ul className="mt-5 flex flex-wrap gap-2">
                    {(['f1', 'f2', 'f3'] as const).map(f => (
                      <li
                        key={f}
                        className="rounded-full border border-accent-violet/25 bg-accent-violet/[0.08] px-3 py-1 text-xs font-medium text-foreground/90"
                      >
                        {td(`tour.${key}.${f}`)}
                      </li>
                    ))}
                  </ul>
                </div>
                <BrowserFrame src={ASSET(img)} alt={td(`tour.${key}.title`)} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
