import { IonIcon } from '@ionic/react';
import { arrowForward, chevronForward } from 'ionicons/icons';
import type { CSSProperties } from 'react';
import { useHistory } from 'react-router-dom';
import { etaMinutes, segmentFill, shortAddress, stageOf, STATUS_COPY, type Delivery } from '../lib/delivery';
import { CategoryIcon } from './Badges';
import { Pressable } from './Pressable';

export function ActiveCard({ d, now, style }: { d: Delivery; now: number; style?: CSSProperties }) {
  const history = useHistory();
  const stage = stageOf(d, now);

  return (
    <Pressable className="card active-card" style={style} onPress={() => history.push(`/track/${d.id}`)}>
      <div className="active-top">
        <CategoryIcon category={d.category} />
        <div className="active-head">
          <div className="eyebrow">#{d.id}</div>
          <div key={stage} className="active-title swap-in">
            {STATUS_COPY[stage].title}
          </div>
        </div>
        <div className="eta" aria-label={`Arriving in about ${etaMinutes(d, now)} minutes`}>
          <span className="eta-value">{etaMinutes(d, now)}</span>
          <span className="eta-unit">min</span>
        </div>
      </div>

      <div className="seg-bar" aria-hidden>
        {[0, 1, 2, 3].map((i) => (
          <span className="seg" key={i}>
            <i style={{ transform: `scaleX(${segmentFill(d, now, i)})` }} />
          </span>
        ))}
      </div>

      <div className="active-route">
        <span className="truncate">{shortAddress(d.pickup)}</span>
        <IonIcon icon={arrowForward} className="muted" />
        <span className="truncate">{shortAddress(d.dropoff)}</span>
        <IonIcon icon={chevronForward} className="push-right muted" />
      </div>
    </Pressable>
  );
}
