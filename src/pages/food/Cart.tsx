import { IonContent, IonFooter, IonIcon, IonPage, useIonActionSheet, useIonRouter } from '@ionic/react';
import { add, arrowBack, bagHandleOutline, cashOutline, chevronForward, locationOutline, remove, timeOutline } from 'ionicons/icons';
import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { BrandLogo } from '../../components/brand/BrandLogo';
import { EmptyState } from '../../components/EmptyState';
import { Photo } from '../../components/food/parts';
import { dishById, offerLabel, restaurantById, SAVED_ADDRESSES } from '../../data/food';
import { formatPrice } from '../../lib/delivery';
import { priceCart } from '../../lib/foodOrder';
import { useFood } from '../../store/FoodStore';

const Cart: React.FC = () => {
  const router = useIonRouter();
  const history = useHistory();
  const { cart, cartLines, setQty, address, setAddressIdx, placeOrder, clearCart } = useFood();
  const [presentSheet] = useIonActionSheet();
  const [note, setNote] = useState('');
  const [placing, setPlacing] = useState(false);
  const r = cart.restaurantId ? restaurantById(cart.restaurantId) : undefined;

  const back = () => (router.canGoBack() ? router.goBack() : router.push('/tabs/home', 'back', 'replace'));

  const pickAddress = () =>
    presentSheet({
      header: 'Deliver to',
      buttons: [
        ...SAVED_ADDRESSES.map((a, i) => ({ text: `${a.label} · ${a.detail}`, handler: () => setAddressIdx(i) })),
        { text: 'Cancel', role: 'cancel' },
      ],
    });

  const place = () => {
    if (placing) return;
    setPlacing(true);
    window.setTimeout(() => {
      const o = placeOrder(note.trim());
      if (o) history.replace(`/order/${o.id}`);
      else setPlacing(false);
    }, 900);
  };

  const header = (
    <div className="page-bar">
      <button className="icon-btn pressable" onClick={back} aria-label="Back">
        <IonIcon icon={arrowBack} />
      </button>
      <h1>Your cart</h1>
      {r && cartLines.length > 0 && (
        <button className="text-btn pressable" onClick={clearCart}>
          Clear
        </button>
      )}
    </div>
  );

  if (!r || !cartLines.length) {
    return (
      <IonPage>
        <IonContent>
          {header}
          <EmptyState
            icon={bagHandleOutline}
            title="Your cart is empty"
            body="Add a dish from any restaurant and it lands here."
            action={
              <button className="btn btn-brand btn-inline pressable" onClick={() => router.push('/tabs/home', 'root')}>
                Browse restaurants
              </button>
            }
          />
        </IonContent>
      </IonPage>
    );
  }

  const p = priceCart(r, cartLines.reduce((s, l) => s + l.price * l.qty, 0));

  return (
    <IonPage>
      <IonContent>
        {header}
        <div className="screen screen-tight">
          {r.demo && <p className="place-demo-notice">Demo order: sample prices. No order is sent to the restaurant.</p>}
          <div className="cart-rest">
            <BrandLogo logo={r.logo} size={44} radius={13} />
            <div className="row-main">
              <div className="row-title">{r.name}</div>
              <div className="row-sub">
                {r.area} · {r.minutes}–{r.minutes + 10} min
              </div>
            </div>
            <button className="text-btn pressable" onClick={() => history.push(`/restaurant/${r.id}`)}>
              Add items
            </button>
          </div>

          <div className="cart-lines">
            {cartLines.map((l) => {
              const d = dishById(l.dishId)!.dish;
              return (
                <div key={l.dishId} className="cart-line">
                  <Photo k={d.photo} w={64} h={64} alt="" className="cart-line-img" />
                  <div className="row-main">
                    <div className="row-title">{l.name}</div>
                    <div className="cart-line-price">{formatPrice(l.price * l.qty)}</div>
                  </div>
                  <div className="stepper-pill stepper-soft">
                    <button className="pressable" aria-label={`Remove one ${l.name}`} onClick={() => setQty(l.dishId, l.qty - 1)}>
                      <IonIcon icon={remove} />
                    </button>
                    <span key={l.qty} className="stepper-qty swap-in">
                      {l.qty}
                    </span>
                    <button className="pressable" aria-label={`Add one ${l.name}`} onClick={() => setQty(l.dishId, l.qty + 1)}>
                      <IonIcon icon={add} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <h3 className="group-title">Delivery</h3>
          <div className="group">
            <button className="group-row pressable-row" onClick={pickAddress}>
              <span className="group-icon">
                <IonIcon icon={locationOutline} />
              </span>
              <span className="row-main">
                <span className="row-title">{address.label}</span>
                <span className="row-sub">{address.detail}</span>
              </span>
              <IonIcon icon={chevronForward} className="muted" />
            </button>
            <div className="group-row">
              <span className="group-icon">
                <IonIcon icon={timeOutline} />
              </span>
              <span className="row-main">
                <span className="row-title">Standard delivery</span>
                <span className="row-sub">
                  Arrives in {r.minutes + 5}–{r.minutes + 15} min
                </span>
              </span>
            </div>
            <label className="group-row group-note">
              <textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder="Note for the kitchen — less spicy, no onion…" rows={2} maxLength={160} />
            </label>
          </div>

          <h3 className="group-title">Payment</h3>
          <div className="group">
            <div className="group-row">
              <span className="group-icon group-icon-green">
                <IonIcon icon={cashOutline} />
              </span>
              <span className="row-main">
                <span className="row-title">Cash on delivery</span>
                <span className="row-sub">Pay the courier when your food arrives</span>
              </span>
            </div>
          </div>

          <div className="bill">
            <div className="bill-line">
              <span>Subtotal</span>
              <span>{formatPrice(p.subtotal)}</span>
            </div>
            <div className="bill-line">
              <span>Delivery fee</span>
              <span>{p.deliveryFee ? formatPrice(p.deliveryFee) : 'Free'}</span>
            </div>
            <div className="bill-line">
              <span>Service fee</span>
              <span>{formatPrice(p.serviceFee)}</span>
            </div>
            {p.discount > 0 && (
              <div className="bill-line bill-discount">
                <span>{offerLabel(r.offer)}</span>
                <span>−{formatPrice(p.discount)}</span>
              </div>
            )}
            <div className="bill-line bill-total">
              <span>Total</span>
              <span key={p.total} className="swap-in">
                {formatPrice(p.total)}
              </span>
            </div>
          </div>
        </div>
      </IonContent>

      <IonFooter className="ion-no-border">
        <div className="cta-bar">
          <button className="btn btn-brand pressable" onClick={place} data-busy={placing}>
            <span className="swap-layers">
              <span className="layer-idle">Place order · {formatPrice(p.total)}</span>
              <span className="layer-busy" aria-hidden={!placing}>
                <span className="spinner" /> Sending to {r.name}
              </span>
            </span>
          </button>
        </div>
      </IonFooter>
    </IonPage>
  );
};

export default Cart;
