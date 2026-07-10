import { useTranslations } from 'next-intl';
import {
  AlarmClock,
  CopyCheck,
  ListTodo,
  Sparkles,
  Tags,
  TrendingDown,
  type LucideIcon,
} from 'lucide-react';
import { SceneStep } from '@/components/projects/applyx/SceneParts';

const FEATURES: { key: string; icon: LucideIcon; accent: string }[] = [
  { key: 'queue', icon: ListTodo, accent: 'text-primary' },
  { key: 'digest', icon: Sparkles, accent: 'text-accent-violet' },
  { key: 'rejections', icon: TrendingDown, accent: 'text-red-400' },
  { key: 'urgency', icon: AlarmClock, accent: 'text-accent-green' },
  { key: 'dedup', icon: CopyCheck, accent: 'text-primary' },
  { key: 'enrich', icon: Tags, accent: 'text-accent-violet' },
];

export function AssistantScene() {
  const td = useTranslations('projects.applyxDetail');

  return (
    <section data-scene="assistant" className="relative px-4 py-24">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-8">
        <div>
          <SceneStep>{td('assistant.step')}</SceneStep>
          <h2
            data-fade
            className="mb-3 font-display text-3xl font-bold tracking-tight text-foreground md:text-5xl"
          >
            {td('assistant.heading')}
          </h2>
          <p data-fade className="max-w-2xl text-base text-muted-foreground md:text-lg">
            {td('assistant.sub')}
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map(({ key, icon: Icon, accent }) => (
            <div
              key={key}
              data-asst-card
              className="group rounded-2xl border border-border/40 bg-card/50 p-5 ring-1 ring-white/[0.04] backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-[0_24px_60px_-24px_hsl(var(--primary)/0.35)]"
            >
              <div className="flex items-center justify-between">
                <div
                  data-asst-icon
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-border/50 bg-background/50"
                >
                  <Icon className={`h-5 w-5 ${accent}`} />
                </div>
                {key === 'queue' ? (
                  <span className="inline-flex items-center gap-1 rounded-full border border-primary/30 bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
                    <span data-asst-count>3</span> {td('assistant.queueBadge')}
                  </span>
                ) : null}
              </div>
              <h3 className="mt-4 font-display text-lg font-bold text-foreground">
                {td(`assistant.${key}Title`)}
              </h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                {td(`assistant.${key}Desc`)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
