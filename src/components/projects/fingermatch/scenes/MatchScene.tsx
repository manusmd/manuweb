import { useTranslations } from 'next-intl';
import { SceneStep, BrowserFrame } from '../parts';
import { ASSET } from '../tokens';

export function MatchScene() {
  const td = useTranslations('projects.fingermatchDetail');

  return (
    <section data-scene="match" className="relative px-4 py-20 md:py-28">
      <div className="mx-auto w-full max-w-5xl">
        <div className="text-center lg:text-left">
          <SceneStep>{td('match.step')}</SceneStep>
          <h2 className="font-display text-3xl font-bold tracking-tight text-foreground md:text-5xl">
            {td('match.heading')}
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-muted-foreground md:text-base lg:mx-0">
            {td('match.sub')}
          </p>
        </div>

        {/* The real match view */}
        <div data-fade className="mt-8">
          <BrowserFrame src={ASSET('app-match.png')} alt="FingerMatch — matched prints">
            <div data-fm-scan className="pointer-events-none absolute inset-x-0 top-0 h-full">
              <div className="h-16 w-full bg-gradient-to-b from-primary/25 to-transparent" />
              <div className="-mt-px h-px w-full bg-primary/70 shadow-[0_0_20px_2px_hsl(var(--primary))]" />
            </div>
          </BrowserFrame>
        </div>

        {/* The verdict — real result panel */}
        <div data-fade className="mt-6 rounded-xl border border-white/10 bg-card/40 p-3 sm:p-4">
          {/* eslint-disable-next-line @next/next/no-img-element -- static exported screenshot */}
          <img
            src={ASSET('app-result.png')}
            alt="Match score and per-type breakdown"
            className="block w-full rounded-lg"
          />
        </div>
        <p data-fade className="mt-4 text-center text-xs text-muted-foreground lg:text-left">
          {td('match.note')}
        </p>
      </div>
    </section>
  );
}
