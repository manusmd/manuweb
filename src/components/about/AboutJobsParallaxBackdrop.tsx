'use client';

import { getBlendedJobAccent, getJobFocusWeight } from '@/components/about/aboutScroll';
import { resolveTimelineMobileAccent } from '@/components/about/timeline.constants';
import { cn } from '@/lib/utils';
import type { ExperienceEntry } from '@/types/experience';

type AboutJobsParallaxBackdropProps = {
  experiences: ExperienceEntry[];
  scrollProgress: number;
  activeIndex: number;
  className?: string;
};

function getBlendedAccent(experiences: ExperienceEntry[], scrollProgress: number): string {
  return getBlendedJobAccent(experiences, scrollProgress);
}

export function AboutJobsParallaxBackdrop({
  experiences,
  scrollProgress,
  activeIndex,
  className,
}: AboutJobsParallaxBackdropProps) {
  const count = experiences.length;
  const blendedAccent = getBlendedAccent(experiences, scrollProgress);
  const counterFarX = scrollProgress * 168;
  const counterMidX = scrollProgress * 88;
  const counterNearX = scrollProgress * 42;
  const driftY = scrollProgress * 32;
  const driftYBack = scrollProgress * -20;
  const gridShift = scrollProgress * 52;
  const vignetteStrength = 0.24 + Math.sin(scrollProgress * Math.PI) * 0.1;

  const auroraBands = [
    { rotate: -28, y: '12%', opacity: 0.22, shift: scrollProgress * 240 - 120 },
    { rotate: -16, y: '38%', opacity: 0.16, shift: scrollProgress * 180 - 90 },
    { rotate: -34, y: '62%', opacity: 0.14, shift: scrollProgress * 300 - 150 },
  ];

  const backdropTopFadeMask = 'linear-gradient(to bottom, transparent 0, black 60px)';

  return (
    <div
      className={cn('pointer-events-none absolute inset-0', className)}
      style={{
        WebkitMaskImage: backdropTopFadeMask,
        maskImage: backdropTopFadeMask,
      }}
      aria-hidden
    >
      <div className="absolute inset-0 size-full bg-gradient-to-b from-transparent via-background/55 to-background/88" />

      {auroraBands.map((band, i) => (
        <div
          key={`aurora-${i}`}
          className="absolute -left-[30%] h-[38%] w-[160%] motion-reduce:translate-none"
          style={{
            top: band.y,
            opacity: band.opacity,
            transform: `translate3d(${band.shift}px, ${driftY * 0.35}px, 0) rotate(${band.rotate}deg)`,
            background: `linear-gradient(90deg, transparent 0%, ${blendedAccent}00 8%, ${blendedAccent}55 38%, ${blendedAccent}88 52%, ${blendedAccent}55 68%, transparent 92%)`,
            filter: 'blur(40px)',
          }}
        />
      ))}

      {experiences.map((exp, index) => {
        const weight = getJobFocusWeight(index, scrollProgress, count);
        const accent = resolveTimelineMobileAccent(exp.company);
        if (weight <= 0.01) return null;

        return (
          <div
            key={`${exp.company}-ambient-${index}`}
            className="absolute inset-0 motion-reduce:transition-none"
            style={{
              opacity: weight * 0.5,
              background: `radial-gradient(ellipse 90% 75% at 48% 40%, ${accent}38, transparent 70%)`,
            }}
          />
        );
      })}

      <div
        className="absolute -left-[22%] top-[4%] h-[58%] w-[68%] rounded-full blur-3xl motion-reduce:translate-none"
        style={{
          transform: `translate3d(${counterFarX}px, ${driftYBack}px, 0)`,
          background: `radial-gradient(circle, ${resolveTimelineMobileAccent(experiences[activeIndex]?.company ?? '')}22, transparent 72%)`,
        }}
      />

      <div
        className="absolute -right-[14%] bottom-[2%] h-[52%] w-[56%] rounded-full blur-3xl motion-reduce:translate-none"
        style={{
          transform: `translate3d(${counterMidX}px, ${driftY}px, 0)`,
          background: `radial-gradient(circle, ${blendedAccent}20, rgba(217,70,239,0.08) 48%, transparent 74%)`,
        }}
      />

      <div
        className="absolute left-1/2 top-[46%] h-[42%] w-[72%] rounded-full blur-3xl motion-reduce:translate-none"
        style={{
          transform: `translate3d(calc(-50% + ${counterNearX * -0.35}px), ${driftY * 0.25}px, 0)`,
          background: `radial-gradient(ellipse, ${blendedAccent}14, transparent 68%)`,
        }}
      />

      <div
        className="absolute -inset-[12%] opacity-[0.04] motion-reduce:opacity-[0.025] motion-reduce:translate-none"
        style={{
          transform: `translate3d(${gridShift}px, 0, 0)`,
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.55) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.55) 1px, transparent 1px)',
          backgroundSize: '72px 72px',
        }}
      />

      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(ellipse at center, transparent 38%, rgba(0,0,0,${vignetteStrength}) 100%)`,
        }}
      />
    </div>
  );
}
