import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { dishById, restaurantById, SAVED_ADDRESSES } from '../data/food';
import { isFoodActive, priceCart, type FoodOrder, type OrderLine } from '../lib/foodOrder';

const STORAGE_KEY = 'gebeta.food.v1';
const DAY = 86_400_000;

interface Cart {
  restaurantId: string | null;
  lines: Record<string, number>;
}

interface Persisted {
  cart: Cart;
  favorites: string[];
  orders: FoodOrder[];
  addressIdx: number;
}

const COURIER = { name: 'Abel Tesfaye', vehicle: 'Motorbike', plate: 'AA 3-B21457', rating: 4.9, phone: '+251911000000' };

function buildOrder(restaurantId: string, lines: OrderLine[], address: string, note: string, createdAt: number): FoodOrder {
  const r = restaurantById(restaurantId)!;
  const subtotal = lines.reduce((s, l) => s + l.price * l.qty, 0);
  return {
    id: `AG-${Math.random().toString(36).slice(2, 7).toUpperCase()}`,
    restaurantId,
    lines,
    ...priceCart(r, subtotal),
    address,
    note,
    createdAt,
    courier: COURIER,
  };
}

const lineOf = (dishId: string, qty: number): OrderLine => {
  const d = dishById(dishId)!.dish;
  return { dishId, name: d.name, price: d.price, qty };
};

function seed(): Persisted {
  const now = Date.now();
  return {
    cart: { restaurantId: null, lines: {} },
    favorites: ['buna-bet'],
    addressIdx: 0,
    orders: [
      buildOrder('mesob-corner', [lineOf('mc-beyaynetu', 2), lineOf('mc-sambusa', 1)], SAVED_ADDRESSES[0].detail, '', now - DAY - 7_200_000),
      buildOrder('smash-lab', [lineOf('sl-combo', 1), lineOf('sl-chips', 1)], SAVED_ADDRESSES[1].detail, '', now - 4 * DAY),
    ],
  };
}

function load(): Persisted {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as Persisted;
  } catch {
    /* corrupt or unavailable — start fresh */
  }
  return seed();
}

export type AddResult = 'added' | 'conflict';

interface FoodStore {
  cart: Cart;
  cartLines: OrderLine[];
  cartCount: number;
  favorites: string[];
  orders: FoodOrder[];
  addressIdx: number;
  address: (typeof SAVED_ADDRESSES)[number];
  add: (restaurantId: string, dishId: string) => AddResult;
  setQty: (dishId: string, qty: number) => void;
  startNewCart: (restaurantId: string, dishId: string) => void;
  clearCart: () => void;
  toggleFavorite: (restaurantId: string) => void;
  setAddressIdx: (i: number) => void;
  placeOrder: (note: string) => FoodOrder | null;
  cancelOrder: (id: string) => void;
  reorder: (order: FoodOrder) => void;
  clearHistory: () => void;
  getOrder: (id: string) => FoodOrder | undefined;
}

const Ctx = createContext<FoodStore | null>(null);

export function FoodProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<Persisted>(load);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* non-fatal */
    }
  }, [state]);

  const add = useCallback(
    (restaurantId: string, dishId: string): AddResult => {
      const c = state.cart;
      if (c.restaurantId && c.restaurantId !== restaurantId && Object.keys(c.lines).length) return 'conflict';
      setState((s) => ({
        ...s,
        cart: { restaurantId, lines: { ...s.cart.lines, [dishId]: (s.cart.lines[dishId] ?? 0) + 1 } },
      }));
      return 'added';
    },
    [state.cart],
  );

  const setQty = useCallback((dishId: string, qty: number) => {
    setState((s) => {
      const lines = { ...s.cart.lines };
      if (qty <= 0) delete lines[dishId];
      else lines[dishId] = qty;
      return { ...s, cart: { restaurantId: Object.keys(lines).length ? s.cart.restaurantId : null, lines } };
    });
  }, []);

  const startNewCart = useCallback((restaurantId: string, dishId: string) => {
    setState((s) => ({ ...s, cart: { restaurantId, lines: { [dishId]: 1 } } }));
  }, []);

  const clearCart = useCallback(() => setState((s) => ({ ...s, cart: { restaurantId: null, lines: {} } })), []);

  const toggleFavorite = useCallback((id: string) => {
    setState((s) => ({
      ...s,
      favorites: s.favorites.includes(id) ? s.favorites.filter((f) => f !== id) : [...s.favorites, id],
    }));
  }, []);

  const setAddressIdx = useCallback((i: number) => setState((s) => ({ ...s, addressIdx: i })), []);

  const cartLines = useMemo(
    () => Object.entries(state.cart.lines).map(([dishId, qty]) => lineOf(dishId, qty)),
    [state.cart.lines],
  );

  const placeOrder = useCallback(
    (note: string) => {
      if (!state.cart.restaurantId || !cartLines.length) return null;
      const order = buildOrder(state.cart.restaurantId, cartLines, SAVED_ADDRESSES[state.addressIdx].detail, note, Date.now());
      setState((s) => ({ ...s, orders: [order, ...s.orders], cart: { restaurantId: null, lines: {} } }));
      return order;
    },
    [state.cart.restaurantId, state.addressIdx, cartLines],
  );

  const cancelOrder = useCallback((id: string) => {
    setState((s) => ({
      ...s,
      orders: s.orders.map((o) => (o.id === id && !o.cancelledAt ? { ...o, cancelledAt: Date.now() } : o)),
    }));
  }, []);

  const reorder = useCallback((order: FoodOrder) => {
    setState((s) => ({
      ...s,
      cart: { restaurantId: order.restaurantId, lines: Object.fromEntries(order.lines.map((l) => [l.dishId, l.qty])) },
    }));
  }, []);

  const clearHistory = useCallback(() => {
    const now = Date.now();
    setState((s) => ({ ...s, orders: s.orders.filter((o) => isFoodActive(o, now)) }));
  }, []);

  const value = useMemo<FoodStore>(
    () => ({
      cart: state.cart,
      cartLines,
      cartCount: cartLines.reduce((n, l) => n + l.qty, 0),
      favorites: state.favorites,
      orders: state.orders,
      addressIdx: state.addressIdx,
      address: SAVED_ADDRESSES[state.addressIdx] ?? SAVED_ADDRESSES[0],
      add,
      setQty,
      startNewCart,
      clearCart,
      toggleFavorite,
      setAddressIdx,
      placeOrder,
      cancelOrder,
      reorder,
      clearHistory,
      getOrder: (id) => state.orders.find((o) => o.id === id),
    }),
    [state, cartLines, add, setQty, startNewCart, clearCart, toggleFavorite, setAddressIdx, placeOrder, cancelOrder, reorder, clearHistory],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useFood() {
  const c = useContext(Ctx);
  if (!c) throw new Error('useFood must be used inside <FoodProvider>');
  return c;
}
