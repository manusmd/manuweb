'use client';

import type { ExperienceEntry } from '@/types/experience';
import type { TimelineDesktopTheme } from '@/components/about/timeline.constants';
import { experienceIsSecret } from '@/components/about/timeline.constants';

interface TimelineExperiencePanelProps {
  exp: ExperienceEntry;
  theme: TimelineDesktopTheme;
}

export function TimelineExperiencePanel({ exp, theme }: TimelineExperiencePanelProps) {
  const isSecret = experienceIsSecret(exp);

  return (
    <div
      className={`flex items-center justify-center relative ${theme.background}`}
      style={{
        width: '100vw',
        height: '100vh',
        minWidth: '100vw',
        flexShrink: 0,
      }}
    >
      <div className={`absolute inset-0 ${theme.pattern ?? ''}`} />

      <div className="max-w-4xl w-full relative z-10 px-8">
        <div className="text-center space-y-8">
          <div className="space-y-6">
            <span
              className={`text-sm font-medium px-4 py-2 rounded-full inline-block ${theme.cardBg} ${theme.textColor} ${theme.borderColor}`}
            >
              {exp.date}
            </span>
            <h3
              className={`text-5xl lg:text-7xl font-display font-bold leading-tight ${theme.textColor}`}
            >
              {exp.title}
            </h3>
            <p className={`text-3xl lg:text-4xl font-semibold ${theme.accentColor}`}>
              {exp.company}
            </p>
          </div>

          {!isSecret && (
            <div className="mt-12">
              <p
                className={`text-xl ${theme.textColor} leading-relaxed max-w-3xl mx-auto opacity-90`}
              >
                {exp.description}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
