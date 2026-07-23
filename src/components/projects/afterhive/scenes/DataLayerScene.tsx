import { useTranslations } from 'next-intl';
import { Monitor, Server, ShieldCheck, Database, Ban } from 'lucide-react';
import { SceneStep, GlassCard } from '../parts';

const ROWS = [
  { name: 'Anna Berger', division: 'Turnen', own: true },
  { name: 'Jonas Wolf', division: 'Turnen', own: true },
  { name: 'Lea Sommer', division: 'Fußball', own: false },
  { name: 'Tim Brandt', division: 'Handball', own: false },
];

export function DataLayerScene() {
  const td = useTranslations('projects.afterhiveDetail');
  const steps = [
    { icon: Monitor, label: 'React UI' },
    { icon: Server, label: 'Fastify API' },
    { icon: ShieldCheck, label: 'ZenStack Policies', accent: true },
    { icon: Database, label: 'Postgres' },
  ];

  return (
    <section data-scene="datalayer" className="relative px-4 py-20 md:py-28">
      <div className="mx-auto w-full max-w-5xl">
        <div className="text-center lg:text-left">
          <SceneStep>{td('datalayer.step')}</SceneStep>
          <h2
            data-fade
            className="font-display text-3xl font-bold tracking-tight text-foreground md:text-5xl"
          >
            {td('datalayer.heading')}
          </h2>
          <p
            data-fade
            className="mx-auto mt-3 max-w-2xl text-sm text-muted-foreground md:text-base lg:mx-0"
          >
            {td('datalayer.sub')}
          </p>
        </div>

        <div className="mt-8 grid items-stretch gap-4 lg:grid-cols-2">
          {/* request flow */}
          <GlassCard className="p-6" data-fade>
            <div className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
              {td('datalayer.flowTitle')}
            </div>
            <div className="mt-5 flex flex-col gap-2">
              {steps.map((s, i) => (
                <div key={s.label} className="flex flex-col">
                  <div
                    className={`flex items-center gap-3 rounded-xl border px-4 py-3 ${
                      s.accent
                        ? 'border-accent-violet/50 bg-accent-violet/10'
                        : 'border-border/50 bg-background/40'
                    }`}
                  >
                    <s.icon
                      className={`h-4 w-4 shrink-0 ${s.accent ? 'text-accent-violet' : 'text-muted-foreground'}`}
                    />
                    <span className="font-mono text-sm text-foreground">{s.label}</span>
                    {s.accent ? (
                      <span className="ml-auto rounded-full border border-accent-violet/40 px-2 py-0.5 font-mono text-[10px] uppercase text-accent-violet">
                        enhanced client
                      </span>
                    ) : null}
                  </div>
                  {i < steps.length - 1 ? <div className="mx-auto h-3 w-px bg-border/60" /> : null}
                </div>
              ))}
            </div>
            <div className="mt-4 flex items-center gap-2.5 rounded-xl border border-red-500/25 bg-red-500/[0.06] px-4 py-2.5 text-xs text-muted-foreground">
              <Ban className="h-4 w-4 shrink-0 text-red-400" />
              {td('datalayer.lintRule')}
            </div>
          </GlassCard>

          {/* rows stripped for a Trainer */}
          <GlassCard className="p-6" data-fade>
            <div className="flex items-center justify-between font-mono text-xs uppercase tracking-widest text-muted-foreground">
              <span>{td('datalayer.queryTitle')}</span>
              <span className="rounded-full border border-border/60 px-2 py-0.5 text-[10px]">
                {td('datalayer.roleTrainer')}
              </span>
            </div>
            <div className="mt-5 space-y-2">
              {ROWS.map(r => (
                <div
                  key={r.name}
                  data-dl-row
                  data-own={r.own ? '' : undefined}
                  className={`flex items-center justify-between rounded-lg border px-3.5 py-2.5 text-sm ${
                    r.own
                      ? 'border-border/50 bg-background/40 text-foreground'
                      : 'border-red-500/20 bg-red-500/[0.04] text-muted-foreground/60 line-through'
                  }`}
                >
                  <span>{r.name}</span>
                  <span className="font-mono text-xs">{r.division}</span>
                </div>
              ))}
            </div>
            <p className="mt-4 text-xs text-muted-foreground">{td('datalayer.queryNote')}</p>
          </GlassCard>
        </div>
      </div>
    </section>
  );
}
