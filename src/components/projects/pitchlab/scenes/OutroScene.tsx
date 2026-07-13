import { useTranslations } from 'next-intl';
import { Check, X, ExternalLink, Github } from 'lucide-react';
import type { Project } from '@/types/project';
import { SceneStep } from '../parts';

export function OutroScene({ project }: { project: Project }) {
  const t = useTranslations('projects');
  const td = useTranslations('projects.pitchlabDetail');

  return (
    <section data-scene="outro" className="relative px-4 py-24">
      <div className="mx-auto w-full max-w-3xl text-center">
        <SceneStep>{td('outro.step')}</SceneStep>
        <h2
          data-fade
          className="mx-auto max-w-2xl font-display text-3xl font-bold tracking-tight text-foreground md:text-5xl"
        >
          {td('outro.heading')}
        </h2>
        <p data-fade className="mx-auto mt-4 max-w-xl text-sm text-muted-foreground md:text-base">
          {td('outro.sub')}
        </p>

        <div data-fade className="mx-auto mt-8 max-w-md space-y-2.5 text-left">
          <div className="flex items-start gap-2.5 rounded-xl border border-border/50 bg-card/40 px-4 py-3">
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-green-400" />
            <span className="text-sm text-foreground">{td('outro.does1')}</span>
          </div>
          <div className="flex items-start gap-2.5 rounded-xl border border-border/50 bg-card/40 px-4 py-3">
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-green-400" />
            <span className="text-sm text-foreground">{td('outro.does2')}</span>
          </div>
          <div className="flex items-start gap-2.5 rounded-xl border border-border/50 bg-card/40 px-4 py-3">
            <X className="mt-0.5 h-4 w-4 shrink-0 text-red-400" />
            <span className="text-sm text-muted-foreground">{td('outro.doesnt')}</span>
          </div>
        </div>

        <div data-fade className="mt-8 flex flex-wrap items-center justify-center gap-3">
          {project.liveUrl ? (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
            >
              <ExternalLink className="h-4 w-4" />
              {t('viewApp')}
            </a>
          ) : null}
          {project.githubUrl ? (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl border border-border/60 bg-background/40 px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:border-border hover:bg-accent/40"
            >
              <Github className="h-4 w-4" />
              {t('viewCode')}
            </a>
          ) : null}
        </div>
      </div>
    </section>
  );
}
