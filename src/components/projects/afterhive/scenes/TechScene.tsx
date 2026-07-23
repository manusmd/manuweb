import { useTranslations } from 'next-intl';
import { Building2, Server, ShieldCheck } from 'lucide-react';
import type { Project } from '@/types/project';
import { SceneStep, GlassCard } from '../parts';

const FACTS = [
  { key: 'tenant', icon: Building2 },
  { key: 'host', icon: Server },
  { key: 'rules', icon: ShieldCheck },
] as const;

/** The "slightly technical" strip: three facts and the stack — no diagrams. */
export function TechScene({ project }: { project: Project }) {
  const td = useTranslations('projects.afterhiveDetail');

  return (
    <section data-scene="tech" className="relative px-4 py-20 md:py-24">
      <div className="mx-auto w-full max-w-5xl">
        <div className="text-center">
          <SceneStep>{td('tech.step')}</SceneStep>
          <h2 className="mx-auto max-w-2xl font-display text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            {td('tech.heading')}
          </h2>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {FACTS.map(({ key, icon: Icon }) => (
            <GlassCard key={key} className="p-5" data-fade>
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-accent-violet/[0.12]">
                <Icon className="h-5 w-5 text-accent-violet" />
              </span>
              <h3 className="mt-4 font-display text-base font-bold text-foreground">
                {td(`tech.${key}.title`)}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {td(`tech.${key}.desc`)}
              </p>
            </GlassCard>
          ))}
        </div>

        <div data-fade className="mt-8 flex flex-wrap items-center justify-center gap-2">
          {(project.tech ?? []).map(t => (
            <span
              key={t}
              className="rounded-full border border-border/60 bg-background/40 px-3.5 py-1.5 font-mono text-xs text-muted-foreground"
            >
              {t}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
