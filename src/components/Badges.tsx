import { IonIcon } from '@ionic/react';
import { CATEGORIES, STATUS_COPY, type Category, type Status } from '../lib/delivery';
import { cssVars } from '../lib/ui';

export function StatusPill({ status }: { status: Status }) {
  const tone = status === 'delivered' ? 'success' : status === 'cancelled' ? 'muted' : 'active';
  return (
    <span className="pill" data-tone={tone}>
      {tone === 'active' && <span className="pill-dot" />}
      {STATUS_COPY[status].pill}
    </span>
  );
}

export function CategoryIcon({ category, size = 'md' }: { category: Category; size?: 'sm' | 'md' | 'lg' }) {
  const c = CATEGORIES[category];
  return (
    <span className="tile-icon" data-size={size} style={cssVars({ '--tint': c.tint })}>
      <IonIcon icon={c.icon} />
    </span>
  );
}
