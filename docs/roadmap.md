# Build Roadmap

**Product:** Direct-Ordering Restaurant Site (MVP)
**Companions:** [SRS.md](./SRS.md) · [system-design.md](./system-design.md)
**Version:** 1.0
**Date:** 2026-07-13

---

## How to read this

Each milestone is **small, sequenced, and independently testable** — you can run and
verify it before we move on. Every milestone lists: **Goal → Build → ✅ Verify (on
your phone/browser)**. We build in this order; I pause after each for you to confirm.

Legend: 🧱 scaffolding · 🎨 customer-facing · 🔐 owner-facing · 🌱 data · 🚀 deploy

**Critical path to a live demo:** M0 → M1 → M2 → M3 → M4 → M6 → M7 → M9.
M5 (menu CRUD) and M8 (polish) can be reordered around your first demo date.

---

## M0 — Project scaffold & "hello, deployed" 🧱🚀

**Goal:** A blank but real app running locally *and* live on Vercel, wired to Supabase.

**Build:**
- Vite + React + TypeScript + Tailwind; mobile-first base styles.
- `src/config/restaurant.config.ts` stub + theme tokens → Tailwind.
- `src/lib/supabase.ts` from env; `.env.example`.
- Create Supabase project; add URL + anon key to env (local + Vercel).
- Routing shell: `/` (menu placeholder) and `/dashboard` (placeholder).
- Deploy to Vercel.

**✅ Verify:** Local dev shows a themed placeholder page; the Vercel URL opens the
same on your phone. No data yet — just proof the pipeline is real.

---

## M1 — Database schema, RLS & seed 🌱

**Goal:** All tables, enums, RLS, the `place_order()` RPC, and the seeded cafe exist.

**Build:**
- `supabase/migrations/` — enums, `menu_items`, `orders`, `order_items`, indexes,
  RLS policies, `place_order()` RPC (all from system-design §3–5).
- `supabase/seed.sql` — **Park Street Adda** with ~18 items across the config
  categories, realistic ₹ prices, placeholder images; a few sample orders in mixed
  statuses so the dashboard looks alive.

**✅ Verify:** In the Supabase table editor you see the seeded menu + sample orders.
Running `place_order()` from the SQL editor with a test payload returns a `short_code`
and inserts a correct order (total computed server-side).

---

## M2 — Customer menu (read-only) 🎨

**Goal:** The QR-landing menu looks production-real on a phone.

**Build:**
- Fetch `menu_items` (anon, available only), group by category using
  `config.categoryOrder`.
- `MenuPage`, `CategorySection`, `ItemCard`: name, description, ₹ price, image/
  placeholder, availability handling.
- Header with cafe brand from config; sticky category nav; loading & empty states.
- Read `?table=` and show a subtle "Table 5" chip.

**✅ Verify:** Open the Vercel URL (and `?table=5`) on your phone — the seeded menu
renders cleanly, grouped, scrollable, with the table chip. Feels like a real cafe.

---

## M3 — Cart 🎨

**Goal:** Add items, adjust quantities, see a live total — persisted on device.

**Build:**
- `CartProvider` backed by localStorage (survives reload); `useCart`.
- Add / increment / decrement / remove; running subtotal + total via `money.ts`.
- Floating cart bar + `CartSheet`; optional name + note fields; empty-cart state.

**✅ Verify:** Add items, change quantities, reload the page — cart persists and the
total is correct in ₹.

---

## M4 — Place order → WhatsApp 🎨🌱

**Goal:** The core money moment: order saved to DB, then WhatsApp opens prefilled.

**Build:**
- `placeOrder()` calls the `place_order()` RPC (table, name, note, items).
- On success: build the `wa.me` message in `lib/whatsapp.ts` (cafe name, table, each
  `qty × item = ₹sub`, total, note, order code), open it, clear cart, show confirmation.
- On failure: error toast, cart preserved (SRS FR-C9).

**✅ Verify:** Place an order on your phone → WhatsApp opens with a correct itemized
message to the configured number → the order appears in the Supabase `orders` table
with the right total and a `short_code`.

---

## M5 — Owner auth + live order board 🔐

**Goal:** Owner logs in and watches orders arrive **live**.

**Build:**
- Supabase Auth (email+password); create the owner account; `LoginPage` + `RequireAuth`.
- `OrderBoard` reads existing orders, then subscribes via the `OrderStream`
  (Supabase Realtime) abstraction; new orders animate in with a cue.
- `OrderCard`: items, total, table, note, code, timestamp, status.

**✅ Verify:** Log in on one device; place an order from another (or your phone) →
it pops into the board within ~1–2s without refresh. Logged-out users are redirected.

---

## M6 — Order status flow 🔐

**Goal:** Owner drives each order `placed → accepted → preparing → ready → done`
(+ cancel), reflected live.

**Build:**
- `StatusStepper` / action buttons → `update` on `orders`; realtime UPDATE syncs any
  open board.
- Active vs Done filter/segment.

**✅ Verify:** Advance an order through every status on one device and watch it update
live on a second. Cancel works from a non-terminal state.

---

## M7 — Owner menu management (CRUD) 🔐

**Goal:** Owner manages the menu without touching the database.

**Build:**
- `MenuManager` list; `ItemForm` create/edit (name, description, ₹ price ↔ paise,
  category, availability); delete with confirm.
- Availability toggle; image upload to Supabase Storage (`menu-images`) with placeholder
  fallback.

**✅ Verify:** Add an item, edit a price, toggle one unavailable, delete one →
reload the customer menu and see every change reflected correctly.

---

## M8 — Production-real polish 🎨

**Goal:** Removes every "demo smell" so it closes deals.

**Build:**
- Consistent loading skeletons, empty/error states, toasts; tap targets ≥44px.
- Micro-interactions (add-to-cart feedback, new-order highlight + optional sound).
- Real copy, favicon, share/OG meta, `theme-color`; verify contrast/legibility.
- Final brand pass from `restaurant.config` (colours, logo, tagline).

**✅ Verify:** Walk all flows on a mid-range phone over mobile data — nothing feels
janky, broken, or placeholder. Would pass as a shipped product to a stranger.

---

## M9 — Demo kit & reskin proof 🚀

**Goal:** You can walk into a meeting and it just works — and prove reusability.

**Build:**
- Optional `/dashboard/qr` page to render/print table QR codes from the live URL.
- Short **demo script** (what to click, in what order) + a DB reset/reseed snippet to
  reset the demo between prospects.
- **Reskin proof:** swap `restaurant.config.ts` + reseed to a second fictional cafe,
  redeploy — confirm zero code changes needed (SRS acceptance #8).

**✅ Verify:** From a printed QR → menu → order → dashboard, end to end on the live
URL. Then reskin to cafe #2 in minutes with only config + seed edits.

---

## Milestone dependency map

```
M0 ─► M1 ─► M2 ─► M3 ─► M4 ─┬─► M5 ─► M6 ─► M8 ─► M9
                            └─► M7 ─────────┘
```
M7 (menu CRUD) depends on M1 + auth from M5 but is otherwise independent of the
order-flow chain — buildable in parallel or deferred past a first demo.

---

## Deferred (post-MVP upsells — not in this roadmap)
Razorpay prepaid checkout · WhatsApp Business API · AI customer assistant ·
multi-tenant single deployment. All seams already reserved in the System Design.
