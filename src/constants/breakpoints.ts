const BREAKPOINT_PX = {
  narrowMobile: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
} as const;

export const MQ = {
  mobileDown: `(max-width: ${BREAKPOINT_PX.md - 1}px)`,
  tabletDown: `(max-width: ${BREAKPOINT_PX.lg - 1}px)`,
  desktop: `(min-width: ${BREAKPOINT_PX.lg}px)`,
  narrowMobile: `(max-width: ${BREAKPOINT_PX.narrowMobile - 1}px)`,
  tabletOnly: `(min-width: ${BREAKPOINT_PX.narrowMobile}px) and (max-width: ${BREAKPOINT_PX.lg - 1}px)`,
} as const;
