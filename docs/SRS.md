# Software Requirements Specification (SRS)

**Product:** Direct-Ordering Restaurant Site (MVP demo)
**Working title:** *QuickServe* (product/template name — the demo cafe is branded separately)
**Version:** 1.0 (MVP)
**Date:** 2026-07-13
**Author:** Saon (with senior-engineer copilot)

---

## 1. Purpose & Vision

A mobile-first, QR-accessible digital ordering site that lets an independent
restaurant, cloud kitchen, or cafe take **direct orders it fully owns** — bypassing
the ~18–30% commission charged by Swiggy/Zomato.

This document specifies the **MVP demo**: a production-real product used as a live
sales tool on the founder's phone. It must look and behave like a shipped product,
not a prototype. It is also the **reusable per-client template** — one deployment
per client, re-skinned via a config layer.

**One-line pitch:** *"Cut your Swiggy/Zomato commission with a direct-ordering site you own."*

---

## 2. Scope

### 2.1 In Scope (MVP)

1. **Mobile-first digital menu** opened via QR code. QR encodes a menu URL with an
   optional `?table=` parameter for dine-in table context.
2. **Cart + WhatsApp ordering.** Customer builds a cart and taps *"Order on WhatsApp"*.
   The order is persisted to the database, then a pre-filled WhatsApp message
   (itemized order + total + table) opens to the owner's number via a `wa.me` link.
3. **Real-time owner dashboard.** Authenticated owner sees incoming orders live and
   advances each through a status flow: `placed → accepted → preparing → ready → done`
   (plus a `cancelled` terminal state).
4. **Owner menu management (CRUD).** Owner can add/edit/delete menu items, set prices,
   assign categories, and toggle availability from the dashboard.
5. **One seeded fictional Kolkata cafe** (~18 menu items with ₹ prices, placeholder
   images) so the demo looks alive on first load.
6. **Config-driven re-skinning.** All restaurant-specific branding/config
   (name, logo, colours, WhatsApp number, tables) lives in a swappable config layer,
   separated from application code.

### 2.2 Out of Scope (MVP) — designed-for, not built

- **Online prepaid payments (Razorpay).** Architecture must not block adding a
  prepaid checkout later; the order model reserves a `payment_status` concept.
  Not implemented in MVP.
- **AI customer assistant.** Planned as a later paid upsell. Not built. Architecture
  must not preclude adding it (menu + orders remain queryable structured data).
- **Multi-tenant single deployment.** MVP is single-tenant per deploy. No cross-cafe
  routing or per-tenant isolation in one instance.
- **Customer accounts / login / order history.** Customers are anonymous.
- **Delivery logistics, rider tracking, live ETA, GPS.**
- **Inventory/stock depletion, table reservations, KOT printing, POS integration.**
- **Ratings/reviews, loyalty points, coupons/promo codes.**
- **Multi-language / i18n.** English + ₹ only for MVP.
- **Push/SMS/email notifications.** WhatsApp `wa.me` link is the only outbound channel.
- **Analytics/reporting dashboards** beyond the live order feed.

---

## 3. User Roles

| Role | Auth | Description | Capabilities |
|------|------|-------------|--------------|
| **Customer** | None (anonymous) | Diner scanning the QR / opening the menu link | Browse menu, filter by category, add to cart, adjust quantities, place order via WhatsApp |
| **Owner / Staff** | Required (Supabase Auth email+password) | The restaurant operator running the counter/kitchen | Log in, view live orders, advance order status, cancel order, manage menu (CRUD), toggle item availability |

> MVP treats "owner" and "staff" as a single privileged role. Fine-grained staff
> permissions are out of scope.

---

## 4. Functional Requirements

### 4.1 Customer — Menu & Ordering

- **FR-C1** The menu page SHALL be fully usable without authentication.
- **FR-C2** The menu page SHALL read an optional `?table=<id>` query param and carry
  it through to the order (dine-in context). Absent = takeaway/pickup context.
- **FR-C3** The menu SHALL display items grouped by category, each showing name,
  description, price in ₹, image (or placeholder), and an add-to-cart control.
- **FR-C4** Items marked unavailable SHALL be visually indicated and non-orderable.
- **FR-C5** The customer SHALL be able to add items, increment/decrement quantity,
  and remove items from a cart. Cart state SHALL persist across reloads on the device
  (localStorage) until the order is placed.
- **FR-C6** The cart SHALL display a live itemized subtotal and total in ₹.
- **FR-C7** The customer MAY add an optional free-text note (e.g. "less spicy") and,
  optionally, a name.
- **FR-C8** Tapping *"Order on WhatsApp"* SHALL:
  1. Persist the order to the database with status `placed`.
  2. Open a `wa.me` link to the owner's configured number, pre-filled with a
     human-readable itemized message: cafe name, table (if any), each line item
     (qty × name = ₹subtotal), total, and any note.
  3. Clear the local cart on success.
- **FR-C9** If order persistence fails, the customer SHALL see an error and the cart
  SHALL be preserved (no silent data loss).

### 4.2 Owner — Authentication

- **FR-O1** The dashboard SHALL require login (Supabase Auth, email + password).
- **FR-O2** Unauthenticated access to any dashboard route SHALL redirect to login.
- **FR-O3** The session SHALL persist across reloads until logout/expiry.

### 4.3 Owner — Live Orders

