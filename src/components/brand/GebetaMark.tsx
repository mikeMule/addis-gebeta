import { cssVars } from '../../lib/ui';

const PITS = [
  [14, 19.5],
  [24, 19.5],
  [34, 19.5],
  [34, 28.5],
  [24, 28.5],
  [14, 28.5],
] as const;

/**
 * The Addis Gebeta mark: a gebeta board seen from above, two rows of pits.
 * Pits are listed in sowing order (left→right, then back) so the splash can
 * fill them the way seeds are sown in the game.
 */
export function GebetaMark({ size = 48, board = '#fff', pit = 'var(--brand)', animated = false }: { size?: number; board?: string; pit?: string; animated?: boolean }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden className={animated ? 'mark mark-animated' : 'mark'}>
      <rect x="3" y="11" width="42" height="26" rx="13" fill={board} className="mark-board" />
      {PITS.map(([cx, cy], i) => (
        <circle key={i} cx={cx} cy={cy} r="3.6" fill={pit} className="mark-pit" style={cssVars({ '--i': i })} />
      ))}
    </svg>
  );
}
