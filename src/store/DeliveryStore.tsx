import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { isActive, makeDelivery, type Delivery, type DeliveryDraft } from '../lib/delivery';

const STORAGE_KEY = 'gebeta.parcels.v1';
const DAY = 86_400_000;

function seed(): Delivery[] {
  const now = Date.now();
  return [
    makeDelivery(
      {
        category: 'documents',
        itemName: 'Signed lease agreement',
        size: 'small',
        notes: '',
        pickup: 'Kazanchis, Addis Ababa',
        dropoff: 'CMC, Addis Ababa',
        recipient: 'Liya Bekele',
        recipientPhone: '0911 234 567',
        speed: 'express',
      },
      now - DAY - 3_600_000,
    ),
    makeDelivery(
      {
        category: 'groceries',
        itemName: 'Two bags of vegetables',
        size: 'medium',
        notes: 'Ring the bell twice',
        pickup: 'Bole Atlas, Addis Ababa',
        dropoff: 'Piassa, Addis Ababa',
        recipient: 'Mom',
        recipientPhone: '0922 765 432',
        speed: 'standard',
      },
      now - 3 * DAY,
    ),
  ];
}

function load(): Delivery[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as Delivery[];
  } catch {
    /* storage unavailable or corrupt — start fresh */
  }
  return seed();
}

interface DeliveryStore {
  deliveries: Delivery[];
  get: (id: string) => Delivery | undefined;
  create: (draft: DeliveryDraft) => Delivery;
  cancel: (id: string) => void;
  clearHistory: () => void;
}

const StoreContext = createContext<DeliveryStore | null>(null);

export function DeliveryProvider({ children }: { children: ReactNode }) {
  const [deliveries, setDeliveries] = useState<Delivery[]>(load);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(deliveries));
    } catch {
      /* non-fatal */
    }
  }, [deliveries]);

  const create = useCallback((draft: DeliveryDraft) => {
    const d = makeDelivery(draft);
    setDeliveries((prev) => [d, ...prev]);
    return d;
  }, []);

  const cancel = useCallback((id: string) => {
    setDeliveries((prev) => prev.map((d) => (d.id === id && !d.cancelledAt ? { ...d, cancelledAt: Date.now() } : d)));
  }, []);

  const clearHistory = useCallback(() => {
    const now = Date.now();
    setDeliveries((prev) => prev.filter((d) => isActive(d, now)));
  }, []);

  const value = useMemo<DeliveryStore>(
    () => ({ deliveries, create, cancel, clearHistory, get: (id) => deliveries.find((d) => d.id === id) }),
    [deliveries, create, cancel, clearHistory],
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useDeliveries() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useDeliveries must be used inside <DeliveryProvider>');
  return ctx;
}

/** A clock that re-renders the caller every `ms`, driving the live status simulation. */
export function useNow(ms = 1000) {
  const [now, setNow] = useState(Date.now);
  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), ms);
    return () => window.clearInterval(id);
  }, [ms]);
  return now;
}
