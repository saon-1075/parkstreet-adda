-- ============================================================================
-- M1 · 0001 · Schema: enums, tables, indexes, updated_at trigger
-- Money is stored as INTEGER PAISE everywhere (₹1 = 100 paise). Formatted to ₹
-- only at the display edge. Matches Razorpay's unit for the future prepaid upsell.
-- ============================================================================

-- gen_random_uuid() comes from pgcrypto, enabled by default on Supabase.

-- ---- Enums -----------------------------------------------------------------
create type public.order_status as enum
  ('placed', 'accepted', 'preparing', 'ready', 'done', 'cancelled');

create type public.payment_status as enum
  ('unpaid', 'paid', 'refunded');   -- 'unpaid' default; Razorpay-ready

-- ---- menu_items ------------------------------------------------------------
create table public.menu_items (
  id           uuid primary key default gen_random_uuid(),
  name         text        not null,
  description  text        not null default '',
  price_paise  integer     not null check (price_paise >= 0),
  category     text        not null,               -- grouped in UI, ordered via config
  image_url    text,                               -- Supabase Storage URL; null = placeholder
  is_available boolean     not null default true,
  sort_order   integer     not null default 0,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

-- ---- orders ----------------------------------------------------------------
create table public.orders (
  id             uuid primary key default gen_random_uuid(),
  short_code     text           not null unique,   -- e.g. 'A3F' — shown in WhatsApp + dashboard
  table_label    text,                             -- from ?table=; null = takeaway
  customer_name  text,
  note           text,
  status         public.order_status   not null default 'placed',
  payment_status public.payment_status not null default 'unpaid',
  total_paise    integer        not null check (total_paise >= 0),
  created_at     timestamptz    not null default now(),
  updated_at     timestamptz    not null default now()
);

-- ---- order_items (name/price SNAPSHOTTED at order time) ---------------------
create table public.order_items (
  id               uuid primary key default gen_random_uuid(),
  order_id         uuid not null references public.orders(id) on delete cascade,
  menu_item_id     uuid references public.menu_items(id) on delete set null, -- keep history
  item_name        text    not null,               -- snapshot
  item_price_paise integer not null,               -- snapshot
  quantity         integer not null check (quantity > 0),
  line_total_paise integer not null
);

-- ---- Indexes ---------------------------------------------------------------
create index orders_created_at_idx    on public.orders (created_at desc);
create index orders_status_idx        on public.orders (status);
create index order_items_order_id_idx on public.order_items (order_id);
create index menu_items_category_idx  on public.menu_items (category, sort_order);

-- ---- updated_at trigger ----------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger menu_items_set_updated_at
  before update on public.menu_items
  for each row execute function public.set_updated_at();

create trigger orders_set_updated_at
  before update on public.orders
  for each row execute function public.set_updated_at();
