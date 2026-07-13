import { useTranslations } from 'next-intl';
import { SceneStep, Glyph } from '../parts';
import { ASSET, DEMO, TYPE_TOKENS, TYPE_ORDER, type Minutia, type MinutiaType } from '../tokens';

const A_BY_ID = new Map(DEMO.A.minutiae.map(m => [m.id, m]));
const B_BY_ID = new Map(DEMO.B.minutiae.map(m => [m.id, m]));
const GAP = 120; // B panel starts at x=120 in a 0..220 viewBox

function glyphPoints(m: Minutia, ox: number) {
  return { cx: ox + m.x * 100, cy: m.y * 100 };
}

const R = 26;
const CIRC = 2 * Math.PI * R;

export function MatchScene() {
  const td = useTranslations('projects.fingermatchDetail');
  const pairs = DEMO.match.pairs;

  return (
    <section data-scene="match" className="relative">
      <div data-pin="match" className="flex flex-col justify-center px-4 py-14 lg:min-h-[100svh]">
        <div className="mx-auto w-full max-w-5xl">
          <div className="text-center lg:text-left">
            <SceneStep>{td('match.step')}</SceneStep>
            <h2 className="font-display text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              {td('match.heading')}
            </h2>
          </div>

          {/* Two prints in one coordinate space so pair lines cross cleanly */}
          <div className="mt-6 rounded-2xl border border-white/10 bg-black p-3">
            <svg viewBox="0 0 220 100" className="w-full">
              <image
                href={ASSET('raw-a.png')}
                x={0}
                y={0}
                width={100}
                height={100}
                opacity={0.65}
              />
              <image
                href={ASSET('raw-b.png')}
                x={GAP}
                y={0}
                width={100}
                height={100}
                opacity={0.65}
              />

              {/* RANSAC hypothesis guides — flicker during alignment */}
              {[30, 50, 70].map((y, i) => (
                <line
                  key={i}
                  data-hypo
                  x1={70}
                  y1={y}
                  x2={GAP + 30}
                  y2={y + (i - 1) * 8}
                  stroke="#8b949e"
                  strokeWidth={0.5}
                  strokeDasharray="2 2"
                  opacity={0}
                />
              ))}

              {/* Pair connection lines (real matched pairs) */}
              {pairs.map((p, i) => {
                const a = A_BY_ID.get(p.a);
                const b = B_BY_ID.get(p.b);
                if (!a || !b) return null;
                const pa = glyphPoints(a, 0);
                const pb = glyphPoints(b, GAP);
                return (
                  <line
                    key={i}
                    data-pair-line
                    x1={pa.cx}
                    y1={pa.cy}
                    x2={pb.cx}
                    y2={pb.cy}
                    stroke={TYPE_TOKENS[p.type].color}
                    strokeWidth={0.7}
                    strokeLinecap="round"
                    opacity={0.85}
                  />
                );
              })}

              {/* Endpoint dots on both prints */}
              {DEMO.A.minutiae.map(m => {
                const p = glyphPoints(m, 0);
                return (
                  <circle
                    key={`a${m.id}`}
                    data-match-dot
                    cx={p.cx}
                    cy={p.cy}
                    r={1.3}
                    fill={TYPE_TOKENS[m.type].color}
                  />
                );
              })}
              {DEMO.B.minutiae.map(m => {
                const p = glyphPoints(m, GAP);
                return (
                  <circle
                    key={`b${m.id}`}
                    data-match-dot
                    cx={p.cx}
                    cy={p.cy}
                    r={1.3}
                    fill={TYPE_TOKENS[m.type].color}
                  />
                );
              })}
            </svg>
          </div>

          {/* Verdict: score ring + per-type breakdown */}
          <div className="mt-6 grid items-center gap-6 sm:grid-cols-[auto_1fr]">
            <div className="mx-auto flex flex-col items-center">
              <svg viewBox="0 0 64 64" className="h-32 w-32 -rotate-90">
                <circle cx={32} cy={32} r={R} fill="none" stroke="#1c2128" strokeWidth={5} />
                <circle
                  data-score-arc
                  cx={32}
                  cy={32}
                  r={R}
                  fill="none"
                  stroke="hsl(var(--primary))"
                  strokeWidth={5}
                  strokeLinecap="round"
                  strokeDasharray={CIRC}
                  strokeDashoffset={CIRC}
                />
              </svg>
              <div className="-mt-[4.75rem] text-center">
                <div className="font-mono text-3xl font-bold text-foreground">
                  <span data-score-num>0</span>
                </div>
                <div className="text-[11px] uppercase tracking-widest text-muted-foreground">
                  {td('match.scoreLabel')}
                </div>
              </div>
              <div
                data-score-verdict
                className="mt-8 rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-xs font-medium text-primary opacity-0"
              >
                {td('match.verdict')}
              </div>
            </div>

            <div className="space-y-2">
              {TYPE_ORDER.filter(
                t => DEMO.match.perType[t].a > 0 || DEMO.match.perType[t].b > 0
              ).map((t: MinutiaType) => {
                const pt = DEMO.match.perType[t];
                const denom = Math.max(pt.a, pt.b, 1);
                return (
                  <div
                    key={t}
                    data-pertype-row
                    className="flex items-center gap-3 rounded-lg border border-border/50 bg-card/40 px-3 py-2"
                  >
                    <span className="flex w-28 shrink-0 items-center gap-2 text-sm text-foreground">
                      <Glyph type={t} /> {td(`match.${TYPE_TOKENS[t].labelKey}`)}
                    </span>
                    <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
                      <div
                        data-pertype-bar
                        className="h-full origin-left rounded-full"
                        style={{
                          background: TYPE_TOKENS[t].color,
                          transform: `scaleX(${pt.matched / denom})`,
                        }}
                      />
                    </div>
                    <span className="w-16 shrink-0 text-right font-mono text-xs text-muted-foreground">
                      <span data-pertype-matched data-to={pt.matched}>
                        0
                      </span>
                      /{pt.a}·{pt.b}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
