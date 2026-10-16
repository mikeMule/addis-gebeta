import {
  basketOutline,
  briefcaseOutline,
  cubeOutline,
  documentTextOutline,
  fastFoodOutline,
  giftOutline,
  heartOutline,
  homeOutline,
} from 'ionicons/icons';

export type Category = 'documents' | 'food' | 'parcel' | 'groceries' | 'other';
export type Size = 'small' | 'medium' | 'large';
export type Speed = 'standard' | 'express';
export type Stage = 'placed' | 'assigned' | 'picked' | 'transit' | 'delivered';
export type Status = Stage | 'cancelled';

export interface Courier {
  name: string;
  vehicle: string;
  plate: string;
  rating: number;
  phone: string;
}

export interface Delivery {
  id: string;
  createdAt: number;
  cancelledAt?: number;
  category: Category;
  itemName: string;
  size: Size;
  notes: string;
  pickup: string;
  dropoff: string;
  recipient: string;
  recipientPhone: string;
  speed: Speed;
  distanceKm: number;
  price: number;
  courier: Courier;
}

export type DeliveryDraft = Omit<Delivery, 'id' | 'createdAt' | 'cancelledAt' | 'distanceKm' | 'price' | 'courier'>;

export const CATEGORIES: Record<Category, { label: string; icon: string; tint: string; placeholder: string }> = {
  documents: { label: 'Documents', icon: documentTextOutline, tint: '#3B6FE0', placeholder: 'e.g. Signed contract, 2 pages' },
  food: { label: 'Food', icon: fastFoodOutline, tint: '#E0572B', placeholder: 'e.g. Lunch box from home' },
  parcel: { label: 'Parcel', icon: cubeOutline, tint: '#A2672E', placeholder: 'e.g. Shoebox, taped shut' },
  groceries: { label: 'Groceries', icon: basketOutline, tint: '#1F9D55', placeholder: 'e.g. 2 bags of vegetables' },
  other: { label: 'Other', icon: giftOutline, tint: '#6B5BD6', placeholder: 'Describe the item' },
};
export const CATEGORY_KEYS = Object.keys(CATEGORIES) as Category[];

export const SIZES: Record<Size, { label: string; hint: string; fee: number }> = {
  small: { label: 'Small', hint: 'Fits in a hand', fee: 0 },
  medium: { label: 'Medium', hint: 'Fits a backpack', fee: 40 },
  large: { label: 'Large', hint: 'Needs both arms', fee: 90 },
};

export const SPEEDS: Record<Speed, { label: string; hint: string; fee: number }> = {
  standard: { label: 'Standard', hint: '45–60 min', fee: 0 },
  express: { label: 'Express', hint: '20–30 min · priority courier', fee: 70 },
};

export const SAVED_PLACES = [
  { label: 'Home', icon: homeOutline, address: 'Bole Atlas, Addis Ababa' },
  { label: 'Work', icon: briefcaseOutline, address: 'Kazanchis, Addis Ababa' },
  { label: 'Mom', icon: heartOutline, address: 'Piassa, Addis Ababa' },
];

/**
 * Stage offsets are in simulated seconds so the whole journey plays out in
 * about a minute. Swap this for real backend status once there is one.
 */
export const STAGES: { key: Stage; label: string; hint: string; at: number }[] = [
  { key: 'placed', label: 'Order placed', hint: 'Looking for a courier nearby', at: 0 },
  { key: 'assigned', label: 'Courier assigned', hint: 'Your courier is heading to pickup', at: 5 },
  { key: 'picked', label: 'Picked up', hint: 'Item collected from pickup', at: 16 },
  { key: 'transit', label: 'On the way', hint: 'Heading to the drop-off', at: 20 },
  { key: 'delivered', label: 'Delivered', hint: 'Handed over to the recipient', at: 50 },
];

export const STATUS_COPY: Record<Status, { title: string; pill: string }> = {
  placed: { title: 'Finding your courier', pill: 'Searching' },
  assigned: { title: 'Courier heading to pickup', pill: 'Assigned' },
  picked: { title: 'Item picked up', pill: 'Picked up' },
  transit: { title: 'On the way to drop-off', pill: 'On the way' },
  delivered: { title: 'Delivered', pill: 'Delivered' },
  cancelled: { title: 'Delivery cancelled', pill: 'Cancelled' },
};

const STAGE_KEYS = STAGES.map((s) => s.key);
const DELIVERED_AT = STAGES[STAGES.length - 1].at;
const atOf = (stage: Stage) => STAGES[STAGE_KEYS.indexOf(stage)].at;
const clamp01 = (n: number) => Math.min(1, Math.max(0, n));
const speedFactor = (d: Pick<Delivery, 'speed'>) => (d.speed === 'express' ? 1.5 : 1);

