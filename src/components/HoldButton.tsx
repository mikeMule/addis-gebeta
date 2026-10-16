import { IonIcon } from '@ionic/react';
import { useEffect, useRef, useState } from 'react';
import { cssVars } from '../lib/ui';

interface Props {
  label: string;
  holdLabel: string;
  icon: string;
  onComplete: () => void;
  duration?: number;
}

/**
 * Press-and-hold for destructive actions. The fill is a clip-path on a
 * duplicated label: slow and linear while the user decides, snapping back
 * fast on release.
 */
export function HoldButton({ label, holdLabel, icon, onComplete, duration = 1400 }: Props) {
  const [holding, setHolding] = useState(false);
  const timer = useRef<number>();

  const start = () => {
    if (timer.current) return; // ignore extra fingers / key repeats
    setHolding(true);
    timer.current = window.setTimeout(() => {
      timer.current = undefined;
      setHolding(false);
      navigator.vibrate?.(24);
      onComplete();
    }, duration);
  };

  const stop = () => {
    window.clearTimeout(timer.current);
    timer.current = undefined;
    setHolding(false);
  };

  useEffect(() => () => window.clearTimeout(timer.current), []);

  return (
    <button
      type="button"
      className="hold"
      data-holding={holding}
      style={cssVars({ '--hold-duration': `${duration}ms` })}
      aria-label={`${label} — press and hold`}
      onPointerDown={(e) => {
        if (e.button !== 0) return;
        e.currentTarget.setPointerCapture(e.pointerId);
        start();
      }}
      onPointerUp={stop}
      onPointerCancel={stop}
      onLostPointerCapture={stop}
      onKeyDown={(e) => {
        if ((e.key === ' ' || e.key === 'Enter') && !e.repeat) {
          e.preventDefault();
          start();
        }
      }}
      onKeyUp={(e) => {
        if (e.key === ' ' || e.key === 'Enter') stop();
      }}
      onContextMenu={(e) => e.preventDefault()}
    >
      <span className="hold-label">
        <IonIcon icon={icon} />
        {label}
      </span>
      <span className="hold-overlay" aria-hidden>
        <IonIcon icon={icon} />
        {holdLabel}
      </span>
    </button>
  );
}
