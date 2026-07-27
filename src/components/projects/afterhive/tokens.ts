import demoJson from './demo.json';

export type Level = 'none' | 'read' | 'write' | 'admin';

export type Scope = 'org' | 'division' | 'self';

export interface AfterhiveDemo {
  modules: string[];
  levels: Level[];
  roleOrder: string[];
  roleNames: Record<string, string>;
  roleScope: Record<string, Scope>;
  roles: Record<string, Level[]>;
  models: string[];
  docs: string[];
}

export const DEMO = demoJson as unknown as AfterhiveDemo;

export const ASSET = (name: string) => `/projects/afterhive/${name}`;

/** Liquid accent per permission level (echoes the app's violet scale). */
export const LEVEL_COLOR: Record<Level, string> = {
  none: 'rgba(148, 163, 184, 0.15)',
  read: 'rgba(139, 92, 246, 0.30)',
  write: 'rgba(139, 92, 246, 0.60)',
  admin: 'rgba(139, 92, 246, 0.95)',
};