- **FR-O4** The dashboard SHALL display all orders, newest first, with items, total,
  table, note, timestamp, and current status.
- **FR-O5** New orders SHALL appear **in real time** without a manual refresh, with a
  clear visual/audio cue (e.g. highlight + optional sound) to signal a new order.
- **FR-O6** The owner SHALL advance an order through
  `placed → accepted → preparing → ready → done`, and MAY set `cancelled` from any
  non-terminal state. Status changes SHALL be reflected in real time.
- **FR-O7** The owner SHOULD be able to filter/segment orders by status
  (e.g. Active vs Done).

### 4.4 Owner — Menu Management (CRUD)

- **FR-O8** The owner SHALL create, read, update, and delete menu items
  (name, description, price, category, image, availability).
- **FR-O9** The owner SHALL toggle item availability without deleting it.
- **FR-O10** Menu changes SHALL be reflected on the customer menu (on next load).
- **FR-O11** Menu images MAY be uploaded to Supabase Storage; a placeholder is used
  when absent.

### 4.5 Seed / Demo

- **FR-S1** A seed SHALL populate the fictional Kolkata cafe with ~18 items across
  sensible categories with realistic ₹ prices.
- **FR-S2** A seed SHOULD optionally insert a few sample orders in varied statuses so
  a fresh dashboard looks alive during a demo.

---

## 5. Non-Functional Requirements

### 5.1 Usability & Design
- **NFR-1 (Mobile-first):** Primary target is a phone in portrait. All core flows
  SHALL be thumb-reachable and fast on a mid-range Android over 4G.
- **NFR-2 (Production-real):** Visual quality, copy, empty/loading/error states, and
  micro-interactions SHALL feel like a shipped product. No lorem ipsum, no broken images.
- **NFR-3 (Accessibility basics):** Legible contrast, tappable targets ≥ 44px,
  semantic headings.

### 5.2 Performance
- **NFR-4:** Menu first meaningful paint SHALL target < 2.5s on 4G / mid-range device.
- **NFR-5:** New-order latency to dashboard SHALL be near-real-time (< ~2s typical).

### 5.3 Reliability
- **NFR-6:** No customer order is lost on a failed submit (FR-C9).
- **NFR-7:** Dashboard realtime SHOULD auto-reconnect after transient network loss.

### 5.4 Security & Privacy
- **NFR-8:** Dashboard and all write access to orders/menu SHALL be protected by auth
  + row-level security. Anonymous users may **read** the menu and **insert** an order,
  and MAY NOT read others' orders or mutate the menu.
- **NFR-9:** No secrets in client code; only the public anon key ships to the browser.
- **NFR-10:** Minimal PII — optional customer name/note only; no accounts stored.

### 5.5 Maintainability & Reusability
- **NFR-11 (Config separation):** All restaurant-specific branding/config SHALL live
  in a single swappable layer; re-skinning a new client SHALL NOT require touching
  application logic.
- **NFR-12:** Code SHALL be organized so a second client is a config swap + seed +
  redeploy, not a fork.

### 5.6 Portability & Deployment
- **NFR-13:** Frontend deployed on Vercel; data/auth/storage/realtime on Supabase
  cloud. Publicly reachable URL so the QR works on any phone, anywhere.
- **NFR-14:** Environment-specific values (Supabase URL/key, WhatsApp number) SHALL be
  provided via environment variables / config, never hard-coded.

### 5.7 Extensibility (future-proofing, not built)
- **NFR-15:** Data model SHALL accommodate a future `payment_status` (Razorpay) without
  migration-breaking redesign.
- **NFR-16:** Menu and orders SHALL remain structured and queryable so a future AI
  assistant can be layered on read-only.

---

## 6. Key Assumptions & Constraints

- **A1:** WhatsApp ordering uses free `wa.me` pre-filled links (no paid WhatsApp
  Business API in MVP). The owner receives the message in their normal WhatsApp.
- **A2:** The order is written to the DB **before** WhatsApp opens; the dashboard —
  not WhatsApp — is the source of truth for order state.
- **A3:** Single owner WhatsApp number per deployment (config).
- **A4:** Placeholder images are acceptable for the seeded demo.
- **A5:** One cafe per deployment (single-tenant); re-skin via config.
- **A6:** Customers are anonymous; no login, no stored profile.

---

## 7. Acceptance Criteria (MVP "done")

1. Scanning the QR opens the cafe menu on a phone; `?table=5` is reflected in the order.
2. A customer can build a cart and place an order; a pre-filled WhatsApp message opens
   with the correct itemized content and total.
3. That order appears on the owner dashboard **live**, without refresh.
4. The owner can log in and advance the order through all statuses, reflected live.
5. The owner can add/edit/delete a menu item and toggle availability; changes show on
   the customer menu.
6. The seeded Kolkata cafe renders with ~18 realistic items and looks production-real
   on a phone.
7. The app is deployed to a public URL (Vercel + Supabase) and works end-to-end there.
8. Re-skinning to a hypothetical second cafe requires only config + seed changes.

---

## 8. Open / Deferred Decisions

- **Realtime transport** (Supabase Realtime vs Node/Express + Socket.IO) — **resolved
  in the System Design** (Deliverable 2), per the founder's request to weigh
  build-speed vs backend-depth/reusability.
- Razorpay prepaid checkout — deferred (designed-for only).
- AI customer assistant — deferred upsell.
