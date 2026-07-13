/* eslint-disable @next/next/no-img-element -- layered stage images with absolute positioning + SVG coordinate overlays; next/image is unsuitable here */
import { useTranslations } from 'next-intl';
import { SceneStep, MinutiaMarker, Glyph } from '../parts';
import { ASSET, DEMO } from '../tokens';

const RIDGE = DEMO.A.minutiae.filter(m => m.type === 'ending' || m.type === 'bifurcation');
const endingCount = RIDGE.filter(m => m.type === 'ending').length;
const bifCount = RIDGE.filter(m => m.type === 'bifurcation').length;

/** A tiny 3×3 crossing-number diagram: a skeleton ridge drawn over a dot grid. */
function CnCase({ variant }: { variant: 'ending' | 'bifurcation' }) {
  const color = variant === 'ending' ? '#f85149' : '#3fb950';
  return (
    <svg viewBox="0 0 30 30" className="h-16 w-16">
      {[0, 1, 2].map(r =>
        [0, 1, 2].map(c => (
          <circle key={`${r}${c}`} cx={5 + c * 10} cy={5 + r * 10} r={1.1} fill="#2b3038" />
        ))
      )}
      {variant === 'ending' ? (
        <path d="M15 15 L15 25" stroke={color} strokeWidth={2} strokeLinecap="round" />
      ) : (
        <path
          d="M15 25 L15 15 M15 15 L6 6 M15 15 L24 6"
          stroke={color}
          strokeWidth={2}
          strokeLinecap="round"
          fill="none"
        />
      )}
      <circle cx={15} cy={15} r={2.2} fill={color} />
    </svg>
  );
}

export function MinutiaeScene() {
  const td = useTranslations('projects.fingermatchDetail');

  return (
    <section data-scene="minutiae" className="relative">
      <div
        data-pin="minutiae"
        className="flex flex-col justify-center px-4 py-14 lg:min-h-[100svh]"
      >
        <div className="mx-auto w-full max-w-5xl">
          <div className="text-center lg:text-left">
            <SceneStep>{td('minutiae.step')}</SceneStep>
            <h2 className="font-display text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              {td('minutiae.heading')}
            </h2>
          </div>

          <div className="mt-6 grid items-center gap-8 lg:grid-cols-2">
            {/* Explainer */}
            <div>
              <p className="max-w-md text-sm text-muted-foreground md:text-base">
                {td('minutiae.sub')}
              </p>
              <div className="mt-4 inline-flex items-center gap-2 rounded-lg border border-border/50 bg-background/40 px-3 py-2 font-mono text-sm text-foreground">
                CN = ½·Σ|pᵢ − pᵢ₊₁|
              </div>
              <div className="mt-5 grid grid-cols-2 gap-3">
                <div
                  data-cn-case
                  className="flex items-center gap-3 rounded-xl border border-border/50 bg-card/40 p-3"
                >
                  <CnCase variant="ending" />
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      {td('minutiae.typeEnding')}
                    </p>
                    <p className="font-mono text-xs text-red-400">CN = 1</p>
                  </div>
                </div>
                <div
                  data-cn-case
                  className="flex items-center gap-3 rounded-xl border border-border/50 bg-card/40 p-3"
                >
                  <CnCase variant="bifurcation" />
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      {td('minutiae.typeBifurcation')}
                    </p>
                    <p className="font-mono text-xs text-green-400">CN = 3</p>
                  </div>
                </div>
              </div>
              <div className="mt-5 flex items-center gap-4 text-sm">
                <span className="flex items-center gap-2 text-muted-foreground">
                  <Glyph type="ending" /> {endingCount} {td('minutiae.typeEnding')}
                </span>
                <span className="flex items-center gap-2 text-muted-foreground">
                  <Glyph type="bifurcation" /> {bifCount} {td('minutiae.typeBifurcation')}
                </span>
              </div>
            </div>

            {/* The print with markers */}
            <div className="relative mx-auto aspect-square w-full max-w-[420px] overflow-hidden rounded-2xl border border-white/10 bg-black">
              <img
                src={ASSET('skeleton-a.png')}
                alt=""
                className="absolute inset-0 h-full w-full opacity-70"
              />
              <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full">
                {RIDGE.map(m => (
                  <MinutiaMarker key={m.id} m={m} tick extraProps={{ 'data-min-marker': '' }} />
                ))}
              </svg>
              <div className="absolute bottom-3 right-3 rounded-lg bg-black/70 px-2.5 py-1 font-mono text-sm text-foreground backdrop-blur">
                <span data-min-count>0</span> {td('minutiae.found')}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
