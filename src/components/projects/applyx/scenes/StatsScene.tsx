import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { SceneStep } from '@/components/projects/applyx/SceneParts';

/* ----------------------------------- data ---------------------------------- */

const APPLICATION_SPARK = [42, 60, 48, 74, 55, 88, 68, 100];
const INTERVIEW_SPARK = [28, 44, 36, 60, 48, 78, 64, 92];

const GAUGE_R = 52;
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
const OUTCOME_TOTAL = 8;

const RESPONSE = [
  { key: 'bucketLt3', value: 0 },
  { key: 'bucket3to7', value: 2 },
  { key: 'bucket7to14', value: 3 },
  { key: 'bucket14to30', value: 1 },
  { key: 'bucket30plus', value: 0 },
  { key: 'bucketNone', value: 2, muted: true },
] as const;
const RESPONSE_MAX = 3;

const DONUT_R = 52;

function trapezoid(topW: number, botW: number) {
  return `polygon(${(100 - topW) / 2}% 0%, ${(100 + topW) / 2}% 0%, ${(100 + botW) / 2}% 100%, ${(100 - botW) / 2}% 100%)`;
}

const CARD =
  'rounded-2xl border border-border/40 bg-card/50 p-6 ring-1 ring-white/[0.04] backdrop-blur md:p-8';
const KPI_CARD =
  'group rounded-2xl border border-border/40 bg-card/50 p-5 ring-1 ring-white/[0.04] backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-[0_24px_60px_-24px_hsl(var(--primary)/0.35)]';
const SECTION_LABEL = 'text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground';

/* --------------------------- count-up (self-animating) ---------------------- */

