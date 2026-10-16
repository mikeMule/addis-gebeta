import { PLACE_RESTAURANTS } from './places';

/**
 * Mock catalogue for Addis Gebeta. Every restaurant, rating, offer and dish
 * here is synthetic demo content — swap for the real API when it exists.
 * Photos: Unsplash (images.unsplash.com), loaded at runtime.
 */

const P = {
  burger1: '1568901346375-23c9450c58cd',
  burger2: '1550547660-d9450f859349',
  burgerPulled: '1606755962773-d324e0a13086',
  burgerFries: '1594212699903-ec8a3eca50f5',
  burger3: '1571091718767-18b5b1457add',
  pizza1: '1565299624946-b28f40a0ae38',
  pizza2: '1513104890138-7c749659a591',
  friedChicken: '1626645738196-c2a7c87a8f58',
  roastChicken: '1598103442097-8b74394b95c6',
  gyro: '1529006557810-274b9b2fc783',
  grilledPlate: '1561651823-34feb02250e4',
  penne: '1621996346565-e3dbc646d9a9',
  farfalle: '1473093295043-cdd812d0e601',
  latte: '1495474472287-4d71bcdd2085',
  cappuccino: '1509042239860-f550ce710b93',
  buna: '1630861413071-a424a4d6d155',
  pourover: '1619109970355-e17b884bcf04',
  donuts: '1551024601-bec78aea704b',
  cupcakes: '1563729784474-d77dbb933a9e',
  bowl1: '1512621776951-a57141f2eefd',
  bowl2: '1546069901-ba9599a7e63c',
  salad: '1540189549336-e6e99c3679fe',
  kebab: '1555939594-58d7cb561ad1',
  steakFries: '1600891964092-4316c288032e',
  pancakes: '1567620905732-2d1ec7ab7445',
  eggsAvo: '1482049016688-2d3e1b311543',
  benedict: '1608039829572-78524f79c4c7',
  sambusa: '1601050690597-df0568f70950',
  curry: '1585937421612-70a008356fbe',
  beyaynetu: '1682495889756-9229b479faaf',
  derek: '1589786742305-f24d19eedbe5',
  kurt: '1781685891312-2d8f7eba4c1d',
  claypots: '1773209927898-a0a7e0a13125',
  lentilPlatter: '1593252719532-53f183016149',
  mesob: '1630861412977-de9bd8944f97',
  mitad: '1763951719000-661d3d50d763',
  mixedGrill: '1771285119318-b342c3ecc51c',
  chips: '1640116345144-8fca02e277b8',
} as const;

export type PhotoKey = keyof typeof P;

/**
 * Requests snap to three widths so the CDN serves warm cache hits instead
 * of resizing a new variant for every component; object-fit does the crop.
 */
const BUCKETS = [240, 480, 960];
export const photo = (key: PhotoKey, w = 400) => {
  const width = BUCKETS.find((b) => b >= w) ?? BUCKETS[BUCKETS.length - 1];
  return `https://images.unsplash.com/photo-${P[key]}?w=${width}&q=72&auto=format`;
};

/* ---------- Types ---------- */

export type Cuisine =
  | 'shawarma'
  | 'burger'
  | 'chicken'
  | 'pizza'
  | 'habesha'
  | 'pasta'
  | 'coffee'
  | 'dessert'
  | 'healthy';

export type Offer = { kind: 'pct'; pct: number; cap: number } | { kind: 'freeDelivery' };

export interface Logo {
  src?: string;
  bg: string;
  fg: string;
  accent?: string;
  /** Visual recipe for the monogram. */
  style: 'ethiopic' | 'block' | 'script' | 'serif' | 'round';
  top: string;
  bottom?: string;
}

export interface Dish {
  id: string;
  name: string;
  desc: string;
  price: number;
  photo: PhotoKey;
  popular?: boolean;
  fasting?: boolean;
}

export interface MenuSection {
  title: string;
  dishes: Dish[];
}

export interface Restaurant {
  demo?: boolean;
  id: string;
  name: string;
  area: string;
  cuisines: Cuisine[];
  tagline: string;
  rating: number;
  reviews: number;
  minutes: number;
  fee: number;
  km: number;
  cover: PhotoKey;
  logo: Logo;
  offer?: Offer;
  menu: MenuSection[];
}

