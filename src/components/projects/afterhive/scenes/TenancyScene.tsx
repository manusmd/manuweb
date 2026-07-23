import { useTranslations } from 'next-intl';
import { Server, ShieldOff } from 'lucide-react';
import { SceneStep, GlassCard } from '../parts';

const CLUBS = [
  { code: 'TW', name: 'TSV Waldkirch 1904', color: '#8b5cf6', members: 320 },
  { code: 'SV', name: 'SV Blau-Weiß', color: '#4f7cff', members: 184 },
  { code: 'MC', name: 'Musikschule Clara', color: '#d946ef', members: 97 },
];

export function TenancyScene() {
  const td = useTranslations('projects.afterhiveDetail');

  return (
    <section data-scene="tenancy" className="relative px-4 py-20 md:py-28">
      <div className="mx-auto w-full max-w-5xl">
        <div className="text-center">
          <SceneStep>{td('tenancy.step')}</SceneStep>
          <h2
            data-fade
            className="mx-auto max-w-2xl font-display text-3xl font-bold tracking-tight text-foreground md:text-5xl"
          >
            {td('tenancy.heading')}
          </h2>
          <p data-fade className="mx-auto mt-3 max-w-xl text-sm text-muted-foreground md:text-base">
            {td('tenancy.sub')}
          </p>
        </div>

        {/* one install → many isolated clubs */}
        <div data-fade className="mx-auto mt-10 flex max-w-3xl flex-col items-center">
          <div className="inline-flex items-center gap-2.5 rounded-xl border border-accent-violet/40 bg-accent-violet/10 px-5 py-3">
            <Server className="h-4 w-4 text-accent-violet" />
            <span className="font-mono text-sm text-foreground">{td('tenancy.instance')}</span>
          </div>
          <div className="my-3 h-6 w-px bg-gradient-to-b from-accent-violet/60 to-transparent" />
          <div className="grid w-full gap-4 sm:grid-cols-3">
            {CLUBS.map(club => (
              <GlassCard key={club.code} className="p-5" data-tenant>
                <span
                  className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-xs font-bold text-white ring-1 ring-white/15"
                  style={{ backgroundColor: club.color }}
                >
                  {club.code}
                </span>
                <p className="mt-3 truncate text-sm font-semibold text-foreground">{club.name}</p>
                <p className="mt-0.5 font-mono text-xs text-muted-foreground">
                  {club.members} {td('tenancy.members')}
                </p>
              </GlassCard>
            ))}
          </div>
          <div
            data-fade
            className="mt-6 inline-flex items-center gap-2.5 rounded-xl border border-red-500/25 bg-red-500/[0.06] px-4 py-2.5 text-sm text-muted-foreground"
          >
            <ShieldOff className="h-4 w-4 shrink-0 text-red-400" />
            {td('tenancy.isolation')}
          </div>
        </div>
      </div>
    </section>
  );
}