/** Simulated seconds since the order was placed, frozen at cancellation. */
function simSeconds(d: Delivery, now: number) {
  const end = Math.min(now, d.cancelledAt ?? now);
  return Math.max(0, (end - d.createdAt) / 1000) * speedFactor(d);
}

export function stageOf(d: Delivery, now: number): Stage {
  const t = simSeconds(d, now);
  let stage: Stage = 'placed';
  for (const s of STAGES) if (t >= s.at) stage = s.key;
  return stage;
}

export function statusOf(d: Delivery, now: number): Status {
  return d.cancelledAt && d.cancelledAt <= now ? 'cancelled' : stageOf(d, now);
}

export const stageIndex = (stage: Stage) => STAGE_KEYS.indexOf(stage);

export function isActive(d: Delivery, now: number) {
  const s = statusOf(d, now);
  return s !== 'delivered' && s !== 'cancelled';
}

/** Fill (0–1) of the segment between stage i and stage i + 1. */
export function segmentFill(d: Delivery, now: number, i: number) {
  const t = simSeconds(d, now);
  return clamp01((t - STAGES[i].at) / (STAGES[i + 1].at - STAGES[i].at));
}

/** Courier progress along the pickup → drop-off route. */
export function routeProgress(d: Delivery, now: number) {
  const start = atOf('picked');
  return clamp01((simSeconds(d, now) - start) / (DELIVERED_AT - start));
}

export function etaMinutes(d: Delivery, now: number) {
  const base = d.speed === 'express' ? 25 : 50;
  return Math.max(1, Math.ceil(((DELIVERED_AT - simSeconds(d, now)) / DELIVERED_AT) * base));
}

export function stageTimestamp(d: Delivery, stage: Stage) {
  return d.createdAt + (atOf(stage) / speedFactor(d)) * 1000;
}

/* ---------- Pricing ---------- */

const BASE_FARE = 60;
const PER_KM = 18;

function hash(s: string) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export const hashId = hash;

/** Deterministic stand-in for a routing API: same addresses, same distance. */
export function estimateDistance(a: string, b: string) {
  const h = hash(`${a.trim().toLowerCase()}→${b.trim().toLowerCase()}`);
  return Math.round((1.8 + (h % 970) / 100) * 10) / 10;
}

export interface QuoteLine {
  label: string;
  amount: number;
}

export function quote(input: Pick<DeliveryDraft, 'pickup' | 'dropoff' | 'size' | 'speed'>) {
  const km = estimateDistance(input.pickup, input.dropoff);
  const lines: QuoteLine[] = [
    { label: 'Base fare', amount: BASE_FARE },
    { label: `Distance · ${km.toFixed(1)} km`, amount: Math.round(km * PER_KM) },
  ];
  if (SIZES[input.size].fee) lines.push({ label: `${SIZES[input.size].label} item`, amount: SIZES[input.size].fee });
  if (SPEEDS[input.speed].fee) lines.push({ label: 'Express delivery', amount: SPEEDS[input.speed].fee });
  return { km, lines, total: lines.reduce((sum, l) => sum + l.amount, 0) };
}

/* ---------- Factory ---------- */

const COURIERS: Omit<Courier, 'phone'>[] = [
  { name: 'Abel Tesfaye', vehicle: 'Motorbike', plate: 'AA 3-B21457', rating: 4.9 },
  { name: 'Hana Girma', vehicle: 'Motorbike', plate: 'AA 2-A88310', rating: 4.8 },
  { name: 'Dawit Mekonnen', vehicle: 'Bicycle', plate: 'Courier #2041', rating: 4.9 },
  { name: 'Selam Kebede', vehicle: 'Car', plate: 'AA 1-C40976', rating: 4.7 },
];

export function makeDelivery(draft: DeliveryDraft, createdAt = Date.now()): Delivery {
  const { km, total } = quote(draft);
  const courier = COURIERS[Math.floor(Math.random() * COURIERS.length)];
  return {
    ...draft,
    id: `BD-${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
    createdAt,
    distanceKm: km,
    price: total,
    courier: { ...courier, phone: '+251911000000' },
  };
}

/* ---------- Formatting ---------- */

export const formatPrice = (n: number) => `ETB ${n.toLocaleString('en-US')}`;

export const formatClock = (ts: number) =>
  new Date(ts).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });

export function formatDay(ts: number) {
  const d = new Date(ts);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);
  if (d.toDateString() === today.toDateString()) return `Today, ${formatClock(ts)}`;
  if (d.toDateString() === yesterday.toDateString()) return 'Yesterday';
  return d.toLocaleDateString([], { month: 'short', day: 'numeric' });
}

export const shortAddress = (a: string) => a.split(',')[0].trim();

export const initials = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .map((p) => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
