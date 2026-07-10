'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { SceneStep } from '@/components/projects/applyx/SceneParts';

/* ----------------------------------- data ---------------------------------- */

const APPLICATION_SPARK = [42, 60, 48, 74, 55, 88, 68, 100];
const INTERVIEW_SPARK = [28, 44, 36, 60, 48, 78, 64, 92];

const GAUGE_R = 34;
const GAUGE_C = 2 * Math.PI * GAUGE_R;
const REPLY_RATE = 75;
const GAUGE_OFFSET = GAUGE_C * (1 - REPLY_RATE / 100);

// Trapezoid widths taper stage-to-stage (bottom of one = top of the next).
const FUNNEL = [
  {
    key: 'funnelApplied',
    count: 8,
    pct: 100,
    ofPrev: false,
    topW: 100,
    botW: 74,
    from: '#5b8cff',
    to: '#6f6bf2',
  },
  {
    key: 'funnelReplied',
    count: 6,
    pct: 75,
    ofPrev: true,
    topW: 74,
    botW: 50,
    from: '#6f6bf2',
    to: '#8b5cf6',
  },
  {
    key: 'funnelInterview',
    count: 4,
    pct: 67,
    ofPrev: true,
    topW: 50,
    botW: 28,
    from: '#8b5cf6',
    to: '#45cdb0',
  },
  {
    key: 'funnelOffer',
    count: 1,
    pct: 25,
    ofPrev: true,
    topW: 28,
    botW: 17,
    from: '#45cdb0',
    to: '#22c07a',
  },
] as const;

const OUTCOMES = [
  { key: 'outcomeActive', value: 4, pct: 50, color: '#5b8cff', from: 0, to: 50 },
  { key: 'outcomeRejected', value: 2, pct: 25, color: '#f87171', from: 50, to: 75 },
  { key: 'outcomeOffer', value: 1, pct: 13, color: '#34d399', from: 75, to: 87.5 },
  { key: 'outcomeGhosted', value: 1, pct: 13, color: '#facc15', from: 87.5, to: 100 },
] as const;

const RESPONSE = [
  { key: 'bucketLt3', value: 0 },
  { key: 'bucket3to7', value: 2 },
  { key: 'bucket7to14', value: 3 },
  { key: 'bucket14to30', value: 1 },
  { key: 'bucket30plus', value: 0 },
  { key: 'bucketNone', value: 2, muted: true },
] as const;
const RESPONSE_MAX = 3;

const DONUT_R = 44;

function trapezoid(topW: number, botW: number) {
  return `polygon(${(100 - topW) / 2}% 0%, ${(100 + topW) / 2}% 0%, ${(100 + botW) / 2}% 100%, ${(100 - botW) / 2}% 100%)`;
}

const CARD =
  'rounded-2xl border border-border/40 bg-card/50 p-5 ring-1 ring-white/[0.04] backdrop-blur';
const SECTION_LABEL = 'text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground';

/** A number the scrub counts up (see useApplyxScrollExperience, [data-stat-count]). */
function StatNumber({
  to,
  suffix = '',
  className,
}: {
  to: number;
  suffix?: string;
  className?: string;
}) {
  return (
    <span data-stat-count data-to={to} data-suffix={suffix} className={className}>
      {to}
      {suffix}
    </span>
  );
}

function Sparkline({ bars, className }: { bars: readonly number[]; className: string }) {
  return (
    <div className="flex h-7 items-end gap-0.5">
      {bars.map((h, i) => (
        <div
          key={i}
          data-spark
          className={`flex-1 origin-bottom scale-y-0 rounded-[1px] ${className}`}
          style={{ height: `${h}%` }}
        />
      ))}
    </div>
  );
}

/* --------------------------------- scene ----------------------------------- */

