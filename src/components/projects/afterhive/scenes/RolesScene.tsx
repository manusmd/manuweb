import { useTranslations } from 'next-intl';
import { Crown, Wallet, Layers, Dumbbell, User } from 'lucide-react';
import type { Level } from '../tokens';
import { SceneStep } from '../parts';
import { DEMO, LEVEL_COLOR } from '../tokens';

const ROLE_ICON: Record<string, typeof Crown> = {
  club_admin: Crown,
  treasurer: Wallet,
  division_admin: Layers,
  coach: Dumbbell,
  member: User,
};

const LEVELS: Level[] = ['none', 'read', 'write', 'admin'];

/** Text colour so labels stay legible on each level's fill. */
const CELL_TEXT: Record<Level, string> = {
  none: 'text-muted-foreground/50',
  read: 'text-foreground/80',
  write: 'text-white',
  admin: 'text-white',
};

/**
 * The permission system as the app itself models it: the real role × module
 * matrix, straight from the SSOT (packages/shared). Rows are the ten modules,
 * columns the five roles with their scope; each cell is coloured by access
 * level. Cells cascade in on scroll.
 */
export function RolesScene() {
  const td = useTranslations('projects.afterhiveDetail');
  const cols = `minmax(6.5rem, 1.1fr) repeat(${DEMO.roleOrder.length}, minmax(0, 1fr))`;

  return (
    <section data-scene="roles" className="relative px-4 py-20 md:py-28">
      <div className="mx-auto w-full max-w-5xl">
        <div className="text-center">
          <SceneStep>{td('roles.step')}</SceneStep>
          <h2 className="mx-auto max-w-2xl font-display text-3xl font-bold tracking-tight text-foreground md:text-5xl">
            {td('roles.heading')}
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-muted-foreground md:text-base">
            {td('roles.sub')}
          </p>
        </div>

        <div className="mt-10 overflow-x-auto rounded-2xl border border-white/10 bg-white/[0.03] p-4 shadow-[0_20px_60px_-24px_rgba(0,0,0,0.7)] backdrop-blur-xl md:p-6">
          <div className="min-w-[40rem]">
            {/* Column headers: role + scope */}
            <div className="grid items-end gap-1.5" style={{ gridTemplateColumns: cols }}>
              <div />
              {DEMO.roleOrder.map(role => {
                const Icon = ROLE_ICON[role] ?? User;
                return (
                  <div key={role} className="px-1 pb-2 text-center">
                    <span className="mx-auto mb-2 flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-accent-violet/[0.12]">
                      <Icon className="h-4 w-4 text-accent-violet" />
                    </span>
                    <p className="text-xs font-semibold leading-tight text-foreground">
                      {DEMO.roleNames[role] ?? role}
                    </p>
                    <p className="mt-1 text-[10px] uppercase tracking-wide text-muted-foreground/70">
                      {td(`roles.scope.${DEMO.roleScope[role] ?? 'self'}`)}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* One row per module. */}
            <div className="mt-1 flex flex-col gap-1.5">
              {DEMO.modules.map((mod, r) => (
                <div
                  key={mod}
                  className="grid items-center gap-1.5"
                  style={{ gridTemplateColumns: cols }}
                >
                  <span className="truncate pr-2 text-xs font-medium text-muted-foreground">
                    {td(`roles.module.${mod}`)}
                  </span>
                  {DEMO.roleOrder.map(role => {
                    const level = DEMO.roles[role]?.[r] ?? 'none';
                    return (
                      <span
                        key={role}
                        data-mx-cell
                        style={{ backgroundColor: LEVEL_COLOR[level] }}
                        className={`flex h-8 items-center justify-center rounded-md text-[10px] font-semibold uppercase tracking-wide md:h-9 ${CELL_TEXT[level]}`}
                      >
                        {level === 'none' ? '' : td(`roles.level_${level}`)}
                      </span>
                    );
                  })}
                </div>
              ))}
            </div>

            {/* Legend + source. */}
            <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-white/[0.06] pt-4">
              <div className="flex flex-wrap items-center gap-3">
                {LEVELS.map(l => (
                  <span
                    key={l}
                    className="inline-flex items-center gap-1.5 text-xs text-muted-foreground"
                  >
                    <span className="h-3 w-3 rounded" style={{ backgroundColor: LEVEL_COLOR[l] }} />
                    {td(`roles.level_${l}`)}
                  </span>
                ))}
              </div>
              <span className="text-[11px] text-muted-foreground/70">{td('roles.source')}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
