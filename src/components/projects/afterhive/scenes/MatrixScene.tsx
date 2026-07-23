import { useTranslations } from 'next-intl';
import { SceneStep } from '../parts';
import { DEMO, LEVEL_COLOR, type Level } from '../tokens';

/** German module labels for the matrix rows (the SSOT keys are English slugs). */
const MODULE_LABEL: Record<string, { de: string; en: string }> = {
  members: { de: 'Mitglieder', en: 'Members' },
  dues: { de: 'Beiträge', en: 'Dues' },
  teams: { de: 'Teams', en: 'Teams' },
  attendance: { de: 'Anwesenheit', en: 'Attendance' },
  events: { de: 'Kalender', en: 'Events' },
  communication: { de: 'Kommunikation', en: 'Communication' },
  documents: { de: 'Dokumente', en: 'Documents' },
  committees: { de: 'Gremien', en: 'Committees' },
  settings: { de: 'Einstellungen', en: 'Settings' },
  website: { de: 'Website', en: 'Website' },
};

export function MatrixScene({ locale }: { locale: string }) {
  const td = useTranslations('projects.afterhiveDetail');
  const lang = locale === 'de' ? 'de' : 'en';

  return (
    <section data-scene="matrix" className="relative">
      <div data-pin="matrix" className="flex flex-col justify-center px-4 py-14 lg:min-h-[100svh]">
        <div className="mx-auto w-full max-w-4xl">
          <div className="text-center lg:text-left">
            <SceneStep>{td('matrix.step')}</SceneStep>
            <h2 className="font-display text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              {td('matrix.heading')}
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm text-muted-foreground md:text-base lg:mx-0">
              {td('matrix.sub')}
            </p>
          </div>

          {/* the real 10×5 matrix from packages/shared (SSOT) */}
          <div className="mt-6 overflow-x-auto">
            <div
              className="grid min-w-[560px] gap-1"
              style={{
                gridTemplateColumns: `minmax(7rem, auto) repeat(${DEMO.roleOrder.length}, 1fr)`,
              }}
            >
              <div />
              {DEMO.roleOrder.map(role => (
                <div
                  key={role}
                  className="truncate px-1 pb-1 text-center font-mono text-[10px] uppercase tracking-wide text-muted-foreground"
                >
                  {DEMO.roleNames[role]}
                </div>
              ))}
              {DEMO.modules.map((mod, mi) => (
                <Row key={mod} mod={mod} mi={mi} lang={lang} />
              ))}
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-center gap-4 font-mono text-[10px] uppercase tracking-widest text-muted-foreground lg:justify-start">
            {DEMO.levels.map(l => (
              <span key={l} className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-sm" style={{ background: LEVEL_COLOR[l] }} />
                {td(`matrix.level_${l}`)}
              </span>
            ))}
            <span className="ml-auto hidden lg:block">{td('matrix.source')}</span>
          </div>
        </div>
      </div>
    </section>
  );
}

function Row({ mod, mi, lang }: { mod: string; mi: number; lang: 'de' | 'en' }) {
  return (
    <>
      <div className="flex items-center pr-2 text-xs font-medium text-foreground">
        {MODULE_LABEL[mod]?.[lang] ?? mod}
      </div>
      {DEMO.roleOrder.map(role => {
        const level = DEMO.roles[role][mi] as Level;
        return (
          <div
            key={role}
            data-mx-cell
            data-level={level}
            className="flex h-8 items-center justify-center rounded-md font-mono text-[9px] uppercase text-white/80"
            style={{ backgroundColor: LEVEL_COLOR[level] }}
          >
            {level !== 'none' ? level : ''}
          </div>
        );
      })}
    </>
  );
}
