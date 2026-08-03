import { useTranslations } from 'next-intl';
import { ExternalLink } from 'lucide-react';
import type { Project } from '@/types/project';
import { SceneStep, BrowserFrame, InstrumentReadout } from '../parts';
import { ASSET, DEMO } from '../tokens';

export function CockpitScene({ project }: { project: Project }) {
  const td = useTranslations('projects.fingermatchDetail');

  const readout = [
    {
      label: td('cockpit.readoutMinutiae'),
      value: `${DEMO.A.minutiae.length}/${DEMO.B.minutiae.length}`,
    },
    { label: td('cockpit.readoutPairs'), value: String(DEMO.match.pairs.length) },
    { label: td('cockpit.readoutScore'), value: String(DEMO.match.score), tone: 'teal' as const },
    {
      label: td('cockpit.readoutStatus'),
      value: td('cockpit.readoutStatusValue'),
      tone: 'green' as const,
    },
  ];

  return (
    <section data-scene="cockpit" className="relative px-4 py-20 md:py-28">
      <div className="mx-auto w-full max-w-5xl">
        <div className="text-center">
          <SceneStep>{td('cockpit.step')}</SceneStep>
          <h2 className="mx-auto max-w-2xl font-display text-3xl font-bold tracking-tight text-foreground md:text-5xl">
            {td('cockpit.heading')}
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-muted-foreground md:text-base">
            {td('cockpit.sub')}
          </p>
        </div>

        <div data-fade className="mt-8">
          <BrowserFrame src={ASSET('app-cockpit.png')} alt="FingerMatch analysis cockpit" />
        </div>

        <div data-fade className="mt-6 flex justify-center">
          <InstrumentReadout items={readout} />
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
              {td('cockpit.cta')}
            </a>
          </div>
        ) : null}
      </div>
    </section>
  );
}
