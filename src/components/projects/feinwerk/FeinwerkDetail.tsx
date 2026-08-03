'use client';

import { useRef, useState } from 'react';
import type { Project } from '@/types/project';
import { FeinwerkBackdrop } from './parts';
import { SCENES, useFeinwerkScrollExperience } from './useFeinwerkScrollExperience';
import {
  HeroScene,
  UploadScene,
  PipelineScene,
  ToolsScene,
  CompressScene,
  TechScene,
  OutroScene,
} from './scenes';

/**
 * Scroll-driven story for Feinwerk in its own visual language — a technical
 * "workshop at night": ink canvas, lime ruler ticks, mono labels. Signature
 * beats: a hero with a self-drawing rule, the "upload fear" that snaps files
 * back behind a "Dein Gerät" line, the local pipeline where 0 bytes ever leave,
 * a pinned horizontal tour through the six tools, a scrubbed compression stat,
 * the build, and a "measurement complete" ruler outro.
 */
export function FeinwerkDetail({ project }: { project: Project; locale?: string }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [activeScene, setActiveScene] = useState(0);

  useFeinwerkScrollExperience(rootRef, setActiveScene);

  return (
    <div
      ref={rootRef}
      className="feinwerk-detail relative -mt-16 w-full overflow-x-hidden bg-[#0b0d11] text-[#f4f4f1]"
    >
      <FeinwerkBackdrop />

      <nav
        aria-hidden
        className="pointer-events-none fixed left-6 top-1/2 z-40 hidden -translate-y-1/2 flex-col gap-3 lg:flex"
      >
        {SCENES.map((s, i) => (
          <span
            key={s}
            className={`h-2 w-2 rounded-full transition-all duration-300 ${
              i === activeScene ? 'scale-150 bg-[#d8e84a]' : 'bg-white/20'
            }`}
          />
        ))}
      </nav>

      <HeroScene project={project} />
      <UploadScene />
      <PipelineScene />
      <ToolsScene />
      <CompressScene />
      <TechScene />
      <OutroScene project={project} />
    </div>
  );
}
