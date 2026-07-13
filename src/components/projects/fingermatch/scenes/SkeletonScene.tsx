/* eslint-disable @next/next/no-img-element -- layered stage images with absolute positioning + SVG coordinate overlays; next/image is unsuitable here */
import { useTranslations } from 'next-intl';
import { SceneStep } from '../parts';
import { ASSET } from '../tokens';

// A few plausible spur spots (viewBox 0..100) that retract as they're pruned.
const SPURS = [
  { x: 30, y: 22, a: -0.7 },
  { x: 68, y: 34, a: 0.5 },
  { x: 44, y: 74, a: 2.4 },
  { x: 72, y: 66, a: 1.9 },
];

export function SkeletonScene() {
  const td = useTranslations('projects.fingermatchDetail');

  return (
    <section data-scene="skeleton" className="relative">
      <div
        data-pin="skeleton"
        className="flex flex-col justify-center px-4 py-14 lg:min-h-[100svh]"
      >
        <div className="mx-auto grid w-full max-w-5xl items-center gap-8 lg:grid-cols-2">
          <div>
            <SceneStep>{td('skeleton.step')}</SceneStep>
            <h2 className="font-display text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              {td('skeleton.heading')}
            </h2>
            <p className="mt-3 max-w-md text-sm text-muted-foreground md:text-base">
              {td('skeleton.sub')}
            </p>
            <div className="mt-6 inline-flex items-center gap-3 rounded-xl border border-border/50 bg-card/40 px-4 py-3">
              <span className="font-mono text-2xl font-bold text-red-400" data-spur-count>
                4
              </span>
              <span className="text-sm text-muted-foreground">{td('skeleton.spursLabel')}</span>
            </div>
          </div>

          <div className="relative mx-auto aspect-square w-full max-w-[440px] overflow-hidden rounded-2xl border border-white/10 bg-black">
            <img src={ASSET('binary-a.png')} alt="" className="absolute inset-0 h-full w-full" />
            <img
              data-skel
              src={ASSET('skeleton-a.png')}
              alt=""
              className="absolute inset-0 h-full w-full opacity-0"
            />
            <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full">
              {SPURS.map((s, i) => (
                <line
                  key={i}
                  data-spur
                  x1={s.x}
                  y1={s.y}
                  x2={s.x + Math.cos(s.a) * 5}
                  y2={s.y + Math.sin(s.a) * 5}
                  stroke="#f85149"
                  strokeWidth={1}
                  strokeLinecap="round"
                />
              ))}
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}
