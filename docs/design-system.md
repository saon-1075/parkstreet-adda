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

| Token | Hex | Use |
|---|---|---|
| `bg` | `#FBF7F0` | warm paper-cream app background |
| `surface` | `#FFFDF9` | item cards (near-white, soft) |
| `surface2` | `#F1E7D6` | eyebrow sections, subtle bands |
| `border` | `#E7DAC6` | hairlines, card edges |
| `ink` | `#2A1A12` | primary text (deep espresso, high contrast) |
| `muted` | `#8A7663` | descriptions, secondary text |
| `primary` | `#B5303B` | primary buttons, prices, brand terracotta |
| `accent` | `#C99A3C` | highlights, dividers, "new order" cue (gold) |
| `whatsapp` | `#25D366` | the Order-on-WhatsApp CTA **only** |

**Deliberate exception:** the "Order on WhatsApp" button uses WhatsApp green
(`#25D366`) rather than the terracotta primary — the green is instantly recognizable
and reinforces the pitch. It is the *only* place green appears.

### Contrast notes
- `ink` on `bg` / `surface` → strong contrast, passes for body text.
- `primary` (terracotta) is used for emphasis and buttons; button text is cream
  (`#FBF7F0` / white) for legibility.
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
  bg: "#FBF7F0", surface: "#FFFDF9", surface2: "#F1E7D6", border: "#E7DAC6",
  ink: "#2A1A12", muted: "#8A7663",
  primary: "#B5303B", accent: "#C99A3C", whatsapp: "#25D366",
  fontDisplay: "Fraunces", fontBody: "Inter",
}
```
