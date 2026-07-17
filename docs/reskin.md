# Reskin Checklist — onboarding a new client

The template is config-driven and single-tenant (one deployment per client). Re-skinning
is a **config swap + asset swap + fresh Supabase project** — no application code changes.
This doubles as the "reskin proof" for the MVP: run it end-to-end for a second cafe.

## 1. Branding & content — `frontend/src/config/restaurant.config.ts`
- `name`, `tagline`, `whatsappNumber` (the owner's real number), `currency`
- `theme` — colour tokens + fonts (the entire look flows from here)
- `hero`, `highlights`, `story`, `contact` (address, phone, hours, map), `social`
- `categoryOrder` and `dineIn.tableCount`

## 2. Brand assets — `frontend/public/brand/`
- `logo.webp`, `banner.webp`, `ambience.webp` (point config at them)
- Then regenerate derived assets:
  ```bash
  cd frontend
  npm run optimize:images     # shrink any large drops to WebP
  npm run generate:icons      # favicons / app icons / og.jpg from the new logo + banner
  ```
- Update the brand strings in `index.html` (title, description, OG/Twitter, apple title)
  and `public/manifest.webmanifest`.

## 3. Menu
- Either seed via SQL, or (recommended) have the owner add items + upload photos from the
  **dashboard → Menu** tab. Menu photos referenced as `/menu/<slug>.webp` live in
  `frontend/public/menu/`.

## 4. Supabase (per client — their own project)
- New project → run [`backend/supabase/migrations/`](../backend/supabase/migrations) 0001→0005 in order
- Create the public `menu-images` Storage bucket
- Create the owner user (Auth → Users → Add user, Auto Confirm)
- Put the Project URL + anon key in the client's Vercel env vars

## 5. Deploy
- Vercel → import repo (or a client copy) → **Root Directory = `frontend`** → add env
  vars → deploy. Optionally attach the client's custom domain.

## 6. Hand over
- Owner login (email + password), the live URL, and **printed table QR codes**
  (dashboard → QR codes → Print from the live site).

---

**Reskin proof:** running steps 1–2 for a second fictional cafe (new name, colours,
logo, menu) and confirming the whole site re-brands with **zero code changes** validates
the template. Keep the original `restaurant.config.ts` under version control so you can
branch per client.
