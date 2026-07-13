# QuickServe — Direct-Ordering Restaurant Site (MVP)

A mobile-first, QR-accessible digital ordering site a restaurant fully owns —
cutting Swiggy/Zomato commissions. Config-driven single-tenant template: reskin a
new client by editing one config file + reseeding the menu.

**Demo cafe:** Park Street Adda (fictional Kolkata cafe).

## Stack

React + Vite + TypeScript + Tailwind (+ shadcn/ui) · Supabase (Postgres, Auth,
Storage, Realtime) · deployed on Vercel. Orders reach the owner via WhatsApp
(`wa.me`) and appear live on the dashboard.

See [`docs/`](./docs) for the SRS, system design, roadmap, and design system.

## Run locally

```bash
cd frontend
npm install
cp .env.example .env      # then fill in Supabase URL + anon key (optional for M0)
npm run dev
```

Open the printed URL (default http://localhost:5173). Routes:

- `/` — customer menu (QR landing)
- `/dashboard` — owner dashboard

## Repo layout

```
frontend/   React + Vite + Tailwind app (deployed to Vercel; root dir = frontend)
backend/    Supabase SQL (migrations, seed) + any future Node/Socket.IO service
docs/       SRS, system design, roadmap, design system
```

## Reskin for a new client

Edit [`frontend/src/config/restaurant.config.ts`](./frontend/src/config/restaurant.config.ts) —
name, tagline, WhatsApp number, categories, and the `theme` tokens. No other code
changes.

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Preview the production build |
| `npm run typecheck` | Type-check without emitting |
