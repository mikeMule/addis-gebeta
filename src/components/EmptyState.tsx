import { IonIcon } from '@ionic/react';
import type { ReactNode } from 'react';

export function EmptyState({ icon, title, body, action }: { icon: string; title: string; body: string; action?: ReactNode }) {
  return (
    <div className="empty fade-in">
      <span className="empty-icon">
        <IonIcon icon={icon} />
      </span>
      <h3>{title}</h3>
      <p>{body}</p>
      {action}
    </div>
  );
}
