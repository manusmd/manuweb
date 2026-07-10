import { useTranslations } from 'next-intl';
import { Mail, Search } from 'lucide-react';
import { SceneStep } from '@/components/projects/applyx/SceneParts';

const CARD =
  'rounded-2xl border border-border/40 bg-card/50 p-6 ring-1 ring-white/[0.04] backdrop-blur md:p-8';
const SECTION_LABEL = 'text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground';

// Each question the scrub reveals, in order, with the block type it resolves to.
const QUESTIONS = ['stat', 'breakdown', 'list', 'funnel', 'detail', 'messages'] as const;

const EMBED_DOTS = [
  { x: 250, y: 60, near: true },
  { x: 306, y: 122, near: true },
  { x: 240, y: 188, near: true },
  { x: 176, y: 44, near: false },
  { x: 208, y: 128, near: false },
  { x: 150, y: 196, near: false },
  { x: 322, y: 196, near: false },
  { x: 306, y: 40, near: false },
] as const;
const QUERY = { x: 46, y: 122 };

type TD = ReturnType<typeof useTranslations>;

/** The concrete answer block for each question — one per intent the router resolves. */
function AnswerBlock({ type, td }: { type: string; td: TD }) {
  switch (type) {
    case 'stat':
      return (
        <div>
          <div className="flex items-end gap-2">
            <span className="font-display text-4xl font-bold leading-none text-primary">3</span>
            <span className="mb-0.5 text-sm text-muted-foreground">{td('ask.statOf')} 11</span>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs text-primary">
              6 {td('ask.segActive')}
            </span>
            <span className="rounded-full bg-red-500/10 px-2.5 py-0.5 text-xs text-red-400">
              3 {td('ask.segRejected')}
            </span>
            <span className="rounded-full bg-accent-green/10 px-2.5 py-0.5 text-xs text-accent-green">
              2 {td('ask.segInterview')}
            </span>
          </div>
        </div>
      );
    case 'breakdown':
      return (
        <div className="space-y-2">
          {[
            { label: td('ask.segActive'), n: 6, w: '100%', c: 'bg-primary' },
            { label: td('ask.segRejected'), n: 3, w: '50%', c: 'bg-red-400' },
            { label: td('ask.segInterview'), n: 2, w: '33%', c: 'bg-accent-green' },
          ].map(b => (
            <div key={b.label} className="flex items-center gap-3 text-xs">
              <span className="w-20 shrink-0 text-muted-foreground">{b.label}</span>
              <div className="h-2 flex-1 rounded-full bg-muted">
                <div className={`h-full rounded-full ${b.c}`} style={{ width: b.w }} />
              </div>
              <span className="w-4 shrink-0 text-right tabular-nums text-foreground">{b.n}</span>
            </div>
          ))}
        </div>
      );
    case 'list':
      return (
        <ul className="divide-y divide-border/40">
          {[
            { co: 'Acme', stage: td('ask.listStageReview') },
            { co: 'Northwind Labs', stage: td('pipeline.stageInterview') },
            { co: 'Globex', stage: td('ask.listStageApplied') },
            { co: 'Initech', stage: td('pipeline.stageInterview') },
          ].map(r => (
            <li key={r.co} className="flex items-center justify-between gap-3 py-2 text-sm">
              <span className="flex items-center gap-2 text-foreground">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                {r.co}
              </span>
              <span className="text-xs text-muted-foreground">{r.stage}</span>
            </li>
          ))}
        </ul>
      );
    case 'funnel':
      return (
        <div className="space-y-1.5">
          {[
            { label: td('stats.funnelApplied'), n: 8, w: '100%' },
            { label: td('stats.funnelReplied'), n: 6, w: '74%' },
            { label: td('stats.funnelInterview'), n: 4, w: '48%' },
            { label: td('stats.funnelOffer'), n: 1, w: '22%' },
          ].map(s => (
            <div key={s.label} className="flex items-center gap-3 text-xs">
              <span className="w-24 shrink-0 text-muted-foreground">{s.label}</span>
              <div
                className="h-4 rounded-sm bg-gradient-to-r from-primary to-accent-violet"
                style={{ width: s.w }}
              />
              <span className="tabular-nums text-foreground">{s.n}</span>
            </div>
          ))}
        </div>
      );
    case 'detail':
      return (
        <div className="rounded-lg border border-border/50 bg-background/40 p-3.5">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-foreground">Northwind Labs</span>
            <span className="rounded-full bg-accent-green/10 px-2 py-0.5 text-[11px] text-accent-green">
              {td('pipeline.stageInterview')}
            </span>
          </div>
          <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
            <Mail className="h-3.5 w-3.5" />
            <span className="text-foreground">{td('ask.detailLast')}</span>
            <span>· {td('ask.detailIdle')}</span>
          </div>
        </div>
      );
    case 'messages':
      return (
        <div className="space-y-2">
          {[
            { co: 'Northwind Labs', text: td('ask.msgText1') },
            { co: 'Acme', text: td('ask.msgText2') },
          ].map(m => (
            <div
              key={m.co}
              className="flex gap-2.5 rounded-lg border border-border/50 bg-background/40 p-2.5"
            >
              <Mail className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground" />
              <div className="min-w-0">
                <p className="text-xs font-medium text-foreground">{m.co}</p>
                <p className="truncate text-xs text-muted-foreground">{m.text}</p>
              </div>
            </div>
          ))}
        </div>
      );
    default:
      return null;
  }
}

