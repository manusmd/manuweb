/* eslint-disable @next/next/no-img-element -- static exported screenshots */
import { useTranslations } from 'next-intl';
import { Rocket } from 'lucide-react';
import { SceneStep } from '../parts';
import { ASSET } from '../tokens';

const STEPS = ['s1', 's2', 's3'] as const;

/**
 * The club website gets its own pinned scene: the editor turns into the
 * published site — the URL bar flips from the app to the public address and
 * the builder capture crossfades into the live page on "publish".
 */
export function WebsiteScene() {
  const td = useTranslations('projects.afterhiveDetail');

  return (
    <section data-scene="website" className="relative px-4 py-20 lg:py-0">
      <div data-pin="website">
        <div className="mx-auto w-full max-w-6xl lg:flex lg:min-h-screen lg:flex-col lg:justify-center lg:py-16">
          <div className="text-center">
            <SceneStep>{td('website.step')}</SceneStep>
            <h2 className="mx-auto max-w-2xl font-display text-3xl font-bold tracking-tight text-foreground md:text-5xl">
              {td('website.heading')}
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm text-muted-foreground md:text-base">
              {td('website.sub')}
            </p>
          </div>

          <div className="mt-10 grid items-center gap-8 lg:grid-cols-[0.7fr_1.5fr]">
            {/* The three steps — highlighted in order by the timeline. */}
            <ol className="flex flex-col gap-4">
              {STEPS.map((s, i) => (
                <li
                  key={s}
                  data-ws-step={i}
                  className="rounded-2xl border border-white/10 bg-white/[0.03] p-4"
                >
                  <span className="font-mono text-xs font-semibold text-accent-violet">
                    0{i + 1}
                  </span>
                  <h3 className="mt-1 font-display text-base font-bold text-foreground">
                    {td(`website.${s}t`)}
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                    {td(`website.${s}d`)}
                  </p>
                </li>
              ))}
            </ol>

            {/* Browser frame with flipping URL + crossfading builder → live site. */}
            <div className="overflow-hidden rounded-xl border border-white/10 bg-[#0b0e13] shadow-[0_30px_80px_-20px_rgba(0,0,0,0.85)] ring-1 ring-white/[0.03]">
              <div className="flex items-center gap-2 border-b border-white/10 bg-black/50 px-3.5 py-2.5">
                <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
                <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
                <span className="h-3 w-3 rounded-full bg-[#28c840]" />
                <span className="relative mx-auto h-6 w-full max-w-[70%] overflow-hidden rounded-md bg-white/[0.06]">
                  <span
                    data-ws-url="0"
                    className="absolute inset-0 flex items-center justify-center font-mono text-[11px] text-muted-foreground"
                  >
                    app.afterhive.de/website
                  </span>
                  <span
                    data-ws-url="1"
                    className="absolute inset-0 flex items-center justify-center font-mono text-[11px] text-emerald-300"
                  >
                    afterhive.de/c/tsv-demofingen
                  </span>
                </span>
                <span
                  data-ws-online
                  className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-2.5 py-0.5 text-[11px] font-medium text-emerald-300"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  {td('website.online')}
                </span>
              </div>
              <div className="relative">
                <img
                  data-ws-img="0"
                  src={ASSET('website.png')}
                  alt={td('website.s2t')}
                  className="block w-full"
                />
                <img
                  data-ws-img="1"
                  src={ASSET('public_site.png')}
                  alt={td('website.s3t')}
                  className="absolute inset-0 block h-full w-full object-cover"
                />
                {/* Publish moment: chip pulses mid-scroll, then the site goes live. */}
                <span
                  data-ws-publish
                  className="absolute right-4 top-4 inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-lg"
                >
                  <Rocket className="h-4 w-4" />
                  {td('website.publish')}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
