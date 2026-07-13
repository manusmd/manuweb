'use client';

import { useRef, useState } from 'react';
import type { Project } from '@/types/project';
import { SCENES, usePitchlabScrollExperience } from './usePitchlabScrollExperience';
import { HeroScene } from './scenes/HeroScene';
import { StrengthsScene } from './scenes/StrengthsScene';
import { MatchModelScene } from './scenes/MatchModelScene';
import { MonteCarloScene } from './scenes/MonteCarloScene';
import { ModelCheckScene } from './scenes/ModelCheckScene';
import { ProductScene } from './scenes/ProductScene';
import { OutroScene } from './scenes/OutroScene';

/**
 * Scroll-driven story for PitchLab: a from-scratch football model — Poisson
 * attack/defence, Dixon-Coles, Elo, a 10k Monte-Carlo tournament sim — that
 * grades its own predictions. Every number is exported from the real model
 * (see soccerlab/backend/scripts/export_detail_assets.py); the app screens are
 * real captures of the live demo.
 */
export function PitchlabDetail({ project }: { project: Project; locale: string }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [activeScene, setActiveScene] = useState(0);

  usePitchlabScrollExperience(rootRef, setActiveScene);

  return (
    <div ref={rootRef} className="pitchlab-detail relative -mt-16 w-full overflow-x-hidden">
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
      <StrengthsScene />
      <MatchModelScene />
      <MonteCarloScene />
      <ModelCheckScene />
      <ProductScene project={project} />
      <OutroScene project={project} />
    </div>
  );
}
