/* eslint-disable @next/next/no-img-element -- layered stage images with absolute positioning + SVG coordinate overlays; next/image is unsuitable here */
import { useTranslations } from 'next-intl';
import { SceneStep } from '../parts';
import { ASSET, DEMO } from '../tokens';

const STEPS = ['stepNormalize', 'stepOrientation', 'stepGabor', 'stepBinarize'] as const;
const L = 1.7; // half-length of an orientation segment, in viewBox units

export function EnhanceScene() {
  const td = useTranslations('projects.fingermatchDetail');

  return (
    <section data-scene="enhance" className="relative">
      <div data-pin="enhance" className="flex flex-col justify-center px-4 py-14 lg:min-h-[100svh]">
        <div className="mx-auto grid w-full max-w-5xl items-center gap-8 lg:grid-cols-2">
          {/* The morphing print */}
          <div className="relative mx-auto aspect-square w-full max-w-[440px] overflow-hidden rounded-2xl border border-white/10 bg-black">
            <img src={ASSET('raw-a.png')} alt="" className="absolute inset-0 h-full w-full" />
            <img
              data-enh-layer="norm"
              src={ASSET('norm-a.png')}
              alt=""
              className="absolute inset-0 h-full w-full opacity-0"
            />
            <img
              data-enh-layer="gabor"
              src={ASSET('gabor-a.png')}
              alt=""
              className="absolute inset-0 h-full w-full opacity-0"
            />
            <img
              data-enh-layer="binary"
              src={ASSET('binary-a.png')}
              alt=""
              className="absolute inset-0 h-full w-full opacity-0"
            />
            {/* Orientation field overlay */}
            <svg
              data-orient
              viewBox="0 0 100 100"
              className="absolute inset-0 h-full w-full opacity-0"
              preserveAspectRatio="none"
            >
              {DEMO.orientation.map((o, i) => {
                // Round so SSR and client serialize identical attribute strings.
                const r = (n: number) => Math.round(n * 1000) / 1000;
                const cx = o.x * 100;
                const cy = o.y * 100;
                const dx = Math.cos(o.angle) * L;
                const dy = Math.sin(o.angle) * L;
                return (
                  <line
                    key={i}
                    data-orient-line
                    x1={r(cx - dx)}
                    y1={r(cy - dy)}
                    x2={r(cx + dx)}
                    y2={r(cy + dy)}
                    stroke="#58a6ff"
                    strokeWidth={0.6}
                    strokeLinecap="round"
                  />
                );
              })}
            </svg>
          </div>

          {/* The steps */}
          <div>
            <SceneStep>{td('enhance.step')}</SceneStep>
            <h2 className="font-display text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              {td('enhance.heading')}
            </h2>
            <p className="mt-3 max-w-md text-sm text-muted-foreground md:text-base">
              {td('enhance.sub')}
            </p>

            <ol className="mt-7 space-y-2.5">
              {STEPS.map((key, i) => (
                <li
                  key={key}
                  data-enh-step={i}
                  className="flex items-center gap-3 rounded-xl border border-border/50 bg-card/40 px-4 py-3 opacity-40"
                >
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-primary/40 font-mono text-xs text-primary">
                    {i + 1}
                  </span>
                  <span className="text-sm font-medium text-foreground">
                    {td(`enhance.${key}`)}
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
