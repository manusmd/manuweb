export type BugKind = 'common' | 'rare' | 'legendary';

export interface BugDisplayData {
  id: string;
  x: number;
  y: number;
  type: BugKind;
  points: number;
  emoji: string;
  found: boolean;
}

export const BUG_HUNT_BUG_TYPES = {
  common: { emoji: '🐛', points: 10 },
  rare: { emoji: '🦗', points: 25 },
  legendary: { emoji: '🕷️', points: 50 },
} as const;

export const BUG_STORAGE_BUGS_KEY = 'bug-hunt-bugs';
export const BUG_STORAGE_FOUND_KEY = 'bug-hunt-found';
export const BUG_STORAGE_ACTIVE_KEY = 'bug-hunt-active';
export const BUG_STORAGE_COMPLETED_KEY = 'bug-hunt-completed';

export function emitBugHuntNotification(
  title: string,
  message: string,
  icon: string,
  persistent = false,
  onClose?: () => void
) {
  const event = new CustomEvent('easterEggDiscovered', {
    detail: { title, message, icon, persistent, onClose },
  });
  window.dispatchEvent(event);
}
