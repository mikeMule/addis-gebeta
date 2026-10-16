import { IonContent, IonIcon, IonPage } from '@ionic/react';
import { cubeOutline, receiptOutline, refresh, timeOutline } from 'ionicons/icons';
import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { ActiveCard } from '../components/ActiveCard';
import { BrandLogo } from '../components/brand/BrandLogo';
import { DeliveryRow } from '../components/DeliveryRow';
import { EmptyState } from '../components/EmptyState';
import { Pressable } from '../components/Pressable';
import { restaurantById } from '../data/food';
import { formatDay, formatPrice, isActive, type Delivery } from '../lib/delivery';
import { FOOD_STAGES, foodEta, foodSegmentFill, foodStageIndex, foodStatus, isFoodActive, type FoodOrder } from '../lib/foodOrder';
import { cssVars } from '../lib/ui';
import { useDeliveries, useNow } from '../store/DeliveryStore';
import { useFood } from '../store/FoodStore';

type Entry = { kind: 'food'; at: number; o: FoodOrder } | { kind: 'parcel'; at: number; d: Delivery };

const FOOD_PILL: Record<string, string> = {
  confirmed: 'Confirmed',
  preparing: 'Preparing',
  picked: 'Picked up',
  transit: 'On the way',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
};

const Orders: React.FC = () => {
  const history = useHistory();
  const { deliveries } = useDeliveries();
  const { orders, reorder } = useFood();
  const now = useNow();

  const entries: Entry[] = [
    ...orders.map((o) => ({ kind: 'food' as const, at: o.createdAt, o })),
    ...deliveries.map((d) => ({ kind: 'parcel' as const, at: d.createdAt, d })),
  ].sort((a, b) => b.at - a.at);

  const live = (e: Entry) => (e.kind === 'food' ? isFoodActive(e.o, now) : isActive(e.d, now));
  const active = entries.filter(live);
  const past = entries.filter((e) => !live(e));
  const [tab, setTab] = useState<0 | 1>(() => (active.length ? 0 : 1));
  const list = tab === 0 ? active : past;

  return (
    <IonPage>
      <IonContent fullscreen>
        <div className="screen screen-tabs">
          <h1 className="page-title">Orders</h1>

          <div className="segmented" data-index={tab} role="tablist">
            <span className="segmented-thumb" aria-hidden />
            <button role="tab" aria-selected={tab === 0} onClick={() => setTab(0)}>
              Active
              {active.length > 0 && <span className="count-badge">{active.length}</span>}
            </button>
            <button role="tab" aria-selected={tab === 1} onClick={() => setTab(1)}>
              Past
            </button>
          </div>

          <div key={tab} className="list stagger">
            {list.map((e, i) => {
              const style = cssVars({ '--i': Math.min(i, 6) });
              if (e.kind === 'parcel') {
                return tab === 0 ? <ActiveCard key={e.d.id} d={e.d} now={now} style={style} /> : <DeliveryRow key={e.d.id} d={e.d} now={now} style={style} />;
              }
              const o = e.o;
              const r = restaurantById(o.restaurantId)!;
              const status = foodStatus(o, now);
              const idx = foodStageIndex(o, now);
              return (
                <Pressable key={o.id} className="order-row" style={style} onPress={() => history.push(`/order/${o.id}`)}>
                  <div className="order-row-top">
                    <BrandLogo logo={r.logo} size={48} radius={14} />
                    <div className="row-main">
                      <div className="row-title">{r.name}</div>
                      <div className="row-sub">{o.lines.map((l) => `${l.qty}× ${l.name}`).join(', ')}</div>
                    </div>
                    {tab === 0 ? (
                      <div className="eta">
                        <span className="eta-value">{foodEta(o, now)}</span>
                        <span className="eta-unit">min</span>
                      </div>
                    ) : (
                      <div className="row-end">
                        <div className="row-price">{formatPrice(status === 'cancelled' ? 0 : o.total)}</div>
                        <span className="pill" data-tone={status === 'cancelled' ? 'muted' : 'success'}>
                          {FOOD_PILL[status]}
                        </span>
                      </div>
                    )}
                  </div>
                  {tab === 0 ? (
                    <>
                      <div className="seg-bar" aria-hidden>
                        {[0, 1, 2, 3].map((s) => (
                          <span className="seg" key={s}>
                            <i style={{ transform: `scaleX(${foodSegmentFill(o, now, s)})` }} />
                          </span>
                        ))}
                      </div>
                      <div key={idx} className="order-row-status swap-in">
                        {FOOD_STAGES[idx].title}
                      </div>
                    </>
                  ) : (
                    <div className="order-row-foot">
                      <span>
                        <IonIcon icon={timeOutline} /> {formatDay(o.createdAt)}
                      </span>
                      <button
                        className="again-btn pressable"
                        onClick={(ev) => {
                          ev.stopPropagation();
                          reorder(o);
                          history.push('/cart');
                        }}
                      >
                        <IonIcon icon={refresh} /> Reorder
                      </button>
                    </div>
                  )}
                </Pressable>
              );
            })}

            {!list.length &&
              (tab === 0 ? (
                <EmptyState
                  icon={receiptOutline}
                  title="No orders on the way"
                  body="Hungry? Mesob Corner is cooking beyaynetu right now."
                  action={
                    <button className="btn btn-brand btn-inline pressable" onClick={() => history.push('/tabs/home')}>
                      Find food
                    </button>
                  }
                />
              ) : (
                <EmptyState icon={cubeOutline} title="No past orders" body="Delivered and cancelled orders show up here." />
              ))}
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Orders;
