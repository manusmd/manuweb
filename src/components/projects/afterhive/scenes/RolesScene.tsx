import { useTranslations } from 'next-intl';
import { Crown, Wallet, Layers, Dumbbell, User } from 'lucide-react';
import { SceneStep, GlassCard } from '../parts';
import { DEMO, LEVEL_COLOR } from '../tokens';

const ROLE_ICON: Record<string, typeof Crown> = {
  club_admin: Crown,
  treasurer: Wallet,
  division_admin: Layers,
  coach: Dumbbell,
  member: User,
};

/**
 * The permission system, humanized: one card per role saying what that person
 * sees — plus a tiny 10-module dot strip straight from the real permission
 * data as the "slightly technical" touch.
 */
export function RolesScene() {
  const td = useTranslations('projects.afterhiveDetail');

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

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {DEMO.roleOrder.map(role => {
            const Icon = ROLE_ICON[role] ?? User;
            return (
              <GlassCard key={role} className="p-5" data-fade>
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-accent-violet/[0.12]">
                    <Icon className="h-5 w-5 text-accent-violet" />
                  </span>
                  <h3 className="font-display text-base font-bold text-foreground">
                    {DEMO.roleNames[role] ?? role}
                  </h3>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {td(`roles.${role}`)}
                </p>
                {/* Real data: this role's access level across the 10 modules. */}
                <div className="mt-4 flex items-center gap-1.5">
                  {(DEMO.roles[role] ?? []).map((level, i) => (
                    <span
                      key={i}
                      className="h-2 w-2 rounded-full"
                      style={{ backgroundColor: LEVEL_COLOR[level] }}
                    />
                  ))}
                </div>
              </GlassCard>
            );
          })}

          <GlassCard className="flex items-center p-5" data-fade>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {td('roles.note')}
              <span className="mt-3 flex items-center gap-3">
                {(['none', 'read', 'write', 'admin'] as const).map(l => (
                  <span key={l} className="inline-flex items-center gap-1.5 text-xs">
                    <span
                      className="h-2 w-2 rounded-full"
                      style={{ backgroundColor: LEVEL_COLOR[l] }}
                    />
                    {td(`roles.level_${l}`)}
                  </span>
                ))}
              </span>
            </p>
          </GlassCard>
        </div>
      </div>
    </section>
  );
}
