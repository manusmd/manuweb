import { useTranslations } from 'next-intl';
import { Check, X, Cpu, ExternalLink, Github, Braces } from 'lucide-react';
import type { Project } from '@/types/project';
import { SceneStep } from '../parts';

export function LimitsScene({ project }: { project: Project }) {
  const t = useTranslations('projects');
  const td = useTranslations('projects.fingermatchDetail');

  return (
    <section data-scene="limits" className="relative px-4 py-24">
      <div className="mx-auto w-full max-w-5xl">
        <div className="text-center">
          <SceneStep>{td('limits.step')}</SceneStep>
          <h2
            data-fade
            className="mx-auto max-w-2xl font-display text-3xl font-bold tracking-tight text-foreground md:text-5xl"
          >
            {td('limits.heading')}
          </h2>
          <p data-fade className="mx-auto mt-4 max-w-xl text-sm text-muted-foreground md:text-base">
            {td('limits.sub')}
          </p>
        </div>

        <div className="mt-10 grid items-stretch gap-4 lg:grid-cols-2">
          {/* does / doesn't */}
          <div data-fade className="rounded-2xl border border-border/50 bg-card/40 p-6">
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2.5">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-green-400" />
                <span className="text-foreground">{td('limits.does1')}</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-green-400" />
                <span className="text-foreground">{td('limits.does2')}</span>
              </li>
              <li className="flex items-start gap-2.5">
                <X className="mt-0.5 h-4 w-4 shrink-0 text-red-400" />
                <span className="text-muted-foreground">{td('limits.doesnt1')}</span>
              </li>
              <li className="flex items-start gap-2.5">
                <X className="mt-0.5 h-4 w-4 shrink-0 text-red-400" />
                <span className="text-muted-foreground">{td('limits.doesnt2')}</span>
              </li>
            </ul>
          </div>

          {/* swappable detector */}
          <div
            data-fade
            className="flex flex-col rounded-2xl border border-border/50 bg-card/40 p-6"
          >
            <div className="flex items-center gap-2 text-primary">
              <Braces className="h-4 w-4" />
              <span className="font-mono text-xs uppercase tracking-wide">
                {td('limits.detectorLabel')}
              </span>
            </div>
            <div className="mt-4 space-y-2">
              <div className="flex items-center gap-3 rounded-xl border border-primary/40 bg-primary/5 px-4 py-3">
                <Cpu className="h-4 w-4 shrink-0 text-primary" />
                <div>
                  <p className="font-mono text-sm text-foreground">classical</p>
                  <p className="text-xs text-muted-foreground">{td('limits.classical')}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-xl border border-border/50 bg-background/40 px-4 py-3 opacity-70">
                <Cpu className="h-4 w-4 shrink-0 text-muted-foreground" />
                <div>
                  <p className="font-mono text-sm text-foreground">minutiaenet (ONNX)</p>
                  <p className="text-xs text-muted-foreground">{td('limits.minutiaenet')}</p>
                </div>
              </div>
            </div>
            <p className="mt-4 text-xs text-muted-foreground">{td('limits.detectorNote')}</p>
          </div>
        </div>

        {/* CTA */}
        <div data-fade className="mt-10 flex flex-wrap items-center justify-center gap-3">
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