/* ---------- Catalogue ---------- */

export const CUISINES: { key: Cuisine; label: string; photo: PhotoKey }[] = [
  { key: 'habesha', label: 'Habesha', photo: 'beyaynetu' },
  { key: 'burger', label: 'Burger', photo: 'burger2' },
  { key: 'shawarma', label: 'Shawarma', photo: 'gyro' },
  { key: 'pizza', label: 'Pizza', photo: 'pizza1' },
  { key: 'chicken', label: 'Chicken', photo: 'roastChicken' },
  { key: 'coffee', label: 'Coffee', photo: 'latte' },
  { key: 'pasta', label: 'Pasta', photo: 'penne' },
  { key: 'healthy', label: 'Healthy', photo: 'bowl2' },
  { key: 'dessert', label: 'Dessert', photo: 'donuts' },
];

export const RESTAURANTS: Restaurant[] = [
  {
    id: 'mesob-corner',
    name: 'Mesob Corner',
    area: 'Kazanchis',
    cuisines: ['habesha'],
    tagline: 'Injera baked fresh every morning',
    rating: 4.7,
    reviews: 1240,
    minutes: 35,
    fee: 45,
    km: 1.2,
    cover: 'mitad',
    logo: { bg: '#7A1E1E', fg: '#F6C343', style: 'ethiopic', top: 'መሶብ', bottom: 'CORNER' },
    offer: { kind: 'pct', pct: 50, cap: 150 },
    menu: [
      {
        title: 'Signature platters',
        dishes: [
          { id: 'mc-beyaynetu', name: 'Beyaynetu', desc: 'Seven fasting stews on fresh teff injera — shiro, misir, gomen, atkilt and more.', price: 320, photo: 'beyaynetu', popular: true, fasting: true },
          { id: 'mc-doro', name: 'Doro Wat', desc: 'Slow-cooked chicken in berbere with a boiled egg and ayib.', price: 450, photo: 'claypots', popular: true },
          { id: 'mc-kitfo', name: 'Special Kitfo', desc: 'Minced beef with mitmita and niter kibbeh, served leb leb or raw.', price: 480, photo: 'kurt' },
        ],
      },
      {
        title: 'Tsom (fasting)',
        dishes: [
          { id: 'mc-shiro', name: 'Shiro Tegabino', desc: 'Bubbling chickpea stew served in a clay pot.', price: 220, photo: 'lentilPlatter', fasting: true },
          { id: 'mc-misir', name: 'Misir Wat', desc: 'Red lentils simmered in berbere and garlic.', price: 200, photo: 'curry', fasting: true },
        ],
      },
      {
        title: 'Snacks',
        dishes: [{ id: 'mc-sambusa', name: 'Sambusa (3 pcs)', desc: 'Crisp pastry with spiced lentils.', price: 120, photo: 'sambusa', fasting: true }],
      },
    ],
  },
  {
    id: 'smash-lab',
    name: 'Smash Lab',
    area: 'Sarbet',
    cuisines: ['burger'],
    tagline: 'Crispy-edged smash burgers',
    rating: 4.5,
    reviews: 2110,
    minutes: 25,
    fee: 55,
    km: 0.8,
    cover: 'burger1',
    logo: { bg: '#FFD23F', fg: '#141414', style: 'block', top: 'SMASH', bottom: 'LAB' },
    offer: { kind: 'pct', pct: 40, cap: 120 },
    menu: [
      {
        title: 'Smash burgers',
        dishes: [
          { id: 'sl-classic', name: 'Classic Smash', desc: 'Two thin patties, cheddar, pickles and house sauce.', price: 380, photo: 'burger1', popular: true },
          { id: 'sl-double', name: 'Double Trouble', desc: 'Four patties, double cheese, caramelised onion.', price: 520, photo: 'burger3' },
          { id: 'sl-pulled', name: 'Pulled Beef', desc: 'Twelve-hour brisket, slaw and smoky barbecue glaze.', price: 460, photo: 'burgerPulled' },
        ],
      },
      {
        title: 'Combos',
        dishes: [{ id: 'sl-combo', name: 'Smash + Fries', desc: 'Classic Smash with fries and a cold drink.', price: 490, photo: 'burgerFries', popular: true }],
      },
      {
        title: 'Sides',
        dishes: [{ id: 'sl-chips', name: 'Loaded Chips', desc: 'Fries with cheese sauce and awaze mayo.', price: 180, photo: 'chips' }],
      },
    ],
  },
  {
    id: 'buna-bet',
    name: 'Buna Bet',
    area: 'Kirkos',
    cuisines: ['coffee'],
    tagline: 'Coffee ceremony, delivered',
    rating: 4.9,
    reviews: 3420,
    minutes: 15,
    fee: 35,
    km: 0.5,
    cover: 'buna',
    logo: { bg: '#3B2417', fg: '#E9C89B', style: 'ethiopic', top: 'ቡና', bottom: 'BET' },
    offer: { kind: 'pct', pct: 50, cap: 100 },
    menu: [
      {
        title: 'Coffee',
        dishes: [
          { id: 'bb-jebena', name: 'Jebena Buna', desc: 'A clay pot of freshly roasted coffee for three, with popcorn.', price: 150, photo: 'buna', popular: true, fasting: true },
          { id: 'bb-macchiato', name: 'Macchiato', desc: 'The Addis classic, layered and strong.', price: 70, photo: 'cappuccino' },
          { id: 'bb-pour', name: 'Yirgacheffe Pour-over', desc: 'Single origin, bright and floral.', price: 120, photo: 'pourover', fasting: true },
        ],
      },
      {
        title: 'Breakfast',
        dishes: [
          { id: 'bb-chechebsa', name: 'Chechebsa', desc: 'Torn flatbread with berbere butter and honey.', price: 180, photo: 'pancakes', popular: true },
          { id: 'bb-enkulal', name: 'Enkulal Firfir', desc: 'Scrambled eggs with onion, tomato and green chilli.', price: 170, photo: 'eggsAvo' },
          { id: 'bb-benedict', name: 'Eggs Benedict', desc: 'Poached eggs, hollandaise, toasted bread.', price: 260, photo: 'benedict' },
        ],
      },
    ],
  },
  {
    id: 'napoli-forno',
    name: 'Napoli Forno',
    area: 'Bole Medhanialem',
    cuisines: ['pizza', 'pasta'],
    tagline: 'Wood-fired since 1998',
    rating: 4.8,
    reviews: 1530,
    minutes: 40,
    fee: 60,
    km: 3.1,
    cover: 'pizza2',
    logo: { bg: '#FFFFFF', fg: '#C62828', accent: '#1E7B3A', style: 'script', top: 'Napoli', bottom: 'FORNO' },
    offer: { kind: 'freeDelivery' },
    menu: [
      {
        title: 'Wood-fired pizza',
        dishes: [
          { id: 'nf-margherita', name: 'Margherita', desc: 'San Marzano tomato, mozzarella, basil.', price: 420, photo: 'pizza2', popular: true },
          { id: 'nf-diavola', name: 'Diavola', desc: 'Spicy salami, chilli oil and oregano.', price: 520, photo: 'pizza1' },
        ],
      },
      {
        title: 'Pasta',
        dishes: [{ id: 'nf-arrabbiata', name: 'Penne Arrabbiata', desc: 'Garlic, chilli and slow tomato sauce.', price: 360, photo: 'penne', fasting: true }],
      },
    ],
  },
  {
    id: 'levant-wrap',
    name: 'Levant Wrap House',
    area: 'Piassa',
    cuisines: ['shawarma'],
    tagline: 'Charcoal shawarma, late nights',
    rating: 4.4,
    reviews: 940,
    minutes: 20,
    fee: 40,
    km: 1.6,
    cover: 'gyro',
    logo: { bg: '#F3E7D3', fg: '#8A4B1F', style: 'serif', top: 'Levant', bottom: 'WRAP HOUSE' },
    offer: { kind: 'pct', pct: 50, cap: 150 },
    menu: [
      {
        title: 'Shawarma',
        dishes: [
          { id: 'lw-chicken', name: 'Chicken Shawarma', desc: 'Garlic toum, pickles and fries in the wrap.', price: 280, photo: 'gyro', popular: true },
          { id: 'lw-plate', name: 'Beef Shawarma Plate', desc: 'Sliced beef, rice, salad and tahini.', price: 390, photo: 'grilledPlate' },
          { id: 'lw-falafel', name: 'Falafel Bowl', desc: 'Falafel, hummus and herb salad.', price: 240, photo: 'bowl2', fasting: true },
        ],
      },
      {
        title: 'From the grill',
        dishes: [{ id: 'lw-grill', name: 'Mixed Grill', desc: 'Kofta, chicken and beef skewers for two.', price: 620, photo: 'kebab' }],
      },
    ],
  },
  {
    id: 'tibs-and-co',
    name: 'Tibs & Co.',
    area: 'Bole',
    cuisines: ['habesha'],
    tagline: 'Sizzling shekla tibs',
    rating: 4.6,
    reviews: 860,
    minutes: 30,
    fee: 55,
    km: 2.4,
    cover: 'mixedGrill',
    logo: { bg: '#161616', fg: '#FF7A2F', style: 'block', top: 'TIBS', bottom: '& CO.' },
    menu: [
      {
        title: 'Tibs',
        dishes: [
          { id: 'tc-shekla', name: 'Shekla Tibs', desc: 'Lamb sizzling in a clay pan with rosemary and awaze.', price: 520, photo: 'kebab', popular: true },
          { id: 'tc-derek', name: 'Derek Tibs', desc: 'Crispy beef cubes with onion and jalapeño.', price: 480, photo: 'derek' },
        ],
      },
      {
        title: 'Raw & kurt',
        dishes: [{ id: 'tc-kurt', name: 'Kurt Platter', desc: 'Prime raw beef with mitmita, awaze and senafich.', price: 650, photo: 'kurt' }],
      },
      {
        title: 'Sides',
        dishes: [{ id: 'tc-salad', name: 'Timatim Salad', desc: 'Tomato, onion and green chilli with lemon.', price: 150, photo: 'salad', fasting: true }],
      },
    ],
  },
  {
    id: 'crispy-coop',
    name: 'Crispy Coop',
    area: 'CMC',
    cuisines: ['chicken'],
    tagline: 'Buttermilk fried, berbere dusted',
    rating: 4.3,
    reviews: 1100,
    minutes: 30,
    fee: 50,
    km: 4.2,
    cover: 'friedChicken',
    logo: { bg: '#D7262E', fg: '#FFFFFF', style: 'script', top: 'Crispy', bottom: 'COOP' },
    offer: { kind: 'pct', pct: 40, cap: 120 },
    menu: [
      {
        title: 'Chicken',
        dishes: [
          { id: 'cc-bucket', name: '6-Piece Bucket', desc: 'Berbere-dusted fried chicken with two dips.', price: 560, photo: 'friedChicken', popular: true },
          { id: 'cc-roast', name: 'Half Roast Chicken', desc: 'Lemon, garlic and herbs, roasted slow.', price: 480, photo: 'roastChicken' },
          { id: 'cc-bowl', name: 'Chicken Bowl', desc: 'Grilled chicken, grains, avocado and greens.', price: 320, photo: 'bowl1' },
        ],
      },
    ],
  },
  {
    id: 'tsom-table',
    name: 'Tsom Table',
    area: 'Gerji',
    cuisines: ['healthy', 'habesha'],
    tagline: 'Plant-based, fasting friendly',
    rating: 4.7,
    reviews: 610,
    minutes: 30,
    fee: 45,
    km: 3.6,
    cover: 'bowl2',
    logo: { bg: '#E4F2E1', fg: '#2E7D32', style: 'round', top: 'tsom', bottom: 'TABLE' },
    offer: { kind: 'freeDelivery' },
    menu: [
      {
        title: 'Bowls & platters',
        dishes: [
          { id: 'tt-platter', name: 'Atkilt & Misir Platter', desc: 'Cabbage, carrot, potato and lentils on injera.', price: 260, photo: 'lentilPlatter', popular: true, fasting: true },
          { id: 'tt-power', name: 'Power Bowl', desc: 'Chickpeas, avocado, greens and teff crunch.', price: 290, photo: 'bowl1', fasting: true },
          { id: 'tt-salad', name: 'Garden Salad', desc: 'Leaves, tomato, beetroot and lemon.', price: 220, photo: 'salad', fasting: true },
        ],
      },
    ],
  },
  {
    id: 'pasta-piazza',
    name: 'Pasta Piazza',
    area: 'Piassa',
    cuisines: ['pasta'],
    tagline: 'Old Piassa, Italian roots',
    rating: 4.5,
    reviews: 720,
    minutes: 35,
    fee: 45,
    km: 2.0,
    cover: 'penne',
    logo: { bg: '#0F4C81', fg: '#FFFFFF', style: 'serif', top: 'PP', bottom: 'PIAZZA' },
    menu: [
      {
        title: 'Pasta',
        dishes: [
          { id: 'pp-ragu', name: 'Penne al Ragù', desc: 'Beef ragù cooked for four hours.', price: 380, photo: 'penne', popular: true },
          { id: 'pp-farfalle', name: 'Farfalle Salad', desc: 'Basil, cherry tomato and olive oil.', price: 300, photo: 'farfalle', fasting: true },
        ],
      },
      {
        title: 'Secondi',
        dishes: [{ id: 'pp-steak', name: 'Steak & Fries', desc: 'Grilled sirloin with rosemary fries.', price: 720, photo: 'steakFries' }],
      },
    ],
  },
  {
    id: 'sweet-merkato',
    name: 'Sweet Merkato',
    area: 'Merkato',
    cuisines: ['dessert'],
    tagline: 'Donuts, cakes and honey',
    rating: 4.6,
    reviews: 1310,
    minutes: 25,
    fee: 40,
    km: 5.0,
    cover: 'donuts',
    logo: { bg: '#FCE4EC', fg: '#C2185B', style: 'script', top: 'Sweet', bottom: 'MERKATO' },
    menu: [
      {
        title: 'Sweets',
        dishes: [
          { id: 'sm-donuts', name: 'Sprinkle Donuts (4)', desc: 'Glazed, filled and topped to order.', price: 220, photo: 'donuts', popular: true },
          { id: 'sm-cupcakes', name: 'Cupcake Box (6)', desc: 'Vanilla, strawberry and buttercream.', price: 340, photo: 'cupcakes' },
          { id: 'sm-pancakes', name: 'Honey Pancakes', desc: 'Stacked with Tigray white honey.', price: 200, photo: 'pancakes' },
        ],
      },
    ],
  },
];

