import demoJson from './demo.json';

export type MinutiaType = 'bifurcation' | 'ending' | 'loop' | 'delta';

export interface Minutia {
  id: string;
  x: number; // normalized 0..1
  y: number; // normalized 0..1
  type: MinutiaType;
  angle: number | null; // radians, null for singular points
}

export interface PerTypeCount {
  a: number;
  b: number;
  matched: number;
}

export interface FingermatchDemo {
  size: number;
  orientation: { x: number; y: number; angle: number }[];
  A: { minutiae: Minutia[] };
  B: { minutiae: Minutia[] };
  match: {
    pairs: { a: string; b: string; type: MinutiaType }[];
    perType: Record<MinutiaType, PerTypeCount>;
    score: number; // 0..100
  };
}

// Ported verbatim from the app's theme.ts — color + glyph per minutia type.
export const TYPE_TOKENS: Record<
  MinutiaType,
  { color: string; glyph: 'circle' | 'square' | 'triangle' | 'diamond'; labelKey: string }
> = {
  bifurcation: { color: '#3fb950', glyph: 'circle', labelKey: 'typeBifurcation' },
  ending: { color: '#f85149', glyph: 'square', labelKey: 'typeEnding' },
  loop: { color: '#58a6ff', glyph: 'triangle', labelKey: 'typeLoop' },
  delta: { color: '#e3b341', glyph: 'diamond', labelKey: 'typeDelta' },
};

export const TYPE_ORDER: MinutiaType[] = ['bifurcation', 'ending', 'loop', 'delta'];

export const DEMO = demoJson as unknown as FingermatchDemo;

export const ASSET = (name: string) => `/projects/fingermatch/${name}`;
