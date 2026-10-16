import { restaurantById, SERVICE_FEE, type Restaurant } from '../data/food';
import type { Courier } from './delivery';

export type FoodStage = 'confirmed' | 'preparing' | 'picked' | 'transit' | 'delivered';
export type FoodStatus = FoodStage | 'cancelled';

export interface OrderLine {
  dishId: string;
  name: string;
  price: number;
  qty: number;
}

export interface FoodOrder {
  id: string;
  restaurantId: string;
  lines: OrderLine[];
  subtotal: number;
  deliveryFee: number;
  serviceFee: number;
  discount: number;
  total: number;
  address: string;
  note: string;
  createdAt: number;
  cancelledAt?: number;
  courier: Courier;
}

/** Simulated seconds; the full journey plays out in about a minute. */
export const FOOD_STAGES: { key: FoodStage; label: string; hint: string; title: string; at: number }[] = [
  { key: 'confirmed', label: 'Order confirmed', hint: 'The restaurant accepted your order', title: 'Order confirmed', at: 0 },
  { key: 'preparing', label: 'Preparing', hint: 'The kitchen is cooking your food', title: 'Your food is being prepared', at: 5 },
  { key: 'picked', label: 'Picked up', hint: 'Your courier has the food', title: 'Picked up from the kitchen', at: 22 },
  { key: 'transit', label: 'On the way', hint: 'Heading to your door', title: 'On the way to you', at: 26 },
  { key: 'delivered', label: 'Delivered', hint: 'Enjoy your meal', title: 'Delivered — enjoy!', at: 58 },
];

const KEYS = FOOD_STAGES.map((s) => s.key);
const END = FOOD_STAGES[FOOD_STAGES.length - 1].at;
const atOf = (k: FoodStage) => FOOD_STAGES[KEYS.indexOf(k)].at;
const clamp01 = (n: number) => Math.min(1, Math.max(0, n));

function sim(o: FoodOrder, now: number) {
  const end = Math.min(now, o.cancelledAt ?? now);
  return Math.max(0, (end - o.createdAt) / 1000);
}

export function foodStageIndex(o: FoodOrder, now: number) {
  const t = sim(o, now);
  let idx = 0;
  FOOD_STAGES.forEach((s, i) => {
    if (t >= s.at) idx = i;
  });
  return idx;
}

export function foodStatus(o: FoodOrder, now: number): FoodStatus {
  return o.cancelledAt && o.cancelledAt <= now ? 'cancelled' : FOOD_STAGES[foodStageIndex(o, now)].key;
}

export const isFoodActive = (o: FoodOrder, now: number) => {
  const s = foodStatus(o, now);
  return s !== 'delivered' && s !== 'cancelled';
};

export const foodSegmentFill = (o: FoodOrder, now: number, i: number) =>
  clamp01((sim(o, now) - FOOD_STAGES[i].at) / (FOOD_STAGES[i + 1].at - FOOD_STAGES[i].at));

export const foodRouteProgress = (o: FoodOrder, now: number) =>
  clamp01((sim(o, now) - atOf('picked')) / (END - atOf('picked')));

export function foodEta(o: FoodOrder, now: number) {
  const r = restaurantById(o.restaurantId);
  const base = (r?.minutes ?? 30) + 10;
  return Math.max(1, Math.ceil(((END - sim(o, now)) / END) * base));
}

export const foodStageTime = (o: FoodOrder, i: number) => o.createdAt + FOOD_STAGES[i].at * 1000;

/* ---------- Pricing ---------- */

export function priceCart(r: Restaurant, subtotal: number) {
  const deliveryFee = r.offer?.kind === 'freeDelivery' ? 0 : r.fee;
  const discount = r.offer?.kind === 'pct' ? Math.min(r.offer.cap, Math.round((subtotal * r.offer.pct) / 100)) : 0;
  const serviceFee = subtotal > 0 ? SERVICE_FEE : 0;
  return { subtotal, deliveryFee, serviceFee, discount, total: Math.max(0, subtotal + deliveryFee + serviceFee - discount) };
}

export const itemCount = (lines: { qty: number }[]) => lines.reduce((n, l) => n + l.qty, 0);
