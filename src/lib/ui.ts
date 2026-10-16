import type { CSSProperties } from 'react';

/** Typed escape hatch for passing CSS custom properties through `style`. */
export const cssVars = (vars: Record<string, string | number>) => vars as CSSProperties;

export function greeting(date = new Date()) {
  const h = date.getHours();
  if (h < 12) return 'Good morning';
  if (h < 18) return 'Good afternoon';
  return 'Good evening';
}
