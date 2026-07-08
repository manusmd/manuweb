'use client';

import {
  experienceIsSecretProject,
  getExperienceHighlights,
  getExperienceSkills,
  getExperienceLocation,
} from '@/components/about/timeline.constants';
import { AnimatedWrapper } from '@/components/animations/AnimatedWrapper';
import { Badge } from '@/components/ui/badge';
import type { ExperienceEntry } from '@/types/experience';
import { MapPin } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface AboutExperienceCardProps {
  exp: ExperienceEntry;
  revealDelay?: number;
}

export function AboutExperienceCard({ exp, revealDelay = 0 }: AboutExperienceCardProps) {
  const t = useTranslations('about.timeline');
  const isSecret = experienceIsSecretProject(exp);
  const bodyItems = getExperienceHighlights(exp);
  const skills = getExperienceSkills(exp);
  const location = getExperienceLocation(exp);

  return (
    <AnimatedWrapper
      animation="fadeInUp"
      delay={revealDelay}
      threshold={0.12}
      once
      className="relative pl-7 sm:pl-9"
    >
      <span
        className="absolute left-[5px] top-7 h-3 w-3 -translate-x-1/2 rounded-full border-2 border-background bg-primary sm:top-8"
        aria-hidden
      />
      <article className="rounded-2xl border border-border/40 bg-card/55 p-6 shadow-[0_22px_64px_-32px_rgba(0,0,0,0.45)] ring-1 ring-white/[0.06] backdrop-blur-xl transition-shadow duration-300 hover:shadow-[0_28px_80px_-32px_rgba(0,0,0,0.6)] md:p-7">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
          <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {exp.date}
          </span>
          {location ? (
            <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
              <MapPin className="h-3.5 w-3.5" aria-hidden />
              {location}
            </span>
          ) : null}
          {isSecret ? (
            <Badge variant="outline" className="text-xs font-normal">
              {t('secretBadge')}
            </Badge>
          ) : null}
        </div>

        <h3 className="font-display mt-2 text-xl font-bold tracking-tight text-foreground md:text-2xl">
          {exp.title}
        </h3>
        <p className="text-sm font-medium text-primary md:text-base">{exp.company}</p>

        {skills.length > 0 ? (
          <div className="mt-4 flex flex-wrap gap-2">
            {skills.map((skill, skillIndex) => (
              <Badge
                key={`${exp.company}-skill-${skillIndex}`}
                variant="secondary"
                className="border-border/50 bg-muted/40 px-2.5 py-1 text-xs font-normal"
              >
                {skill}
              </Badge>
            ))}
          </div>
        ) : null}

        {bodyItems.length > 0 ? (
          <ul className="mt-4 space-y-2">
            {bodyItems.map((item, itemIndex) => (
              <li
                key={`${exp.company}-${itemIndex}-${item.slice(0, 28)}`}
                className="flex gap-2.5 text-sm leading-relaxed text-muted-foreground md:text-base"
              >
                <span
                  className="mt-2 h-1 w-1 shrink-0 rounded-full bg-muted-foreground/50"
                  aria-hidden
                />
                <span className="min-w-0 flex-1">{item}</span>
              </li>
            ))}
          </ul>
        ) : null}
      </article>
    </AnimatedWrapper>
  );
}
