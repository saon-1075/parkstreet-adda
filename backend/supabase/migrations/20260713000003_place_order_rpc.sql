-- ============================================================================
-- M1 · 0003 · place_order() RPC  (the MVP's one piece of trusted backend logic)
--
-- The client sends only { table_label, customer_name, note, items:[{menu_item_id,
-- quantity}] }. The function IGNORES any client-sent prices: it re-reads each
-- item's current price from menu_items, rejects unavailable/unknown items,
-- computes line + grand totals, generates a short_code, and inserts the order +
-- items atomically. Prevents price tampering and half-inserted orders.
--
-- Payload example:
--   {
--     "table_label": "5",
--     "customer_name": "Riya",
--     "note": "less spicy",
--     "items": [
--       { "menu_item_id": "…uuid…", "quantity": 2 },
--       { "menu_item_id": "…uuid…", "quantity": 1 }
--     ]
--   }
-- ============================================================================

create or replace function public.place_order(payload jsonb)
returns table (id uuid, short_code text)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_order_id uuid;
  v_code     text := upper(substr(md5(gen_random_uuid()::text), 1, 4));
  v_total    integer := 0;
  it         jsonb;
  m          public.menu_items%rowtype;
  qty        integer;
begin
  if payload->'items' is null
     or jsonb_typeof(payload->'items') <> 'array'
     or jsonb_array_length(payload->'items') = 0 then
    raise exception 'Order must contain at least one item';
  end if;

  insert into public.orders (short_code, table_label, customer_name, note, total_paise)
  values (
    v_code,
    nullif(payload->>'table_label', ''),
    nullif(payload->>'customer_name', ''),
    nullif(payload->>'note', ''),
    0
  )
  returning orders.id into v_order_id;

  for it in select * from jsonb_array_elements(payload->'items')
  loop
    qty := greatest(coalesce((it->>'quantity')::int, 0), 1);

    select * into m
      from public.menu_items
     where menu_items.id = (it->>'menu_item_id')::uuid
       and is_available = true;

    if not found then
      raise exception 'Item unavailable or not found: %', it->>'menu_item_id';
    end if;

    insert into public.order_items
      (order_id, menu_item_id, item_name, item_price_paise, quantity, line_total_paise)
    values
      (v_order_id, m.id, m.name, m.price_paise, qty, m.price_paise * qty);

    v_total := v_total + m.price_paise * qty;
  end loop;

  update public.orders set total_paise = v_total where orders.id = v_order_id;

  return query select v_order_id, v_code;
end;
$$;

-- Customers (anon) and owner (authenticated) may call it. The function body runs
-- as its owner (definer), so it can insert past RLS while the caller cannot.
grant execute on function public.place_order(jsonb) to anon, authenticated;
