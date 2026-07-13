'use client';

import { useRef, useState } from 'react';
import type { Project } from '@/types/project';
import { SCENES, useFingermatchScrollExperience } from './useFingermatchScrollExperience';
import { HeroScene } from './scenes/HeroScene';
import { EnhanceScene } from './scenes/EnhanceScene';
import { SkeletonScene } from './scenes/SkeletonScene';
import { MinutiaeScene } from './scenes/MinutiaeScene';
import { SingularScene } from './scenes/SingularScene';
import { MatchScene } from './scenes/MatchScene';
import { LimitsScene } from './scenes/LimitsScene';

/**
 * Scroll-driven story for FingerMatch: two prints run through a genuine classical
 * CV pipeline — enhance, skeletonize, extract minutiae, find singular points, and
 * match — every pixel and number exported from the real backend. Scene markup
 * lives in ./scenes; the orchestration lives in useFingermatchScrollExperience.
 */
export function FingermatchDetail({ project }: { project: Project; locale: string }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [activeScene, setActiveScene] = useState(0);

  useFingermatchScrollExperience(rootRef, setActiveScene);

  return (
    <div ref={rootRef} className="fingermatch-detail relative -mt-16 w-full overflow-x-hidden">
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
      <EnhanceScene />
      <SkeletonScene />
      <MinutiaeScene />
      <SingularScene />
      <MatchScene />
      <LimitsScene project={project} />
    </div>
  );
}
