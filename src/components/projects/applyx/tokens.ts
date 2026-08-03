/**
 * ApplyX's app design language on the portfolio canvas: a deep navy shell with
 * an indigo brand accent and the real application-status pill colours. The
 * portfolio's dark theme is already navy (hue 219), so this formalises the
 * accent + status palette that makes the page read as the ApplyX app rather
 * than the generic portfolio.
 */
export const AX = {
  canvas: '#0a0e14',
  indigo: '#4f7cff',
  indigoSoft: 'rgba(79, 124, 255, 0.14)',
  ink: '#e6e9ef',
  muted: '#8b93a3',
  line: 'rgba(255, 255, 255, 0.08)',
} as const;

export type StatusKey = 'applied' | 'review' | 'interview' | 'offer' | 'rejected' | 'ghosted';

/** Colour + tint per application status — matches the pills in the app. */
export const STATUS: Record<StatusKey, { color: string; tint: string; border: string }> = {
  applied: {
    color: '#4f7cff',
    tint: 'rgba(79, 124, 255, 0.12)',
    border: 'rgba(79, 124, 255, 0.45)',
  },
  review: {
    color: '#6b8afd',
    tint: 'rgba(107, 138, 253, 0.12)',
    border: 'rgba(107, 138, 253, 0.45)',
  },
  interview: {
    color: '#4f7cff',
    tint: 'rgba(79, 124, 255, 0.12)',
    border: 'rgba(79, 124, 255, 0.45)',
  },
  offer: { color: '#22c55e', tint: 'rgba(34, 197, 94, 0.12)', border: 'rgba(34, 197, 94, 0.45)' },
  rejected: {
    color: '#ef4444',
    tint: 'rgba(239, 68, 68, 0.12)',
    border: 'rgba(239, 68, 68, 0.45)',
  },
  ghosted: {
    color: '#8b93a3',
    tint: 'rgba(139, 147, 163, 0.12)',
    border: 'rgba(139, 147, 163, 0.4)',
  },
};
