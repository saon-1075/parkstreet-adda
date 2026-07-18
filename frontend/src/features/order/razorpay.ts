import { supabase } from "@/lib/supabase";
import { restaurant } from "@/config/restaurant.config";
import type { CartLine } from "@/features/cart/CartProvider";

/** True when a Razorpay publishable key is configured → show "Pay online". */
export const hasRazorpay = Boolean(import.meta.env.VITE_RAZORPAY_KEY_ID);

/** Thrown when the customer closes the Razorpay modal without paying. */
export class PaymentDismissed extends Error {
  constructor() {
    super("Payment cancelled");
    this.name = "PaymentDismissed";
  }
}

interface CheckoutResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}
interface RazorpayInstance {
  open: () => void;
  on: (event: string, cb: (resp: unknown) => void) => void;
}
type RazorpayCtor = new (options: Record<string, unknown>) => RazorpayInstance;

let scriptPromise: Promise<void> | null = null;
function loadScript(): Promise<void> {
  if (scriptPromise) return scriptPromise;
  scriptPromise = new Promise((resolve, reject) => {
    if ((window as { Razorpay?: RazorpayCtor }).Razorpay) return resolve();
    const s = document.createElement("script");
    s.src = "https://checkout.razorpay.com/v1/checkout.js";
    s.onload = () => resolve();
    s.onerror = () => {
      scriptPromise = null;
      reject(new Error("Couldn't reach Razorpay. Check your connection."));
    };
    document.body.appendChild(s);
  });
  return scriptPromise;
}

// The deployed Edge Function slug. Defaults to "razorpay"; override with
// VITE_RAZORPAY_FUNCTION if Supabase auto-named it something else.
const RZP_FUNCTION = import.meta.env.VITE_RAZORPAY_FUNCTION || "razorpay";

async function callFn(body: Record<string, unknown>) {
  const { data, error } = await supabase.functions.invoke(RZP_FUNCTION, { body });
  if (error) throw new Error("Payment service is unavailable right now.");
  if (!data?.ok) throw new Error(data?.error ?? "Payment failed.");
  return data as Record<string, unknown>;
}

export interface PayInput {
  lines: CartLine[];
  tableLabel: string | null;
  customerName?: string;
  note?: string;
}

/**
 * Full verified Razorpay flow:
 *   1) Edge Function creates the order (amount priced server-side)
 *   2) Razorpay Checkout collects payment (publishable key only)
 *   3) Edge Function verifies the signature with the secret, then persists the
 *      order as PAID and returns its short code.
 */
export async function payWithRazorpay(input: PayInput): Promise<{ shortCode: string }> {
  const items = input.lines.map((l) => ({ menu_item_id: l.id, quantity: l.quantity }));
  const meta = {
    items,
    table_label: input.tableLabel,
    customer_name: input.customerName?.trim() || null,
    note: input.note?.trim() || null,
  };

  const created = await callFn({ action: "create", ...meta });
  await loadScript();
  const Razorpay = (window as { Razorpay?: RazorpayCtor }).Razorpay;
  if (!Razorpay) throw new Error("Razorpay failed to load.");

  const primary =
    getComputedStyle(document.documentElement).getPropertyValue("--color-primary").trim() ||
    "#A15E2E";

  const checkout = await new Promise<CheckoutResponse>((resolve, reject) => {
    const rzp = new Razorpay({
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      order_id: created.razorpay_order_id,
      amount: created.amount,
      currency: created.currency ?? "INR",
      name: restaurant.name,
      description: "Order",
      prefill: input.customerName ? { name: input.customerName } : undefined,
      theme: { color: primary },
      handler: (resp: unknown) => resolve(resp as CheckoutResponse),
      modal: { ondismiss: () => reject(new PaymentDismissed()) },
    });
    rzp.on("payment.failed", (resp: unknown) => {
      const desc = (resp as { error?: { description?: string } })?.error?.description;
      reject(new Error(desc || "Payment failed. Please try again."));
    });
    rzp.open();
  });

  const verified = await callFn({
    action: "verify",
    razorpay_order_id: checkout.razorpay_order_id,
    razorpay_payment_id: checkout.razorpay_payment_id,
    razorpay_signature: checkout.razorpay_signature,
    ...meta,
  });

  return { shortCode: verified.short_code as string };
}
