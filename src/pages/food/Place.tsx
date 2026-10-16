import { IonContent, IonIcon, IonPage, useIonRouter } from '@ionic/react';
import { arrowBack, callOutline, locationOutline, cartOutline } from 'ionicons/icons';
import { useState } from 'react';
import { Link, useParams, useHistory } from 'react-router-dom';
import { PLACE_CONTACTS, PLACE_RESTAURANTS, POPULAR_PLACES } from '../../data/places';
import { DishRow, Photo } from '../../components/food/parts';
import { CartBar } from '../../components/food/CartBar';
import { useFood } from '../../store/FoodStore';

export default function Place() {
  const { id } = useParams<{ id?: string }>();
  const router = useIonRouter();
  const history = useHistory();
  const { cartCount } = useFood();
  const [selection, setSelection] = useState({ id, category: 'All' });
  const category = selection.id === id ? selection.category : 'All';
  const place = POPULAR_PLACES.find((p) => p.id === id);
  const restaurant = PLACE_RESTAURANTS.find((p) => p.id === id);
  const back = () => router.canGoBack() ? router.goBack() : router.push('/tabs/home', 'back', 'replace');

  if (place && restaurant) {
    const phone = PLACE_CONTACTS[place.id];
    const menu = category === 'All' ? restaurant.menu : restaurant.menu.filter((section) => section.title === category);
    const count = restaurant.menu.reduce((total, section) => total + section.dishes.length, 0);
    return (
      <IonPage>
        <IonContent fullscreen>
          <header className="place-hero">
            <Photo k={restaurant.cover} w={960} alt={`${place.name} food banner, illustrative photograph`} />
            <div className="place-hero-shade" />
            <div className="place-hero-actions">
              <button className="round-action pressable" aria-label="Back" onClick={back}><IonIcon icon={arrowBack} /></button>
              <button className="round-action pressable" aria-label={`Cart, ${cartCount} items`} onClick={() => history.push('/cart')}>
                <IonIcon icon={cartOutline} />
                {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
              </button>
            </div>
            <div className="place-hero-caption"><span>{place.category}</span><h1>{place.name}</h1></div>
          </header>
          <div className="place-detail">
            <div className="place-overview">
              <span className="place-logo-circle"><img src={place.logo} alt={`${place.name} logo`} /></span>
              <p>{place.description}</p>
            </div>
            <div className="place-contact-row">
              <IonIcon icon={locationOutline} /><span>{place.location}</span>
            </div>
            <div className="place-contact-row">
              <IonIcon icon={callOutline} />
              {phone ? <a href={`tel:${phone}`}>{phone}</a> : <span>Phone unavailable</span>}
            </div>
            <p className="place-demo-notice">Demo menu & prices. Photos are illustrative. Checkout simulates an order; nothing is sent to the restaurant.</p>
          </div>
          <nav className="place-categories" aria-label="Food categories">
            {['All', ...restaurant.menu.map((section) => section.title)].map((title) => (
              <button key={title} className="place-category-button pressable" aria-pressed={category === title} onClick={() => setSelection({ id, category: title })}>{title}</button>
            ))}
          </nav>
          <div className="place-menu">
            <div className="place-menu-heading"><h2>{category === 'All' ? 'Explore the menu' : category}</h2><span>{category === 'All' ? count : menu.reduce((n, section) => n + section.dishes.length, 0)} items</span></div>
            {menu.map((section) => (
              <section className="place-menu-section" key={section.title} aria-label={section.title}>
                <h3>{section.title}</h3>
                {section.dishes.map((dish) => <DishRow key={dish.id} d={dish} r={restaurant} />)}
              </section>
            ))}
          </div>
          <CartBar above="edge" />
        </IonContent>
      </IonPage>
    );
  }

  return (
    <IonPage>
      <IonContent>
        <main className="place-page">
          <button className="round-action pressable" aria-label="Back" onClick={back}><IonIcon icon={arrowBack} /></button>
          {id ? <><h1>Place not found</h1><Link to="/places">Browse popular places</Link></> : <>
            <h1>Popular places</h1><p>Discover food and coffee in Addis Ababa.</p>
            <div className="places-directory">{POPULAR_PLACES.map((p) => (
              <Link className="place-directory-row pressable" key={p.id} to={`/places/${p.id}`}>
                <span className="place-logo-circle"><img src={p.logo} alt="" /></span>
                <span><strong>{p.name}</strong><small>{p.category}</small></span>
              </Link>
            ))}</div>
          </>}
        </main>
      </IonContent>
    </IonPage>
  );
}
