import { IonContent, IonIcon, IonPage, useIonActionSheet } from '@ionic/react';
import {
  cartOutline,
  checkmark,
  chevronDown,
  chevronForward,
  locationOutline,
  pricetagOutline,
  search,
  starOutline,
  timerOutline,
} from 'ionicons/icons';
import { useMemo, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { BrandLogo } from '../../components/brand/BrandLogo';
import { CartBar } from '../../components/food/CartBar';
import { Photo, RestaurantCard } from '../../components/food/parts';
import { Pressable } from '../../components/Pressable';
import { CUISINES, RESTAURANTS, restaurantById, SAVED_ADDRESSES } from '../../data/food';
import { FOOD_STAGES, foodEta, foodSegmentFill, foodStageIndex, isFoodActive } from '../../lib/foodOrder';
import { cssVars } from '../../lib/ui';
import { useNow } from '../../store/DeliveryStore';
import { useFood } from '../../store/FoodStore';

import { POPULAR_PLACES } from '../../data/places';

type Filter = 'recommended' | 'nearest' | 'rated' | 'fastest' | 'offers';

const FILTERS: { key: Filter; label: string; icon: string }[] = [
  { key: 'recommended', label: 'Recommended', icon: checkmark },
  { key: 'nearest', label: 'Nearby', icon: locationOutline },
  { key: 'rated', label: 'Top rated', icon: starOutline },
  { key: 'fastest', label: 'Fastest', icon: timerOutline },
  { key: 'offers', label: 'Offers', icon: pricetagOutline },
];

const Home: React.FC = () => {
  const history = useHistory();
  const { address, setAddressIdx, cartCount, orders } = useFood();
  const [presentSheet] = useIonActionSheet();
  const [filter, setFilter] = useState<Filter>('nearest');
  const now = useNow();
  const active = orders.find((o) => isFoodActive(o, now));

  const list = useMemo(() => {
    const rs = [...RESTAURANTS];
    switch (filter) {
      case 'nearest':
        return rs.sort((a, b) => a.km - b.km);
      case 'rated':
        return rs.sort((a, b) => b.rating - a.rating);
      case 'fastest':
        return rs.sort((a, b) => a.minutes - b.minutes);
      case 'offers':
        return rs.filter((r) => r.offer);
      default:
        return rs;
    }
  }, [filter]);

  const pickAddress = () =>
    presentSheet({
      header: 'Deliver to',
      buttons: [
        ...SAVED_ADDRESSES.map((a, i) => ({ text: `${a.label} · ${a.detail}`, handler: () => setAddressIdx(i) })),
        { text: 'Cancel', role: 'cancel' },
      ],
    });

  return (
    <IonPage>
      <IonContent fullscreen className="home-content">
        <div className="home-band">
          <div className="home-city" role="img" aria-label="Addis Ababa skyline at sunset" />

          <div className="deliver-bar">
            <button className="deliver-to pressable" onClick={pickAddress}>
              <span className="deliver-icon">
                <IonIcon icon={locationOutline} />
              </span>
              <span className="deliver-text">
                <span className="deliver-label">Deliver to</span>
                <span className="deliver-value">
                  <span className="deliver-value-text">
                    <b>{address.label}</b> · {address.area}
                  </span>
                  <IonIcon icon={chevronDown} />
                </span>
              </span>
            </button>
            <button className="round-action pressable" aria-label="Search" onClick={() => history.push('/search')}>
              <IonIcon icon={search} />
            </button>
            <button className="round-action round-action-brand pressable" aria-label={`Cart, ${cartCount} items`} onClick={() => history.push('/cart')}>
              <IonIcon icon={cartOutline} />
              {cartCount > 0 && (
                <span key={cartCount} className="cart-badge swap-in">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        <div className="home-body">
          {active && <ActiveOrder orderId={active.id} now={now} />}

          <div className="cuisines" role="list">
            {CUISINES.map((c) => (
              <Pressable key={c.key} role="listitem" className="cuisine" onPress={() => history.push(`/search?cuisine=${c.key}`)}>
                <span className="cuisine-img">
                  <Photo k={c.photo} w={84} h={84} />
                </span>
                <span className="cuisine-label">{c.label}</span>
              </Pressable>
            ))}
          </div>

          <section className="h-section">
            <div className="h-head">
              <h2 id="popular-places-title">Popular places</h2>
              <button className="see-all pressable" onClick={() => history.push('/places')}>
                See all <IonIcon icon={chevronForward} />
              </button>
            </div>
            <div className="places-carousel" aria-labelledby="popular-places-title">
              <div className="places-track">
                {[0, 1].map((copy) => (
                  <div className="places-group" key={copy} aria-hidden={copy === 1 ? true : undefined}>
                    {POPULAR_PLACES.map((r) => (
                      <button
                        key={r.id}
                        className="place-logo pressable"
                        tabIndex={copy === 1 ? -1 : 0}
                        onClick={() => history.push(`/places/${r.id}`)}
                        aria-label={r.name}
                      >
                        <span className="place-logo-circle"><img src={r.logo} alt="" width={76} height={76} /></span>
                        <span className="place-name">{r.name}</span>
                      </button>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </section>

          <div className="filters-anchor" />
          <div className="h-scroll filters" role="radiogroup" aria-label="Sort restaurants">
            {FILTERS.map((f) => (
              <button
                key={f.key}
                role="radio"
                aria-checked={filter === f.key}
                className="filter-chip pressable"
                onClick={() => setFilter(f.key)}
              >
                <span className="filter-symbol"><IonIcon icon={f.icon} /></span>
                {f.label}
              </button>
            ))}
          </div>

          <div key={filter} className="r-list stagger">
            {list.map((r, i) => (
              <RestaurantCard key={r.id} r={r} style={cssVars({ '--i': Math.min(i, 6) })} />
            ))}
          </div>
        </div>

        <CartBar />
      </IonContent>
    </IonPage>
  );
};

function ActiveOrder({ orderId, now }: { orderId: string; now: number }) {
  const history = useHistory();
  const { getOrder } = useFood();
  const o = getOrder(orderId);
  if (!o) return null;
  const r = restaurantById(o.restaurantId)!;
  const idx = foodStageIndex(o, now);
  return (
    <Pressable className="live-order" onPress={() => history.push(`/order/${o.id}`)}>
      <BrandLogo logo={r.logo} size={44} radius={13} />
      <div className="live-order-text">
        <span key={idx} className="live-order-title swap-in">
          {FOOD_STAGES[idx].title}
        </span>
        <span className="live-order-sub">{r.name}</span>
        <span className="live-order-bar" aria-hidden>
          {[0, 1, 2, 3].map((i) => (
            <span key={i}>
              <i style={{ transform: `scaleX(${foodSegmentFill(o, now, i)})` }} />
            </span>
          ))}
        </span>
      </div>
      <span className="live-order-eta">
        <b>{foodEta(o, now)}</b>
        <span>min</span>
      </span>
    </Pressable>
  );
}

export default Home;
