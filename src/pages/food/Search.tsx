import { IonContent, IonHeader, IonIcon, IonPage, useIonRouter } from '@ionic/react';
import { arrowBack, closeCircle, search as searchIcon, searchOutline } from 'ionicons/icons';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { EmptyState } from '../../components/EmptyState';
import { DishCard, RestaurantCard } from '../../components/food/parts';
import { allDishes, CUISINES, RESTAURANTS, type Cuisine } from '../../data/food';
import { cssVars } from '../../lib/ui';

const Search: React.FC = () => {
  const router = useIonRouter();
  const { search } = useLocation();
  const initialCuisine = new URLSearchParams(search).get('cuisine') as Cuisine | null;
  const [q, setQ] = useState('');
  const [cuisine, setCuisine] = useState<Cuisine | null>(initialCuisine);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!initialCuisine) {
      const t = window.setTimeout(() => inputRef.current?.focus(), 350);
      return () => window.clearTimeout(t);
    }
  }, [initialCuisine]);

  const term = q.trim().toLowerCase();
  const restaurants = useMemo(
    () =>
      RESTAURANTS.filter(
        (r) =>
          (!cuisine || r.cuisines.includes(cuisine)) &&
          (!term || r.name.toLowerCase().includes(term) || r.area.toLowerCase().includes(term) || r.tagline.toLowerCase().includes(term)),
      ),
    [cuisine, term],
  );
  const dishes = useMemo(
    () =>
      term
        ? allDishes.filter(
            ({ dish, restaurant }) =>
              (!cuisine || restaurant.cuisines.includes(cuisine)) &&
              (dish.name.toLowerCase().includes(term) || dish.desc.toLowerCase().includes(term)),
          )
        : [],
    [cuisine, term],
  );

  const back = () => (router.canGoBack() ? router.goBack() : router.push('/tabs/home', 'back', 'replace'));

  return (
    <IonPage>
      <IonHeader className="ion-no-border">
        <div className="search-bar">
          <button className="icon-btn pressable" onClick={back} aria-label="Back">
            <IonIcon icon={arrowBack} />
          </button>
          <label className="search-field">
            <IonIcon icon={searchIcon} />
            <input
              ref={inputRef}
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search dishes, restaurants, areas"
              enterKeyHint="search"
              type="search"
              aria-label="Search"
            />
            {q && (
              <button className="clear-btn" onClick={() => setQ('')} aria-label="Clear search">
                <IonIcon icon={closeCircle} />
              </button>
            )}
          </label>
        </div>
        <div className="h-scroll search-chips" role="radiogroup" aria-label="Cuisine">
          <button role="radio" aria-checked={!cuisine} className="filter-chip pressable" onClick={() => setCuisine(null)}>
            All
          </button>
          {CUISINES.map((c) => (
            <button key={c.key} role="radio" aria-checked={cuisine === c.key} className="filter-chip pressable" onClick={() => setCuisine(c.key)}>
              {c.label}
            </button>
          ))}
        </div>
      </IonHeader>

      <IonContent>
        <div className="search-body">
          {dishes.length > 0 && (
            <section>
              <h2 className="group-title">Dishes</h2>
              <div className="h-scroll dish-scroll">
                {dishes.map(({ dish, restaurant }) => (
                  <DishCard key={dish.id} d={dish} r={restaurant} />
                ))}
              </div>
            </section>
          )}

          {restaurants.length > 0 && (
            <section>
              <h2 className="group-title">
                {restaurants.length} {restaurants.length === 1 ? 'restaurant' : 'restaurants'}
              </h2>
              <div key={`${cuisine}-${term}`} className="r-list stagger">
                {restaurants.map((r, i) => (
                  <RestaurantCard key={r.id} r={r} style={cssVars({ '--i': Math.min(i, 6) })} />
                ))}
              </div>
            </section>
          )}

          {!restaurants.length && !dishes.length && (
            <EmptyState icon={searchOutline} title={`Nothing for “${q.trim()}”`} body="Try a dish like tibs or shiro, or an area like Bole." />
          )}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Search;
