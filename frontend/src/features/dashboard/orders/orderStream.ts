import { supabase } from "@/lib/supabase";
import { hasSupabase } from "@/data/menu";
import type { Order } from "@/types/db";

export interface OrderStreamHandlers {
  onInsert: (order: Order) => void;
  onUpdate: (order: Order) => void;
}

export interface OrderStream {
  /** Start streaming; returns an unsubscribe function. */
  subscribe: (handlers: OrderStreamHandlers) => () => void;
}

/**
 * The realtime seam (system-design §7). The dashboard depends on this interface,
 * not on Supabase directly — so a future Node/Socket.IO service is a drop-in
 * replacement. MVP impl: Postgres change-data-capture on `orders`, RLS-filtered.
 * In mock mode it's a no-op.
 */
export function createOrderStream(): OrderStream {
  if (!hasSupabase) {
    return { subscribe: () => () => {} };
  }

  return {
    subscribe({ onInsert, onUpdate }) {
      const channel = supabase
        .channel("orders-feed")
        .on(
          "postgres_changes",
          { event: "INSERT", schema: "public", table: "orders" },
          (payload) => onInsert(payload.new as Order)
        )
        .on(
          "postgres_changes",
          { event: "UPDATE", schema: "public", table: "orders" },
          (payload) => onUpdate(payload.new as Order)
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    },
  };
}
