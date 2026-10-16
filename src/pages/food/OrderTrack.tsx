import { IonContent, IonIcon, IonPage, useIonRouter, useIonToast } from '@ionic/react';
import { arrowBack, call, chatbubble, closeCircleOutline, refresh, searchOutline, star } from 'ionicons/icons';
import { useParams } from 'react-router-dom';
import { BrandLogo } from '../../components/brand/BrandLogo';
import { EmptyState } from '../../components/EmptyState';
import { HoldButton } from '../../components/HoldButton';
import { RouteMap } from '../../components/RouteMap';
import { Timeline } from '../../components/Timeline';
import { restaurantById } from '../../data/food';
import { formatClock, formatPrice, hashId, initials } from '../../lib/delivery';
import { FOOD_STAGES, foodEta, foodRouteProgress, foodStageIndex, foodStageTime, foodStatus } from '../../lib/foodOrder';
import { useNow } from '../../store/DeliveryStore';
import { useFood } from '../../store/FoodStore';

const OrderTrack: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { getOrder, cancelOrder, reorder } = useFood();
  const router = useIonRouter();
  const [presentToast] = useIonToast();
  const now = useNow();
  const o = getOrder(id);

  const back = () => (router.canGoBack() ? router.goBack() : router.push('/tabs/home', 'back', 'replace'));

  if (!o) {
    return (
      <IonPage>
        <IonContent>
          <div className="screen">
            <button className="icon-btn pressable" onClick={back} aria-label="Back">
              <IonIcon icon={arrowBack} />
            </button>
            <EmptyState icon={searchOutline} title="Order not found" body="It may have been cleared from your history." />
          </div>
        </IonContent>
      </IonPage>
    );
  }

  const r = restaurantById(o.restaurantId)!;
  const status = foodStatus(o, now);
  const idx = foodStageIndex(o, now);
  const live = status !== 'delivered' && status !== 'cancelled';
  const cancelled = status === 'cancelled';

  const title = cancelled ? 'Order cancelled' : FOOD_STAGES[idx].title;
  const line = live
    ? `Arriving in about ${foodEta(o, now)} min`
    : cancelled
      ? `Cancelled at ${formatClock(o.cancelledAt!)} · you were not charged`
      : `Delivered at ${formatClock(foodStageTime(o, FOOD_STAGES.length - 1))}`;

  return (
    <IonPage>
      <IonContent fullscreen>
        <div className="map-wrap">
          <RouteMap seed={hashId(o.id)} progress={foodRouteProgress(o, now)} showCourier={idx >= 2 && !cancelled} searching={idx < 2 && !cancelled} />
          <button className="icon-btn map-back pressable" onClick={back} aria-label="Back">
            <IonIcon icon={arrowBack} />
          </button>
          <span className="map-chip">#{o.id}</span>
        </div>

        <div className="sheet">
          <span className="sheet-handle" aria-hidden />

          <section className="status-block" aria-live="polite">
            <div className="status-row">
              {status === 'delivered' && <DoneMark />}
              <h1 key={title} className="status-title swap-in">
                {title}
              </h1>
            </div>
            <p className="status-hint">{line}</p>
          </section>

          {idx >= 2 && !cancelled && (
            <div className="card courier-card fade-in">
              <span className="avatar">{initials(o.courier.name)}</span>
              <div className="row-main">
                <div className="row-title">{o.courier.name}</div>
                <div className="row-sub">
                  <IonIcon icon={star} className="star" /> {o.courier.rating} · {o.courier.vehicle}
                </div>
              </div>
              {live && (
                <div className="courier-actions">
                  <a className="round-btn pressable" href={`sms:${o.courier.phone}`} aria-label="Message courier">
                    <IonIcon icon={chatbubble} />
                  </a>
                  <a className="round-btn round-btn-accent pressable" href={`tel:${o.courier.phone}`} aria-label="Call courier">
                    <IonIcon icon={call} />
                  </a>
                </div>
              )}
            </div>
          )}

          <div className="card">
            <Timeline stages={FOOD_STAGES} current={idx} cancelled={cancelled} timeOf={(i) => foodStageTime(o, i)} />
          </div>

          <h3 className="group-title">Your order</h3>
          <div className="card receipt-card">
            <div className="cart-rest">
              <BrandLogo logo={r.logo} size={40} radius={12} />
              <div className="row-main">
                <div className="row-title">{r.name}</div>
                <div className="row-sub">To {o.address}</div>
              </div>
            </div>
            <div className="divider" />
            {o.lines.map((l) => (
              <div className="bill-line" key={l.dishId}>
                <span>
                  <b className="qty">{l.qty}×</b> {l.name}
                </span>
                <span>{formatPrice(l.price * l.qty)}</span>
              </div>
            ))}
            {o.note && <p className="order-note">“{o.note}”</p>}
            <div className="divider" />
            {o.discount > 0 && (
              <div className="bill-line bill-discount">
                <span>Offer</span>
                <span>−{formatPrice(o.discount)}</span>
              </div>
            )}
            <div className="bill-line bill-total">
              <span>{cancelled ? 'Charged' : 'Total · cash'}</span>
              <span>{formatPrice(cancelled ? 0 : o.total)}</span>
            </div>
          </div>

          {idx === 0 && !cancelled && (
            <div className="cancel-zone">
              <HoldButton
                label="Hold to cancel"
                holdLabel="Keep holding…"
                icon={closeCircleOutline}
                onComplete={() => {
                  cancelOrder(o.id);
                  presentToast({ message: 'Order cancelled', duration: 1800, position: 'top', cssClass: 'app-toast' });
                }}
              />
              <p className="fine">You can cancel until the kitchen starts cooking.</p>
            </div>
          )}

          {!live && (
            <button
              className="btn btn-brand pressable sheet-cta"
              onClick={() => {
                reorder(o);
                router.push('/cart', 'forward');
              }}
            >
              <IonIcon icon={refresh} /> Order again
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

export default OrderTrack;
