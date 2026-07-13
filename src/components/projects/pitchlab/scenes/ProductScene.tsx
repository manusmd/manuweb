import { useTranslations } from 'next-intl';
import { ExternalLink } from 'lucide-react';
import type { Project } from '@/types/project';
import { SceneStep, BrowserFrame } from '../parts';
import { ASSET } from '../tokens';

export function ProductScene({ project }: { project: Project }) {
  const td = useTranslations('projects.pitchlabDetail');

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
          <BrowserFrame src={ASSET('titelrennen.png')} alt="Title race" />
        </div>

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div data-fade>
            <BrowserFrame src={ASSET('matchdetail.png')} alt="Match detail" />
          </div>
          <div data-fade>
            <BrowserFrame src={ASSET('modellcheck.png')} alt="Model check" />
          </div>
        </div>

        {project.liveUrl ? (
          <div data-fade className="mt-8 flex justify-center">
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
            >
              <ExternalLink className="h-4 w-4" />
              {td('product.cta')}
            </a>
          </div>
        ) : null}
      </div>
    </section>
  );
}
