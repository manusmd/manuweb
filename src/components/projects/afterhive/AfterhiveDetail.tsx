'use client';

import { useRef, useState } from 'react';
import type { Project } from '@/types/project';
import { SCENES, useAfterhiveScrollExperience } from './useAfterhiveScrollExperience';
import { HeroScene } from './scenes/HeroScene';
import { TourScene } from './scenes/TourScene';
import { DuesScene } from './scenes/DuesScene';
import { AttendanceScene } from './scenes/AttendanceScene';
import { WebsiteScene } from './scenes/WebsiteScene';
import { RolesScene } from './scenes/RolesScene';
import { TechScene } from './scenes/TechScene';
import { OutroScene } from './scenes/OutroScene';

/**
 * Scroll-driven story for afterhive, feature-first: a pinned product tour
 * through real demo screens (dashboard, members, dues, calendar, attendance,
 * club website), a humanized roles section powered by the app's real
 * permission data, and one slim technical strip.
 */
export function AfterhiveDetail({ project }: { project: Project; locale?: string }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [activeScene, setActiveScene] = useState(0);

  useAfterhiveScrollExperience(rootRef, setActiveScene);

  return (
    <div ref={rootRef} className="afterhive-detail relative -mt-16 w-full overflow-x-hidden">
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
      <TourScene />
      <DuesScene />
      <AttendanceScene />
      <WebsiteScene />
      <RolesScene />
      <TechScene project={project} />
      <OutroScene project={project} />
    </div>
  );
}
