// Razorpay payments — server-side (Supabase Edge Function, Deno).
//
// Two actions, both POSTed as JSON:
//   { action: "create", items, ... }  -> creates a Razorpay order (secret key),
//                                         amount computed server-side from the DB.
//   { action: "verify", razorpay_*  } -> verifies the payment signature with the
//                                         secret, then inserts the order as PAID
//                                         via the service role.
//
// The Razorpay SECRET and the service-role key live only here (Supabase secrets),
// never in the browser. Deploy with --no-verify-jwt so anonymous customers can call it.
//
// Secrets required:  RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET
// Auto-provided:     SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const RZP_KEY = Deno.env.get("RAZORPAY_KEY_ID")!;
const RZP_SECRET = Deno.env.get("RAZORPAY_KEY_SECRET")!;
const admin = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};
const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...cors, "Content-Type": "application/json" },
  });

interface Item {
  menu_item_id: string;
  quantity: number;
}
interface Row {
  menu_item_id: string;
  item_name: string;
  item_price_paise: number;
  quantity: number;
  line_total_paise: number;
}

/** Re-price the cart from the DB (trusted) — clients never set the amount. */
async function resolveCart(items: Item[]): Promise<{ total: number; rows: Row[] }> {
  if (!Array.isArray(items) || items.length === 0) throw new Error("Cart is empty");
  const ids = items.map((i) => i.menu_item_id);
  const { data, error } = await admin
    .from("menu_items")
    .select("id, name, price_paise, is_available")
    .in("id", ids);
  if (error) throw new Error(error.message);
  const map = new Map(data.map((m) => [m.id, m]));

  let total = 0;
  const rows: Row[] = [];
  for (const it of items) {
    const m = map.get(it.menu_item_id);
    if (!m || !m.is_available) throw new Error("An item is unavailable");
    const qty = Math.max(1, Math.floor(Number(it.quantity)) || 1);
    total += m.price_paise * qty;
    rows.push({
      menu_item_id: m.id,
      item_name: m.name,
      item_price_paise: m.price_paise,
      quantity: qty,
      line_total_paise: m.price_paise * qty,
    });
  }
  return { total, rows };
}

async function hmacHex(message: string, secret: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(message));
  return [...new Uint8Array(sig)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

const shortCode = () =>
  Math.random().toString(16).slice(2, 6).toUpperCase();

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  try {
    const body = await req.json();

    if (body.action === "create") {
      const { total } = await resolveCart(body.items);
      const resp = await fetch("https://api.razorpay.com/v1/orders", {
        method: "POST",
        headers: {
          Authorization: "Basic " + btoa(`${RZP_KEY}:${RZP_SECRET}`),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ amount: total, currency: "INR", receipt: crypto.randomUUID() }),
      });
      const order = await resp.json();
      if (!resp.ok) return json({ ok: false, error: order?.error?.description ?? "Razorpay error" });
      return json({ ok: true, razorpay_order_id: order.id, amount: total, currency: "INR" });
    }

    if (body.action === "verify") {
      const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;
      const expected = await hmacHex(`${razorpay_order_id}|${razorpay_payment_id}`, RZP_SECRET);
      if (expected !== razorpay_signature) {
        return json({ ok: false, error: "Payment could not be verified" });
      }

      // Verified — persist as PAID with a fresh server-side re-price.
      const { total, rows } = await resolveCart(body.items);
      const code = shortCode();
      const { data: order, error: oerr } = await admin
        .from("orders")
        .insert({
          short_code: code,
          table_label: body.table_label ?? null,
          customer_name: body.customer_name ?? null,
          note: body.note ?? null,
          total_paise: total,
          payment_status: "paid",
          payment_ref: razorpay_payment_id,
        })
        .select("id, short_code")
        .single();
      if (oerr) return json({ ok: false, error: oerr.message });

      const { error: ierr } = await admin
        .from("order_items")
        .insert(rows.map((r) => ({ ...r, order_id: order.id })));
      if (ierr) return json({ ok: false, error: ierr.message });

      return json({ ok: true, short_code: order.short_code });
    }

    return json({ ok: false, error: "Unknown action" }, 400);
  } catch (e) {
    return json({ ok: false, error: e instanceof Error ? e.message : String(e) }, 500);
  }
});
