import { useTranslations } from 'next-intl';
import { Receipt, CircleCheck } from 'lucide-react';
import { SceneStep, GlassCard, BrowserFrame } from '../parts';
import { ASSET } from '../tokens';

/**
 * Dues get their own scene: a dues run animating in front of the real
 * Beiträge screen — invoice counter and open-items sum count up on enter,
 * the progress bar is scrubbed by scroll.
 */
export function DuesScene() {
  const td = useTranslations('projects.afterhiveDetail');

  return (
    <section data-scene="dues" className="relative px-4 py-20 md:py-28">
      <div className="mx-auto w-full max-w-6xl">
        <div className="grid items-center gap-10 lg:grid-cols-[0.8fr_1.4fr]">
          <div>
            <SceneStep>{td('dues.step')}</SceneStep>
            <h2 className="font-display text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              {td('dues.heading')}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground md:text-base">
              {td('dues.sub')}
            </p>

            <GlassCard className="mt-8 p-5" data-fade>
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-2 text-sm font-semibold text-foreground">
                  <Receipt className="h-4 w-4 text-accent-violet" />
                  {td('dues.runTitle')}
                </span>
                <span
                  data-dues-done
                  className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-2.5 py-1 text-[11px] font-medium text-emerald-300"
                >
                  <CircleCheck className="h-3.5 w-3.5" />
                  {td('dues.statusDone')}
                </span>
              </div>
              <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/[0.06]">
                <div
                  data-dues-bar
                  className="h-full w-full origin-left rounded-full bg-gradient-to-r from-accent-violet to-primary"
                />
              </div>
              <dl className="mt-5 grid grid-cols-2 gap-4">
                <div>
                  <dd className="font-display text-2xl font-bold text-accent-violet md:text-3xl">
                    <span data-dues-count data-to="320">
                      0
                    </span>
                  </dd>
                  <dt className="mt-1 text-xs text-muted-foreground">{td('dues.invoicesLabel')}</dt>
                </div>
                <div>
                  <dd className="font-display text-2xl font-bold text-foreground md:text-3xl">
                    <span data-dues-count data-to="5409" data-suffix=" €">
                      0
                    </span>
                  </dd>
                  <dt className="mt-1 text-xs text-muted-foreground">{td('dues.openLabel')}</dt>
                </div>
              </dl>
            </GlassCard>
            <p data-fade className="mt-4 text-xs text-muted-foreground/80">
              {td('dues.note')}
            </p>
          </div>

          <div data-fade>
            <BrowserFrame src={ASSET('beitraege.png')} alt={td('dues.heading')} />
          </div>
        </div>
      </div>
    </section>
  );
}
