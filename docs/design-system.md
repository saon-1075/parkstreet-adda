# Design System

**Product:** Direct-Ordering Restaurant Site (MVP)
**Companions:** [SRS.md](./SRS.md) · [system-design.md](./system-design.md) · [roadmap.md](./roadmap.md)
**Version:** 1.0
**Date:** 2026-07-13

---

## 1. Direction — "Light niche cafe"

A warm, artisanal, **light** aesthetic that reads as an independent boutique cafe —
not a delivery chain. The visual language is drawn from the **Cavo Coffee** reference
(elegant serif headlines, small-caps eyebrow labels, refined photo→name→price product
cards, gold/coffee accents, generous spacing), but the canvas is flipped from dark
espresso to **warm cream**.

**Why light, not dark:** stays effortlessly legible on any phone in sunlight (a real
risk with all-dark UIs on budget Androids), and the cream/terracotta palette signals
"handmade & independent," which is exactly the story we sell to owners.

**What we took from the Cavo reference**
- Serif display headlines paired with a clean sans for body.
- Uppercase, letter-spaced **eyebrow labels** ("OUR MENU", section headers).
- Product card anatomy: **photo → uppercase name → one-line tagline → price**.
- Rounded-rectangle buttons with uppercase, spaced text.
- Subtle coffee-bean divider motif.

**What we changed (marketing page → mobile-first ordering app)**
- Dark espresso canvas → **warm cream**; cards become soft near-white with hairline borders.
- Cards gain an **Add button + quantity stepper**; add a **sticky category nav**, a
  **floating cart bar**, and a **cart sheet**.
- **Serif for display only** (cafe name, eyebrows); **sans for menu items, descriptions,
  and all prices** — prices must be instantly legible.

---

## 2. Color Tokens

All colors live in the reskin layer (`src/config/restaurant.config.ts` → `theme`) and
are exposed as CSS variables consumed by Tailwind. **Changing a client's brand = editing
these values only.**

**Palette: "Caramel Cream"** (v1.1 — replaced the terracotta-red v1). Light, premium,
appetising. Caramel doubles as the **"star surface"**: hero and CTA bands are filled
`primary` with cream text — that's the eye-catcher — while menu cards stay light for
legibility.

| Token | Hex | Use |
|---|---|---|
| `bg` | `#FBF6EE` | warm paper-cream app background |
| `surface` | `#FFFFFF` | item cards (clean white) |
| `surface2` | `#F1E7D8` | eyebrow sections, subtle bands |
| `border` | `#E7DAC6` | hairlines, card edges |
| `ink` | `#2C2620` | primary text (warm near-black, high contrast) |
| `muted` | `#8B7E6D` | descriptions, secondary text |
| `primary` | `#A15E2E` | caramel — buttons, prices, **and hero/CTA band backgrounds** |
| `accent` | `#E0A458` | honey — highlights, dividers, "new order" cue |
| `whatsapp` | `#25D366` | the Order-on-WhatsApp CTA **only** |

**Deliberate exception:** the "Order on WhatsApp" button uses WhatsApp green
(`#25D366`) rather than the caramel primary — the green is instantly recognizable and
reinforces the pitch. It is the *only* place green appears.

### Contrast notes
- `ink` on `bg` / `surface` → strong contrast, passes for body text.
- On a caramel (`primary`) surface, text and CTAs are **cream/white** (hero pattern);
  the primary CTA there inverts to a white button with caramel text.
- `primary` (caramel) carries white button text and price emphasis on light surfaces.
- `muted` is for secondary text only — never for essential labels or prices.

---

## 3. Typography

| Role | Font | Usage |
|---|---|---|
| Display | **Fraunces** (serif, variable) | Cafe name, hero, section eyebrows/headlines |
| Body / UI | **Inter** (sans, variable) | Menu item names, descriptions, prices, buttons, all UI |

- Both are free Google Fonts, variable, mobile-friendly.
- **Prices and numbers always use Inter** (tabular, unambiguous).
- **Eyebrow labels:** Inter or Fraunces small-caps feel via `uppercase` +
  `letter-spacing: 0.12em`, `muted` or `accent` color, small size.
- Load fonts self-hosted or via Google Fonts with `display=swap`.

### Type scale (mobile-first, rem)
| Style | Size / Weight | Notes |
|---|---|---|
| Display (cafe name/hero) | 2rem–2.5rem, Fraunces 600 | tight leading |
| Section headline | 1.5rem, Fraunces 600 | |
| Eyebrow label | 0.75rem, Inter 600, uppercase, tracked | |
| Item name | 1rem, Inter 600 | |
| Body / description | 0.875rem, Inter 400, `muted` | |
| Price | 1rem, Inter 700, `primary` | |
| Button | 0.875rem, Inter 600, uppercase, tracked | |

---

## 4. Component & Layout Conventions

- **Component base:** shadcn/ui + Tailwind (accessible, themeable, "shipped-product" feel).
- **Radius:** cards & buttons `rounded-xl` (~12px); pills/chips `rounded-full`.
- **Elevation:** soft, low shadows on `surface` cards over `bg`; hairline `border`
  everywhere instead of heavy shadows (keeps the light look calm).
- **Spacing:** generous; base unit 4px; comfortable card padding (16px), section gaps (24–32px).
- **Tap targets:** ≥ 44px (NFR-3).
- **Dividers:** thin `border`-colored rules; optional centered coffee-bean glyph on
  section breaks (the Cavo motif).
- **Buttons:** primary = filled terracotta w/ cream text; secondary = outline w/
  `border` + `ink` text; both uppercase + tracked. WhatsApp CTA = filled `whatsapp` green.
- **Images:** rounded, `object-cover`, consistent aspect ratio (4:3 for item cards);
  always a graceful placeholder when `image_url` is null.
- **Motion:** subtle only — add-to-cart bump, new-order highlight fade, sheet slide-up.

### Signature screens (how the language applies)
- **Menu:** cream page, brand header (Fraunces), sticky uppercase category nav,
  soft white item cards (photo/name/tagline/price/Add), floating cart bar.
- **Cart sheet:** slide-up on `surface`, line items w/ steppers, terracotta total,
  green **Order on WhatsApp** CTA.
- **Dashboard:** same cream system; order cards on `surface`, gold `accent` highlight
  on a newly-arrived order, terracotta status controls.

---

## 5. Reskin Rule

Everything brand-specific (all tokens above, fonts, logo, cafe name, WhatsApp number)
resolves from `restaurant.config.ts`. A new client is a **config edit + reseed +
redeploy** — never a code change. Light/dark or a totally different palette for a
future client is just new token values here.

### Current config theme block
```ts
theme: {
  bg: "#FBF6EE", surface: "#FFFFFF", surface2: "#F1E7D8", border: "#E7DAC6",
  ink: "#2C2620", muted: "#8B7E6D",
  primary: "#A15E2E", accent: "#E0A458", whatsapp: "#25D366",
  fontDisplay: "Fraunces", fontBody: "Inter",
}
```
