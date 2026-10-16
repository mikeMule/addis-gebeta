import type { PhotoKey, Restaurant } from './food';

export interface PopularPlace {
  id: string;
  name: string;
  logo: string;
  category: string;
  description: string;
  location: string;
  website: string;
  sourceLabel: string;
}

// Real place identities; no synthetic menus, prices, ratings or delivery claims.
export const POPULAR_PLACES: PopularPlace[] = [
  { id: 'chanoly', name: 'Chanoly Noodle', logo: '/places/chanoly.jpg', category: 'Noodles', description: 'Fresh noodles, sizzling plates, salads and rice dishes.', location: 'Multiple branches, Addis Ababa', website: 'https://www.chanolynoodle.com.et/', sourceLabel: 'Official website' },
  { id: 'pizza-hut', name: 'Pizza Hut', logo: '/places/pizza-hut.png', category: 'Pizza', description: 'Pizza, sides and desserts from Pizza Hut Ethiopia.', location: 'Addis Ababa', website: 'https://www.pizzahut.et/', sourceLabel: 'Official website' },
  { id: 'bgs', name: 'BGS Chicken', logo: '/places/bgs.png', category: 'Chicken', description: 'BGS Poultry Farm chicken restaurant and supermarket.', location: 'Summit, Addis Ababa', website: 'https://menu.bgs.et/', sourceLabel: 'Official menu' },
  { id: 'kategna', name: 'Kategna Restaurant', logo: '/places/kategna.jpg', category: 'Ethiopian', description: 'Traditional Ethiopian dining in Addis Ababa.', location: 'Bole Medhanialem, Addis Ababa', website: 'https://www.booknbook.com/restaurant/kategna-restaurant/profile', sourceLabel: 'Restaurant profile' },
  { id: 'chaka-buna', name: 'Chaka Buna', logo: '/places/chaka-buna.png', category: 'Coffee & food', description: 'Coffee, breakfast, Ethiopian dishes, burgers and sandwiches.', location: 'Morning Star branch, Addis Ababa', website: 'https://deliveraddis.com/restaurants/chaka-buna-new', sourceLabel: 'View branch menu' },
  { id: 'akkoo', name: 'Akkoo Coffee', logo: '/places/akkoo.jpg', category: 'Coffee & Ethiopian', description: 'Ethiopian coffee, baked goods and meals, founded in Addis Ababa in 2019.', location: 'Churchill Road, Addis Ababa', website: 'https://www.akkoocoffee.com/', sourceLabel: 'Official website' },
];

export interface PlaceFoodItem { name: string; description: string; photo: PhotoKey; }

// Preview content until the restaurants provide their live menus.
export const PLACE_MENU_PREVIEWS: Record<string, PlaceFoodItem[]> = {
  'chanoly': [
    { name: 'Stir Fry Chicken Noodle', description: 'Noodles with chicken, egg and vegetables.', photo: 'penne' },
    { name: 'Stir Fry Vegetable Noodle', description: 'Vegetables and noodles with a savoury sauce.', photo: 'farfalle' },
    { name: 'Stir Fry Beef Noodle', description: 'Beef, vegetables and freshly prepared noodles.', photo: 'grilledPlate' },
  ],
  'pizza-hut': [
    { name: 'Margherita Pizza', description: 'Tomato, cheese and a golden baked crust.', photo: 'pizza2' },
    { name: 'Chicken Pizza', description: 'Chicken and cheese on a tomato base.', photo: 'pizza1' },
    { name: 'Vegetable Pizza', description: 'Mixed vegetables, tomato and cheese.', photo: 'pizza2' },
  ],
  'bgs': [
    { name: 'Fried Chicken', description: 'Crisp chicken pieces.', photo: 'friedChicken' },
    { name: 'Roast Chicken', description: 'Roasted chicken with a golden finish.', photo: 'roastChicken' },
    { name: 'Chicken Wrap', description: 'Chicken and vegetables in a soft wrap.', photo: 'gyro' },
  ],
  'kategna': [
    { name: 'Beyaynetu', description: 'An assortment of Ethiopian vegetable stews on injera.', photo: 'beyaynetu' },
    { name: 'Tibs', description: 'Ethiopian sauteed beef with onion and spices.', photo: 'derek' },
    { name: 'Shiro', description: 'A warmly spiced chickpea stew.', photo: 'lentilPlatter' },
  ],
  'chaka-buna': [
    { name: 'Margherita Pizza', description: 'A classic tomato and cheese pizza.', photo: 'pizza2' },
    { name: 'Cheese Burger', description: 'Beef, cheese, tomato and salad.', photo: 'burger2' },
    { name: 'Chicken Wrap', description: 'Chicken, tomato, salad and mayonnaise.', photo: 'gyro' },
  ],
  'akkoo': [
    { name: 'Ethiopian Coffee', description: 'Freshly brewed Ethiopian coffee.', photo: 'buna' },
    { name: 'Breakfast Firfir', description: 'Pieces of injera mixed with a spiced sauce.', photo: 'beyaynetu' },
    { name: 'Coffee & Pastry', description: 'Coffee alongside a sweet baked treat.', photo: 'donuts' },
  ],
};

export const PLACE_CONTACTS: Record<string, string | undefined> = {
  chanoly: '+251973377373',
  bgs: '+251924131415',
  akkoo: '+251905828282',
};

// Demo catalogue shared with the existing cart and simulated checkout.
export const PLACE_RESTAURANTS: Restaurant[] = POPULAR_PLACES.map((place) => {
  const items = PLACE_MENU_PREVIEWS[place.id] ?? [];
  const main = items.map((item, i) => ({ id: `${place.id}-main-${i}`, name: item.name, desc: item.description, photo: item.photo, price: [420, 380, 460][i % 3] }));
  const drinks = [{ id: `${place.id}-coffee`, name: 'Macchiato', desc: 'Espresso with steamed milk.', photo: 'cappuccino' as const, price: 95 }];
  const sides = [{ id: `${place.id}-side`, name: 'French Fries', desc: 'Golden potato fries.', photo: 'chips' as const, price: 160 }];
  return {
    id: place.id, name: place.name, area: place.location, cuisines: [], tagline: place.description,
    rating: 0, reviews: 0, minutes: 35, fee: 50, km: 0, demo: true,
    cover: items[0]?.photo ?? 'pizza1',
    logo: { src: place.logo, bg: '#fff', fg: '#17171c', style: 'block', top: place.name },
    menu: [{ title: place.category, dishes: main }, { title: 'Sides', dishes: sides }, { title: 'Drinks', dishes: drinks }],
  };
});
