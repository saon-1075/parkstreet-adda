import { supabase } from "@/lib/supabase";
import { hasSupabase } from "@/data/menu";
import { restaurant } from "@/config/restaurant.config";
import { whatsappLink } from "@/lib/whatsapp";
import { formatPaise } from "@/lib/money";
import type { CartLine } from "@/features/cart/CartProvider";

export interface PlaceOrderInput {
  lines: CartLine[];
  tableLabel: string | null;
  customerName?: string;
  note?: string;
}

export interface PlaceOrderResult {
  shortCode: string;
  whatsappUrl: string;
  /** true when the order was written to the DB (Supabase configured). */
  persisted: boolean;
}

/** Human-friendly order code, e.g. "A3F0" — matches the RPC's style. */
function randomCode(): string {
  return Math.random().toString(16).slice(2, 6).toUpperCase();
}

/** Build the itemized WhatsApp message the owner receives. */
function buildMessage(input: PlaceOrderInput, totalPaise: number, shortCode: string): string {
  const lines: string[] = [];
  lines.push(`${restaurant.name} — New order #${shortCode}`);
  lines.push(input.tableLabel ? `Table ${input.tableLabel}` : "Takeaway / Pickup");
  lines.push("");
  for (const l of input.lines) {
    lines.push(`${l.quantity}× ${l.name} — ${formatPaise(l.price_paise * l.quantity)}`);
  }
  lines.push("");
  lines.push(`Total: ${formatPaise(totalPaise)}`);
  if (input.customerName) lines.push(`\nName: ${input.customerName}`);
  if (input.note) lines.push(`Note: ${input.note}`);
  return lines.join("\n");
}

/**
 * Persist the order (when Supabase is configured) and build the pre-filled
 * WhatsApp link. The DB is the source of truth: with Supabase live, the
 * place_order RPC re-computes prices server-side and returns the authoritative
 * short_code; without it (mock/demo mode), we generate a code locally so the
 * flow still works end-to-end.
 */
export async function placeOrder(input: PlaceOrderInput): Promise<PlaceOrderResult> {
  if (input.lines.length === 0) throw new Error("Your cart is empty.");

  const totalPaise = input.lines.reduce((sum, l) => sum + l.price_paise * l.quantity, 0);
  let shortCode = randomCode();
  let persisted = false;

  if (hasSupabase) {
    const payload = {
      table_label: input.tableLabel ?? null,
      customer_name: input.customerName?.trim() || null,
      note: input.note?.trim() || null,
      items: input.lines.map((l) => ({ menu_item_id: l.id, quantity: l.quantity })),
    };
    const { data, error } = await supabase.rpc("place_order", { payload });
    if (error) throw new Error(error.message);
    const row = Array.isArray(data) ? data[0] : data;
    if (row?.short_code) shortCode = row.short_code as string;
    persisted = true;
  }

  const message = buildMessage(input, totalPaise, shortCode);
  return { shortCode, whatsappUrl: whatsappLink(message), persisted };
}
