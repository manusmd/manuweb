import { useTranslations } from 'next-intl';
import { Mail } from 'lucide-react';
import { SceneStep } from '@/components/projects/applyx/SceneParts';

export function IndeedScene() {
  const td = useTranslations('projects.applyxDetail');

  return (
    <section data-scene="indeed" className="relative">
      <div data-pin="indeed" className="flex items-center px-4 py-20 lg:min-h-[100svh]">
        <div className="mx-auto grid w-full max-w-5xl items-center gap-10 lg:grid-cols-2">
          <div>
            <SceneStep>{td('indeed.step')}</SceneStep>
            <h2 className="font-display text-3xl font-bold tracking-tight text-foreground md:text-5xl">
              {td('indeed.heading')}
            </h2>
            <p className="mt-4 max-w-md text-base text-muted-foreground md:text-lg">
              {td('indeed.sub')}
            </p>
          </div>
          <div className="rounded-2xl border border-border/50 bg-card/70 p-6 shadow-2xl backdrop-blur">
            <div className="flex items-center gap-2 border-b border-border/40 pb-3">
              <Mail className="h-4 w-4 text-primary" />
              <span className="text-xs text-muted-foreground">Indeed Apply</span>
            </div>
            <p className="mt-4 text-xs uppercase tracking-widest text-muted-foreground/70">
              {td('indeed.redacted')}
            </p>
            <div className="relative mt-1 h-9 overflow-hidden rounded-md">
              <span
                data-revealed
                className="flex h-full items-center text-xl font-bold text-accent-green"
              >
                {td('indeed.revealed')}
              </span>
              <span
                data-redaction
                className="absolute inset-0 flex items-center rounded-md bg-muted px-3 font-mono text-muted-foreground"
              >
                ▓▓▓▓▓▓▓▓▓
              </span>
            </div>
            <div className="mt-5 h-1 w-full overflow-hidden rounded-full bg-muted">
              <div
                data-scanbar
                className="h-full w-full origin-left scale-x-0 bg-gradient-to-r from-primary to-accent-violet"
              />
            </div>
            <p className="mt-2 text-[11px] text-muted-foreground/70">{td('indeed.scanning')}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
