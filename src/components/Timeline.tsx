import { IonIcon } from '@ionic/react';
import { checkmark } from 'ionicons/icons';
import { formatClock } from '../lib/delivery';

interface Props {
  stages: { key: string; label: string; hint: string }[];
  /** Index of the stage reached so far. */
  current: number;
  cancelled: boolean;
  timeOf: (i: number) => number;
}

export function Timeline({ stages, current, cancelled, timeOf }: Props) {
  const last = stages.length - 1;
  return (
    <ol className="timeline">
      {stages.map((s, i) => {
        const state =
          i < current || (i === current && i === last) ? 'done' : i === current ? (cancelled ? 'stopped' : 'current') : 'upcoming';
        return (
          <li key={s.key} className="tl-item" data-state={state}>
            <span className="tl-dot">{state === 'done' && <IonIcon icon={checkmark} />}</span>
            {i < last && (
              <span className="tl-rail" aria-hidden>
                <i style={{ transform: `scaleY(${i < current ? 1 : 0})` }} />
              </span>
            )}
            <span className="tl-text">
              <span className="tl-label">{s.label}</span>
              {state === 'current' && <span className="tl-hint">{s.hint}</span>}
            </span>
            <span className="tl-time">{i <= current ? formatClock(timeOf(i)) : ''}</span>
          </li>
        );
      })}
    </ol>
  );
}
