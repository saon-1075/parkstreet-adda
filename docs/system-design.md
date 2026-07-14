# System Design

**Product:** Direct-Ordering Restaurant Site (MVP)
**Companion to:** [SRS.md](./SRS.md)
**Version:** 1.0
**Date:** 2026-07-13

---

## 1. Architecture Overview

Single-page mobile web app (React/Vite/Tailwind) talking directly to Supabase for
data, auth, storage, and realtime. **No custom backend server in the MVP** — the one
piece of "server logic" (atomic, price-validated order placement) lives in a Postgres
function (RPC) inside Supabase. One deployment per client.

```
                          ┌───────────────────────────────────────────┐
                          │                 SUPABASE                    │
                          │                                             │
  Customer phone          │   ┌──────────┐   Postgres   ┌───────────┐  │
  (anon, no login)        │   │  Auth    │  ┌─────────┐  │  Storage  │  │
  ┌───────────────┐  QR   │   │ (owner)  │  │ tables  │  │ (images)  │  │
  │  Menu + Cart   │◄─────┼───┤          │  │ +RLS    │  │           │  │
  │  (React SPA)   │       │   └──────────┘  │ +RPC    │  └───────────┘  │
  └───────┬───────┘  read  │        ▲        │ place_  │       ▲         │
          │  menu (SELECT)  │        │        │ order() │       │        │
          │  place_order()  │        │        └────┬────┘       │        │
          │  (RPC) ─────────┼────────┼─────────────┘            │        │
          │                 │        │        ▲                 │        │
          ▼                 │        │        │ Realtime         │        │
   ┌─────────────┐  wa.me   │        │        │ (Postgres CDC,   │        │
   │  WhatsApp    │◄─prefill │        │        │  RLS-filtered)   │        │
   │ (owner recv) │          │        │        │                 │        │
   └─────────────┘          │        │        │                 │        │
                          │        │        ▼                 │        │
  Owner phone/laptop      │   ┌────┴─────────────────┐        │        │
  (authenticated)         │   │  live orders stream   │        │        │
  ┌───────────────┐  sub   │   └──────────────────────┘        │        │
  │  Dashboard     │◄──────┼───────────── realtime ────────────┘        │
  │  - live orders │       │                                             │
  │  - status flow │  read/update orders (RLS: authenticated only)       │
  │  - menu CRUD   │  read/write menu_items + Storage                    │
  └───────────────┘       └───────────────────────────────────────────┘

  Hosting: Frontend → Vercel (static SPA + env vars).  Data/Auth/RT/Storage → Supabase cloud.
```

**Two flows, one source of truth:**
1. **Customer order:** cart → `place_order()` RPC (server-validates prices, computes
   total, inserts order + items atomically) → returns `short_code` → open `wa.me`
   prefilled message. The **database row is authoritative**; WhatsApp is just the
   owner's notification channel.
2. **Owner:** authenticates → subscribes to realtime `orders` changes → new orders
   pop in live → advances status (UPDATE) → manages menu (CRUD + Storage).

---

## 2. Resolved Decision — Supabase Realtime vs Node/Express + Socket.IO

**Decision: Use Supabase Realtime for the MVP live order feed.** Wrap it behind a
thin `orderStream` abstraction so a Socket.IO service can replace it later without
touching UI. Give the Node/Express backend a *real* home when a genuinely
server-side concern arrives (below) — don't manufacture one for the order feed.

### Why (weighing your two goals)

| Factor | Supabase Realtime ✅ | Node + Socket.IO |
|---|---|---|
| **Build speed** | Subscribe in ~10 lines; no server to write | Must build + wire an emitter service |
| **Live-demo reliability** | One fewer moving part on stage; nothing to keep awake | A sleeping free-tier server = a dead demo on a prospect's phone |
| **Hosting/cost** | $0, already in the stack | Another deploy (Render/Railway), cold starts, more ops |
| **Security** | RLS auto-filters the stream — anon can't see orders | You hand-roll auth on the socket |
| **Reusability as template** | Reskin = config swap, zero infra per client | Every client needs the server stood up too |
| **Backend-depth showcase** | Shown via the `place_order()` Postgres RPC (atomic, price-validated) | Overkill here; better spent where it's real |

For a **sales demo you run live on a phone**, the biggest risks are latency and a
component being asleep. Supabase Realtime removes an entire failure surface while
still being genuinely real-time (Postgres change-data-capture, typically <1–2s).

