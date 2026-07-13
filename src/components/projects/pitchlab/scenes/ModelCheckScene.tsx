import { useTranslations } from 'next-intl';
import { SceneStep, StatTile } from '../parts';
import { DEMO } from '../tokens';

const cal = DEMO.calibration;
const bt = DEMO.backtest;
const ALL = [...bt.model, ...bt.market];
const LO = Math.min(...ALL) - 0.005;
const HI = Math.max(...ALL) + 0.005;
const btY = (b: number) => 8 + ((b - LO) / (HI - LO)) * 84; // lower brier = higher on chart
const btX = (i: number) => (bt.labels.length === 1 ? 50 : (i / (bt.labels.length - 1)) * 100);
const line = (arr: number[]) => arr.map((b, i) => `${btX(i)},${btY(b)}`).join(' ');

export function ModelCheckScene() {
  const td = useTranslations('projects.pitchlabDetail');

  return (
    <section data-scene="modelcheck" className="relative px-4 py-20 md:py-28">
      <div className="mx-auto w-full max-w-5xl">
        <div className="text-center lg:text-left">
          <SceneStep>{td('modelcheck.step')}</SceneStep>
          <h2
            data-fade
            className="font-display text-3xl font-bold tracking-tight text-foreground md:text-5xl"
          >
            {td('modelcheck.heading')}
          </h2>
          <p
            data-fade
            className="mx-auto mt-3 max-w-2xl text-sm text-muted-foreground md:text-base lg:mx-0"
          >
            {td('modelcheck.sub')}
          </p>
        </div>

        <div className="mt-8 grid gap-4 lg:grid-cols-2">
          {/* reliability / calibration */}
          <div data-fade className="rounded-2xl border border-border/50 bg-card/40 p-5">
            <div className="mb-3 font-mono text-xs uppercase tracking-widest text-muted-foreground">
              {td('modelcheck.calibration')}
            </div>
            <svg viewBox="0 0 100 100" className="w-full">
              {[0, 25, 50, 75, 100].map(g => (
                <g key={g}>
                  <line
                    x1={g}
                    y1={0}
                    x2={g}
                    y2={100}
                    stroke="hsl(var(--border))"
                    strokeWidth={0.3}
                  />
                  <line
                    x1={0}
                    y1={g}
                    x2={100}
                    y2={g}
                    stroke="hsl(var(--border))"
                    strokeWidth={0.3}
                  />
                </g>
              ))}
              {/* ideal line: predicted == observed */}
              <line
                data-cal-ideal
                x1={0}
                y1={100}
                x2={100}
                y2={0}
                stroke="hsl(var(--muted-foreground))"
                strokeWidth={0.6}
                strokeDasharray="2 2"
              />
              {cal.points.map(([pred, obs], i) => (
                <circle
                  key={i}
                  data-cal-pt
                  cx={pred}
                  cy={100 - obs}
                  r={2.2}
                  fill="#4f7cff"
                  stroke="#0b0e13"
                  strokeWidth={0.5}
                />
              ))}
            </svg>
            <div className="mt-2 flex justify-between font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              <span>{td('modelcheck.predicted')}</span>
              <span>{td('modelcheck.observed')}</span>
            </div>
          </div>

          {/* Brier vs market backtest */}
          <div data-fade className="rounded-2xl border border-border/50 bg-card/40 p-5">
            <div className="mb-3 flex items-center justify-between font-mono text-xs uppercase tracking-widest">
              <span className="text-muted-foreground">{td('modelcheck.backtest')}</span>
              <span className="flex items-center gap-3">
                <span className="flex items-center gap-1.5 text-[#4f7cff]">
                  <span className="h-2 w-2 rounded-full bg-[#4f7cff]" />
                  {td('modelcheck.model')}
                </span>
                <span className="flex items-center gap-1.5 text-muted-foreground">
                  <span className="h-2 w-2 rounded-full bg-muted-foreground" />
                  {td('modelcheck.market')}
                </span>
              </span>
            </div>
            <svg viewBox="0 0 100 100" className="w-full" preserveAspectRatio="none">
              <polyline
                data-bt-line
                points={line(bt.market)}
                fill="none"
                stroke="hsl(var(--muted-foreground))"
                strokeWidth={1.2}
                strokeDasharray="3 2"
                vectorEffect="non-scaling-stroke"
              />
              <polyline
                data-bt-line
                points={line(bt.model)}
                fill="none"
                stroke="#4f7cff"
                strokeWidth={1.6}
                vectorEffect="non-scaling-stroke"
              />
            </svg>
            <div className="mt-2 flex justify-between font-mono text-[10px] text-muted-foreground">
              {bt.labels.map(l => (
                <span key={l}>{l}</span>
              ))}
            </div>
          </div>
        </div>

        {/* headline metrics */}
        <div data-fade className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <StatTile value={cal.brier} label={td('modelcheck.brier')} accent="#4f7cff" />
          <StatTile value={`${cal.hitRate}%`} label={td('modelcheck.hitRate')} />
          <StatTile value={`${cal.reliabilityGap}%`} label={td('modelcheck.gap')} />
          <StatTile value={cal.n} label={td('modelcheck.matches')} />
        </div>
      </div>
    </section>
  );
}
