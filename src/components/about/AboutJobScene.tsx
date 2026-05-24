'use client';

import {
  experienceIsSecretProject,
  getExperienceHighlights,
  getExperienceSkills,
  getExperienceLocation,
  resolveTimelineDesktopTheme,
  resolveTimelineMobileAccent,
} from '@/components/about/timeline.constants';
import { AboutJobSceneVisual } from '@/components/about/AboutJobSceneVisual';
import { Badge } from '@/components/ui/badge';
import { getAboutExperienceAnchorId } from '@/components/about/aboutScroll';
import type { ExperienceEntry } from '@/types/experience';
import { MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTranslations } from 'next-intl';

interface AboutJobSceneProps {
  exp: ExperienceEntry;
  index: number;
}

export function AboutJobScene({ exp, index }: AboutJobSceneProps) {
  const t = useTranslations('about.timeline');
  const theme = resolveTimelineDesktopTheme(exp.company);
  const accentHex = resolveTimelineMobileAccent(exp.company);
  const isSecret = experienceIsSecretProject(exp);
  const cardId = getAboutExperienceAnchorId(index);
  const bodyItems = getExperienceHighlights(exp);
  const skills = getExperienceSkills(exp);
  const location = getExperienceLocation(exp);

  return (
    <section
      id={cardId}
      data-about-job-scene
      data-about-step={index}
      className="relative isolate h-full w-[min(68vw,920px)] max-w-[920px] flex-shrink-0 overflow-hidden rounded-2xl border border-white/[0.1] shadow-[0_16px_48px_-20px_rgba(0,0,0,0.65)]"
    >
      <div
        className={cn('pointer-events-none absolute inset-0 opacity-95', theme.background)}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-br from-purple-950/25 via-transparent to-slate-950/40"
        aria-hidden
      />
      <div
        data-about-scene-parallax="0.35"
        className={cn(
          'pointer-events-none absolute -left-[20%] top-[-10%] h-[55%] w-[70%] rounded-full opacity-40 blur-3xl',
          theme.pattern ?? ''
        )}
        aria-hidden
      />
      <div
        data-about-scene-parallax="0.55"
        className="pointer-events-none absolute -right-[15%] bottom-[-20%] h-[50%] w-[55%] rounded-full bg-gradient-to-tl from-primary/15 via-fuchsia-600/10 to-transparent opacity-70 blur-3xl"
        aria-hidden
      />

      <AboutJobSceneVisual visualElement={theme.visualElement} accentHex={accentHex} />

      <div className="relative z-10 mx-auto flex h-full max-w-none flex-col justify-center overflow-y-auto px-5 py-6 md:px-8 md:py-8 lg:pr-[min(280px,34%)]">
        <div
          data-scene-stage="meta"
          className="mb-3 flex flex-wrap gap-1.5 opacity-0 will-change-transform"
        >
          <span
            className="inline-flex items-center gap-2 rounded-full border border-border/55 bg-background/35 px-3 py-1 text-xs font-medium tabular-nums text-muted-foreground backdrop-blur-md"
            style={{ borderLeftColor: accentHex, borderLeftWidth: 3 }}
          >
            <span
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: accentHex, boxShadow: `0 0 12px ${accentHex}` }}
            />
            {exp.date}
          </span>
          {location ? (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-border/50 bg-background/30 px-3 py-1 text-xs text-muted-foreground backdrop-blur-md">
              <MapPin className="h-3.5 w-3.5 opacity-70" aria-hidden />
              {location}
            </span>
          ) : null}
          {isSecret ? (
            <span className="rounded-full border border-border/50 bg-muted/40 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur-md">
              {t('secretBadge')}
            </span>
          ) : null}
        </div>

        <h2
          data-scene-stage="heading"
          className={cn(
            'font-display mb-2 max-w-2xl text-pretty text-3xl font-bold leading-[1.12] opacity-0 will-change-transform md:text-4xl lg:text-[2.65rem]',
            theme.textColor
          )}
        >
          {exp.title}
        </h2>

        <p
          data-scene-stage="company"
          className={cn(
            'mb-4 text-lg font-semibold opacity-0 will-change-transform md:text-xl',
            theme.accentColor
          )}
        >
          {exp.company}
        </p>

        {skills.length > 0 ? (
          <div
            data-scene-stage="skills"
            className="mb-4 flex flex-wrap gap-1.5 opacity-0 will-change-transform"
          >
            {skills.map((skill, skillIndex) => (
              <Badge
                key={`${exp.company}-sk-${skillIndex}`}
                variant="outline"
                className="rounded-lg border bg-background/50 px-2.5 py-0.5 text-[11px] font-medium backdrop-blur-sm"
                style={{ borderColor: `${accentHex}66` }}
              >
                {skill}
              </Badge>
            ))}
          </div>
        ) : (
          <div data-scene-stage="skills" className="mb-4 hidden opacity-0" aria-hidden />
        )}

        {bodyItems.length > 0 ? (
          <ul className="space-y-2.5 md:space-y-3">
            {bodyItems.map((item, dotIndex) => (
              <li
                key={`${exp.company}-b-${dotIndex}`}
                data-scene-stage="bullet"
                className="flex gap-3 text-sm leading-relaxed text-muted-foreground opacity-0 will-change-transform md:text-base md:leading-relaxed"
              >
                <span
                  className="relative mt-[0.42rem] h-2 w-2 shrink-0 rounded-sm"
                  style={{
                    backgroundColor: accentHex,
                    boxShadow: `0 0 14px ${accentHex}`,
                  }}
                />
                <span className="min-w-0 text-pretty">{item}</span>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </section>
  );
}
