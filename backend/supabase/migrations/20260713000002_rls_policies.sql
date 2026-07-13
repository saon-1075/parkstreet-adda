-- ============================================================================
-- M1 · 0002 · Row-Level Security
-- Anon: may READ available menu items; may place orders ONLY via the
-- place_order() RPC (0003), never by direct insert. Owner (authenticated):
-- full read/write on orders + menu.
-- ============================================================================

alter table public.menu_items  enable row level security;
alter table public.orders      enable row level security;
alter table public.order_items enable row level security;

-- ---- menu_items ------------------------------------------------------------
-- Customers see only available items; owner sees all.
create policy menu_public_read on public.menu_items
  for select to anon
  using (is_available = true);

create policy menu_owner_read on public.menu_items
  for select to authenticated
  using (true);

create policy menu_owner_write on public.menu_items
  for all to authenticated
  using (true) with check (true);

-- ---- orders ----------------------------------------------------------------
-- Only the owner can read/update. Customers never read others' orders, and do
-- not insert directly — inserts happen inside the security-definer RPC.
create policy orders_owner_read on public.orders
  for select to authenticated
  using (true);

create policy orders_owner_update on public.orders
  for update to authenticated
  using (true) with check (true);

-- ---- order_items -----------------------------------------------------------
-- Owner read only; writes happen inside the RPC (definer bypasses RLS).
create policy order_items_owner_read on public.order_items
  for select to authenticated
  using (true);

-- NOTE: single-tenant MVP → policies are "any authenticated user". A future
-- multi-tenant version swaps using(true) for a restaurant_id predicate.
