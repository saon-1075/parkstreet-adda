import { supabase } from "@/lib/supabase";
import { hasSupabase } from "./menu";
import type { OrderStatus, OrderWithItems } from "@/types/db";

const SELECT = "*, order_items(*)";

/**
 * Advance/cancel an order. With Supabase this UPDATEs the row (which the realtime
 * feed echoes to every open board); in mock mode it's a no-op and the caller's
 * optimistic local update is the only change.
 */
export async function setOrderStatus(id: string, status: OrderStatus): Promise<void> {
  if (!hasSupabase) return;
  const { error } = await supabase.from("orders").update({ status }).eq("id", id);
  if (error) throw new Error(error.message);
}

/**
 * All orders, newest first, with their line items. Uses Supabase when
 * configured; otherwise returns a few mock orders so the dashboard is viewable
 * without a database (no realtime in that mode).
 */
export async function fetchOrders(): Promise<OrderWithItems[]> {
  if (!hasSupabase) return buildMockOrders();

  const { data, error } = await supabase
    .from("orders")
    .select(SELECT)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data ?? []) as OrderWithItems[];
}

/** Fetch one order with items — used to hydrate a realtime INSERT event. */
export async function fetchOrderWithItems(id: string): Promise<OrderWithItems | null> {
  const { data, error } = await supabase.from("orders").select(SELECT).eq("id", id).single();
  if (error) return null;
  return data as OrderWithItems;
}

// ---- Mock orders (mirror backend/supabase/seed.sql sample orders) ----------
const minsAgo = (m: number) => new Date(Date.now() - m * 60_000).toISOString();

function buildMockOrders(): OrderWithItems[] {
  const mk = (
    id: string,
    short_code: string,
    table_label: string | null,
    customer_name: string | null,
    note: string | null,
    status: OrderWithItems["status"],
    createdMinsAgo: number,
    items: [name: string, price: number, qty: number][]
  ): OrderWithItems => {
    const order_items = items.map(([item_name, item_price_paise, quantity], i) => ({
      id: `${id}-i${i}`,
      order_id: id,
      menu_item_id: null,
      item_name,
      item_price_paise,
      quantity,
      line_total_paise: item_price_paise * quantity,
    }));
    return {
      id,
      short_code,
      table_label,
      customer_name,
      note,
      status,
      payment_status: "unpaid",
      payment_ref: null,
      total_paise: order_items.reduce((s, l) => s + l.line_total_paise, 0),
      created_at: minsAgo(createdMinsAgo),
      updated_at: minsAgo(createdMinsAgo),
      order_items,
    };
  };

  return [
    mk("mock-b7k", "B7K", null, null, null, "placed", 1.5, [
      ["Mughlai Paratha", 15000, 1],
      ["Cold Coffee with Ice Cream", 12000, 1],
    ]),
    mk("mock-a3f", "A3F", "5", "Riya", "less spicy", "preparing", 4, [
      ["Kosha Mangsho Kathi Roll", 18000, 2],
      ["Bhaar-er Cha", 3000, 1],
    ]),
    mk("mock-c2m", "C2M", "2", "Arjun", null, "ready", 11, [
      ["Chicken Kasha with Rice", 22000, 1],
      ["Gondhoraj Ghol", 6000, 2],
    ]),
    mk("mock-d9p", "D9P", "8", null, null, "done", 38, [
      ["Fish Fry (Bhetki)", 18000, 1],
      ["Nolen Gur Rosogolla (2 pc)", 8000, 1],
    ]),
  ];
}
