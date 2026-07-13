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

## Future (post-MVP, designed-for — not built)

A dedicated Node/Express + Socket.IO service will land here (e.g. `backend/server/`)
when features that must run server-side arrive: WhatsApp Business API webhooks,
Razorpay payment webhooks, and AI-assistant orchestration. The frontend already talks
to an `OrderStream` interface, so introducing it is additive.
