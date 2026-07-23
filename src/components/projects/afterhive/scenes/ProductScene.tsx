import { useTranslations } from 'next-intl';
import { ExternalLink } from 'lucide-react';
import type { Project } from '@/types/project';
import { SceneStep, BrowserFrame } from '../parts';
import { ASSET } from '../tokens';

export function ProductScene() {
  const td = useTranslations('projects.afterhiveDetail');

  return (
    <section data-scene="product" className="relative px-4 py-20 md:py-28">
      <div className="mx-auto w-full max-w-5xl">
        <div className="text-center">
          <SceneStep>{td('product.step')}</SceneStep>
          <h2 className="mx-auto max-w-2xl font-display text-3xl font-bold tracking-tight text-foreground md:text-5xl">
            {td('product.heading')}
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-muted-foreground md:text-base">
            {td('product.sub')}
          </p>
        </div>

        <div data-fade className="mt-8">
          <BrowserFrame src={ASSET('rollen.png')} alt="Rollen & Rechte — Rechte-Matrix" />
        </div>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div data-fade>
            <BrowserFrame src={ASSET('mitglieder.png')} alt="Mitgliederverwaltung" />
          </div>
          <div data-fade>
            <BrowserFrame src={ASSET('beitraege.png')} alt="Beiträge" />
          </div>
        </div>
      </div>
    </section>
  );
}

export function OutroScene({ project }: { project: Project }) {
  const t = useTranslations('projects');
  const td = useTranslations('projects.afterhiveDetail');

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
        <div data-fade className="mt-8 flex flex-wrap items-center justify-center gap-3">
          {project.liveUrl ? (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
            >
              <ExternalLink className="h-4 w-4" />
              {td('outro.cta')}
            </a>
          ) : null}
          {project.githubUrl ? (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl border border-border/60 bg-background/40 px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:border-border hover:bg-accent/40"
            >
              {t('viewCode')}
            </a>
          ) : null}
        </div>
      </div>
    </section>
  );
}
