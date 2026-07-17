-- ============================================================================
-- Reset the demo between prospects.
-- Clears every order placed during a demo but KEEPS the menu intact.
-- Run in the Supabase SQL Editor.
-- ============================================================================

truncate table public.order_items, public.orders restart identity cascade;

-- Optional: also restore the 4 sample orders so a fresh dashboard looks alive.
-- Uncomment the line below to re-run the sample-order blocks from the seed.
-- (Copy the "Sample orders" section of seed.sql here, or just re-run seed.sql
--  if you also want to reset the menu to the Park Street Adda defaults.)
