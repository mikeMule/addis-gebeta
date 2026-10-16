import { IonApp, IonIcon, IonLabel, IonRouterOutlet, IonTabBar, IonTabButton, IonTabs, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { home, homeOutline, person, personOutline, receipt, receiptOutline, sparkles, sparklesOutline } from 'ionicons/icons';
import { useCallback, useState } from 'react';
import { Redirect, Route, useLocation } from 'react-router-dom';

import { Splash } from './components/brand/Splash';
import Cart from './pages/food/Cart';
import ForYou from './pages/food/ForYou';
import Home from './pages/food/Home';
import OrderTrack from './pages/food/OrderTrack';
import Restaurant from './pages/food/Restaurant';
import Place from './pages/food/Place';
import Search from './pages/food/Search';
import NewDelivery from './pages/NewDelivery';
import Orders from './pages/Orders';
import Profile from './pages/Profile';
import Track from './pages/Track';
import { DeliveryProvider } from './store/DeliveryStore';
import { FoodProvider } from './store/FoodStore';

import '@ionic/react/css/core.css';
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';
import '@ionic/react/css/display.css';

import './theme/variables.css';
import './theme/global.css';
import './theme/food.css';
import './theme/splash.css';

// iOS mode on every platform: one consistent, refined motion language.
setupIonicReact({ mode: 'ios' });

const TABS = [
  { tab: 'home', href: '/tabs/home', label: 'Home', on: home, off: homeOutline },
  { tab: 'foryou', href: '/tabs/foryou', label: 'For You', on: sparkles, off: sparklesOutline },
  { tab: 'orders', href: '/tabs/orders', label: 'Orders', on: receipt, off: receiptOutline },
  { tab: 'profile', href: '/tabs/profile', label: 'Profile', on: person, off: personOutline },
];

const Tabs: React.FC = () => {
  const { pathname } = useLocation();
  return (
    <IonTabs>
      <IonRouterOutlet>
        <Route exact path="/tabs/home" component={Home} />
        <Route exact path="/tabs/foryou" component={ForYou} />
        <Route exact path="/tabs/orders" component={Orders} />
        <Route exact path="/tabs/profile" component={Profile} />
        <Route exact path="/tabs">
          <Redirect to="/tabs/home" />
        </Route>
      </IonRouterOutlet>
      <IonTabBar slot="bottom">
        {TABS.map((t) => (
          <IonTabButton key={t.tab} tab={t.tab} href={t.href}>
            <IonIcon icon={pathname.startsWith(t.href) ? t.on : t.off} />
            <IonLabel>{t.label}</IonLabel>
          </IonTabButton>
        ))}
      </IonTabBar>
    </IonTabs>
  );
};
const App: React.FC = () => {
  const [splash, setSplash] = useState(true);
  const done = useCallback(() => setSplash(false), []);

  return (
    <IonApp>
      <DeliveryProvider>
        <FoodProvider>
          <IonReactRouter>
            <IonRouterOutlet>
              <Route path="/tabs" render={() => <Tabs />} />
              <Route exact path="/restaurant/:id" component={Restaurant} />
              <Route exact path="/places/:id?" component={Place} />
              <Route exact path="/cart" component={Cart} />
              <Route exact path="/search" component={Search} />
              <Route exact path="/order/:id" component={OrderTrack} />
              <Route exact path="/new" component={NewDelivery} />
              <Route exact path="/track/:id" component={Track} />
              <Route exact path="/">
                <Redirect to="/tabs/home" />
              </Route>
            </IonRouterOutlet>
          </IonReactRouter>
          {splash && <Splash onDone={done} />}
        </FoodProvider>
      </DeliveryProvider>
    </IonApp>
  );
};

export default App;
