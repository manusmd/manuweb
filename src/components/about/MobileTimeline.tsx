'use client';

import { useTranslations } from 'next-intl';

interface Experience {
  date: string;
  title: string;
  company: string;
  description: string;
}

const companyThemes: Record<
  string,
  {
    accentColor: string;
  }
> = {
  Syndikat7: {
    accentColor: '#f87171',
  },
  'T-Systems': {
    accentColor: '#f472b6',
  },
  PRGH: {
    accentColor: '#a78bfa',
  },
  'Neue Fische': {
    accentColor: '#fdba74',
  },
};

export function MobileTimeline() {
  const t = useTranslations('about');
  const experiences = t.raw('experience') as Experience[];

  return (
    <div className="w-full min-h-screen bg-background px-2 py-8">
      <div className="flex flex-col gap-8">
        {experiences.map((exp, i) => {
          const themeKey = Object.keys(companyThemes).find(key =>
            exp.company.toLowerCase().includes(key.toLowerCase())
          );
          const theme = themeKey ? companyThemes[themeKey] : { accentColor: '#a78bfa' };
          return (
            <div
              key={i}
              className="w-full relative flex bg-zinc-900/90 rounded-2xl shadow-lg border border-zinc-800 px-6 py-7 transition-all duration-200 hover:shadow-2xl hover:-translate-y-1"
            >
              <div
                className="absolute left-0 top-4 bottom-4 w-1.5 rounded-full"
                style={{ background: theme.accentColor, opacity: 0.8 }}
              />
              <div className="pl-5 flex-1 flex flex-col gap-2">
                <span className="text-xs font-semibold text-zinc-400 tracking-wide">
                  {exp.date}
                </span>
                <h3 className="text-xl font-extrabold text-white">{exp.title}</h3>
                <p className="text-base font-semibold" style={{ color: theme.accentColor }}>
                  {exp.company}
                </p>
                <p className="text-sm text-zinc-300">{exp.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
