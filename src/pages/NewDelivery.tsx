import { IonContent, IonFooter, IonHeader, IonIcon, IonPage, useIonRouter } from '@ionic/react';
import { arrowBack, cashOutline, chevronForward, ellipse, location, swapVertical } from 'ionicons/icons';
import { useMemo, useRef, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { CategoryIcon } from '../components/Badges';
import {
  CATEGORIES,
  CATEGORY_KEYS,
  formatPrice,
  quote,
  SAVED_PLACES,
  shortAddress,
  SIZES,
  SPEEDS,
  type Category,
  type DeliveryDraft,
  type Size,
  type Speed,
} from '../lib/delivery';
import { cssVars } from '../lib/ui';
import { useDeliveries } from '../store/DeliveryStore';

const STEPS = ['Route', 'Item', 'Review'] as const;
type Target = 'pickup' | 'dropoff';

const NewDelivery: React.FC = () => {
  const router = useIonRouter();
  const history = useHistory();
  const { search } = useLocation();
  const { create } = useDeliveries();
  const contentRef = useRef<HTMLIonContentElement>(null);

  const initialCategory = new URLSearchParams(search).get('category') as Category | null;
  const [draft, setDraft] = useState<DeliveryDraft>({
    category: initialCategory && initialCategory in CATEGORIES ? initialCategory : 'parcel',
    itemName: '',
    size: 'small',
    notes: '',
    pickup: '',
    dropoff: '',
    recipient: '',
    recipientPhone: '',
    speed: 'standard',
  });
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState<'fwd' | 'back'>('fwd');
  const [target, setTarget] = useState<Target>('pickup');
  const [swapped, setSwapped] = useState(false);
  const [placing, setPlacing] = useState(false);

  const set = <K extends keyof DeliveryDraft>(key: K, value: DeliveryDraft[K]) => setDraft((d) => ({ ...d, [key]: value }));

  const hasRoute = draft.pickup.trim().length > 2 && draft.dropoff.trim().length > 2;
  const q = useMemo(() => (hasRoute ? quote(draft) : null), [hasRoute, draft]);

  const valid = [
    hasRoute && draft.recipient.trim().length > 1 && draft.recipientPhone.replace(/\D/g, '').length >= 9,
    draft.itemName.trim().length > 1,
    true,
  ][step];

  const goTo = (next: number) => {
    setDir(next > step ? 'fwd' : 'back');
    setStep(next);
    contentRef.current?.scrollToTop(200);
  };

  const back = () => {
    if (step > 0) return goTo(step - 1);
    if (router.canGoBack()) router.goBack();
    else history.replace('/tabs/home');
  };

  const fillPlace = (address: string) => {
    set(target, address);
    if (target === 'pickup' && !draft.dropoff) setTarget('dropoff');
  };

  const swap = () => {
    setDraft((d) => ({ ...d, pickup: d.dropoff, dropoff: d.pickup }));
    setSwapped((s) => !s);
  };

  const place = () => {
    if (placing) return;
    setPlacing(true);
    window.setTimeout(() => {
      const d = create(draft);
      history.replace(`/track/${d.id}`);
    }, 900);
  };

  const primary = () => (step < STEPS.length - 1 ? goTo(step + 1) : place());

  return (
    <IonPage>
      <IonHeader className="ion-no-border">
        <div className="topbar">
          <button className="icon-btn pressable" onClick={back} aria-label="Back">
            <IonIcon icon={arrowBack} />
          </button>
          <div className="topbar-title">
            <div className="eyebrow">
              Step {step + 1} of {STEPS.length}
            </div>
            <div className="topbar-heading">{STEPS[step] === 'Route' ? 'Where to?' : STEPS[step] === 'Item' ? 'What are you sending?' : 'Review & confirm'}</div>
          </div>
        </div>
        <div className="stepper" aria-hidden>
          {STEPS.map((s, i) => (
            <i key={s} data-done={i <= step} />
          ))}
        </div>
      </IonHeader>

      <IonContent ref={contentRef}>
        <div key={step} className="screen screen-form step" data-dir={dir}>
          {step === 0 && (
            <>
              <div className="card field-group route-group">
                <span className="route-rail" aria-hidden />
                <label className="field" data-target={target === 'pickup'}>
                  <span className="field-mark mark-pickup">
                    <IonIcon icon={ellipse} />
                  </span>
                  <span className="field-body">
                    <span className="field-label">Pickup</span>
                    <input
                      value={draft.pickup}
                      onChange={(e) => set('pickup', e.target.value)}
                      onFocus={() => setTarget('pickup')}
                      placeholder="Street, area or landmark"
                      autoComplete="street-address"
                      enterKeyHint="next"
                    />
                  </span>
                </label>
                <label className="field" data-target={target === 'dropoff'}>
                  <span className="field-mark mark-drop">
                    <IonIcon icon={location} />
                  </span>
                  <span className="field-body">
                    <span className="field-label">Drop-off</span>
                    <input
                      value={draft.dropoff}
                      onChange={(e) => set('dropoff', e.target.value)}
                      onFocus={() => setTarget('dropoff')}
                      placeholder="Where should it go?"
                      enterKeyHint="next"
                    />
                  </span>
                </label>
                <button
                  className="swap-btn pressable"
                  onClick={swap}
                  aria-label="Swap pickup and drop-off"
                  disabled={!draft.pickup && !draft.dropoff}
                >
                  <IonIcon icon={swapVertical} style={{ transform: `rotate(${swapped ? 180 : 0}deg)` }} />
                </button>
              </div>

              <div className="chips-head">
                Saved places · fills <strong>{target === 'pickup' ? 'pickup' : 'drop-off'}</strong>
              </div>
              <div className="chips">
                {SAVED_PLACES.map((p) => (
                  <button key={p.label} className="chip pressable" onClick={() => fillPlace(p.address)}>
                    <IonIcon icon={p.icon} />
                    {p.label}
                  </button>
                ))}
              </div>

              <h3 className="form-heading">Recipient</h3>
              <div className="card field-group">
                <label className="field">
                  <span className="field-body">
                    <span className="field-label">Full name</span>
                    <input
                      value={draft.recipient}
                      onChange={(e) => set('recipient', e.target.value)}
                      placeholder="Who receives it?"
                      autoComplete="name"
                    />
                  </span>
                </label>
                <label className="field">
                  <span className="field-body">
                    <span className="field-label">Phone</span>
                    <input
                      value={draft.recipientPhone}
                      onChange={(e) => set('recipientPhone', e.target.value)}
                      placeholder="09xx xxx xxx"
                      type="tel"
                      inputMode="tel"
                      autoComplete="tel"
                    />
                  </span>
                </label>
              </div>
            </>
          )}

          {step === 1 && (
            <>
              <div className="chips chips-lg" role="radiogroup" aria-label="Category">
                {CATEGORY_KEYS.map((key) => (
                  <button
                    key={key}
                    role="radio"
                    aria-checked={draft.category === key}
                    className="chip pressable"
                    onClick={() => set('category', key)}
                  >
                    <IonIcon icon={CATEGORIES[key].icon} />
                    {CATEGORIES[key].label}
                  </button>
                ))}
              </div>

              <div className="card field-group">
                <label className="field">
                  <span className="field-body">
                    <span className="field-label">Item</span>
                    <input
                      value={draft.itemName}
                      onChange={(e) => set('itemName', e.target.value)}
                      placeholder={CATEGORIES[draft.category].placeholder}
                      maxLength={60}
                    />
                  </span>
                </label>
              </div>

              <h3 className="form-heading">Size</h3>
              <div className="options" role="radiogroup" aria-label="Size">
                {(Object.keys(SIZES) as Size[]).map((key, i) => (
                  <button
                    key={key}
                    role="radio"
                    aria-checked={draft.size === key}
                    className="option pressable"
                    onClick={() => set('size', key)}
                  >
                    <span className="radio" />
                    <SizeGlyph scale={0.62 + i * 0.19} />
                    <span className="option-title">{SIZES[key].label}</span>
                    <span className="option-hint">{SIZES[key].hint}</span>
                    <span className="option-fee">{SIZES[key].fee ? `+${SIZES[key].fee}` : 'Included'}</span>
                  </button>
                ))}
              </div>

              <h3 className="form-heading">Notes for courier</h3>
              <div className="card field-group">
                <label className="field">
                  <span className="field-body">
                    <textarea
                      value={draft.notes}
                      onChange={(e) => set('notes', e.target.value)}
                      placeholder="Gate code, fragile, call on arrival… (optional)"
                      rows={3}
                      maxLength={200}
                    />
                  </span>
                </label>
              </div>
            </>
          )}

          {step === 2 && q && (
            <>
              <div className="options options-2" role="radiogroup" aria-label="Delivery speed">
                {(Object.keys(SPEEDS) as Speed[]).map((key) => (
                  <button
                    key={key}
                    role="radio"
                    aria-checked={draft.speed === key}
                    className="option pressable"
                    onClick={() => set('speed', key)}
                  >
                    <span className="radio" />
                    <span className="option-title">{SPEEDS[key].label}</span>
                    <span className="option-hint">{SPEEDS[key].hint}</span>
                    <span className="option-fee">{SPEEDS[key].fee ? `+${formatPrice(SPEEDS[key].fee)}` : 'No extra fee'}</span>
                  </button>
                ))}
              </div>

              <div className="card summary">
                <div className="summary-route">
                  <div className="summary-stop">
                    <span className="field-mark mark-pickup">
                      <IonIcon icon={ellipse} />
                    </span>
                    <div>
                      <div className="field-label">Pickup</div>
                      <div className="summary-value">{draft.pickup}</div>
                    </div>
                  </div>
                  <div className="summary-stop">
                    <span className="field-mark mark-drop">
                      <IonIcon icon={location} />
                    </span>
                    <div>
                      <div className="field-label">Drop-off · {draft.recipient}</div>
                      <div className="summary-value">{draft.dropoff}</div>
                    </div>
                  </div>
                  <button className="link-btn pressable" onClick={() => goTo(0)}>
                    Edit
                  </button>
                </div>
                <div className="divider" />
                <div className="summary-item">
                  <CategoryIcon category={draft.category} />
                  <div className="row-main">
                    <div className="row-title">{draft.itemName}</div>
                    <div className="row-sub">
                      {SIZES[draft.size].label} · {CATEGORIES[draft.category].label}
                    </div>
                  </div>
                  <button className="link-btn pressable" onClick={() => goTo(1)}>
                    Edit
                  </button>
                </div>
              </div>

              <div className="card receipt">
                {q.lines.map((l) => (
                  <div className="receipt-line" key={l.label}>
                    <span>{l.label}</span>
                    <span>{formatPrice(l.amount)}</span>
                  </div>
                ))}
                <div className="divider" />
                <div className="receipt-line receipt-total">
                  <span>Total</span>
                  <span key={q.total} className="swap-in">
                    {formatPrice(q.total)}
                  </span>
                </div>
              </div>

              <div className="card pay-row">
                <span className="tile-icon" data-size="sm" style={cssVars({ '--tint': '#1F9D55' })}>
                  <IonIcon icon={cashOutline} />
                </span>
                <div className="row-main">
                  <div className="row-title">Cash on delivery</div>
                  <div className="row-sub">Pay the courier in cash</div>
                </div>
                <IonIcon icon={chevronForward} className="muted" />
              </div>
            </>
          )}
        </div>
      </IonContent>

      <IonFooter className="ion-no-border">
        <div className="cta-bar">
          {q && step < 2 && (
            <div className="cta-estimate fade-in">
              <span className="eyebrow">Estimate</span>
              <span key={q.total} className="cta-price swap-in">
                {formatPrice(q.total)}
              </span>
              <span className="cta-km">
                {q.km.toFixed(1)} km · {shortAddress(draft.dropoff)}
              </span>
            </div>
          )}
          <button className="btn btn-primary pressable" disabled={!valid} onClick={primary} data-busy={placing}>
            <span className="swap-layers">
              <span className="layer-idle">
                {step < 2 ? 'Continue' : `Place order${q ? ` · ${formatPrice(q.total)}` : ''}`}
              </span>
              <span className="layer-busy" aria-hidden={!placing}>
                <span className="spinner" /> Placing order
              </span>
            </span>
          </button>
        </div>
      </IonFooter>
    </IonPage>
  );
};

function SizeGlyph({ scale }: { scale: number }) {
  return (
    <svg className="size-glyph" viewBox="0 0 40 40" aria-hidden>
      <g style={{ transform: `scale(${scale})`, transformOrigin: '20px 34px' }} fill="none" strokeWidth="2.4" strokeLinejoin="round">
        <path d="M6 13 L20 6 L34 13 L34 29 L20 36 L6 29 Z" />
        <path d="M6 13 L20 20 L34 13 M20 20 L20 36" />
      </g>
    </svg>
  );
}

export default NewDelivery;
