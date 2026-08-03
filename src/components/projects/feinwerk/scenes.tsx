'use client';

import { useTranslations } from 'next-intl';
import type { Project } from '@/types/project';
import { Eyebrow, HeroRulerField, Panel, ToolDemoVisual } from './parts';
import { TOOLS, type ToolDemo } from './tokens';

/* ------------------------------------------------------------------ Hero -- */
export function HeroScene({ project }: { project: Project }) {
  const t = useTranslations('projects.feinwerkDetail');
  return (
    <section data-scene="hero" className="relative flex min-h-[92vh] w-full items-center">
      <HeroRulerField />
      <div className="relative mx-auto w-full max-w-6xl px-6">
        <div data-fw-reveal>
          <Eyebrow>{t('hero.eyebrow')}</Eyebrow>
        </div>
        <h1
          data-fw-hero-title
          className="mt-6 text-[clamp(3.5rem,13vw,10.5rem)] font-bold leading-[0.88] tracking-[-0.045em] text-[#f4f4f1]"
        >
          Feinwerk
        </h1>
        <div
          data-fw-rule
          className="mt-5 h-2.5 w-[min(560px,72%)] origin-left rounded-sm bg-[#d8e84a]"
        />
        <p
          data-fw-reveal
          className="mt-8 max-w-2xl text-lg leading-relaxed text-[#c6c9c2] md:text-xl"
        >
          {t('hero.lead')}
        </p>
        <div data-fw-reveal className="mt-9 flex flex-wrap items-center gap-3">
          <a
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-md border-b-[3px] border-[#d8e84a] bg-[#f4f4f1] px-5 py-2.5 font-mono text-sm font-semibold text-[#0b0d11] transition-transform hover:translate-y-0.5"
          >
            {t('hero.live')}
          </a>
          <span className="font-mono text-xs uppercase tracking-[0.18em] text-[#8a8f8a]">
            {t('hero.stack')}
          </span>
        </div>
        <div
          data-fw-reveal
          className="mt-16 flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-[#8a8f8a]"
        >
          <span className="inline-block h-8 w-px bg-[#d8e84a]/50" />
          {t('hero.scrollCue')}
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------- Upload -- */
export function UploadScene() {
  const t = useTranslations('projects.feinwerkDetail');
  const files = ['foto.heic', 'vertrag.pdf', 'scan.jpg', 'rechnung.pdf', 'ausweis.png'];
  return (
    <section data-scene="upload" className="relative">
      <div
        data-pin="upload"
        className="flex h-screen w-full items-center justify-center overflow-hidden"
      >
        <div className="mx-auto w-full max-w-4xl px-6">
          <div className="text-center">
            <Eyebrow>{t('upload.eyebrow')}</Eyebrow>
            <h2 className="mx-auto mt-4 max-w-2xl text-3xl font-bold tracking-tight text-[#f4f4f1] md:text-4xl">
              {t('upload.heading')}
            </h2>
          </div>

          <div className="relative mt-12 h-[300px]">
            <div
              data-fw-cloud
              className="absolute left-1/2 top-0 flex -translate-x-1/2 items-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] px-4 py-2.5 font-mono text-xs text-[#8a8f8a]"
            >
              <span className="h-2 w-2 rounded-full bg-[#e86a5a]" />
              {t('upload.server')}
            </div>

            <div
              data-fw-guard
              className="absolute inset-x-0 top-[150px] flex origin-left scale-x-0 items-center gap-3"
            >
              <span className="h-px flex-1 bg-[#d8e84a]/60" />
              <span className="whitespace-nowrap font-mono text-[11px] uppercase tracking-[0.18em] text-[#d8e84a]">
                {t('upload.guard')}
              </span>
              <span className="h-px flex-1 bg-[#d8e84a]/60" />
            </div>

            {files.map((f, i) => (
              <span
                key={f}
                data-fw-file
                className="absolute rounded-md border border-white/15 bg-[#14161a] px-3 py-1.5 font-mono text-[13px] text-[#f4f4f1] shadow-lg"
                style={{ left: `${12 + i * 18}%`, top: `${205 + (i % 2) * 30}px` }}
              >
                {f}
              </span>
            ))}

            <div
              data-fw-stamp
              className="absolute bottom-[-8px] left-1/2 -translate-x-1/2 rounded-md border-2 border-[#d8e84a] px-4 py-1.5 font-mono text-sm font-bold uppercase tracking-[0.14em] text-[#d8e84a]"
            >
              {t('upload.stamp')}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------- Pipeline -- */
export function PipelineScene() {
  const t = useTranslations('projects.feinwerkDetail');
  const stages = [t('pipeline.stageSelect'), t('pipeline.stageConvert'), t('pipeline.stageSave')];
  return (
    <section data-scene="pipeline" className="relative">
      <div
        data-pin="pipeline"
        className="flex h-screen w-full items-center justify-center overflow-hidden"
      >
        <div className="w-full max-w-4xl px-6">
          <div className="text-center">
            <Eyebrow>{t('pipeline.eyebrow')}</Eyebrow>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-[#f4f4f1] md:text-4xl">
              {t('pipeline.heading')}
            </h2>
          </div>

          <Panel className="mt-10 p-8">
            <div className="flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.16em] text-[#8a8f8a]">
              <span>{t('pipeline.device')}</span>
              <span className="flex items-center gap-1.5 text-[#d8e84a]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#d8e84a]" /> {t('pipeline.local')}
              </span>
            </div>

            <div className="relative mt-8 h-16">
              <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-[repeating-linear-gradient(to_right,#3a3f44_0_6px,transparent_6px_12px)]" />
              <div
                data-fw-token
                className="absolute top-1/2 -translate-y-1/2 rounded-md border border-[#4a4f55] bg-[#14161a] px-3 py-1.5 font-mono text-[13px] text-[#f4f4f1]"
                style={{ left: 0 }}
              >
                foto.heic
              </div>
            </div>

            <div className="mt-4 flex justify-between">
              {stages.map((s, i) => (
                <span
                  key={i}
                  data-fw-stage={i}
                  className="font-mono text-[13px] text-[#8a8f8a] transition-colors"
                >
                  {s}
                </span>
              ))}
            </div>
          </Panel>

          <div className="mt-6 flex items-center gap-3">
            <span className="h-px flex-1 bg-[repeating-linear-gradient(to_right,#3a3f44_0_4px,transparent_4px_10px)]" />
            <span className="rounded border border-[#5a3a38] px-2.5 py-1 font-mono text-[11px] uppercase tracking-[0.12em] text-[#e86a5a]">
              {t('pipeline.notSent')}
            </span>
            <span className="h-px flex-1 bg-[repeating-linear-gradient(to_right,#3a3f44_0_4px,transparent_4px_10px)]" />
          </div>

          <div className="mt-6 flex items-baseline justify-center gap-3">
            <span
              data-fw-bytes
              className="font-mono text-5xl font-bold tabular-nums text-[#d8e84a]"
            >
              0
            </span>
            <span className="font-mono text-sm text-[#8a8f8a]">{t('pipeline.bytesLabel')}</span>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ----------------------------------------------------------------- Tools -- */
export function ToolsScene() {
  const t = useTranslations('projects.feinwerkDetail');
  const items = t.raw('tools.items') as Record<ToolDemo, { name: string; blurb: string }>;
  return (
    <section data-scene="tools" className="relative">
      <div data-pin="tools" data-no-fit className="h-screen w-full overflow-hidden">
        <div className="flex h-full w-full flex-col justify-center">
          <div className="mx-auto mb-8 flex w-full max-w-6xl items-baseline justify-between px-6">
            <h2 className="text-3xl font-bold tracking-tight text-[#f4f4f1] md:text-4xl">
              {t('tools.title')}
            </h2>
            <span className="font-mono text-sm uppercase tracking-[0.16em] text-[#8a8f8a]">
              <span data-fw-tool-num className="text-[#d8e84a]">
                01
              </span>{' '}
              / 06
            </span>
          </div>

          <div
            data-fw-track
            className="flex gap-6 pl-[max(1.5rem,calc(50vw-38rem))] pr-[50vw] will-change-transform"
          >
            {TOOLS.map(tool => (
              <Panel
                key={tool.num}
                data-fw-tool-card
                className="flex w-[78vw] max-w-[30rem] shrink-0 flex-col p-7"
              >
                <div className="flex items-center justify-between font-mono text-xs uppercase tracking-[0.16em] text-[#8a8f8a]">
                  <span>{tool.num}</span>
                  <span className="text-[#d8e84a]">{t('tools.unit')}</span>
                </div>
                <div className="mt-3 text-2xl font-bold tracking-tight text-[#f4f4f1]">
                  {items[tool.demo].name}
                </div>
                <p className="mt-1.5 text-sm text-[#8a8f8a]">{items[tool.demo].blurb}</p>
                <div className="mt-5 h-40 rounded-lg border border-white/10 bg-black/20">
                  <ToolDemoVisual demo={tool.demo} />
                </div>
              </Panel>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------- Compress -- */
export function CompressScene() {
  const t = useTranslations('projects.feinwerkDetail');
  return (
    <section data-scene="compress" className="relative py-28">
      <div className="mx-auto w-full max-w-5xl px-6">
        <div data-fw-reveal>
          <Eyebrow>{t('compress.eyebrow')}</Eyebrow>
        </div>
        <div className="mt-8 grid items-center gap-10 md:grid-cols-2">
          <div>
            <div className="flex items-end gap-4">
              <span
                data-fw-count
                data-to="86"
                data-suffix=" %"
                className="text-7xl font-bold tabular-nums text-[#d8e84a] md:text-8xl"
              >
                0 %
              </span>
              <span className="mb-3 font-mono text-sm text-[#8a8f8a]">{t('compress.less')}</span>
            </div>
            <p data-fw-reveal className="mt-6 max-w-md text-[#c6c9c2]">
              {t('compress.body')}
            </p>
          </div>

          <Panel className="p-7">
            <div className="flex justify-between font-mono text-xs text-[#8a8f8a]">
              <span>{t('compress.before')}</span>
              <span>{t('compress.after')}</span>
            </div>
            <div className="mt-3 h-4 w-full overflow-hidden rounded-full bg-white/10">
              <div
                data-fw-comp-bar
                className="h-full origin-left rounded-full bg-[#d8e84a]"
                style={{ transform: 'scaleX(1)' }}
              />
            </div>
            <div className="mt-3 flex justify-between font-mono text-sm">
              <span className="text-[#8a8f8a]">
                <span data-fw-count data-to="8.4" data-suffix=" MB" data-decimals="1">
                  0 MB
                </span>
              </span>
              <span className="text-[#d8e84a]">
                <span data-fw-count data-to="1.2" data-suffix=" MB" data-decimals="1">
                  0 MB
                </span>
              </span>
            </div>
          </Panel>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ Tech -- */
export function TechScene() {
  const t = useTranslations('projects.feinwerkDetail');
  const chips = ['Next.js', 'TypeScript', 'heic2any', 'pdf-lib', 'pdf.js', 'Canvas', 'WebAssembly'];
  return (
    <section data-scene="tech" className="relative py-28">
      <div className="mx-auto w-full max-w-4xl px-6 text-center">
        <div data-fw-reveal>
          <Eyebrow>{t('tech.eyebrow')}</Eyebrow>
        </div>
        <h2
          data-fw-reveal
          className="mx-auto mt-5 max-w-2xl text-3xl font-bold tracking-tight text-[#f4f4f1] md:text-5xl"
        >
          {t('tech.heading')}
        </h2>
        <p data-fw-reveal className="mx-auto mt-5 max-w-xl text-[#c6c9c2]">
          {t('tech.body')}
        </p>
        <div className="mt-9 flex flex-wrap justify-center gap-2.5">
          {chips.map(c => (
            <span
              key={c}
              data-fw-chip
              className="rounded-md border border-white/12 bg-white/[0.04] px-3.5 py-1.5 font-mono text-sm text-[#c6c9c2]"
            >
              {c}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ----------------------------------------------------------------- Outro -- */
export function OutroScene({ project }: { project: Project }) {
  const t = useTranslations('projects.feinwerkDetail');
  return (
    <section data-scene="outro" className="relative flex min-h-[88vh] w-full items-center">
      <div className="mx-auto w-full max-w-4xl px-6 text-center">
        <div className="mb-10 flex items-end justify-center gap-1.5">
          {Array.from({ length: 21 }).map((_, i) => (
            <span
              key={i}
              data-fw-outro-tick
              className="w-px bg-[#d8e84a]"
              style={{ height: i === 10 ? 36 : 14 }}
            />
          ))}
        </div>
        <div data-fw-reveal>
          <Eyebrow>{t('outro.eyebrow')}</Eyebrow>
        </div>
        <h2
          data-fw-reveal
          className="mx-auto mt-6 text-4xl font-bold tracking-tight text-[#f4f4f1] md:text-6xl"
        >
          feinwerk-tools.de
        </h2>
        <div data-fw-reveal className="mt-9 flex flex-wrap justify-center gap-3">
          <a
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-md border-b-[3px] border-[#d8e84a] bg-[#f4f4f1] px-6 py-3 font-mono text-sm font-semibold text-[#0b0d11] transition-transform hover:translate-y-0.5"
          >
            {t('outro.cta')}
          </a>
        </div>
      </div>
    </section>
  );
}
