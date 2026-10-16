import { IonContent, IonIcon, IonPage, IonToggle, useIonAlert } from '@ionic/react';
import {
  briefcaseOutline,
  cashOutline,
  chevronForward,
  cubeOutline,
  documentTextOutline,
  heartOutline,
  helpCircleOutline,
  homeOutline,
  notificationsOutline,
  trashOutline,
} from 'ionicons/icons';
import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { GebetaMark } from '../components/brand/GebetaMark';
import { SAVED_ADDRESSES } from '../data/food';
import { foodStatus } from '../lib/foodOrder';
import { useDeliveries, useNow } from '../store/DeliveryStore';
import { useFood } from '../store/FoodStore';

const NOTIFY_KEY = 'gebeta.notify';
const PLACE_ICONS = [homeOutline, briefcaseOutline, heartOutline];

const Profile: React.FC = () => {
  const history = useHistory();
  const { orders, favorites, clearHistory: clearFood } = useFood();
  const { clearHistory: clearParcels } = useDeliveries();
  const now = useNow(5000);
  const [presentAlert] = useIonAlert();
  const [notify, setNotify] = useState(() => {
    try {
      return localStorage.getItem(NOTIFY_KEY) !== 'off';
    } catch {
      return true;
    }
  });

  const delivered = orders.filter((o) => foodStatus(o, now) === 'delivered');
  const spent = delivered.reduce((s, o) => s + o.total, 0);

  const toggleNotify = (on: boolean) => {
    setNotify(on);
    try {
      localStorage.setItem(NOTIFY_KEY, on ? 'on' : 'off');
    } catch {
      /* non-fatal */
    }
  };

  const confirmClear = () =>
    presentAlert({
      header: 'Clear order history?',
      message: 'Past and cancelled orders will be removed. Anything on the way stays.',
      buttons: [
        { text: 'Keep', role: 'cancel' },
        {
          text: 'Clear',
          role: 'destructive',
          handler: () => {
            clearFood();
            clearParcels();
          },
        },
      ],
    });

  return (
    <IonPage>
      <IonContent fullscreen>
        <div className="profile-band">
          <span className="avatar avatar-xl">S</span>
          <div>
            <h1>Selam</h1>
            <p>+251 911 000 000</p>
          </div>
        </div>

        <div className="screen screen-tabs profile-body">
          <div className="stats">
            <div className="stat">
              <span className="stat-value">{delivered.length}</span>
              <span className="stat-label">Delivered</span>
            </div>
            <div className="stat">
              <span className="stat-value">{favorites.length}</span>
              <span className="stat-label">Favourites</span>
            </div>
            <div className="stat">
              <span className="stat-value">{spent.toLocaleString('en-US')}</span>
              <span className="stat-label">ETB spent</span>
            </div>
          </div>

          <h3 className="group-title">Saved addresses</h3>
          <div className="group">
            {SAVED_ADDRESSES.map((a, i) => (
              <div className="group-row" key={a.label}>
                <span className="group-icon">
                  <IonIcon icon={PLACE_ICONS[i]} />
                </span>
                <span className="row-main">
                  <span className="row-title">{a.label}</span>
                  <span className="row-sub">{a.detail}</span>
                </span>
              </div>
            ))}
          </div>

          <h3 className="group-title">Preferences</h3>
          <div className="group">
            <label className="group-row">
              <span className="group-icon">
                <IonIcon icon={notificationsOutline} />
              </span>
              <span className="row-main">
                <span className="row-title">Order updates</span>
                <span className="row-sub">Notify me at every step</span>
              </span>
              <IonToggle checked={notify} onIonChange={(e) => toggleNotify(e.detail.checked)} aria-label="Order updates" />
            </label>
            <div className="group-row">
              <span className="group-icon group-icon-green">
                <IonIcon icon={cashOutline} />
              </span>
              <span className="row-main">
                <span className="row-title">Payment</span>
                <span className="row-sub">Cash on delivery</span>
              </span>
            </div>
            <button className="group-row pressable-row" onClick={() => history.push('/new')}>
              <span className="group-icon">
                <IonIcon icon={cubeOutline} />
              </span>
              <span className="row-main">
                <span className="row-title">Send a parcel</span>
                <span className="row-sub">Documents and packages across town</span>
              </span>
              <IonIcon icon={chevronForward} className="muted" />
            </button>
          </div>

          <h3 className="group-title">Support</h3>
          <div className="group">
            <a className="group-row pressable-row" href="mailto:support@addisgebeta.app">
              <span className="group-icon">
                <IonIcon icon={helpCircleOutline} />
              </span>
              <span className="row-main">
                <span className="row-title">Help & support</span>
              </span>
              <IonIcon icon={chevronForward} className="muted" />
            </a>
            <div className="group-row">
              <span className="group-icon">
                <IonIcon icon={documentTextOutline} />
              </span>
              <span className="row-main">
                <span className="row-title">Terms & privacy</span>
              </span>
              <IonIcon icon={chevronForward} className="muted" />
            </div>
            <button className="group-row group-danger pressable-row" onClick={confirmClear}>
              <span className="group-icon">
                <IonIcon icon={trashOutline} />
              </span>
              <span className="row-main">
                <span className="row-title">Clear order history</span>
              </span>
            </button>
          </div>

          <div className="profile-foot">
            <GebetaMark size={28} board="var(--brand)" pit="#fff" />
            <span>Addis Gebeta · v1.0.0 · demo data</span>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Profile;
