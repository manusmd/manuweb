'use client';

import { useRef, useState } from 'react';
import type { Project } from '@/types/project';
import {
  SCENES,
  useApplyxScrollExperience,
} from '@/components/projects/applyx/useApplyxScrollExperience';
import { HeroScene } from '@/components/projects/applyx/scenes/HeroScene';
import { IngestScene } from '@/components/projects/applyx/scenes/IngestScene';
import { PipelineScene } from '@/components/projects/applyx/scenes/PipelineScene';
import { IndeedScene } from '@/components/projects/applyx/scenes/IndeedScene';
import { StatsScene } from '@/components/projects/applyx/scenes/StatsScene';
import { LocalScene } from '@/components/projects/applyx/scenes/LocalScene';
import { JobPostingScene } from '@/components/projects/applyx/scenes/JobPostingScene';
import { AskScene } from '@/components/projects/applyx/scenes/AskScene';
import { AssistantScene } from '@/components/projects/applyx/scenes/AssistantScene';
import { OutroScene } from '@/components/projects/applyx/scenes/OutroScene';

interface ApplyxDetailProps {
  project: Project;
  locale: string;
}

/**
 * A GSAP-choreographed, scroll-driven story for the ApplyX project: a single
 * email is read over IMAP, classified locally, and moves through the pipeline —
 * all without leaving "your machine". Each scene owns its own markup; the
 * scroll orchestration lives in {@link useApplyxScrollExperience}.
 */
export function ApplyxDetail({ project, locale }: ApplyxDetailProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [activeScene, setActiveScene] = useState(0);

  useApplyxScrollExperience(rootRef, setActiveScene);

  return (
    <div ref={rootRef} className="applyx-detail relative -mt-16 w-full overflow-x-hidden">
      {/* Scene progress rail (desktop) */}
      <nav
        aria-hidden
        className="pointer-events-none fixed left-6 top-1/2 z-40 hidden -translate-y-1/2 flex-col gap-3 lg:flex"
      >
        {SCENES.map((s, i) => (
          <span
            key={s}
            className={`h-2 w-2 rounded-full transition-all duration-300 ${
              i === activeScene ? 'scale-150 bg-primary' : 'bg-muted-foreground/30'
            }`}
          />
        ))}
      </nav>

      <HeroScene project={project} />
      <IngestScene />
      <PipelineScene />
      <IndeedScene />
      <StatsScene />
      <LocalScene />
      <JobPostingScene />
      <AskScene />
      <AssistantScene />
      <OutroScene project={project} locale={locale} />
    </div>
  );
}
