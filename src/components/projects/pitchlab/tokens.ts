import demoJson from './demo.json';

export interface Team {
  code: string;
  en: string;
  de: string;
  bg: string;
  fg: string;
}

export interface StrengthRow extends Team {
  attack: number; // 0..100
  defence: number; // 0..100
  elo: number;
  trend: number;
}

export interface TitleRow extends Team {
  pct: number;
}

export interface PitchlabDemo {
  featured: {
    home: Team;
    away: Team;
    p: [number, number, number]; // home / draw / away %
    xg: [number, number];
    likely: [number, number];
    conf: string;
    matrix: number[][]; // 6x6 with Dixon-Coles
    matrixNoDc: number[][]; // 6x6 plain Poisson
    rho: number;
  };
  strengths: StrengthRow[];
  sim: { iterations: number; title: TitleRow[] };
  calibration: {
    points: [number, number][];
    brier: number;
    hitRate: number;
    reliabilityGap: number;
    logloss: number;
    n: number;
  };
  backtest: { labels: string[]; model: number[]; market: number[] };
}

export const DEMO = demoJson as unknown as PitchlabDemo;

export const ASSET = (name: string) => `/projects/pitchlab/${name}`;

// Home / draw / away accent colors (match the app's blue / gray / orange bars).
export const OUTCOME = {
  home: '#4f7cff',
  draw: '#6b7280',
  away: '#f59e0b',
} as const;

/** Localized team name for the current locale. */
export const teamName = (t: Team, locale: string) => (locale === 'de' ? t.de : t.en);
