/* eslint-disable @next/next/no-img-element -- layered stage images with absolute positioning + SVG coordinate overlays; next/image is unsuitable here */
import { useTranslations } from 'next-intl';
import { SceneStep, ScannerFrame } from '../parts';
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

            {/* before → after: a thick ridge collapses to a 1px line */}
            <div className="mt-6 grid max-w-md grid-cols-[1fr_auto_1fr] items-center gap-3">
              <div className="rounded-xl border border-border/50 bg-card/40 p-4">
                <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                  {td('skeleton.before')}
                </span>
                <div className="mt-3 flex h-6 items-center">
                  <span className="h-2.5 w-full rounded-full bg-white/75" />
                </div>
                <span className="mt-2 block text-xs text-muted-foreground">
                  {td('skeleton.beforeCaption')}
                </span>
              </div>
              <span className="font-mono text-lg text-primary">→</span>
              <div className="rounded-xl border border-primary/30 bg-primary/5 p-4">
                <span className="font-mono text-[10px] uppercase tracking-widest text-primary">
                  {td('skeleton.after')}
                </span>
                <div className="mt-3 flex h-6 items-center">
                  <span className="h-px w-full bg-white shadow-[0_0_8px_1px_rgba(255,255,255,0.6)]" />
                </div>
                <span className="mt-2 block text-xs text-muted-foreground">
                  {td('skeleton.afterCaption')}
                </span>
              </div>
            </div>

            <div className="mt-4 inline-flex items-center gap-3 rounded-xl border border-red-500/25 bg-red-500/[0.06] px-4 py-3">
              <span className="font-mono text-2xl font-bold text-red-400" data-spur-count>
                4
              </span>
              <span className="text-sm text-muted-foreground">{td('skeleton.spursLabel')}</span>
            </div>
          </div>

          <ScannerFrame label={td('skeleton.scanLabel')}>
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
          </ScannerFrame>
        </div>
      </div>
    </section>
  );
}
