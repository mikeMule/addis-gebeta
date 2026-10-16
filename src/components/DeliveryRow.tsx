import type { CSSProperties } from 'react';
import { useHistory } from 'react-router-dom';
import { formatDay, formatPrice, shortAddress, statusOf, type Delivery } from '../lib/delivery';
import { CategoryIcon, StatusPill } from './Badges';
import { Pressable } from './Pressable';

export function DeliveryRow({ d, now, style }: { d: Delivery; now: number; style?: CSSProperties }) {
  const history = useHistory();
  return (
    <Pressable className="row" style={style} onPress={() => history.push(`/track/${d.id}`)}>
      <CategoryIcon category={d.category} />
      <div className="row-main">
        <div className="row-title">{d.itemName}</div>
        <div className="row-sub">
          To {shortAddress(d.dropoff)} · {formatDay(d.createdAt)}
        </div>
      </div>
      <div className="row-end">
        <div className="row-price">{formatPrice(d.price)}</div>
        <StatusPill status={statusOf(d, now)} />
      </div>
    </Pressable>
  );
}
