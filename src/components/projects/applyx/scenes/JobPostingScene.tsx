import { useTranslations } from 'next-intl';
import {
  Building2,
  CalendarClock,
  Check,
  ClipboardPaste,
  Link2,
  Mail,
  Target,
  Wallet,
} from 'lucide-react';
import { SceneStep } from '@/components/projects/applyx/SceneParts';

const CARD =
  'rounded-2xl border border-border/40 bg-card/50 p-5 ring-1 ring-white/[0.04] backdrop-blur';
const SECTION_LABEL = 'text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground';

// The five ATS boards ApplyX recognises (see web/ats.ts). Proper nouns — same in both locales.
const ATS = ['Greenhouse', 'Lever', 'Ashby', 'Recruitee', 'SmartRecruiters'] as const;

const MATCH_SCORE = 82; // illustrative Dice similarity, in %
const MATCH_GATE = 60; // MATCH_THRESHOLD = 0.6 in jobDiscoveryService

export function JobPostingScene() {
  const td = useTranslations('projects.applyxDetail');

  // The detected board's live listings. One matches the role; the scrub scan lands on it.
  const board = [
    { title: td('jobposting.roleListing'), score: '0.82', match: true },
    { title: td('jobposting.open1Role'), score: '0.28', match: false },
    { title: td('jobposting.open2Role'), score: '0.11', match: false },
  ];
  const responsibilities = [td('jobposting.resp1'), td('jobposting.resp2'), td('jobposting.resp3')];
  const openings = [
    { role: td('jobposting.open1Role'), loc: td('jobposting.open1Loc') },
    { role: td('jobposting.open2Role'), loc: td('jobposting.open2Loc') },
    { role: td('jobposting.open3Role'), loc: td('jobposting.open3Loc') },
  ];

  return (
    <section data-scene="jobposting" className="relative">
      {/* Pinned + scrubbed investigation: link → board → openings → match → gate → lock → fields */}
      <div
        data-pin="jobposting"
        className="flex flex-col justify-center px-4 py-12 lg:min-h-[100svh]"
      >
        <div className="mx-auto w-full max-w-5xl">
          <div className="text-center lg:text-left">
            <SceneStep>{td('jobposting.step')}</SceneStep>
            <h2 className="font-display text-3xl font-bold tracking-tight text-foreground md:text-5xl">
              {td('jobposting.heading')}
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-base text-muted-foreground md:text-lg lg:mx-0">
              {td('jobposting.sub')}
            </p>
          </div>

          {/* ATS chips */}
          <div className="mt-5 flex flex-wrap items-center gap-2">
            <span className={`${SECTION_LABEL} mr-1`}>{td('jobposting.atsLabel')}</span>
            {ATS.map(name => (
              <span
                key={name}
                data-jp-chip
                className="rounded-full border border-border/50 bg-muted/40 px-3 py-1 font-mono text-xs text-foreground"
              >
                {name}
              </span>
            ))}
          </div>

          <div className="mt-4 grid gap-4 lg:grid-cols-2 lg:items-start">
            {/* LEFT: the trail — an email's ATS link resolves to a board + its openings */}
            <div className="space-y-3">
              <div className="rounded-2xl border border-border/50 bg-card/60 p-4 shadow-xl backdrop-blur">
                <div className="flex items-center gap-2 border-b border-border/40 pb-2.5 text-xs text-muted-foreground">
                  <Mail className="h-4 w-4 text-primary" />
                  {td('jobposting.emailFrom')}
                </div>
                <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">
                  {td('jobposting.emailBody')}
                </p>
                <span
                  data-jp-link
                  className="mt-2.5 inline-flex items-center gap-1.5 rounded-md border border-border/60 bg-background/50 px-2.5 py-1 font-mono text-xs text-primary"
                >
                  <Link2 className="h-3.5 w-3.5" />
                  boards.greenhouse.io/acme
                </span>
              </div>

              {/* detected board + its live openings */}
              <div
                data-jp-board
                className="rounded-2xl border-2 border-primary/30 bg-card/50 p-4 backdrop-blur"
              >
                <div className="flex items-center justify-between">
                  <span className={SECTION_LABEL}>{td('jobposting.detected')}</span>
                  <span className="rounded bg-muted/60 px-2 py-0.5 font-mono text-[11px] text-foreground">
                    Greenhouse · acme
                  </span>
                </div>
                <ul className="mt-2.5 space-y-1.5">
                  {board.map(o => (
                    <li
                      key={o.title}
                      data-jp-opening
                      data-jp-match={o.match ? 'true' : undefined}
                      className={`flex items-center justify-between gap-3 rounded-lg border px-3 py-2 text-sm ${
                        o.match
                          ? 'border-accent-green/40 bg-accent-green/5'
                          : 'border-border/40 bg-background/30'
                      }`}
                    >
                      <span className={o.match ? 'text-foreground' : 'text-muted-foreground'}>
                        {o.title}
                      </span>
                      <span
                        className={`font-mono text-xs tabular-nums ${
                          o.match ? 'text-accent-green' : 'text-muted-foreground/60'
                        }`}
                      >
                        {o.score}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* RIGHT: the verdict — normalise, confidence gate, lock, extracted fields */}
            <div data-gate-card className={`rounded-2xl ${CARD}`}>
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4 text-primary" />
                <span className={SECTION_LABEL}>{td('jobposting.matchTitle')}</span>
              </div>

              <div className="mt-4 space-y-2.5 font-mono text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <span className="truncate">{td('jobposting.roleRaw')}</span>
                </div>
                <div data-gate-reveal className="flex items-center gap-2">
                  <span className="text-muted-foreground/60">→</span>
                  <span className="text-foreground">{td('jobposting.roleNormalized')}</span>
                </div>
                <div data-gate-reveal className="flex items-center gap-2">
                  <span className="text-muted-foreground/60">≈</span>
                  <span className="text-accent-green">{td('jobposting.roleListing')}</span>
                  <span
                    data-gate-lock
                    className="ml-auto inline-flex h-5 w-5 items-center justify-center rounded-full bg-accent-green/15 text-accent-green ring-1 ring-accent-green/40"
                  >
                    <Check className="h-3 w-3" strokeWidth={3} />
                  </span>
                </div>
              </div>

              {/* Confidence gate */}
              <div className="mt-5">
                <div className="relative h-2.5 w-full rounded-full bg-muted">
                  <div
                    data-gate-fill
                    className="absolute inset-y-0 left-0 origin-left rounded-full bg-gradient-to-r from-primary to-accent-green"
                    style={{ width: `${MATCH_SCORE}%` }}
                  />
                  <div
                    data-gate-marker
                    className="absolute inset-y-[-3px] w-px origin-center bg-foreground/70"
                    style={{ left: `${MATCH_GATE}%` }}
                  />
                </div>
                <div className="mt-2 flex items-center justify-between text-[11px] text-muted-foreground">
                  <span>
                    {td('jobposting.similarity')}{' '}
                    <span data-gate-score className="font-semibold text-accent-green">
                      0.82
                    </span>
                  </span>
                  <span style={{ marginRight: `${100 - MATCH_GATE}%` }} className="translate-x-1/2">
                    {td('jobposting.gate')} 0.60
                  </span>
                </div>
                <p className="mt-2.5 text-sm text-muted-foreground">{td('jobposting.matchNote')}</p>
              </div>

              {/* Extracted fields (revealed at the end of the scrub) */}
              <div className="mt-4 space-y-2.5 border-t border-border/40 pt-3.5 text-sm">
                <div data-jp-field>
                  <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground/70">
                    {td('jobposting.responsibilities')}
                  </p>
                  <ul className="space-y-1">
                    {responsibilities.map(r => (
                      <li key={r} className="flex gap-2 text-foreground">
                        <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-accent-violet" />
                        {r}
                      </li>
                    ))}
                  </ul>
                </div>
                <div data-jp-field className="flex flex-wrap gap-2 pt-1">
                  <span className="inline-flex items-center gap-1.5 rounded-lg border border-border/50 bg-background/40 px-2.5 py-1 text-xs text-foreground">
                    <Wallet className="h-3.5 w-3.5 text-accent-green" />
                    {td('jobposting.salary')}
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-lg border border-border/50 bg-background/40 px-2.5 py-1 text-xs text-foreground">
                    <CalendarClock className="h-3.5 w-3.5 text-primary" />
                    {td('jobposting.deadline')}
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-lg border border-border/50 bg-background/40 px-2.5 py-1 text-xs text-foreground">
                    {td('jobposting.employmentType')}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Coda (not pinned): other openings + login-wall fallback */}
      <div className="px-4 py-24">
        <div className="mx-auto grid w-full max-w-5xl gap-4 lg:grid-cols-2">
          <div data-fade className={CARD}>
            <div className="flex items-center gap-2">
              <Building2 className="h-4 w-4 text-primary" />
              <span className={SECTION_LABEL}>{td('jobposting.openingsTitle')}</span>
            </div>
            <ul className="mt-4 divide-y divide-border/40">
              {openings.map(o => (
                <li key={o.role} className="flex items-center justify-between gap-3 py-2.5 text-sm">
                  <span className="text-foreground">{o.role}</span>
                  <span className="shrink-0 text-xs text-muted-foreground">{o.loc}</span>
                </li>
              ))}
            </ul>
            <p className="mt-3 text-xs text-muted-foreground/70">{td('jobposting.openingsNote')}</p>
          </div>

          <div data-fade className={CARD}>
            <div className="flex items-center gap-2">
              <ClipboardPaste className="h-4 w-4 text-accent-violet" />
              <span className={SECTION_LABEL}>{td('jobposting.fallbackTitle')}</span>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              {td('jobposting.fallbackBody')}
            </p>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              {td('jobposting.fallbackTos')}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
