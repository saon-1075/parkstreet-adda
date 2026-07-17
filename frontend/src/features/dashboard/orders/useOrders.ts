import { useCallback, useEffect, useRef, useState } from "react";
import { fetchOrders, fetchOrderWithItems, setOrderStatus } from "@/data/orders";
import type { OrderStatus, OrderWithItems } from "@/types/db";
import { createOrderStream } from "./orderStream";
import { playChime } from "./chime";

interface OrdersState {
  orders: OrderWithItems[];
  loading: boolean;
  error: string | null;
  /** Order ids that just arrived, for the highlight cue. */
  newIds: Set<string>;
  /** Advance/cancel an order (optimistic, reverts on failure). */
  updateStatus: (id: string, status: OrderStatus) => Promise<void>;
}

/** Loads orders once, then keeps them live via the OrderStream. */
export function useOrders(): OrdersState {
  const [orders, setOrders] = useState<OrderWithItems[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newIds, setNewIds] = useState<Set<string>>(new Set());

  // Latest orders, readable inside async callbacks without re-subscribing.
  const ordersRef = useRef<OrderWithItems[]>([]);
  useEffect(() => {
    ordersRef.current = orders;
  }, [orders]);

  useEffect(() => {
    let active = true;

    fetchOrders()
      .then((data) => {
        if (!active) return;
        setOrders(data);
        setLoading(false);
      })
      .catch((e) => {
        if (!active) return;
        setError(e instanceof Error ? e.message : "Failed to load orders.");
        setLoading(false);
      });

    const flagNew = (id: string) => {
      setNewIds((prev) => new Set(prev).add(id));
      setTimeout(() => {
        setNewIds((prev) => {
          const next = new Set(prev);
          next.delete(id);
          return next;
        });
      }, 6000);
    };

    const stream = createOrderStream();
    const unsubscribe = stream.subscribe({
      onInsert: async (order) => {
        // Realtime carries the order row but not its items — hydrate them.
        const full = (await fetchOrderWithItems(order.id)) ?? { ...order, order_items: [] };
        if (!active) return;
        setOrders((prev) => [full, ...prev.filter((o) => o.id !== order.id)]);
        flagNew(order.id);
        playChime();
      },
      onUpdate: (order) => {
        setOrders((prev) => prev.map((o) => (o.id === order.id ? { ...o, ...order } : o)));
      },
    });

    return () => {
      active = false;
      unsubscribe();
    };
  }, []);

  const updateStatus = useCallback(async (id: string, status: OrderStatus) => {
    const previous = ordersRef.current.find((o) => o.id === id)?.status;
    // Optimistic: reflect immediately (also the only update in mock mode).
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
    try {
      await setOrderStatus(id, status);
    } catch (e) {
      // Revert on failure.
      if (previous) {
        setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status: previous } : o)));
      }
      throw e;
    }
  }, []);

  return { orders, loading, error, newIds, updateStatus };
}
