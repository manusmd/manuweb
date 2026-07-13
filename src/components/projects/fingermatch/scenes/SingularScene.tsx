/* eslint-disable @next/next/no-img-element -- layered stage image + SVG coordinate overlay; next/image is unsuitable here */
import { useTranslations } from 'next-intl';
import { SceneStep, MinutiaMarker, Glyph, ScannerFrame } from '../parts';
import { ASSET, DEMO } from '../tokens';

const LOOP = DEMO.A.minutiae.find(m => m.type === 'loop');
const DELTA = DEMO.A.minutiae.find(m => m.type === 'delta');

export function SingularScene() {
  const td = useTranslations('projects.fingermatchDetail');

  return (
    <section data-scene="singular" className="relative">
      <div
        data-pin="singular"
        className="flex flex-col justify-center px-4 py-14 lg:min-h-[100svh]"
      >
        <div className="mx-auto grid w-full max-w-5xl items-center gap-8 lg:grid-cols-2">
          <div>
            <SceneStep>{td('singular.step')}</SceneStep>
            <h2 className="font-display text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              {td('singular.heading')}
            </h2>
            <p className="mt-3 max-w-md text-sm text-muted-foreground md:text-base">
              {td('singular.sub')}
            </p>

            <div className="mt-6 space-y-3">
              <div className="flex items-center justify-between rounded-xl border border-border/50 bg-card/40 px-4 py-3">
                <span className="flex items-center gap-2 text-sm font-medium text-foreground">
                  <Glyph type="loop" /> {td('singular.typeLoop')}
                </span>
                <span className="font-mono text-sm text-[#58a6ff]" data-poincare-loop-deg>
                  +0°
                </span>
              </div>
              <div className="flex items-center justify-between rounded-xl border border-border/50 bg-card/40 px-4 py-3">
                <span className="flex items-center gap-2 text-sm font-medium text-foreground">
                  <Glyph type="delta" /> {td('singular.typeDelta')}
                </span>
                <span className="font-mono text-sm text-[#e3b341]" data-poincare-delta-deg>
                  −0°
                </span>
              </div>
            </div>
          </div>

          <ScannerFrame label={td('singular.scanLabel')}>
            <img
              src={ASSET('skeleton-a.png')}
              alt=""
              className="absolute inset-0 h-full w-full opacity-45"
            />
            <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full">
              {/* accumulator ring around the core */}
              {LOOP ? (
                <circle
                  data-poincare-ring
                  cx={LOOP.x * 100}
                  cy={LOOP.y * 100}
                  r={9}
                  fill="none"
                  stroke="#58a6ff"
                  strokeWidth={1.2}
                  strokeDasharray="1 2"
                />
              ) : null}
              {LOOP ? (
                <g data-sing-marker>
                  <MinutiaMarker m={LOOP} size={4} />
                </g>
              ) : null}
              {DELTA ? (
                <g data-sing-marker>
                  <MinutiaMarker m={DELTA} size={4} />
                </g>
              ) : null}
            </svg>
          </ScannerFrame>
        </div>
      </div>
    </section>
  );
}