export function AskScene() {
  const td = useTranslations('projects.applyxDetail');

  return (
    <section data-scene="ask" className="relative">
      {/* Pinned + scrubbed with snap: scrolling steps through the questions, each one
          typing in (data-ask-q) and revealing its typed block (data-ask-reveal). Only
          one panel is shown at a time (data-ask-panel), so there's never any bleed. */}
      <div
        data-pin="ask"
        className="flex flex-col justify-center px-4 py-16 lg:min-h-[100svh] lg:py-20"
      >
        <div className="mx-auto w-full max-w-5xl">
          <div className="text-center lg:text-left">
            <SceneStep>{td('ask.step')}</SceneStep>
            <h2 className="font-display text-3xl font-bold tracking-tight text-foreground md:text-5xl">
              {td('ask.heading')}
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-base text-muted-foreground md:text-lg lg:mx-0">
              {td('ask.sub')}
            </p>
          </div>

          <div className="mt-8 grid gap-5 lg:grid-cols-2 lg:items-stretch">
            {/* LEFT: one question panel visible at a time */}
            <div className={`flex flex-col ${CARD}`}>
              <div className="relative min-h-[300px] flex-1">
                {QUESTIONS.map((type, i) => (
                  <div
                    key={type}
                    data-ask-panel
                    className="absolute inset-0 flex flex-col"
                    style={{ opacity: i === 0 ? 1 : 0 }}
                  >
                    <div className="flex items-center gap-2 rounded-xl border border-border/60 bg-background/50 px-3 py-2.5">
                      <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
                      <span data-ask-q className="text-sm text-foreground">
                        {td(`ask.q_${type}`)}
                      </span>
                      <span className="ml-0.5 h-4 w-px animate-pulse bg-primary" aria-hidden />
                    </div>
                    <div data-ask-reveal className="mt-4" style={{ opacity: i === 0 ? 1 : 0 }}>
                      <div className="flex items-start justify-between gap-3">
                        <p className="text-base text-foreground">{td(`ask.a_${type}`)}</p>
                        <span className="mt-0.5 shrink-0 rounded-md border border-primary/40 bg-primary/10 px-2 py-0.5 font-mono text-[11px] text-primary">
                          {type}
                        </span>
                      </div>
                      <div className="mt-3 rounded-xl border border-border/50 bg-background/40 p-4">
                        <AnswerBlock type={type} td={td} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-5 border-t border-border/40 pt-4">
                <span className={SECTION_LABEL}>{td('ask.blocksLabel')}</span>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {QUESTIONS.map(type => (
                    <span
                      key={type}
                      data-ask-legend
                      className="rounded-md border border-border/50 bg-muted/40 px-2 py-0.5 font-mono text-[11px] text-muted-foreground transition-colors duration-300"
                    >
                      {type}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* RIGHT: semantic retrieval over local embeddings (scrub-drawn) */}
            <div className={`flex flex-col ${CARD}`}>
              <span className={SECTION_LABEL}>{td('ask.semanticLabel')}</span>
              <svg viewBox="0 0 360 240" className="my-auto w-full">
                {EMBED_DOTS.filter(d => d.near).map((d, idx) => (
                  <line
                    key={`l${idx}`}
                    data-embed-line
                    x1={QUERY.x}
                    y1={QUERY.y}
                    x2={d.x}
                    y2={d.y}
                    stroke="url(#askLine)"
                    strokeWidth="1.5"
                  />
                ))}
                {EMBED_DOTS.map((d, idx) => (
                  <circle
                    key={`d${idx}`}
                    data-embed-dot
                    data-embed-near={d.near ? 'true' : undefined}
                    cx={d.x}
                    cy={d.y}
                    r={d.near ? 6 : 4}
                    fill={d.near ? 'hsl(var(--accent-green))' : 'hsl(var(--muted-foreground))'}
                    opacity={d.near ? 1 : 0.4}
                  />
                ))}
                <circle
                  data-embed-query
                  cx={QUERY.x}
                  cy={QUERY.y}
                  r="9"
                  fill="hsl(var(--primary))"
                />
                <defs>
                  <linearGradient id="askLine" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="hsl(var(--primary))" />
                    <stop offset="100%" stopColor="hsl(var(--accent-green))" />
                  </linearGradient>
                </defs>
              </svg>
              <p className="text-sm text-muted-foreground">{td('ask.retrievalNote')}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Coda (not pinned): who does what — the model only classifies + phrases */}
      <div className="px-4 py-24">
        <div className="mx-auto w-full max-w-5xl">
          <span className={SECTION_LABEL}>{td('ask.flowTitle')}</span>
          <ol className="mt-5 grid gap-3 sm:grid-cols-2">
            {(
              [
                { key: 'intent', who: 'model' },
                { key: 'facts', who: 'code' },
                { key: 'phrase', who: 'model' },
                { key: 'block', who: 'code' },
              ] as const
            ).map((s, idx) => (
              <li key={s.key} data-fade className={`flex items-start gap-3 ${CARD}`}>
                <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-border/60 bg-background/50 text-xs font-semibold text-muted-foreground">
                  {idx + 1}
                </span>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-semibold text-foreground">{td(`ask.step_${s.key}`)}</span>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
                        s.who === 'model'
                          ? 'bg-accent-violet/10 text-accent-violet'
                          : 'bg-primary/10 text-primary'
                      }`}
                    >
                      {s.who === 'model' ? td('ask.byModel') : td('ask.byCode')}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {td(`ask.step_${s.key}Desc`)}
                  </p>
                </div>
              </li>
            ))}
          </ol>
          <p className="mx-auto mt-6 max-w-2xl text-center text-sm leading-relaxed text-muted-foreground">
            {td('ask.note')}
          </p>
        </div>
      </div>
    </section>
  );
}