export const restaurantById = (id: string) => RESTAURANTS.find((r) => r.id === id) ?? PLACE_RESTAURANTS.find((r) => r.id === id);

export const allDishes = [...RESTAURANTS, ...PLACE_RESTAURANTS].flatMap((r) => r.menu.flatMap((s) => s.dishes.map((d) => ({ dish: d, restaurant: r }))));

export const dishById = (id: string) => allDishes.find((x) => x.dish.id === id);

export interface OfferTicket {
  id: string;
  headline: string;
  sub: string;
  tone: 'green' | 'blue' | 'orange';
  match: (o?: Offer) => boolean;
}

export const OFFER_TICKETS: OfferTicket[] = [
  { id: 'half', headline: '50%', sub: 'OFF', tone: 'green', match: (o) => o?.kind === 'pct' && o.pct === 50 },
  { id: 'forty', headline: '40%', sub: 'OFF', tone: 'blue', match: (o) => o?.kind === 'pct' && o.pct === 40 },
  { id: 'free', headline: 'FREE', sub: 'DELIVERY', tone: 'orange', match: (o) => o?.kind === 'freeDelivery' },
];

export const offerLabel = (o?: Offer) =>
  !o ? '' : o.kind === 'freeDelivery' ? 'Free delivery' : `${o.pct}% off, max ${o.cap} ETB`;

export const SAVED_ADDRESSES = [
  { label: 'Home', area: 'Kirkos', detail: 'Kirkos, Addis Ababa' },
  { label: 'Work', area: 'Kazanchis', detail: 'Kazanchis, Addis Ababa' },
  { label: 'Mom', area: 'Piassa', detail: 'Piassa, Addis Ababa' },
];

export const SERVICE_FEE = 15;