export function StatsScene() {
  const td = useTranslations('projects.applyxDetail');
  const [hoveredStage, setHoveredStage] = useState<number | null>(null);
  const [hoveredOutcome, setHoveredOutcome] = useState<number | null>(null);

  return (
    <section data-scene="stats" className="relative">
      <div
        data-pin="stats"
        className="flex flex-col justify-center px-4 py-16 lg:min-h-[100svh] lg:py-24"
      >
        <div className="mx-auto w-full max-w-5xl">
          <div className="mb-6 text-center lg:text-left">
            <SceneStep>{td('stats.step')}</SceneStep>
            <h2 className="font-display text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              {td('stats.heading')}
            </h2>
          </div>

          <div className="grid gap-4 lg:grid-cols-5">
            {/* FUNNEL — the hero, builds stage by stage */}
            <div className={`relative overflow-hidden lg:col-span-3 ${CARD}`}>
              <div
                aria-hidden
                className="pointer-events-none absolute left-1/2 top-1/2 h-56 w-56 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-3xl"
              />
              <span className={SECTION_LABEL}>{td('stats.funnel')}</span>
              <div className="mt-4 space-y-1.5" onMouseLeave={() => setHoveredStage(null)}>
                {FUNNEL.map((s, i) => {
                  const isHovered = hoveredStage === i;
                  const dim = hoveredStage !== null && !isHovered;
                  return (
                    <div
                      key={s.key}
                      className="flex cursor-default items-center gap-4"
                      onMouseEnter={() => setHoveredStage(i)}
                    >
                      <div className="w-32 shrink-0 sm:w-44">
                        <div
                          data-funnel-seg
                          className="flex h-12 origin-top items-center justify-center transition-[filter] duration-300"
                          style={{
                            clipPath: trapezoid(s.topW, s.botW),
                            background: `linear-gradient(180deg, rgba(255,255,255,0.28), rgba(255,255,255,0) 42%), linear-gradient(180deg, ${s.from}, ${s.to})`,
                            filter: isHovered
                              ? `brightness(1.12) drop-shadow(0 0 18px ${s.to}aa)`
                              : dim
                                ? 'brightness(0.5) saturate(0.75)'
                                : 'none',
                          }}
                        >
                          <span className="font-display text-xl font-bold text-white drop-shadow-sm">
                            {s.count}
                          </span>
                        </div>
                      </div>
                      <div className="min-w-0">
                        <p
                          className={`text-sm font-semibold transition-colors ${dim ? 'text-muted-foreground' : 'text-foreground'}`}
                        >
                          {td(`stats.${s.key}`)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {s.pct}% {s.ofPrev ? td('stats.funnelOfPrev') : td('stats.funnelOfTotal')}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* RIGHT: KPI trio + outcomes donut */}
            <div className="flex flex-col gap-4 lg:col-span-2">
              <div className="grid grid-cols-3 gap-3">
                <div className={`${CARD} !p-4`}>
                  <p className="truncate text-[11px] text-muted-foreground">
                    {td('stats.applications')}
                  </p>
                  <StatNumber
                    to={8}
                    className="mt-0.5 block font-display text-2xl font-bold text-primary"
                  />
                  <div className="mt-2">
                    <Sparkline
                      bars={APPLICATION_SPARK}
                      className="bg-gradient-to-t from-primary/30 to-primary"
                    />
                  </div>
                </div>

                <div className={`flex flex-col items-center justify-center ${CARD} !p-4`}>
                  <div className="relative flex items-center justify-center">
                    <svg viewBox="0 0 80 80" className="h-16 w-16 -rotate-90">
                      <circle
                        cx="40"
                        cy="40"
                        r={GAUGE_R}
                        fill="none"
                        stroke="hsl(var(--muted))"
                        strokeWidth="7"
                        opacity="0.5"
                      />
                      <circle
                        data-gauge-arc
                        data-gauge-offset={GAUGE_OFFSET}
                        cx="40"
                        cy="40"
                        r={GAUGE_R}
                        fill="none"
                        stroke="url(#replyGauge)"
                        strokeWidth="7"
                        strokeLinecap="round"
                        strokeDasharray={GAUGE_C}
                        strokeDashoffset={GAUGE_C}
                      />
                      <defs>
                        <linearGradient id="replyGauge" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="hsl(var(--primary))" />
                          <stop offset="100%" stopColor="#8b5cf6" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <StatNumber
                      to={REPLY_RATE}
                      suffix="%"
                      className="absolute font-display text-sm font-bold text-foreground"
                    />
                  </div>
                  <p className="mt-1.5 text-center text-[11px] leading-tight text-muted-foreground">
                    {td('stats.replyRate')}
                  </p>
                </div>

                <div className={`${CARD} !p-4`}>
                  <p className="truncate text-[11px] text-muted-foreground">
                    {td('stats.interviews')}
                  </p>
                  <StatNumber
                    to={4}
                    className="mt-0.5 block font-display text-2xl font-bold text-accent-green"
                  />
                  <div className="mt-2">
                    <Sparkline
                      bars={INTERVIEW_SPARK}
                      className="bg-gradient-to-t from-accent-green/30 to-accent-green"
                    />
                  </div>
                </div>
              </div>

              <div className={CARD}>
                <span className={SECTION_LABEL}>{td('stats.outcomes')}</span>
                <div className="mt-3 flex items-center gap-4">
                  <div className="relative shrink-0" onMouseLeave={() => setHoveredOutcome(null)}>
                    <svg viewBox="0 0 120 120" className="h-24 w-24 -rotate-90">
                      <circle
                        cx="60"
                        cy="60"
                        r={DONUT_R}
                        fill="none"
                        stroke="hsl(var(--muted))"
                        strokeWidth="12"
                        opacity="0.35"
                      />
                      {OUTCOMES.map((o, i) => (
                        <circle
                          key={o.key}
                          data-donut-arc
                          data-draw-from={o.from}
                          data-draw-to={o.to}
                          cx="60"
                          cy="60"
                          r={DONUT_R}
                          fill="none"
                          stroke={o.color}
                          strokeWidth="12"
                          strokeDasharray="0 1000"
                          style={{
                            opacity: hoveredOutcome === null || hoveredOutcome === i ? 1 : 0.25,
                            transition: 'opacity 200ms',
                          }}
                          onMouseEnter={() => setHoveredOutcome(i)}
                        />
                      ))}
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <StatNumber
                        to={8}
                        className="font-display text-xl font-bold text-foreground"
                      />
                    </div>
                  </div>

                  <ul className="flex-1 space-y-1">
                    {OUTCOMES.map((o, i) => (
                      <li
                        key={o.key}
                        onMouseEnter={() => setHoveredOutcome(i)}
                        onMouseLeave={() => setHoveredOutcome(null)}
                        className={`flex items-center gap-2 text-xs transition-opacity ${
                          hoveredOutcome === null || hoveredOutcome === i
                            ? 'opacity-100'
                            : 'opacity-40'
                        }`}
                      >
                        <span
                          className="h-2 w-2 shrink-0 rounded-full"
                          style={{ background: o.color }}
                        />
                        <span className="flex-1 text-foreground">{td(`stats.${o.key}`)}</span>
                        <span className="tabular-nums text-muted-foreground">{o.value}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* TIME TO FIRST RESPONSE — compact strip */}
          <div className={`mt-4 ${CARD}`}>
            <div className="flex items-baseline justify-between">
              <span className={SECTION_LABEL}>{td('stats.responseTitle')}</span>
              <span className="text-xs text-muted-foreground">
                {td('stats.responseMedian', { days: 13 })}
              </span>
            </div>
            <div className="mt-3 flex items-end justify-between gap-2">
              {RESPONSE.map(b => (
                <div key={b.key} className="flex flex-1 flex-col items-center">
                  <span className="mb-1 font-display text-xs font-semibold tabular-nums text-foreground">
                    {b.value}
                  </span>
                  <div className="flex h-14 w-full items-end">
                    <div
                      data-response-bar
                      className={`w-full origin-bottom rounded-t-md ${
                        'muted' in b && b.muted
                          ? 'bg-gradient-to-t from-muted to-muted-foreground/40'
                          : 'bg-gradient-to-t from-primary/40 to-primary'
                      }`}
                      style={{ height: `${Math.max(b.value / RESPONSE_MAX, 0.04) * 100}%` }}
                    />
                  </div>
                  <span className="mt-1.5 text-center text-[10px] leading-tight text-muted-foreground">
                    {td(`stats.${b.key}`)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
