'use client';

import { useRef, useState } from 'react';
import type { Project } from '@/types/project';
import { SCENES, useAfterhiveScrollExperience } from './useAfterhiveScrollExperience';
import { HeroScene } from './scenes/HeroScene';
import { TenancyScene } from './scenes/TenancyScene';
import { MatrixScene } from './scenes/MatrixScene';
import { DataLayerScene } from './scenes/DataLayerScene';
import { DomainScene } from './scenes/DomainScene';
import { ProductScene, OutroScene } from './scenes/ProductScene';

/**
 * Scroll-driven story for afterhive: a self-hosted, multi-tenant SaaS for
 * sports clubs — told through its engineering. The permission matrix and the
 * domain stats come straight from the repo's SSOT (packages/shared) and
 * schema.zmodel; the app screens are real captures of the public demo.
 */
export function AfterhiveDetail({ project, locale }: { project: Project; locale: string }) {
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
      <TenancyScene />
      <MatrixScene locale={locale} />
      <DataLayerScene />
      <DomainScene />
      <ProductScene />
      <OutroScene project={project} />
    </div>
  );
}
