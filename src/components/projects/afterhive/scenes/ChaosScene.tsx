import { useTranslations } from 'next-intl';
import { MessageCircle, Table2, ClipboardList, Banknote, Globe } from 'lucide-react';
import { SceneStep, BrowserFrame } from '../parts';
import { ASSET } from '../tokens';

/**
 * Opener: "Ersetzt das Chaos." Five stylized mock cards standing in for the
 * pile of tools a club juggles today (a group chat, a spreadsheet, a paper
 * attendance list, bank transfers, an old website). On desktop the scene is
 * pinned and, as you scroll, the tools converge on and dissolve into a single
 * afterhive window. On mobile the tools stack above the app, no pin.
 */

const TOOLS = [
  { key: 'chat', icon: MessageCircle, pos: 'lg:left-[2%] lg:top-[4%]', rot: '-7deg' },
  { key: 'sheet', icon: Table2, pos: 'lg:right-[3%] lg:top-[8%]', rot: '6deg' },
  { key: 'paper', icon: ClipboardList, pos: 'lg:left-[6%] lg:bottom-[8%]', rot: '5deg' },
  { key: 'bank', icon: Banknote, pos: 'lg:right-[5%] lg:bottom-[6%]', rot: '-5deg' },
  { key: 'oldsite', icon: Globe, pos: 'lg:left-1/2 lg:top-[-2%] lg:-translate-x-1/2', rot: '3deg' },
] as const;

function ToolCard({
  index,
  icon: Icon,
  label,
  meta,
  posClass,
  rot,
}: {
  index: number;
  icon: typeof MessageCircle;
  label: string;
  meta: string;
  posClass: string;
  rot: string;
}) {
  return (
    <div
      data-chaos-tool={index}
      style={{ '--rot': rot } as React.CSSProperties}
      className={`w-full max-w-[15rem] rounded-2xl border border-white/10 bg-white/[0.05] p-4 shadow-[0_18px_50px_-24px_rgba(0,0,0,0.8)] backdrop-blur-md lg:absolute lg:w-56 ${posClass}`}
    >
      <div className="flex items-center gap-2.5">
        <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/[0.06] text-muted-foreground">
          <Icon className="h-5 w-5" />
        </span>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-foreground/90">{label}</p>
          <p className="truncate text-[11px] text-muted-foreground">{meta}</p>
        </div>
      </div>
    </div>
  );
}

export function ChaosScene() {
  const td = useTranslations('projects.afterhiveDetail');

  return (
    <section data-scene="chaos" className="relative px-4 py-20 lg:py-0">
      <div data-pin="chaos" className="lg:flex lg:h-screen lg:flex-col lg:justify-center">
        <div className="mx-auto w-full max-w-6xl">
          <div className="text-center">
            <SceneStep>{td('chaos.step')}</SceneStep>
            <h2 className="mx-auto max-w-2xl font-display text-3xl font-bold tracking-tight text-foreground md:text-5xl">
              {td('chaos.heading')}
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm text-muted-foreground md:text-base">
              {td('chaos.sub')}
            </p>
          </div>

          {/* Stage: scattered tools around a central afterhive window. */}
          <div className="relative mx-auto mt-10 flex max-w-3xl flex-col items-center gap-4 lg:mt-12 lg:block lg:min-h-[460px]">
            {TOOLS.map(({ key, icon, pos, rot }, i) => (
              <ToolCard
                key={key}
                index={i}
                icon={icon}
                label={td(`chaos.${key}.label`)}
                meta={td(`chaos.${key}.meta`)}
                posClass={pos}
                rot={rot}
              />
            ))}

            <div
              data-chaos-app
              className="relative z-10 mt-6 w-full lg:absolute lg:left-1/2 lg:top-1/2 lg:mt-0 lg:w-[46%] lg:-translate-x-1/2 lg:-translate-y-1/2"
            >
              <BrowserFrame src={ASSET('dashboard.png')} alt="afterhive" />
              <span
                data-chaos-badge
                className="mt-4 block text-center text-sm font-medium text-foreground/90 lg:absolute lg:-bottom-9 lg:left-0 lg:right-0 lg:mt-0"
              >
                {td('chaos.after')}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
