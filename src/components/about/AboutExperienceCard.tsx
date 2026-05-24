'use client';

import {
  experienceIsSecretProject,
  getExperienceHighlights,
  getExperienceSkills,
  getExperienceLocation,
  resolveTimelineDesktopTheme,
  resolveTimelineMobileAccent,
} from '@/components/about/timeline.constants';
import { AnimatedWrapper } from '@/components/animations/AnimatedWrapper';
import { Badge } from '@/components/ui/badge';
import { getAboutExperienceAnchorId } from '@/components/about/aboutScroll';
import type { ExperienceEntry } from '@/types/experience';
import { MapPin } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface AboutExperienceCardProps {
  exp: ExperienceEntry;
  index: number;
  revealDelay?: number;
}

export function AboutExperienceCard({ exp, index, revealDelay = 0 }: AboutExperienceCardProps) {
  const t = useTranslations('about.timeline');
  const theme = resolveTimelineDesktopTheme(exp.company);
  const accentHex = resolveTimelineMobileAccent(exp.company);
  const cardId = getAboutExperienceAnchorId(index);
  const isSecret = experienceIsSecretProject(exp);
  const bodyItems = getExperienceHighlights(exp);
  const skills = getExperienceSkills(exp);
  const location = getExperienceLocation(exp);

  return (
    <AnimatedWrapper animation="fadeInUp" delay={revealDelay} threshold={0.12} once>
      <article
        id={cardId}
        data-about-step={index}
        className="group relative flex flex-col overflow-hidden rounded-3xl border border-border/40 bg-gradient-to-br from-card/85 via-card/55 to-muted/30 shadow-[0_22px_64px_-32px_rgba(0,0,0,0.45)] backdrop-blur-xl ring-1 ring-black/[0.04] transition-[transform,box-shadow] duration-500 hover:-translate-y-1 hover:border-border hover:shadow-[0_36px_80px_-40px_color-mix(in_oklab,var(--primary)_42%,transparent)] motion-reduce:hover:translate-y-0 dark:shadow-[0_26px_70px_-36px_rgba(0,0,0,0.75)] dark:ring-white/[0.06]"
        style={{
          borderLeftWidth: '5px',
          borderLeftColor: accentHex,
        }}
      >
        <div className="pointer-events-none absolute -right-24 -top-28 h-60 w-60 rounded-full bg-gradient-to-br from-primary/[0.14] via-transparent to-transparent blur-3xl opacity-75 transition-opacity duration-500 group-hover:opacity-100" />

        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
          <div
            className={`absolute inset-0 opacity-90 transition-opacity duration-500 group-hover:opacity-100 ${theme.pattern ?? ''}`}
          />
        </div>

        <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-foreground/[0.12] to-transparent" />

        <div className="relative z-10 flex flex-1 flex-col space-y-6 overflow-y-auto p-6 sm:p-8 md:p-9">
          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-muted/55 px-3 py-1 text-xs font-medium tabular-nums text-muted-foreground backdrop-blur-sm">
                <span
                  className="h-2 w-2 rounded-full shadow-[0_0_14px]"
                  style={{ backgroundColor: accentHex, boxShadow: `0 0 14px ${accentHex}` }}
                />
                {exp.date}
              </span>
              {location ? (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-border/50 bg-muted/35 px-3 py-1 text-xs text-muted-foreground backdrop-blur-sm">
                  <MapPin className="h-3.5 w-3.5 opacity-75" aria-hidden />
                  <span>{location}</span>
                </span>
              ) : null}
              {isSecret ? (
                <span className="rounded-full border border-border/50 bg-muted/40 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur-sm">
                  {t('secretBadge')}
                </span>
              ) : null}
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="font-display max-w-xl text-pretty text-2xl font-bold leading-tight text-foreground md:text-[1.85rem]">
              {exp.title}
            </h3>
            <p className={`text-lg font-semibold md:text-xl ${theme.accentColor}`}>{exp.company}</p>
          </div>

          {skills.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {skills.map((skill, skillIndex) => (
                <Badge
                  key={`${exp.company}-skill-${skillIndex}`}
                  variant="outline"
                  className="rounded-lg border-primary/35 bg-background/65 px-2.5 py-0.5 text-[11px] font-medium tracking-wide shadow-sm backdrop-blur-sm"
                  style={{
                    borderColor: `${accentHex}55`,
                  }}
                >
                  {skill}
                </Badge>
              ))}
            </div>
          ) : null}

          {bodyItems.length > 0 ? (
            <ul className="space-y-3.5 pt-2">
              {bodyItems.map((item, dotIndex) => (
                <li
                  key={`${exp.company}-${dotIndex}-${item.slice(0, 28)}`}
                  className="flex gap-3.5 leading-relaxed text-[0.935rem] text-muted-foreground md:text-[1.02rem]"
                >
                  <span
                    className="relative mt-[0.52rem] h-2 w-2 shrink-0 rounded-[3px]"
                    style={{
                      backgroundColor: accentHex,
                      boxShadow: `0 0 16px ${accentHex}aa`,
                    }}
                  />
                  <span className="min-w-0 flex-1 text-pretty">{item}</span>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </article>
    </AnimatedWrapper>
  );
}
