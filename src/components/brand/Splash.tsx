import { useEffect, useMemo, useState } from 'react';
import { GebetaMark } from './GebetaMark';

/** Archimedean spiral — injera batter is poured onto the mitad in exactly this shape. */
function spiralPath(turns = 7, maxR = 300, cx = 200, cy = 200) {
  const total = turns * Math.PI * 2;
  const a = maxR / total;
  // Start most of a turn out so the pour begins beyond the mark, not under it.
  const t0 = Math.PI * 1.4;
  let d = `M ${(cx + a * t0 * Math.cos(t0)).toFixed(1)} ${(cy + a * t0 * Math.sin(t0)).toFixed(1)}`;
  for (let t = t0; t <= total; t += 0.18) {
    const r = a * t;
    d += ` L ${(cx + r * Math.cos(t)).toFixed(1)} ${(cy + r * Math.sin(t)).toFixed(1)}`;
  }
  return d;
}

const HOLD_MS = 1750;
const EXIT_MS = 420;

/**
 * Cold-start splash. Seen once per launch, so it is allowed to be a moment:
 * the injera spiral pours outward, the gebeta pits are sown one by one, the
 * wordmark settles, then the whole field lifts away to reveal Home.
 */
export function Splash({ onDone }: { onDone: () => void }) {
  const [leaving, setLeaving] = useState(false);
  const d = useMemo(() => spiralPath(), []);

  useEffect(() => {
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    const hold = reduce ? 700 : HOLD_MS;
    const t1 = window.setTimeout(() => setLeaving(true), hold);
    const t2 = window.setTimeout(onDone, hold + EXIT_MS);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, [onDone]);

  const skip = () => {
    if (leaving) return;
    setLeaving(true);
    window.setTimeout(onDone, EXIT_MS);
  };

  return (
    <div className="splash" data-leaving={leaving} onClick={skip} role="presentation">
      <svg className="splash-spiral" viewBox="0 0 400 400" aria-hidden preserveAspectRatio="xMidYMid slice">
        <path d={d} pathLength={1} />
      </svg>

      <div className="splash-center">
        <div className="splash-mark">
          <GebetaMark size={92} board="var(--brand)" pit="#fff" animated />
        </div>
        <h1 className="splash-word">
          Addis <span>Gebeta</span>
        </h1>
        <p className="splash-geez" lang="am">
          አዲስ ገበታ
        </p>
      </div>

      <div className="splash-foot">
        <span className="splash-bar" aria-hidden>
          <i />
        </span>
        <span>Addis on your table</span>
      </div>
    </div>
  );
}