function CountUp({
  value,
  suffix = '',
  className,
}: {
  value: number;
  suffix?: string;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(0);
  const seen = useRef(false);
  const fromRef = useRef(0);
  const valueRef = useRef(value);
  const rafRef = useRef(0);

  const animate = useCallback((to: number) => {
    cancelAnimationFrame(rafRef.current);
    const from = fromRef.current;
    fromRef.current = to;
    const reduce =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce || from === to) {
      setDisplay(to);
      return;
    }
    const start = performance.now();
    const dur = 800;
    const tick = (now: number) => {
      const t = Math.min((now - start) / dur, 1);
      setDisplay(from + (to - from) * (1 - Math.pow(1 - t, 3)));
      if (t < 1) rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      entries => {
        if (entries[0]?.isIntersecting && !seen.current) {
          seen.current = true;
          animate(valueRef.current);
        }
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(rafRef.current);
    };
  }, [animate]);

  useEffect(() => {
    valueRef.current = value;
    if (seen.current) animate(value);
  }, [value, animate]);

  return (
    <span ref={ref} className={className}>
      {Math.round(display)}
      {suffix}
    </span>
  );
}

function Sparkline({ bars, className }: { bars: readonly number[]; className: string }) {
  return (
    <div className="flex h-12 items-end gap-1">
      {bars.map((h, i) => (
        <div
          key={i}
          data-spark
          className={`flex-1 origin-bottom scale-y-0 rounded-[2px] transition-[filter] duration-200 hover:brightness-150 ${className}`}
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
    <section data-scene="stats" className="relative border-t border-border/30 px-4 py-24">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-4">
        <div>
          <SceneStep>{td('stats.step')}</SceneStep>
          <h2
            data-fade
            className="mb-2 font-display text-3xl font-bold tracking-tight text-foreground md:text-5xl"
          >
            {td('stats.heading')}
          </h2>
        </div>

        {/* Top KPIs */}
        <div data-fade className="grid gap-4 md:grid-cols-3">
          {/* Applications */}
          <div className={`flex flex-col justify-between gap-6 ${KPI_CARD}`}>
            <div>
              <p className="text-sm text-muted-foreground">{td('stats.applications')}</p>
              <p className="mt-1 font-display text-4xl font-bold text-primary md:text-5xl">
                <CountUp value={8} />
              </p>
            </div>
            <Sparkline
              bars={APPLICATION_SPARK}
              className="bg-gradient-to-t from-primary/30 to-primary group-hover:brightness-110"
            />
          </div>

          {/* Reply rate — animated donut gauge */}
          <div className={`flex flex-col items-center justify-center gap-3 ${KPI_CARD}`}>
            <div className="relative flex items-center justify-center">
              <svg
                viewBox="0 0 120 120"
                className="h-32 w-32 -rotate-90 transition-transform duration-300 group-hover:scale-105"
              >
                <circle
                  cx="60"
                  cy="60"
                  r={GAUGE_R}
                  fill="none"
                  stroke="hsl(var(--muted))"
                  strokeWidth="9"
                  opacity="0.5"
                />
                <circle
                  data-gauge-arc
                  data-gauge-offset={GAUGE_OFFSET}
                  cx="60"
                  cy="60"
                  r={GAUGE_R}
                  fill="none"
                  stroke="url(#replyGauge)"
                  strokeWidth="9"
                  strokeLinecap="round"
                  strokeDasharray={GAUGE_C}
                  strokeDashoffset={GAUGE_C}
                  className="transition-[filter] duration-300 group-hover:[filter:drop-shadow(0_0_6px_hsl(var(--primary)/0.7))]"
                />
                <defs>
                  <linearGradient id="replyGauge" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="hsl(var(--primary))" />
                    <stop offset="100%" stopColor="#8b5cf6" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute flex flex-col items-center">
                <CountUp
                  value={REPLY_RATE}
                  suffix="%"
                  className="font-display text-3xl font-bold text-foreground"
                />
              </div>
            </div>
            <p className="text-sm text-muted-foreground">{td('stats.replyRate')}</p>
          </div>

          {/* Interviews */}
          <div className={`flex flex-col justify-between gap-6 ${KPI_CARD}`}>
            <div>
              <p className="text-sm text-muted-foreground">{td('stats.interviews')}</p>
              <p className="mt-1 font-display text-4xl font-bold text-accent-green md:text-5xl">
                <CountUp value={4} />
              </p>
            </div>
            <Sparkline
              bars={INTERVIEW_SPARK}
              className="bg-gradient-to-t from-accent-green/30 to-accent-green group-hover:brightness-110"
            />
          </div>
        </div>

        {/* FUNNEL (pipeline trichter) */}
        <div data-fade data-funnel className={`relative overflow-hidden ${CARD}`}>
          <div
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-3xl"
          />
          <span className={SECTION_LABEL}>{td('stats.funnel')}</span>
          <div className="mt-6 space-y-1.5" onMouseLeave={() => setHoveredStage(null)}>
            {FUNNEL.map((s, i) => {
              const isHovered = hoveredStage === i;
              const dim = hoveredStage !== null && !isHovered;
              return (
                <div
                  key={s.key}
                  className="flex cursor-default items-center gap-4"
                  onMouseEnter={() => setHoveredStage(i)}
                >
                  <div className="w-36 shrink-0 sm:w-52">
                    <div
                      data-funnel-seg
                      className="flex h-16 origin-top items-center justify-center transition-[filter] duration-300"
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
                      <span className="font-display text-2xl font-bold text-white drop-shadow-sm">
                        {s.count}
                      </span>
                    </div>
                  </div>
                  <div className="min-w-0">
                    <p
                      className={`font-semibold transition-colors ${dim ? 'text-muted-foreground' : 'text-foreground'}`}
                    >
                      {td(`stats.${s.key}`)}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {s.pct}% {s.ofPrev ? td('stats.funnelOfPrev') : td('stats.funnelOfTotal')}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* OUTCOMES + TIME TO FIRST RESPONSE */}
        <div className="grid gap-4 md:grid-cols-2">
          {/* Outcomes donut */}
          <div data-fade className={CARD}>
            <span className={SECTION_LABEL}>{td('stats.outcomes')}</span>
            <div className="mt-4 flex items-center gap-6">
              <div className="relative shrink-0" onMouseLeave={() => setHoveredOutcome(null)}>
                <svg viewBox="0 0 140 140" className="h-36 w-36 -rotate-90">
                  <circle
                    cx="70"
                    cy="70"
                    r={DONUT_R}
                    fill="none"
                    stroke="hsl(var(--muted))"
                    strokeWidth="14"
                    opacity="0.35"
                  />
                  {OUTCOMES.map((o, i) => (
                    <circle
                      key={o.key}
                      data-donut-arc
                      data-draw-from={o.from}
                      data-draw-to={o.to}
                      cx="70"
                      cy="70"
                      r={DONUT_R}
                      fill="none"
                      stroke={o.color}
                      strokeWidth="14"
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
                  <CountUp
                    value={OUTCOME_TOTAL}
                    className="font-display text-3xl font-bold text-foreground"
                  />
                  <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                    {td('stats.total')}
                  </span>
                </div>
              </div>

              <ul className="flex-1 space-y-2">
                {OUTCOMES.map((o, i) => (
                  <li
                    key={o.key}
                    onMouseEnter={() => setHoveredOutcome(i)}
                    onMouseLeave={() => setHoveredOutcome(null)}
                    className={`flex items-center gap-2 text-sm transition-opacity ${
                      hoveredOutcome === null || hoveredOutcome === i ? 'opacity-100' : 'opacity-40'
                    }`}
                  >
                    <span
                      className="h-2.5 w-2.5 shrink-0 rounded-full"
                      style={{ background: o.color }}
                    />
                    <span className="flex-1 text-foreground">{td(`stats.${o.key}`)}</span>
                    <span className="tabular-nums text-muted-foreground">
                      {o.value} · {o.pct}%
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Time to first response */}
          <div data-fade className={CARD}>
            <span className={SECTION_LABEL}>{td('stats.responseTitle')}</span>
            <p className="mt-1 text-sm text-muted-foreground">
              {td('stats.responseMedian', { days: 13 })}
            </p>
            <div className="mt-6 flex items-end justify-between gap-2">
              {RESPONSE.map(b => (
                <div key={b.key} className="flex flex-1 flex-col items-center">
                  <span className="mb-1.5 font-display text-sm font-semibold tabular-nums text-foreground">
                    {b.value}
                  </span>
                  <div className="flex h-28 w-full items-end">
                    <div
                      data-response-bar
                      className={`w-full origin-bottom rounded-t-md transition-[filter] duration-200 hover:brightness-125 ${
                        'muted' in b && b.muted
                          ? 'bg-gradient-to-t from-muted to-muted-foreground/40'
                          : 'bg-gradient-to-t from-primary/40 to-primary'
                      }`}
                      style={{ height: `${Math.max(b.value / RESPONSE_MAX, 0.04) * 100}%` }}
                    />
                  </div>
                  <span className="mt-2 text-center text-[10px] leading-tight text-muted-foreground">
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
