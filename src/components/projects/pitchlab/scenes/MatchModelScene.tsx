import { useLocale, useTranslations } from 'next-intl';
import { SceneStep, TeamBadge } from '../parts';
import { DEMO, OUTCOME, teamName } from '../tokens';

const f = DEMO.featured;
const MAXP = Math.max(...f.matrix.flat());
const DC_CELLS = new Set(['0-0', '1-0', '0-1', '1-1']); // Dixon-Coles corrects these

function outcomeColor(i: number, j: number) {
  if (i > j) return OUTCOME.home;
  if (i < j) return OUTCOME.away;
  return OUTCOME.draw;
}

export function MatchModelScene() {
  const td = useTranslations('projects.pitchlabDetail');
  const locale = useLocale();
  const segs = [
    { w: f.p[0], color: OUTCOME.home, label: f.home.code },
    { w: f.p[1], color: OUTCOME.draw, label: td('draw') },
    { w: f.p[2], color: OUTCOME.away, label: f.away.code },
  ];

  return (
    <section data-scene="matchmodel" className="relative">
      <div
        data-pin="matchmodel"
        className="flex flex-col justify-center px-4 py-14 lg:min-h-[100svh]"
      >
        <div className="mx-auto w-full max-w-5xl">
          <div className="text-center lg:text-left">
            <SceneStep>{td('matchmodel.step')}</SceneStep>
            <h2 className="font-display text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              {td('matchmodel.heading')}
            </h2>
          </div>

          <div className="mt-6 grid items-center gap-8 lg:grid-cols-[1fr_1.1fr]">
            {/* explainer + derived result */}
            <div>
              <div className="mb-4 flex items-center gap-2 text-sm">
                <TeamBadge team={f.home} size="sm" />
                <span className="font-medium text-foreground">{teamName(f.home, locale)}</span>
                <span className="font-mono text-xs text-muted-foreground">
                  λ {f.xg[0]} · {f.xg[1]} λ
                </span>
                <span className="font-medium text-foreground">{teamName(f.away, locale)}</span>
                <TeamBadge team={f.away} size="sm" />
              </div>
              <p className="max-w-md text-sm text-muted-foreground md:text-base">
                {td('matchmodel.sub')}
              </p>
              <div className="mt-4 inline-flex items-center gap-2 rounded-lg border border-border/50 bg-background/40 px-3 py-2 font-mono text-xs text-foreground">
                P(i,j) = Pois(i,λ)·Pois(j,μ)·τ(i,j)
              </div>

              {/* derived win / draw / loss */}
              <div className="mt-6">
                <div className="flex h-3 w-full overflow-hidden rounded-full bg-muted">
                  {segs.map((s, i) => (
                    <div
                      key={i}
                      data-mm-seg
                      className="h-full origin-left"
                      style={{ width: `${s.w}%`, backgroundColor: s.color }}
                    />
                  ))}
                </div>
                <div className="mt-2 flex justify-between font-mono text-xs">
                  {segs.map((s, i) => (
                    <span key={i} style={{ color: s.color }}>
                      {s.label} {s.w}%
                    </span>
                  ))}
                </div>
              </div>

              <p data-mm-dc-note className="mt-5 text-xs text-muted-foreground opacity-0">
                <span className="font-mono text-primary">τ (ρ={f.rho})</span> —{' '}
                {td('matchmodel.dcNote')}
              </p>
            </div>

            {/* scoreline heatmap */}
            <div className="mx-auto w-full max-w-[420px]">
              <div
                className="grid gap-1"
                style={{ gridTemplateColumns: 'auto repeat(6, minmax(0, 1fr))' }}
              >
                <div />
                {[0, 1, 2, 3, 4, 5].map(j => (
                  <div
                    key={`c${j}`}
                    className="text-center font-mono text-[10px] text-muted-foreground"
                  >
                    {j}
                  </div>
                ))}
                {f.matrix.map((row, i) => (
                  <FragmentRow key={i} i={i} row={row} likely={f.likely} />
                ))}
              </div>
              <div className="mt-3 flex items-center justify-center gap-4 font-mono text-[10px] uppercase tracking-widest">
                <span className="flex items-center gap-1.5" style={{ color: OUTCOME.home }}>
                  <span className="h-2 w-2 rounded-sm" style={{ background: OUTCOME.home }} />
                  {f.home.code}
                </span>
                <span className="flex items-center gap-1.5" style={{ color: OUTCOME.draw }}>
                  <span className="h-2 w-2 rounded-sm" style={{ background: OUTCOME.draw }} />
                  {td('draw')}
                </span>
                <span className="flex items-center gap-1.5" style={{ color: OUTCOME.away }}>
                  <span className="h-2 w-2 rounded-sm" style={{ background: OUTCOME.away }} />
                  {f.away.code}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function FragmentRow({ i, row, likely }: { i: number; row: number[]; likely: [number, number] }) {
  return (
    <>
      <div className="flex items-center justify-center font-mono text-[10px] text-muted-foreground">
        {i}
      </div>
      {row.map((p, j) => {
        const isLikely = likely[0] === i && likely[1] === j;
        const isDc = DC_CELLS.has(`${i}-${j}`);
        const alpha = 0.1 + 0.9 * (p / MAXP);
        return (
          <div
            key={j}
            data-mm-cell
            data-mm-dc={isDc ? '' : undefined}
            className={`relative aspect-square rounded-[3px] ${isLikely ? 'ring-2 ring-white' : ''}`}
            style={{ backgroundColor: hexA(outcomeColor(i, j), alpha) }}
          >
            {isLikely ? (
              <span className="absolute inset-0 flex items-center justify-center font-mono text-[9px] font-bold text-white">
                {i}:{j}
              </span>
            ) : null}
          </div>
        );
      })}
    </>
  );
}

function hexA(hex: string, a: number) {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${a.toFixed(3)})`;
}
