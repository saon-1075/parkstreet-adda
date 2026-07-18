/**
 * Frontend mirror of the database schema (backend/supabase/migrations).
 * Money is always integer paise here — format to ₹ only at the display edge
 * (see src/lib/money.ts).
 */

export type OrderStatus =
  | "placed"
  | "accepted"
  | "preparing"
  | "ready"
  | "done"
  | "cancelled";

export type PaymentStatus = "unpaid" | "paid" | "refunded";

/** Ordered lifecycle for the dashboard status stepper (excludes 'cancelled'). */
export const ORDER_FLOW: OrderStatus[] = [
  "placed",
  "accepted",
  "preparing",
  "ready",
  "done",
];

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price_paise: number;
  category: string;
  image_url: string | null;
  is_available: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface Order {
  id: string;
  short_code: string;
  table_label: string | null;
  customer_name: string | null;
  note: string | null;
  status: OrderStatus;
  payment_status: PaymentStatus;
  payment_ref: string | null;
  total_paise: number;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  menu_item_id: string | null;
  item_name: string;
  item_price_paise: number;
  quantity: number;
  line_total_paise: number;
}

/** An order with its line items joined — the shape the dashboard renders. */
export interface OrderWithItems extends Order {
  order_items: OrderItem[];
}

/** Payload accepted by the place_order() RPC. */
export interface PlaceOrderPayload {
  table_label?: string | null;
  customer_name?: string | null;
  note?: string | null;
  items: { menu_item_id: string; quantity: number }[];
}
