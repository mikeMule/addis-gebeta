import { IonContent, IonIcon, IonPage, useIonRouter, useIonToast } from '@ionic/react';
import { arrowBack, call, chatbubble, closeCircleOutline, star, searchOutline } from 'ionicons/icons';
import { useParams } from 'react-router-dom';
import { CategoryIcon } from '../components/Badges';
import { EmptyState } from '../components/EmptyState';
import { HoldButton } from '../components/HoldButton';
import { RouteMap } from '../components/RouteMap';
import { Timeline } from '../components/Timeline';
import {
  CATEGORIES,
  etaMinutes,
  formatClock,
  formatDay,
  formatPrice,
  hashId,
  initials,
  routeProgress,
  SIZES,
  SPEEDS,
  stageIndex,
  stageOf,
  STAGES,
  stageTimestamp,
  STATUS_COPY,
  statusOf,
} from '../lib/delivery';
import { useDeliveries, useNow } from '../store/DeliveryStore';

const Track: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { get, cancel } = useDeliveries();
  const router = useIonRouter();
  const [presentToast] = useIonToast();
  const now = useNow();
  const d = get(id);

  const back = () => (router.canGoBack() ? router.goBack() : router.push('/tabs/home', 'back', 'replace'));

  if (!d) {
    return (
      <IonPage>
        <IonContent>
          <div className="screen">
            <button className="icon-btn pressable" onClick={back} aria-label="Back">
              <IonIcon icon={arrowBack} />
            </button>
            <EmptyState icon={searchOutline} title="Delivery not found" body="It may have been cleared from your history." />
          </div>
        </IonContent>
      </IonPage>
    );
  }

  const status = statusOf(d, now);
  const stage = stageOf(d, now);
  const idx = stageIndex(stage);
  const live = status !== 'delivered' && status !== 'cancelled';
  const cancellable = status === 'placed' || status === 'assigned';
  const hasCourier = idx >= 1;

  const eyebrow = live
    ? `Arriving in ~${etaMinutes(d, now)} min`
    : status === 'delivered'
      ? `Delivered at ${formatClock(stageTimestamp(d, 'delivered'))}`
      : `Cancelled at ${formatClock(d.cancelledAt!)}`;

  const hint = live
    ? STAGES[idx].hint
    : status === 'delivered'
      ? `Handed to ${d.recipient}. Thanks for using Addis Gebeta.`
      : 'You were not charged for this delivery.';

  return (
    <IonPage>
      <IonContent fullscreen>
        <div className="map-wrap">
          <RouteMap
            seed={hashId(d.id)}
            progress={routeProgress(d, now)}
            showCourier={hasCourier && status !== 'cancelled'}
            searching={status === 'placed'}
          />
          <button className="icon-btn map-back pressable" onClick={back} aria-label="Back">
            <IonIcon icon={arrowBack} />
          </button>
          <span className="map-chip">#{d.id}</span>
        </div>

        <div className="sheet">
          <span className="sheet-handle" aria-hidden />

          <section className="status-block" aria-live="polite">
            <div className="eyebrow">{eyebrow}</div>
            <div className="status-row">
              {status === 'delivered' && <DoneMark />}
              <h1 key={status} className="status-title swap-in">
                {STATUS_COPY[status].title}
              </h1>
            </div>
            <p className="status-hint">{hint}</p>
          </section>

          {status === 'placed' && (
            <div className="card searching fade-in">
              <span className="spinner spinner-accent" />
              <span>Matching you with the nearest courier…</span>
            </div>
          )}

          {hasCourier && (
            <div className="card courier-card fade-in">
              <span className="avatar">{initials(d.courier.name)}</span>
              <div className="row-main">
                <div className="row-title">{d.courier.name}</div>
                <div className="row-sub">
                  <IonIcon icon={star} className="star" /> {d.courier.rating} · {d.courier.vehicle} · {d.courier.plate}
                </div>
              </div>
              {live && (
                <div className="courier-actions">
                  <a className="round-btn pressable" href={`sms:${d.courier.phone}`} aria-label="Message courier">
                    <IonIcon icon={chatbubble} />
                  </a>
                  <a className="round-btn round-btn-accent pressable" href={`tel:${d.courier.phone}`} aria-label="Call courier">
                    <IonIcon icon={call} />
                  </a>
                </div>
              )}
            </div>
          )}

          <div className="card">
            <Timeline
              stages={STAGES}
              current={idx}
              cancelled={status === 'cancelled'}
              timeOf={(i) => stageTimestamp(d, STAGES[i].key)}
            />
          </div>

          <h3 className="form-heading">Details</h3>
          <div className="card details">
            <div className="summary-item">
              <CategoryIcon category={d.category} />
              <div className="row-main">
                <div className="row-title">{d.itemName}</div>
                <div className="row-sub">
                  {SIZES[d.size].label} · {CATEGORIES[d.category].label}
                </div>
              </div>
            </div>
            <div className="divider" />
            <dl className="kv">
              <div>
                <dt>From</dt>
                <dd>{d.pickup}</dd>
              </div>
              <div>
                <dt>To</dt>
                <dd>{d.dropoff}</dd>
              </div>
              <div>
                <dt>Recipient</dt>
                <dd>
                  {d.recipient} · {d.recipientPhone}
                </dd>
              </div>
              {d.notes && (
                <div>
                  <dt>Notes</dt>
                  <dd>{d.notes}</dd>
                </div>
              )}
              <div>
                <dt>Speed</dt>
                <dd>{SPEEDS[d.speed].label}</dd>
              </div>
              <div>
                <dt>Placed</dt>
                <dd>{formatDay(d.createdAt)}</dd>
              </div>
              <div className="kv-total">
                <dt>{status === 'cancelled' ? 'Charged' : 'Total · cash'}</dt>
                <dd>{status === 'cancelled' ? formatPrice(0) : formatPrice(d.price)}</dd>
              </div>
            </dl>
          </div>

          {cancellable && (
            <div className="cancel-zone">
              <HoldButton
                label="Hold to cancel"
                holdLabel="Keep holding…"
                icon={closeCircleOutline}
                onComplete={() => {
                  cancel(d.id);
                  presentToast({ message: 'Delivery cancelled', duration: 1800, position: 'top', cssClass: 'app-toast' });
                }}
              />
              <p className="fine">Free to cancel until the courier picks up.</p>
            </div>
          )}

          {!live && (
            <button className="btn btn-primary pressable" onClick={() => router.push('/new', 'forward')}>
              Send another item
            </button>
          )}
        </div>
      </IonContent>
    </IonPage>
  );
};

function DoneMark() {
  return (
    <svg className="done-mark" viewBox="0 0 32 32" aria-hidden>
      <circle cx="16" cy="16" r="16" />
      <path d="M9.5 16.5 L14 21 L22.5 11.5" pathLength={1} />
    </svg>
  );
}

export default Track;
