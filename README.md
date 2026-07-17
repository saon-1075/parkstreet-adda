# Park Street Adda — direct-ordering restaurant site

A mobile-first, QR-accessible ordering website a restaurant **fully owns** — cutting
the ~18–30% commission charged by Swiggy/Zomato. Customers scan a QR, browse the menu,
and send their order **straight to the owner's WhatsApp**; the owner watches orders
arrive **live** on a dashboard and manages the menu themselves.

Built as a **config-driven, single-tenant template**: re-skin it for a new client by
editing one config file + swapping brand assets — no code changes.

> **Park Street Adda** is a fictional Kolkata cafe used as the demo brand.

---

## What it does

**Customer (no login)**
- Multi-page brand site — Home, Menu, Our Story, Contact — with a persistent nav + footer
- QR deep-links to the menu with an optional `?table=` for dine-in
- Cart persisted to `localStorage` (survives reload + navigation)
- Checkout **persists the order** (server-validated) and opens a pre-filled `wa.me` message

**Owner (authenticated)**
- Email/password login (Supabase Auth)
- **Live order board** — new orders stream in over Supabase Realtime with a highlight + chime
- **Status flow** — advance `placed → accepted → preparing → ready → done`, or cancel; synced live
- **Menu management** — add/edit/delete items, toggle availability, and **upload photos from any device** (HEIC/JPG/PNG → auto-shrunk to WebP in the browser)

---

## Tech stack

| Layer | Choice |
| --- | --- |
| Frontend | React + Vite + TypeScript + Tailwind, `class-variance-authority` for variants, `lucide-react` icons |
| Backend | Supabase — Postgres, Auth, Storage, Realtime |
| Ordering | WhatsApp via `wa.me` pre-filled links (no paid WhatsApp API) |
| Hosting | Vercel (frontend) + Supabase cloud |

**Key design decisions** (see [`docs/`](./docs)):
- Money stored as **integer paise** everywhere (no float bugs; Razorpay-ready).
- The one piece of trusted backend logic is the **`place_order()` Postgres RPC** — it
  re-computes prices server-side so the client can't tamper with totals.
- The live feed sits behind an **`OrderStream`** interface (Supabase impl today, a
  Node/Socket.IO service is a drop-in later).
- **RLS**: anon can read available menu items + place orders via the RPC only; the owner
  reads/writes everything.

---

## Repo layout

```
frontend/   React + Vite + Tailwind app (Vercel root dir = frontend)
backend/    Supabase SQL — migrations, seed (+ any future Node service)
docs/       SRS · system-design · roadmap · design-system · assets
```

---

## Getting started

```bash
cd frontend
npm install
cp .env.example .env     # fill in Supabase URL + anon key (see below)
npm run dev
```

Open the printed URL (default `http://localhost:5173`). Public routes: `/`, `/menu`,
`/cart`, `/our-story`, `/contact`. Owner: `/login`, `/dashboard`, `/dashboard/menu`.

**Mock mode:** without Supabase keys the app runs on local mock data (full menu, sample
orders, an interactive demo dashboard) — great for previewing the UI. It switches to the
live database automatically once both env vars are set.

### Connect Supabase (live mode)
1. Create a Supabase project (region closest to your users).
2. Run the SQL in [`backend/supabase/migrations/`](./backend/supabase/migrations) **in order** (0001 → 0005), then optionally [`seed.sql`](./backend/supabase/seed.sql).
3. Create a public Storage bucket named `menu-images` (for owner photo uploads).
4. Create the owner user: Authentication → Users → Add user (Auto Confirm).
5. Put the **Project URL** + **anon/publishable key** in `frontend/.env`, then restart `npm run dev`.

See [`backend/README.md`](./backend/README.md) for details.

---

## Re-skin for a new client

Edit [`frontend/src/config/restaurant.config.ts`](./frontend/src/config/restaurant.config.ts) —
name, tagline, WhatsApp number, hours, story, categories, and the `theme` color/font
tokens. Swap brand assets in `frontend/public/brand/` and dish photos in
`frontend/public/menu/`, then run the asset scripts. No application code changes.

---

## Scripts (`frontend/`)

| Command | What it does |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Preview the production build |
| `npm run typecheck` | Type-check without emitting |
| `npm run optimize:images` | Resize/compress brand + menu images to WebP (re-runnable) |
| `npm run generate:icons` | Regenerate favicons/app icons + OG image from the logo/banner |

---

## Deploy (Vercel)

Import the repo (private is fine), set **Root Directory = `frontend`**, add the two
Supabase env vars, and deploy. The repo stays private; the deployed site is public.

---

## Docs

- [`docs/SRS.md`](./docs/SRS.md) — requirements & scope
- [`docs/system-design.md`](./docs/system-design.md) — architecture, schema, RLS, routes
- [`docs/roadmap.md`](./docs/roadmap.md) — milestones
- [`docs/design-system.md`](./docs/design-system.md) — palette, type, components
- [`docs/assets.md`](./docs/assets.md) — image asset guide
