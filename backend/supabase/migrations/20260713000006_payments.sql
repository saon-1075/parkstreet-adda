-- ============================================================================
-- Payments · 0006 · Let place_order() record an online payment.
-- Adds orders.payment_ref and extends the RPC to accept an optional
-- "payment_ref" in the payload: when present, the order is created as PAID.
-- The WhatsApp flow omits it and orders stay 'unpaid' as before.
--
-- NOTE (production): this MVP marks paid from the client Razorpay callback with
-- only the publishable key_id. For real money, add a Supabase Edge Function to
-- create the Razorpay order + verify the payment signature with the SECRET key
-- before trusting 'paid'. Test keys / demo are fine as-is.
-- ============================================================================

alter table public.orders add column if not exists payment_ref text;

create or replace function public.place_order(payload jsonb)
returns table (id uuid, short_code text)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_order_id   uuid;
  v_code       text := upper(substr(md5(gen_random_uuid()::text), 1, 4));
  v_total      integer := 0;
  v_payment    text := nullif(payload->>'payment_ref', '');
  it           jsonb;
  m            public.menu_items%rowtype;
  qty          integer;
begin
  if payload->'items' is null
     or jsonb_typeof(payload->'items') <> 'array'
     or jsonb_array_length(payload->'items') = 0 then
    raise exception 'Order must contain at least one item';
  end if;

  insert into public.orders
    (short_code, table_label, customer_name, note, total_paise, payment_ref, payment_status)
  values (
    v_code,
    nullif(payload->>'table_label', ''),
    nullif(payload->>'customer_name', ''),
    nullif(payload->>'note', ''),
    0,
    v_payment,
    case when v_payment is not null then 'paid'::public.payment_status
         else 'unpaid'::public.payment_status end
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
    values (v_order_id, m.id, m.name, m.price_paise, qty, m.price_paise * qty);
    v_total := v_total + m.price_paise * qty;
  end loop;

  update public.orders set total_paise = v_total where orders.id = v_order_id;
  return query select v_order_id, v_code;
end;
$$;

grant execute on function public.place_order(jsonb) to anon, authenticated;
