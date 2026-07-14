# Build Roadmap

**Product:** Brand website + direct-ordering web app (MVP)
**Companions:** [SRS.md](./SRS.md) · [system-design.md](./system-design.md) · [design-system.md](./design-system.md)
**Version:** 2.0 — *revised for a multi-page brand + ordering site*
**Date:** 2026-07-14

---

## How to read this

Each milestone is **small, sequenced, and independently testable**. Every milestone
lists: **Goal → Build → ✅ Verify**. We build in order; I pause after each for you to
run and confirm.

**Scope shift (v2):** the customer side is now a full **mobile-first brand website that
also takes orders** — a persistent nav + footer wrapping routed pages (Home, Menu,
Cart, Our Story, Contact) — not just a single QR menu. The QR deep-links to `/menu`.
Owner side (dashboard) is unchanged.

Legend: 🧱 scaffold · 🎨 customer site · 🔐 owner · 🌱 data · 🚀 deploy

**Status:** ✅ M0 done · ✅ M1 done (SQL written, unrun) · ▶️ M2 in progress

---

## ✅ M0 — Project scaffold & theme 🧱
Vite + React + TS + Tailwind, `frontend/` + `backend/` split, config-driven theme
(light niche-cafe), routing shell, Supabase client. *Done — deploy deferred.*

## ✅ M1 — Database layer 🌱
Schema, enums, RLS, `place_order()` RPC, realtime, and the Park Street Adda seed
(20 items + sample orders). *Done — SQL written, to be run against Supabase later.*

---

## M2 — App shell, navigation & Home 🧱🎨

**Goal:** The site frame is real: persistent nav + footer on every page, working
routing between all pages, and a branded Home landing.

**Build:**
- `SiteLayout` (nav + `<Outlet/>` + footer) wrapping all public routes.
- **NavBar**: logo/name, desktop links (Home · Menu · Our Story · Contact),
  **Order Now** button, always-visible **cart icon** (count wired in M3); mobile
  **hamburger** menu.
- **Footer**: hours, address, socials, WhatsApp — all from config.
- **Home page**: brand hero (image, tagline, **Order Now → /menu** CTA), a short
  *Our Story* teaser, a promo strip. (Featured-items row added in M4 once item cards exist.)
- Placeholder bodies for Menu / Cart / Our Story / Contact.
- Extend `restaurant.config.ts` with `hero`, `story`, `contact` content.

**✅ Verify:** On your phone, the nav + footer show on every page; hamburger works;
you can navigate Home ↔ Menu ↔ Our Story ↔ Contact; Home looks like a real cafe
landing. (`npm run dev` — no DB needed.)

---

## M3 — Menu page + cart 🎨

**Goal:** Browse the full menu and add items to a persistent cart.

**Build:**
- **Menu page** `/menu`: sticky category nav, item rows (name/desc/price/image),
  grouped by config category order; reads `?table=`. (Uses the M2-era data layer +
  mock fallback.)
- **Cart state**: `CartProvider` backed by localStorage (survives reload + page nav);
  **Add / +/- / remove**; cart-icon **count** + running total go live.
- Mini-cart drawer or sticky "View cart" bar.

**✅ Verify:** Add items from the menu, change quantities, navigate to another page and
back — cart persists; the nav cart-count and total are correct.

## M4 — Cart page + WhatsApp checkout 🎨🌱

**Goal:** The money moment — review cart, place order to DB, open prefilled WhatsApp.
Plus featured items on Home.

**Build:**
- **Cart/Checkout page** `/cart`: line items, totals, optional name + note, table context.
- **Order on WhatsApp**: `place_order()` RPC → build `wa.me` message → open → clear
  cart → confirmation. Error path preserves the cart.
- **Home featured items** row (reuses the menu item card).

**✅ Verify:** From cart, tap Order on WhatsApp → correct itemized message opens → (once
DB is wired) the order lands in Supabase with the right total.

## M5 — Our Story + Contact & Location 🎨

**Goal:** The brand pages that make it a real website.

**Build:**
- **Our Story** `/our-story`: narrative + imagery from config.
- **Contact & Location** `/contact`: address, hours, phone + WhatsApp buttons, map embed.

**✅ Verify:** Both pages render from config, look polished on mobile, and the
call/WhatsApp/map actions work.

---

## M6 — Owner auth + live order board 🔐

**Goal:** Owner logs in and watches orders arrive live.

**Build:** Supabase Auth (email+password), `LoginPage` + `RequireAuth`; `OrderBoard`
reads existing orders then subscribes via the `OrderStream` (Supabase Realtime)
abstraction; new orders animate in with a cue; `OrderCard` shows items/total/table/
note/code/time/status.

**✅ Verify:** Log in on one device; place an order from another → it pops into the
board in ~1–2s without refresh. Logged-out users are redirected.

## M7 — Order status flow 🔐

**Goal:** Drive each order `placed → accepted → preparing → ready → done` (+ cancel),
reflected live.

**✅ Verify:** Advance an order through every status on one device, watch it sync live
on a second. Cancel works from a non-terminal state.

## M8 — Owner menu management (CRUD) 🔐

**Goal:** Owner manages the menu without touching the database.

**Build:** `MenuManager` list; `ItemForm` create/edit (name, desc, ₹↔paise, category,
availability); delete w/ confirm; availability toggle; image upload to Supabase
Storage with placeholder fallback.

**✅ Verify:** Add/edit/toggle/delete an item → reload the customer menu and see every
change reflected.

---

## M9 — Production-real polish 🎨

Loading skeletons, empty/error states, toasts, tap targets ≥44px; micro-interactions
(add-to-cart feedback, new-order highlight + sound); real copy, favicon, OG/share
meta, `theme-color`; final brand pass from config.

**✅ Verify:** Walk every flow on a mid-range phone over mobile data — nothing janky,
broken, or placeholder. Passes as a shipped product.

## M10 — Deploy, demo kit & reskin proof 🚀

**Goal:** Live and demo-ready — and proven reusable.

**Build:**
- **Wire the database**: create Supabase project, run migrations + seed, create owner
  login, verify every flow end-to-end against real data.
- **Deploy** frontend to Vercel (root dir = `frontend`) with env vars → live URL.
- Optional `/dashboard/qr` to print table QR codes.
- **Demo script** + DB reset/reseed snippet to reset between prospects.
- **Reskin proof**: swap `restaurant.config.ts` + reseed to a second fictional cafe,
  redeploy — confirm zero code changes needed.

**✅ Verify:** Printed QR → menu → order → live dashboard, end to end on the public URL.
Then reskin to cafe #2 in minutes with only config + seed edits.

---

## Dependency map

```
M0 ─► M1 ─► M2 ─► M3 ─► M4 ─► M5 ─┐
                                   ├─► M9 ─► M10
            M6 ─► M7 ─► M8 ────────┘
```
Owner side (M6–M8) depends only on M1; it can be built in parallel with the customer
pages if needed. Everything converges at polish (M9) and deploy (M10).

## Deferred (post-MVP upsells)
Razorpay prepaid checkout · WhatsApp Business API · AI customer assistant ·
multi-tenant single deployment · Offers/Deals & Gallery pages. Seams reserved in the
System Design.
