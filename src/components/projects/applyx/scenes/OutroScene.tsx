import { useTranslations } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowLeft,
  Ban,
  Cloud,
  Cpu,
  Database,
  ExternalLink,
  Lock,
  Mail,
  Monitor,
  X,
  type LucideIcon,
} from 'lucide-react';
import type { Project } from '@/types/project';
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

export function OutroScene({ project, locale }: { project: Project; locale: string }) {
  const t = useTranslations('projects');
  const td = useTranslations('projects.applyxDetail');

  return (
    <section data-scene="outro" className="relative border-t border-border/30 px-4 py-24">
      <div className="mx-auto w-full max-w-5xl">
        <SceneStep>{td('outro.step')}</SceneStep>

        {/* Privacy boundary — the machine as a sealed box */}
        <div data-fade className="mx-auto mb-12 max-w-2xl">
          {/* What stays out: cloud services, refused at the boundary */}
          <div className="flex items-center justify-between gap-3 rounded-xl border border-border/50 bg-card/30 px-4 py-3 opacity-60">
            <div className="flex min-w-0 items-center gap-2.5 text-sm text-muted-foreground">
              <Cloud className="h-[18px] w-[18px] shrink-0" />
              <span className="truncate">{td('outro.blockedLabel')}</span>
            </div>
            <span className="inline-flex shrink-0 items-center gap-1.5 rounded-md border border-red-500/30 bg-red-500/10 px-2.5 py-1 text-xs font-medium text-red-400">
              <Ban className="h-3.5 w-3.5" />
              {td('outro.blockedBadge')}
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
                <span className="font-mono">{td('outro.machineLabel')}</span>
              </div>
              <span className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest text-primary/80">
                <Lock className="h-3.5 w-3.5" />
                {td('outro.boundaryLabel')}
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
        </div>

        <h2
          data-fade
          className="text-center font-display text-3xl font-bold tracking-tight text-foreground md:text-5xl"
        >
          {td('outro.heading')}
        </h2>
        <p data-fade className="mx-auto mt-4 max-w-md text-center text-muted-foreground">
          {td('outro.sub')}
        </p>

        {/* Device frame with live demo */}
        <div
          data-fade
          className="mx-auto mt-10 max-w-4xl overflow-hidden rounded-2xl border border-border/50 bg-card/60 shadow-2xl"
        >
          <div className="flex items-center gap-1.5 border-b border-border/40 bg-muted/40 px-4 py-3">
            <span className="h-3 w-3 rounded-full bg-red-500/70" />
            <span className="h-3 w-3 rounded-full bg-yellow-500/70" />
            <span className="h-3 w-3 rounded-full bg-green-500/70" />
            <span className="ml-3 truncate text-xs text-muted-foreground">{project.liveUrl}</span>
          </div>
          <div className="relative aspect-[16/10] w-full">
            <Image
              src={project.image ?? '/applyxdashboard.png'}
              alt={project.title}
              fill
              className="object-cover object-top"
              sizes="(max-width: 1024px) 100vw, 60vw"
            />
          </div>
        </div>

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
          <Link
            href={`/${locale}#projects`}
            className="inline-flex items-center gap-2 rounded-xl border border-border/60 bg-background/40 px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:border-border hover:bg-accent/40"
          >
            <ArrowLeft className="h-4 w-4" />
            {t('backToProjects')}
          </Link>
        </div>
      </div>
    </section>
  );
}