### Where your backend depth actually earns its place (later, not MVP)

A dedicated **Node/Express + Socket.IO** service becomes the *right* call — and a
strong portfolio/story piece — when you add features that are inherently
server-side and shouldn't touch the browser:
- **WhatsApp Business API** send/receive **webhooks** (paid upgrade from `wa.me`).
- **Razorpay** order-creation + **payment webhooks** (needs a trusted server + secret).
- **AI customer assistant** orchestration (system prompts, tool calls, rate limits).
- Cross-channel fan-out / printer bridges (KOT), analytics pipelines.

The MVP's `orderStream` abstraction (see §7) means the dashboard subscribes to an
interface, not to Supabase directly — so introducing that service later is additive,
not a rewrite. **This is the "backend depth" story: I chose the simplest thing that
ships and isolated the seam where a real backend belongs.**

---

## 3. Data Model

Money is stored as **integer paise** (₹1 = 100 paise) everywhere — avoids float
rounding and matches Razorpay's unit for the future prepaid upsell. Formatted to
`₹` at the display edge only.

### 3.1 Enums

```sql
create type order_status  as enum ('placed','accepted','preparing','ready','done','cancelled');
create type payment_status as enum ('unpaid','paid','refunded');   -- 'unpaid' default; Razorpay-ready
```

### 3.2 Tables

```sql
-- MENU -------------------------------------------------------------
create table menu_items (
  id           uuid primary key default gen_random_uuid(),
  name         text        not null,
  description  text        default '',
  price_paise  integer     not null check (price_paise >= 0),
  category     text        not null,              -- grouped client-side; ordered via config
  image_url    text,                              -- Supabase Storage public URL, nullable
  is_available boolean     not null default true,
  sort_order   integer     not null default 0,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

-- ORDERS -----------------------------------------------------------
create table orders (
  id             uuid primary key default gen_random_uuid(),
  short_code     text        not null unique,     -- e.g. 'A3F' — used in WhatsApp + dashboard
  table_label    text,                            -- from ?table=, null = takeaway
  customer_name  text,
  note           text,
  status         order_status   not null default 'placed',
  payment_status payment_status not null default 'unpaid',
  total_paise    integer        not null check (total_paise >= 0),
  created_at     timestamptz    not null default now(),
  updated_at     timestamptz    not null default now()
);

-- ORDER LINE ITEMS (price/name SNAPSHOTTED at order time) -----------
create table order_items (
  id              uuid primary key default gen_random_uuid(),
  order_id        uuid not null references orders(id) on delete cascade,
  menu_item_id    uuid references menu_items(id) on delete set null,  -- keep history if item deleted
  item_name       text    not null,               -- snapshot
  item_price_paise integer not null,              -- snapshot
  quantity        integer not null check (quantity > 0),
  line_total_paise integer not null
);

create index on orders (created_at desc);
create index on orders (status);
create index on order_items (order_id);
create index on menu_items (category, sort_order);
```

