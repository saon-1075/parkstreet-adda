# Backend

All server-side / data-tier concerns live here, kept separate from the `frontend/`
app.

## Current (MVP)

```
backend/
└─ supabase/
   ├─ migrations/   SQL: enums, tables, RLS policies, place_order() RPC   (added in M1)
   └─ seed.sql      Park Street Adda menu + sample orders                 (added in M1)
```

For the MVP the "backend" is Supabase (Postgres + Auth + Storage + Realtime). The only
custom server logic is the `place_order()` Postgres function (atomic, price-validated
order placement) — see [`../docs/system-design.md`](../docs/system-design.md).

### Applying this to a Supabase project (when ready)

Migrations are plain SQL, ordered by filename. Two ways to run them:

**A. Supabase Studio (quickest, no tooling)**
1. Open your project → **SQL Editor**.
2. Paste and run each file in `supabase/migrations/` **in order** (0001 → 0004).
3. Paste and run `supabase/seed.sql` last.

**B. Supabase CLI (repeatable)**
```bash
npm i -g supabase
supabase link --project-ref <your-project-ref>
supabase db push          # applies migrations/
psql "$DATABASE_URL" -f supabase/seed.sql   # or paste seed in Studio
```

After applying, create the owner login (used from M5): Studio → **Authentication →
Users → Add user** (email + password), and put the Supabase URL + anon key in
`frontend/.env`.

## Future (post-MVP, designed-for — not built)

A dedicated Node/Express + Socket.IO service will land here (e.g. `backend/server/`)
when features that must run server-side arrive: WhatsApp Business API webhooks,
Razorpay payment webhooks, and AI-assistant orchestration. The frontend already talks
to an `OrderStream` interface, so introducing it is additive.
