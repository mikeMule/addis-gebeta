import { IonIcon } from '@ionic/react';
import { arrowForward } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import { restaurantById } from '../../data/food';
import { formatPrice } from '../../lib/delivery';
import { priceCart } from '../../lib/foodOrder';
import { useFood } from '../../store/FoodStore';
import { BrandLogo } from '../brand/BrandLogo';

/** Floating summary that appears once the cart has something in it. */
export function CartBar({ above = 'tabs' }: { above?: 'tabs' | 'edge' }) {
  const history = useHistory();
  const { cart, cartLines, cartCount } = useFood();
  const r = cart.restaurantId ? restaurantById(cart.restaurantId) : undefined;
  if (!r || !cartCount) return null;
  const { total } = priceCart(r, cartLines.reduce((s, l) => s + l.price * l.qty, 0));

  return (
    <div className="cart-bar-wrap" data-above={above} slot="fixed">
      <button className="cart-bar pressable" onClick={() => history.push('/cart')}>
        <BrandLogo logo={r.logo} size={38} radius={11} />
        <span className="cart-bar-text">
          <span key={cartCount} className="cart-bar-count swap-in">
            {cartCount} {cartCount === 1 ? 'item' : 'items'}
          </span>
          <span className="cart-bar-rest">{r.name}</span>
        </span>
        <span className="cart-bar-total">
          <span key={total} className="swap-in">
            {formatPrice(total)}
          </span>
          <IonIcon icon={arrowForward} />
        </span>
      </button>
    </div>
  );
}