**Why snapshot name/price on `order_items`:** if the owner later edits or deletes a
menu item, historical orders (and the demo's "alive" look) stay correct. Real POS
behaviour.

**Categories** are a plain text column (grouped in the UI, ordered by a config list),
not a separate table — deliberately avoiding an extra CRUD surface for the MVP.
Promoting to a `categories` table later is a non-breaking add.

---

## 4. Data-Access Surface ("API")

No REST layer of our own. Access is via the Supabase JS client, governed by RLS, plus
one RPC for the trust-sensitive write.

| Operation | Who | Mechanism | Notes |
|---|---|---|---|
| List menu | Customer (anon) | `select` on `menu_items` | RLS: anon sees `is_available = true` only |
| Place order | Customer (anon) | **RPC `place_order(payload)`** | Server validates prices, computes total, inserts order+items atomically, returns `{id, short_code}` |
| List / watch orders | Owner (auth) | `select` + **Realtime** subscribe | RLS: authenticated only |
| Advance status / cancel | Owner (auth) | `update` on `orders` | RLS: authenticated only |
| Menu CRUD | Owner (auth) | `insert/update/delete` on `menu_items` | RLS: authenticated only |
| Upload item image | Owner (auth) | Supabase Storage `menu-images` | public read, auth write |

### 4.1 `place_order` RPC (security definer)

Client sends `{ table_label, customer_name, note, items: [{menu_item_id, quantity}] }`.
The function **ignores any client-sent prices**, re-reads each item's current
`price_paise` from `menu_items`, rejects unavailable/unknown items, computes line
totals + grand total, generates a `short_code`, inserts `orders` + `order_items` in
one transaction, and returns the new order's `id` and `short_code`.

```sql
create or replace function place_order(payload jsonb)
returns table (id uuid, short_code text)
language plpgsql security definer set search_path = public as $$
declare
  v_order_id uuid;
  v_code text := upper(substr(md5(gen_random_uuid()::text), 1, 4));
  v_total int := 0;
  it jsonb;
  m menu_items%rowtype;
  qty int;
begin
  insert into orders (short_code, table_label, customer_name, note, total_paise)
  values (v_code, nullif(payload->>'table_label',''), nullif(payload->>'customer_name',''),
          nullif(payload->>'note',''), 0)
  returning orders.id into v_order_id;

  for it in select * from jsonb_array_elements(payload->'items') loop
    qty := greatest((it->>'quantity')::int, 1);
    select * into m from menu_items
      where menu_items.id = (it->>'menu_item_id')::uuid and is_available = true;
    if not found then raise exception 'Item unavailable: %', it->>'menu_item_id'; end if;
    insert into order_items (order_id, menu_item_id, item_name, item_price_paise, quantity, line_total_paise)
    values (v_order_id, m.id, m.name, m.price_paise, qty, m.price_paise * qty);
    v_total := v_total + m.price_paise * qty;
  end loop;

  update orders set total_paise = v_total where orders.id = v_order_id;
  return query select v_order_id, v_code;
end $$;

grant execute on function place_order(jsonb) to anon, authenticated;
```

This is the MVP's one intentional bit of backend depth: **prices can't be tampered
from the client, and an order is never half-inserted.**

---

## 5. Row-Level Security (RLS) Policies

```sql
alter table menu_items  enable row level security;
alter table orders      enable row level security;
alter table order_items enable row level security;

-- MENU: anon reads available items; owner reads all + full write
create policy menu_public_read on menu_items for select
  to anon using (is_available = true);
create policy menu_owner_read on menu_items for select
  to authenticated using (true);
create policy menu_owner_write on menu_items for all
  to authenticated using (true) with check (true);

-- ORDERS: only owner reads/updates. Customers never read; they write via RPC only.
create policy orders_owner_read on orders for select
  to authenticated using (true);
create policy orders_owner_update on orders for update
  to authenticated using (true) with check (true);
-- (no direct anon insert policy: inserts go through security-definer place_order())

-- ORDER_ITEMS: owner read only; writes happen inside the RPC (definer bypasses RLS)
create policy order_items_owner_read on order_items for select
  to authenticated using (true);
```

Realtime respects RLS, so the anon customer stream can never receive other diners'
orders; only the authenticated dashboard subscription does.

> Because MVP is single-tenant (one owner account per deploy), policies are "any
> authenticated user." A future multi-tenant version would swap `using (true)` for a
> `restaurant_id = auth.jwt()->>...` predicate — an additive change.

---

## 6. Config Layer (the reskin seam)

All restaurant-specific values live in **one** typed config module + env vars.
Re-skinning a new client = edit this file, reseed the menu, redeploy. **No app logic
changes.**

```
src/config/restaurant.config.ts
```
```ts
export const restaurant = {
  name: "Park Street Adda",
  tagline: "Kolkata's living-room cafe",
  logoUrl: "/brand/logo.svg",
  whatsappNumber: "919830000000",     // owner receives orders here (public, not a secret)
  currency: "₹",
  theme: {                            // mapped to CSS variables → Tailwind tokens
    primary: "#B5303B", accent: "#E8B04B", bg: "#FBF7F0", ink: "#241B15",
  },
  dineIn: { enabled: true, tableParam: "table" },
  categoryOrder: ["Chai & Coffee", "Breakfast", "Snacks", "Rolls & Kathi", "Mains", "Desserts", "Beverages"],
  social: { instagram: "" },
} as const;
```
Env (never hard-coded): `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`.

---

## 7. Realtime Abstraction (future-swap seam)

The dashboard depends on an interface, not on Supabase directly:

```ts
// src/lib/orderStream.ts
export interface OrderStream {
  subscribe(onInsert: (o: Order) => void, onUpdate: (o: Order) => void): () => void;
}
// MVP impl: SupabaseOrderStream (postgres_changes on `orders`)
// Future impl: SocketOrderStream (Socket.IO client) — drop-in, no UI change
```

Swapping to Node/Socket.IO later means adding one file and changing one wiring line.

---

## 8. Folder Structure

Frontend and backend files are kept in separate top-level folders.

```
mvp/
├─ docs/                          SRS · system-design · roadmap · design-system
├─ backend/                       server-side / data tier (kept separate)
│  └─ supabase/
│     ├─ migrations/              schema + enums + RLS + place_order() RPC
│     └─ seed.sql                 fictional cafe: ~18 items (+ optional sample orders)
│     (future: backend/server/ — Node/Express + Socket.IO, §2)
├─ frontend/                      React + Vite app (Vercel root dir = frontend)
│  ├─ public/
│  │  └─ brand/                   logo, favicon, placeholder food image
│  ├─ src/
│  │  ├─ config/
│  │  │  └─ restaurant.config.ts  ← the ONLY per-client file (branding/theme/number)
│  │  ├─ lib/
│  │  │  ├─ supabase.ts           client init from env
│  │  │  ├─ theme.ts              apply config theme → CSS vars
│  │  │  ├─ orderStream.ts        realtime abstraction (§7)
│  │  │  ├─ whatsapp.ts           build wa.me prefilled message
│  │  │  └─ money.ts              paise ↔ ₹ formatting
│  │  ├─ types/                   Order, MenuItem, OrderItem
│  │  ├─ data/                    menu fetch (+ mock fallback), grouping
│  │  ├─ hooks/                   useMenu, useTableParam, useCart …
│  │  ├─ components/
│  │  │  ├─ layout/               SiteLayout, NavBar (mobile hamburger), Footer
│  │  │  └─ ui/                   Button, Sheet, Badge, Toast, EmptyState …
│  │  ├─ features/
│  │  │  ├─ home/                 HomePage (hero, featured, story teaser, promo)
│  │  │  ├─ menu/                 MenuPage, CategorySection, ItemCard, ItemImage
│  │  │  ├─ cart/                 CartProvider (localStorage), CartPage, useCart
│  │  │  ├─ order/                placeOrder() → RPC + wa.me
│  │  │  ├─ story/                OurStoryPage
│  │  │  ├─ contact/              ContactPage (address, hours, map, WhatsApp)
│  │  │  └─ dashboard/
│  │  │     ├─ auth/              LoginPage, RequireAuth
│  │  │     ├─ orders/            OrderBoard, OrderCard, StatusStepper
│  │  │     └─ menu-admin/        MenuManager, ItemForm, image upload
│  │  ├─ App.tsx                  routes (see below)
│  │  └─ main.tsx
│  ├─ .env.example
│  ├─ tailwind.config.ts          theme tokens ← restaurant.config theme
│  ├─ vercel.json                 SPA rewrite
│  └─ index.html
├─ .gitignore
└─ README.md
```

Routes — public pages share `SiteLayout` (nav + footer); the owner area is separate:

| Route | Page | Notes |
|---|---|---|
| `/` | Home | brand hero, featured items, story teaser, Order Now |
| `/menu` | Menu | ordering menu; **QR deep-links here** with `?table=` |
| `/cart` | Cart / Checkout | review → Order on WhatsApp |
| `/our-story` | Our Story | brand narrative from config |
| `/contact` | Contact & Location | address, hours, phone/WhatsApp, map |
| `/login` | Owner login | Supabase Auth |
| `/dashboard` | Order board | auth-gated; not in public nav |
| `/dashboard/menu` | Menu admin | owner CRUD |
| `/dashboard/qr` | QR (optional) | print table QR codes |

The cart lives in a `CartProvider` above the layout, so it persists across every
public page. Brand content (hero/story/contact/hours/socials) is config-driven.

---

## 9. Future-Proofing Checklist (designed-for, not built)

- **Razorpay:** `orders.payment_status` reserved; money already in paise; a Node
  service is the future home for order-create + webhook (§2).
- **AI assistant:** menu + orders are clean structured rows → a read-only assistant
  can be layered on without schema change.
- **Socket.IO / real backend:** isolated behind `OrderStream` (§7).
- **Multi-tenant:** additive `restaurant_id` + RLS predicate swap (§5).
- **WhatsApp Business API:** replaces `wa.me` builder in `lib/whatsapp.ts`; dashboard
  unaffected (DB already source of truth).
```
