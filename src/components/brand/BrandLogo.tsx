import type { Logo } from '../../data/food';
import { cssVars } from '../../lib/ui';

/**
 * Fictional restaurant monograms. Sized in em off a font-size of size/5 so
 * every recipe scales cleanly from a 28px badge to a 96px header.
 */
export function BrandLogo({ logo, size = 64, radius }: { logo: Logo; size?: number; radius?: number }) {
  if (logo.src) return <img src={logo.src} alt="" className="brand-logo brand-logo-image" style={{ width: size, height: size, borderRadius: radius ?? Math.round(size * 0.26), objectFit: 'contain', background: '#fff' }} />;
  return (
    <span
      className="brand-logo"
      data-style={logo.style}
      data-small={size < 40}
      aria-hidden
      style={cssVars({
        '--bg': logo.bg,
        '--fg': logo.fg,
        '--accent': logo.accent ?? logo.fg,
        width: `${size}px`,
        height: `${size}px`,
        fontSize: `${size / 5}px`,
        borderRadius: `${radius ?? Math.round(size * 0.26)}px`,
      })}
    >
      <span className="bl-top">{logo.top}</span>
      {logo.bottom && <span className="bl-bottom">{logo.bottom}</span>}
    </span>
  );
}
