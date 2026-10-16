import { IonIcon, useIonAlert } from '@ionic/react';
import { add, bicycleOutline, heart, heartOutline, navigateOutline, remove, star, timeOutline } from 'ionicons/icons';
import type { CSSProperties } from 'react';
import { useHistory } from 'react-router-dom';
import { offerLabel, photo, restaurantById, type Dish, type PhotoKey, type Restaurant } from '../../data/food';
import { formatPrice } from '../../lib/delivery';
import { useFood } from '../../store/FoodStore';
import { BrandLogo } from '../brand/BrandLogo';
import { Pressable } from '../Pressable';

export const fmtReviews = (n: number) => (n >= 1000 ? `${(n / 1000).toFixed(1).replace('.0', '')}k+` : `${n}+`);

/** Lazy, fade-in food photo with a warm placeholder so layout never jumps. */
export function Photo({ k, w, alt = '', className = '' }: { k: PhotoKey; w: number; h?: number; alt?: string; className?: string }) {
  return (
    <img
      className={`photo ${className}`}
      src={photo(k, w * 2)}
      alt={alt}
      loading="lazy"
      decoding="async"
      onLoad={(e) => e.currentTarget.setAttribute('data-loaded', 'true')}
    />
  );
}

export function Rating({ r }: { r: Pick<Restaurant, 'rating' | 'reviews'> }) {
  return (
    <span className="rating">
      <IonIcon icon={star} className="rating-star" />
      <b>{r.rating.toFixed(1)}</b>
      <span>({fmtReviews(r.reviews)})</span>
    </span>
  );
}

export function MetaPills({ r }: { r: Restaurant }) {
  const free = r.offer?.kind === 'freeDelivery';
  return (
    <div className="meta-pills">
      <span className="meta-pill">
        <IonIcon icon={timeOutline} />
        {r.minutes} min
      </span>
      <span className="meta-pill" data-free={free}>
        <IonIcon icon={bicycleOutline} />
        {free ? 'Free' : `${r.fee} ETB`}
      </span>
      <span className="meta-pill">
        <IonIcon icon={navigateOutline} />
        {r.km.toFixed(1)} km
      </span>
    </div>
  );
}

export function FavButton({ id, className = '' }: { id: string; className?: string }) {
  const { favorites, toggleFavorite } = useFood();
  const on = favorites.includes(id);
  return (
    <button
      className={`fav-btn pressable ${className}`}
      data-on={on}
      aria-pressed={on}
      aria-label={on ? 'Remove from favourites' : 'Add to favourites'}
      onClick={(e) => {
        e.stopPropagation();
        toggleFavorite(id);
      }}
    >
      <IonIcon icon={on ? heart : heartOutline} />
    </button>
  );
}

export function RestaurantCard({ r, style }: { r: Restaurant; style?: CSSProperties }) {
  const history = useHistory();
  return (
    <Pressable className="r-card" style={style} onPress={() => history.push(`/restaurant/${r.id}`)} aria-label={r.name}>
      <div className="r-card-media">
        <Photo k={r.cover} w={124} h={124} />
        <span className="r-card-badge">
          <BrandLogo logo={r.logo} size={34} radius={10} />
        </span>
        {r.offer && <span className="r-card-offer">{r.offer.kind === 'pct' ? `${r.offer.pct}% OFF` : 'FREE DELIVERY'}</span>}
      </div>
      <div className="r-card-body">
        <div className="r-card-head">
          <div className="r-card-titles">
            <h3 className="r-card-name">{r.name}</h3>
            <p className="r-card-area">({r.area})</p>
          </div>
          <FavButton id={r.id} />
        </div>
        <Rating r={r} />
        <MetaPills r={r} />
      </div>
    </Pressable>
  );
}

/** Adds a dish, asking before replacing a cart from another restaurant. */
export function useAddToCart() {
  const { add, startNewCart, cart } = useFood();
  const [presentAlert] = useIonAlert();
  return (restaurantId: string, dishId: string) => {
    if (add(restaurantId, dishId) === 'added') return;
    const current = cart.restaurantId ? restaurantById(cart.restaurantId)?.name : 'another restaurant';
    presentAlert({
      header: 'Start a new cart?',
      message: `Your cart has items from ${current}. Adding this will clear them.`,
      buttons: [
        { text: 'Keep cart', role: 'cancel' },
        { text: 'Start new', role: 'destructive', handler: () => startNewCart(restaurantId, dishId) },
      ],
    });
  };
}

export function Stepper({ dishId, restaurantId, compact = false }: { dishId: string; restaurantId: string; compact?: boolean }) {
  const { cart, setQty } = useFood();
  const addToCart = useAddToCart();
  const qty = cart.restaurantId === restaurantId ? cart.lines[dishId] ?? 0 : 0;

  if (!qty) {
    return (
      <button
        className="add-btn pressable"
        data-compact={compact}
        aria-label="Add to cart"
        onClick={(e) => {
          e.stopPropagation();
          addToCart(restaurantId, dishId);
        }}
      >
        <IonIcon icon={add} />
      </button>
    );
  }
  return (
    <div className="stepper-pill" data-compact={compact} onClick={(e) => e.stopPropagation()}>
      <button className="pressable" aria-label="Remove one" onClick={() => setQty(dishId, qty - 1)}>
        <IonIcon icon={remove} />
      </button>
      <span key={qty} className="stepper-qty swap-in" aria-live="polite">
        {qty}
      </span>
      <button className="pressable" aria-label="Add one" onClick={() => setQty(dishId, qty + 1)}>
        <IonIcon icon={add} />
      </button>
    </div>
  );
}

export function DishTags({ d }: { d: Dish }) {
  if (!d.popular && !d.fasting) return null;
  return (
    <span className="dish-tags">
      {d.popular && <span className="dish-tag" data-tone="hot">Popular</span>}
      {d.fasting && <span className="dish-tag" data-tone="tsom">Tsom</span>}
    </span>
  );
}

export function DishRow({ d, r }: { d: Dish; r: Restaurant }) {
  return (
    <div className="dish-row">
      <div className="dish-row-text">
        <DishTags d={d} />
        <h4 className="dish-name">{d.name}</h4>
        <p className="dish-desc">{d.desc}</p>
        <span className="dish-price">{formatPrice(d.price)}</span>
      </div>
      <div className="dish-row-media">
        <Photo k={d.photo} w={112} h={112} alt={d.name} />
        <span className="dish-row-action">
          <Stepper dishId={d.id} restaurantId={r.id} />
        </span>
      </div>
    </div>
  );
}

export function DishCard({ d, r, style }: { d: Dish; r: Restaurant; style?: CSSProperties }) {
  const history = useHistory();
  return (
    <Pressable className="dish-card" style={style} onPress={() => history.push(`/restaurant/${r.id}`)} aria-label={`${d.name} from ${r.name}`}>
      <div className="dish-card-media">
        <Photo k={d.photo} w={176} h={124} alt="" />
        <span className="dish-card-action">
          <Stepper dishId={d.id} restaurantId={r.id} compact />
        </span>
      </div>
      <h4 className="dish-card-name">{d.name}</h4>
      <p className="dish-card-sub">{r.name}</p>
      <span className="dish-price">{formatPrice(d.price)}</span>
    </Pressable>
  );
}

export function OfferStrip({ r }: { r: Restaurant }) {
  if (!r.offer) return null;
  return <span className="offer-strip">{offerLabel(r.offer)}</span>;
}
