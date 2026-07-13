-- ============================================================================
-- M1 · 0004 · Realtime for the live order board (used by M5)
-- Adds `orders` to the supabase_realtime publication so INSERT/UPDATE events
-- stream to the dashboard. REPLICA IDENTITY FULL ensures UPDATE events carry the
-- full row. Realtime respects RLS, so anon never receives order events.
-- order_items are fetched on demand when a new order arrives (no stream needed).
-- ============================================================================

alter table public.orders replica identity full;

alter publication supabase_realtime add table public.orders;
