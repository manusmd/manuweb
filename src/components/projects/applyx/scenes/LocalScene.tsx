import { useTranslations } from 'next-intl';
import { Ban, Cloud, Cpu, Database, Lock, Mail, Monitor, X, type LucideIcon } from 'lucide-react';
import { SceneStep } from '@/components/projects/applyx/SceneParts';

function BoundaryNode({ icon: Icon, label }: { icon: LucideIcon; label: string }) {
  return (
    <div className="flex shrink-0 flex-col items-center gap-2.5">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-border/60 bg-background/50 sm:h-[52px] sm:w-[52px]">
        <Icon className="h-5 w-5 text-muted-foreground sm:h-[22px] sm:w-[22px]" />
      </div>
      <span className="font-mono text-xs text-muted-foreground">{label}</span>
    </div>
  );
}

function BoundaryWire() {
  return (
    <div className="relative h-0.5 w-6 shrink-0 -translate-y-[13px] bg-border/60 sm:w-12">
      <div className="applyx-flow absolute inset-0 bg-gradient-to-r from-transparent via-primary to-transparent" />
    </div>
  );
}

export function LocalScene() {
  const td = useTranslations('projects.applyxDetail');

  return (
    <section data-scene="local" className="relative px-4 py-24">
      <div className="mx-auto w-full max-w-5xl">
        <div className="text-center">
          <SceneStep>{td('local.step')}</SceneStep>
          <h2
            data-fade
            className="mx-auto max-w-2xl font-display text-3xl font-bold tracking-tight text-foreground md:text-5xl"
          >
            {td('local.heading')}
          </h2>
        </div>

        {/* Privacy boundary — the machine as a sealed box */}
        <div data-fade className="mx-auto mt-10 max-w-2xl">
          {/* What stays out: cloud services, refused at the boundary */}
          <div className="flex items-center justify-between gap-3 rounded-xl border border-border/50 bg-card/30 px-4 py-3 opacity-60">
            <div className="flex min-w-0 items-center gap-2.5 text-sm text-muted-foreground">
              <Cloud className="h-[18px] w-[18px] shrink-0" />
              <span className="truncate">{td('local.blockedLabel')}</span>
            </div>
            <span className="inline-flex shrink-0 items-center gap-1.5 rounded-md border border-red-500/30 bg-red-500/10 px-2.5 py-1 text-xs font-medium text-red-400">
              <Ban className="h-3.5 w-3.5" />
              {td('local.blockedBadge')}
            </span>
          </div>

          {/* The boundary wall — nothing crosses */}
          <div className="flex flex-col items-center py-1.5">
            <div className="h-4 w-px bg-border" />
            <div className="flex items-center gap-2">
              <div className="h-px w-8 bg-gradient-to-l from-red-500/40 to-transparent" />
              <X className="h-4 w-4 text-red-400/80" />
              <div className="h-px w-8 bg-gradient-to-r from-red-500/40 to-transparent" />
            </div>
            <div className="h-4 w-px bg-primary/50" />
          </div>

          {/* The machine — data flows freely, but only inside */}
          <div className="overflow-hidden rounded-2xl border-2 border-primary/40 bg-card/40">
            <div className="flex items-center justify-between gap-3 border-b border-border/40 bg-background/40 px-4 py-2.5">
              <div className="flex items-center gap-2 text-sm text-foreground">
                <Monitor className="h-[18px] w-[18px] text-primary" />
                <span className="font-mono">{td('local.machineLabel')}</span>
              </div>
              <span className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest text-primary/80">
                <Lock className="h-3.5 w-3.5" />
                {td('local.boundaryLabel')}
              </span>
            </div>

            <div className="flex items-center justify-center gap-2 px-4 py-8 sm:gap-3 sm:px-8">
              <BoundaryNode icon={Mail} label="IMAP" />
              <BoundaryWire />
              <div className="flex shrink-0 flex-col items-center gap-2.5">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl border-2 border-accent-violet/50 bg-accent-violet/10 sm:h-16 sm:w-16">
                  <Cpu className="h-6 w-6 text-accent-violet sm:h-7 sm:w-7" />
                </div>
                <span className="font-mono text-xs font-medium text-accent-violet">Ollama</span>
              </div>
              <BoundaryWire />
              <BoundaryNode icon={Database} label="Postgres" />
            </div>
          </div>

          {/* Sharpening: local by default; the hosted demo swaps the reasoning provider,
              embeddings stay local. Keeps the page honest without weakening the claim. */}
          <p
            data-fade
            className="mx-auto mt-6 max-w-xl text-center text-sm leading-relaxed text-muted-foreground"
          >
            <span className="font-semibold text-foreground">{td('local.noteLead')}</span>{' '}
            {td('local.note')}
          </p>
        </div>
      </div>
    </section>
  );
}
