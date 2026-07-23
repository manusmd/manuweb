import { useTranslations } from 'next-intl';
import { SceneStep } from '../parts';
import { DEMO } from '../tokens';

const STATS = [
  { value: DEMO.models.length, key: 'models' },
  { value: DEMO.modules.length, key: 'modules' },
  { value: DEMO.roleOrder.length, key: 'roles' },
  { value: DEMO.docs.length, key: 'docs' },
] as const;

export function DomainScene() {
  const td = useTranslations('projects.afterhiveDetail');

  return (
    <section data-scene="domain" className="relative px-4 py-20 md:py-28">
      <div className="mx-auto w-full max-w-5xl">
        <div className="text-center">
          <SceneStep>{td('domain.step')}</SceneStep>
          <h2
            data-fade
            className="mx-auto max-w-2xl font-display text-3xl font-bold tracking-tight text-foreground md:text-5xl"
          >
            {td('domain.heading')}
          </h2>
          <p data-fade className="mx-auto mt-3 max-w-xl text-sm text-muted-foreground md:text-base">
            {td('domain.sub')}
          </p>
        </div>

        <div data-fade className="mx-auto mt-8 grid max-w-3xl grid-cols-2 gap-3 sm:grid-cols-4">
          {STATS.map(s => (
            <div
              key={s.key}
              className="rounded-xl border border-border/50 bg-card/40 p-4 text-center"
            >
              <div className="font-mono text-3xl font-bold text-accent-violet">
                <span data-dm-count data-to={s.value}>
                  0
                </span>
              </div>
              <div className="mt-1 text-xs uppercase tracking-widest text-muted-foreground">
                {td(`domain.${s.key}`)}
              </div>
            </div>
          ))}
        </div>

        {/* the real Prisma models, straight from schema.zmodel */}
        <div data-fade className="mx-auto mt-8 flex max-w-4xl flex-wrap justify-center gap-1.5">
          {DEMO.models.map(m => (
            <span
              key={m}
              data-dm-chip
              className="rounded-md border border-border/50 bg-muted/30 px-2 py-0.5 font-mono text-[11px] text-muted-foreground"
            >
              {m}
            </span>
          ))}
        </div>
        <p data-fade className="mt-4 text-center font-mono text-xs text-muted-foreground">
          {td('domain.source')}
        </p>
      </div>
    </section>
  );
}
