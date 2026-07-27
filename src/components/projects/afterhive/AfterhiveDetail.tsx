'use client';

import { useRef, useState } from 'react';
import type { Project } from '@/types/project';
import { SCENES, useAfterhiveScrollExperience } from './useAfterhiveScrollExperience';
import { LiquidField } from './parts';
import { HeroScene } from './scenes/HeroScene';
import { ChaosScene } from './scenes/ChaosScene';
import { TourScene } from './scenes/TourScene';
import { DuesScene } from './scenes/DuesScene';
import { AttendanceScene } from './scenes/AttendanceScene';
import { WebsiteScene } from './scenes/WebsiteScene';
import { RolesScene } from './scenes/RolesScene';
import { TrustScene } from './scenes/TrustScene';
import { OutroScene } from './scenes/OutroScene';

/**
 * Scroll-driven story for afterhive, feature-first and elevated to flagship: a
 * signature Liquid backdrop, a cinematic hero, a "replaces the chaos" opener,
 * the pinned product tour through real demo screens, dedicated feature scenes
 * (dues, attendance, club website), humanized roles from the real permission
 * data, and one calm trust line before the outro.
 */
export function AfterhiveDetail({ project }: { project: Project; locale?: string }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [activeScene, setActiveScene] = useState(0);

  useAfterhiveScrollExperience(rootRef, setActiveScene);

  return (
    <div ref={rootRef} className="afterhive-detail relative -mt-16 w-full overflow-x-hidden">
      <LiquidField />

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
      <ChaosScene />
      <TourScene />
      <DuesScene />
      <AttendanceScene />
      <WebsiteScene />
      <RolesScene />
      <TrustScene />
      <OutroScene project={project} />
    </div>
  );
}
