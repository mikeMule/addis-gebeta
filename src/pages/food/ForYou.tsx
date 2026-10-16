import { IonContent, IonIcon, IonPage } from '@ionic/react';
import { arrowForward, refresh } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import { BrandLogo } from '../../components/brand/BrandLogo';
import { CartBar } from '../../components/food/CartBar';
import { DishCard, Photo, RestaurantCard } from '../../components/food/parts';
import { Pressable } from '../../components/Pressable';
import { allDishes, restaurantById, RESTAURANTS } from '../../data/food';
import { formatDay, formatPrice } from '../../lib/delivery';
import { cssVars } from '../../lib/ui';
import { useFood } from '../../store/FoodStore';

const tsom = allDishes.filter((x) => x.dish.fasting).slice(0, 8);
const breakfast = restaurantById('buna-bet')!.menu.flatMap((s) => s.dishes.map((dish) => ({ dish, restaurant: restaurantById('buna-bet')! })));
const budget = allDishes.filter((x) => x.dish.price <= 250 && !x.dish.fasting).slice(0, 8);

const ForYou: React.FC = () => {
  const history = useHistory();
  const { orders, favorites, reorder } = useFood();
  const past = orders.filter((o) => !o.cancelledAt).slice(0, 4);
  const favs = RESTAURANTS.filter((r) => favorites.includes(r.id));

  return (
    <IonPage>
      <IonContent fullscreen>
        <div className="screen screen-tabs foryou stagger">
          <h1 className="page-title" style={cssVars({ '--i': 0 })}>
            For you
          </h1>

          <Pressable className="feature" style={cssVars({ '--i': 1 })} onPress={() => history.push('/restaurant/buna-bet')}>
            <Photo k="buna" w={420} h={260} alt="" />
            <div className="feature-shade" />
            <div className="feature-copy">
              <h2>
                Buna time{' '}
                <span className="feature-geez" lang="am">
                  ቡና ሰዓት
                </span>
              </h2>
              <p>A jebena of fresh coffee from Buna Bet, at your door in 15 minutes.</p>
              <span className="feature-cta">
                Order {formatPrice(150)} <IonIcon icon={arrowForward} />
              </span>
            </div>
          </Pressable>

          <Shelf title="Tsom-friendly" note="Fasting dishes, no animal products" items={tsom} i={2} />
          <Shelf title="Breakfast in Addis" note="Chechebsa, firfir and macchiato" items={breakfast} i={3} />
          <Shelf title="Under 250 ETB" note="Big flavour, small bill" items={budget} i={4} />

          {past.length > 0 && (
            <section className="h-section" style={cssVars({ '--i': 5 })}>
              <div className="h-head">
                <h2>Order again</h2>
              </div>
              <div className="again-list">
                {past.map((o) => {
                  const r = restaurantById(o.restaurantId)!;
                  return (
                    <div key={o.id} className="again">
                      <BrandLogo logo={r.logo} size={46} radius={14} />
                      <div className="row-main">
                        <div className="row-title">{r.name}</div>
                        <div className="row-sub">
                          {o.lines.map((l) => `${l.qty}× ${l.name}`).join(', ')} · {formatDay(o.createdAt)}
                        </div>
                      </div>
                      <button
                        className="again-btn pressable"
                        onClick={() => {
                          reorder(o);
                          history.push('/cart');
                        }}
                      >
                        <IonIcon icon={refresh} />
                        Reorder
                      </button>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {favs.length > 0 && (
            <section className="h-section" style={cssVars({ '--i': 6 })}>
              <div className="h-head">
                <h2>Your favourites</h2>
              </div>
              <div className="r-list">
                {favs.map((r) => (
                  <RestaurantCard key={r.id} r={r} />
                ))}
              </div>
            </section>
          )}
        </div>
        <CartBar />
      </IonContent>
    </IonPage>
  );
};

function Shelf({ title, note, items, i }: { title: string; note: string; items: typeof allDishes; i: number }) {
  return (
    <section className="h-section" style={cssVars({ '--i': i })}>
      <div className="h-head h-head-stack">
        <h2>{title}</h2>
        <p>{note}</p>
      </div>
      <div className="h-scroll dish-scroll">
        {items.map(({ dish, restaurant }) => (
          <DishCard key={dish.id} d={dish} r={restaurant} />
        ))}
      </div>
    </section>
  );
}

export default ForYou;
