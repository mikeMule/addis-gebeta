import { IonContent, IonIcon, IonPage, useIonRouter } from '@ionic/react';
import { arrowBack, leafOutline, pricetag, searchOutline } from 'ionicons/icons';
import { useRef, useState } from 'react';
import { Redirect, useParams } from 'react-router-dom';
import { BrandLogo } from '../../components/brand/BrandLogo';
import { CartBar } from '../../components/food/CartBar';
import { DishRow, FavButton, MetaPills, Photo, Rating } from '../../components/food/parts';
import { EmptyState } from '../../components/EmptyState';
import { offerLabel, restaurantById } from '../../data/food';

const Restaurant: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const router = useIonRouter();
  const r = restaurantById(id);
  const [tab, setTab] = useState(0);
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);
  const [scrolled, setScrolled] = useState(false);

  const back = () => (router.canGoBack() ? router.goBack() : router.push('/tabs/home', 'back', 'replace'));

  if (r?.demo) return <Redirect to={`/places/${r.id}`} />;

  if (!r) {
    return (
      <IonPage>
        <IonContent>
          <div className="screen">
            <EmptyState icon={searchOutline} title="Restaurant not found" body="It may have closed for today." />
          </div>
        </IonContent>
      </IonPage>
    );
  }

  const jump = (i: number) => {
    setTab(i);
    sectionRefs.current[i]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const fastingCount = r.menu.flatMap((s) => s.dishes).filter((d) => d.fasting).length;

  return (
    <IonPage>
      <div className="r-topbar" data-scrolled={scrolled}>
        <button className="glass-btn pressable" onClick={back} aria-label="Back">
          <IonIcon icon={arrowBack} />
        </button>
        <span className="r-topbar-title">{r.name}</span>
        <FavButton id={r.id} className="glass-btn" />
      </div>

      <IonContent fullscreen scrollEvents onIonScroll={(e) => setScrolled(e.detail.scrollTop > 180)}>
        <div className="r-hero">
          <Photo k={r.cover} w={480} h={300} alt="" />
        </div>

        <div className="r-sheet">
          <div className="r-ident">
            <BrandLogo logo={r.logo} size={72} radius={20} />
            <div className="r-ident-text">
              <h1>{r.name}</h1>
              <p>
                {r.tagline} · {r.area}
              </p>
              <Rating r={r} />
            </div>
          </div>

          <MetaPills r={r} />

          {(r.offer || fastingCount > 0) && (
            <div className="r-perks">
              {r.offer && (
                <span className="perk perk-offer">
                  <IonIcon icon={pricetag} />
                  {offerLabel(r.offer)}
                </span>
              )}
              {fastingCount > 0 && (
                <span className="perk perk-tsom">
                  <IonIcon icon={leafOutline} />
                  {fastingCount} Tsom dishes
                </span>
              )}
            </div>
          )}
        </div>

        <nav className="menu-tabs" aria-label="Menu sections">
          {r.menu.map((s, i) => (
            <button key={s.title} className="menu-tab pressable" aria-current={tab === i} onClick={() => jump(i)}>
              {s.title}
            </button>
          ))}
        </nav>

        <div className="menu">
          {r.menu.map((s, i) => (
            <section
              key={s.title}
              className="menu-section"
              ref={(el) => {
                sectionRefs.current[i] = el;
              }}
            >
              <h2>{s.title}</h2>
              {s.dishes.map((d) => (
                <DishRow key={d.id} d={d} r={r} />
              ))}
            </section>
          ))}
        </div>

        <CartBar above="edge" />
      </IonContent>
    </IonPage>
  );
};

export default Restaurant;
