/* eslint-disable @next/next/no-img-element -- static exported screenshots */
import { useTranslations } from 'next-intl';
import { LayoutDashboard, Users, Wallet, CalendarDays, Megaphone, ListChecks } from 'lucide-react';
import { SceneStep, BrowserFrame } from '../parts';
import { ASSET } from '../tokens';

/** The six stations of the guided product tour — real captures of the public demo. */
export const TOUR_STOPS = [
  { key: 'dashboard', img: 'dashboard.png', icon: LayoutDashboard, url: 'app.afterhive.de' },
  { key: 'members', img: 'mitglieder.png', icon: Users, url: 'app.afterhive.de/mitglieder' },
  { key: 'cashbook', img: 'kassenbuch.png', icon: Wallet, url: 'app.afterhive.de/kassenbuch' },
  { key: 'calendar', img: 'kalender.png', icon: CalendarDays, url: 'app.afterhive.de/kalender' },
  {
    key: 'communication',
    img: 'kommunikation.png',
    icon: Megaphone,
    url: 'app.afterhive.de/kommunikation',
  },
  { key: 'tasks', img: 'aufgaben.png', icon: ListChecks, url: 'app.afterhive.de/aufgaben' },
] as const;

/** Annotation callouts that pop on the two marquee stops, positioned over the frame. */
const CALLOUTS = [
  { stop: 0, key: 'dashboard', pos: 'right-[9%] top-[21%]' },
  { stop: 2, key: 'cashbook', pos: 'right-[7%] top-[17%]' },
] as const;

/**
 * Signature scene: a guided click-through. On desktop the browser chrome stays
 * put while the app is "used" — the URL bar updates, the active tab travels,
 * and each screen slides in from the right as if you clicked it, with callouts
 * popping on the marquee stops. On mobile the stops simply stack.
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

          {/* ---- Desktop: persistent chrome, the app being driven ---- */}
          <div className="hidden lg:block">
            <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
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

            <div className="mt-8 grid grid-cols-[0.72fr_1.5fr] items-center gap-10">
              {/* Text panel — one block per stop, crossfading. */}
              <div className="relative min-h-[15rem]">
                {TOUR_STOPS.map(({ key }, i) => (
                  <div
                    key={key}
                    data-tour-text={i}
                    className={`absolute inset-0 ${i > 0 ? 'opacity-0' : ''}`}
                  >
                    <h3 className="font-display text-2xl font-bold text-foreground">
                      {td(`tour.${key}.title`)}
                    </h3>
                    <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">
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
                ))}
              </div>

              {/* Persistent browser frame. */}
              <div className="overflow-hidden rounded-xl border border-white/10 bg-[#0b0e13] shadow-[0_30px_80px_-20px_rgba(0,0,0,0.85)] ring-1 ring-white/[0.03]">
                <div className="flex items-center gap-2 border-b border-white/10 bg-black/50 px-3.5 py-2.5">
                  <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
                  <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
                  <span className="h-3 w-3 rounded-full bg-[#28c840]" />
                  <span className="relative mx-auto h-6 w-full max-w-[70%] overflow-hidden rounded-md bg-white/[0.06]">
                    {TOUR_STOPS.map(({ key, url }, i) => (
                      <span
                        key={key}
                        data-tour-url={i}
                        className={`absolute inset-0 flex items-center justify-center font-mono text-[11px] text-muted-foreground ${
                          i > 0 ? 'opacity-0' : ''
                        }`}
                      >
                        {url}
                      </span>
                    ))}
                  </span>
                </div>
                {/* Screen viewport — screens slide horizontally. */}
                <div className="relative aspect-[1600/1000] overflow-hidden">
                  {TOUR_STOPS.map(({ key, img }, i) => (
                    <img
                      key={key}
                      data-tour-screen={i}
                      src={ASSET(img)}
                      alt={td(`tour.${key}.title`)}
                      className={`absolute inset-0 h-full w-full object-cover object-top ${
                        i > 0 ? 'opacity-0' : ''
                      }`}
                    />
                  ))}
                  {CALLOUTS.map(({ stop, key, pos }) => (
                    <span
                      key={stop}
                      data-tour-callout={stop}
                      className={`absolute ${pos} flex items-center gap-2 rounded-lg border border-accent-violet/40 bg-[#0b0e13]/90 px-3 py-1.5 text-[11px] font-medium text-white opacity-0 shadow-lg backdrop-blur`}
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-accent-violet" />
                      {td(`tour.${key}.callout`)}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ---- Mobile: stacked stops ---- */}
          <div className="mt-10 flex flex-col gap-16 lg:hidden">
            {TOUR_STOPS.map(({ key, img, icon: Icon }) => (
              <div key={key}>
                <span className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/[0.05]">
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
                <div className="mt-6">
                  <BrowserFrame src={ASSET(img)} alt={td(`tour.${key}.title`)} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
