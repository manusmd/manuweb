/** Feinwerk's visual language on the dark portfolio canvas: ink + lime + ruler. */
export const FW = {
  ink: '#0b0d11',
  paper: '#f4f4f1',
  lime: '#d8e84a',
  blue: '#7c93ff',
  muted: '#8a8f8a',
  line: '#242a31',
} as const;

export type ToolDemo = 'heic' | 'shrink' | 'merge' | 'compress' | 'scale' | 'qr';

export interface ToolEntry {
  num: string;
  /** i18n key under `projects.feinwerkDetail.tools.items` and the demo variant. */
  demo: ToolDemo;
}

/** The six tools, in the order shown on feinwerk-tools.de. Names + blurbs are
 *  translated (see `projects.feinwerkDetail.tools.items.<demo>`). */
export const TOOLS: ToolEntry[] = [
  { num: '01', demo: 'heic' },
  { num: '02', demo: 'shrink' },
  { num: '03', demo: 'merge' },
  { num: '04', demo: 'compress' },
  { num: '05', demo: 'scale' },
  { num: '06', demo: 'qr' },
];
