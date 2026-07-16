-- ============================================================================
-- M1 · Seed · Park Street Adda (fictional Kolkata cafe)
-- Run AFTER the migrations. Idempotent-ish: truncates first so re-seeding is safe.
-- Prices are in PAISE (₹1 = 100 paise). image_url points at the static photos in
-- frontend/public/menu/<slug>.webp (served by the app); a missing file falls back
-- to the placeholder icon in the UI. Keep these paths in sync with the photos.
-- ============================================================================

truncate table public.order_items, public.orders restart identity cascade;
truncate table public.menu_items restart identity cascade;

-- ---- Menu (20 items across the config categories) --------------------------
insert into public.menu_items (name, description, price_paise, category, image_url, sort_order) values
  -- Chai & Coffee
  ('Bhaar-er Cha',              'Cutting chai served in a traditional clay cup',        3000,  'Chai & Coffee', '/menu/bhaar-er-cha.webp', 1),
  ('Elaichi Malai Chai',       'Slow-boiled cardamom milk tea',                        5000,  'Chai & Coffee', '/menu/elaichi-malai-chai.webp', 2),
  ('Cold Coffee with Ice Cream','Thick cold coffee topped with vanilla',               12000, 'Chai & Coffee', '/menu/cold-coffee.webp', 3),
  -- Breakfast
  ('Kochuri & Aloor Dom',      'Flaky kochuri with Kolkata-style spiced potato curry', 9000,  'Breakfast', '/menu/kochuri-aloor-dom.webp', 1),
  ('Ghugni Chaat',             'Yellow peas with onion, coriander and lime',           7000,  'Breakfast', '/menu/ghugni-chaat.webp', 2),
  ('Butter Toast & Omelette',  'Buttered toast with a fluffy masala omelette',         8000,  'Breakfast', '/menu/butter-toast-omelette.webp', 3),
  -- Snacks
  ('Beguni',                   'Batter-fried eggplant fritters',                       5000,  'Snacks', '/menu/beguni.webp', 1),
  ('Mughlai Paratha',          'Egg-and-keema stuffed fried paratha',                  15000, 'Snacks', '/menu/mughlai-paratha.webp', 2),
  ('Fish Fry (Bhetki)',        'Bengali-style crumb-fried bhetki fillet',              18000, 'Snacks', '/menu/fish-fry-bhetki.webp', 3),
  -- Rolls & Kathi
  ('Kosha Mangsho Kathi Roll', 'Slow-cooked spicy mutton in a flaky paratha',          18000, 'Rolls & Kathi', '/menu/kosha-mangsho-roll.webp', 1),
  ('Chicken Egg Roll',         'Classic Kolkata chicken kathi roll with egg',          12000, 'Rolls & Kathi', '/menu/chicken-egg-roll.webp', 2),
  ('Paneer Roll',              'Spiced paneer with onions and green chutney',           11000, 'Rolls & Kathi', '/menu/paneer-roll.webp', 3),
  ('Double Egg Chicken Roll',  'Double egg, double chicken, single happiness',         15000, 'Rolls & Kathi', '/menu/double-egg-chicken-roll.webp', 4),
  -- Mains
  ('Kosha Mangsho with Luchi', 'Rich slow-cooked mutton with puffed luchi',            26000, 'Mains', '/menu/kosha-mangsho-luchi.webp', 1),
  ('Chicken Kasha with Rice',  'Bengali dry chicken curry with steamed rice',          22000, 'Mains', '/menu/chicken-kasha-rice.webp', 2),
  ('Shorshe Bhetki with Rice', 'Bhetki in mustard gravy with steamed rice',            28000, 'Mains', '/menu/shorshe-bhetki-rice.webp', 3),
  -- Desserts
  ('Nolen Gur Rosogolla (2 pc)','Date-palm jaggery rosogolla',                         8000,  'Desserts', '/menu/nolen-gur-rosogolla.webp', 1),
  ('Mishti Doi',               'Caramelised sweet yogurt in an earthen pot',           6000,  'Desserts', '/menu/mishti-doi.webp', 2),
  -- Beverages
  ('Aam Pora Shorbot',         'Smoked raw-mango summer cooler',                       7000,  'Beverages', '/menu/aam-pora-shorbot.webp', 1),
  ('Gondhoraj Ghol',           'Lime-leaf spiced buttermilk',                          6000,  'Beverages', '/menu/gondhoraj-ghol.webp', 2);

-- ---- Sample orders (mixed statuses so the dashboard looks alive) ------------
-- Each block inserts an order + its items (price snapshotted from menu_items),
-- then sets the order total from the line totals.

do $$
declare v_order uuid; v_total integer;
begin
  insert into public.orders (short_code, table_label, customer_name, note, status, created_at)
  values ('A3F', '5', 'Riya', 'less spicy', 'preparing', now() - interval '4 minutes')
  returning id into v_order;

  insert into public.order_items (order_id, menu_item_id, item_name, item_price_paise, quantity, line_total_paise)
  select v_order, m.id, m.name, m.price_paise, q.qty, m.price_paise * q.qty
  from (values ('Kosha Mangsho Kathi Roll', 2), ('Bhaar-er Cha', 1)) as q(name, qty)
  join public.menu_items m on m.name = q.name;

  select coalesce(sum(line_total_paise), 0) into v_total from public.order_items where order_id = v_order;
  update public.orders set total_paise = v_total where id = v_order;
end $$;

do $$
declare v_order uuid; v_total integer;
begin
  insert into public.orders (short_code, table_label, customer_name, note, status, created_at)
  values ('B7K', null, null, null, 'placed', now() - interval '90 seconds')
  returning id into v_order;

  insert into public.order_items (order_id, menu_item_id, item_name, item_price_paise, quantity, line_total_paise)
  select v_order, m.id, m.name, m.price_paise, q.qty, m.price_paise * q.qty
  from (values ('Mughlai Paratha', 1), ('Cold Coffee with Ice Cream', 1)) as q(name, qty)
  join public.menu_items m on m.name = q.name;

  select coalesce(sum(line_total_paise), 0) into v_total from public.order_items where order_id = v_order;
  update public.orders set total_paise = v_total where id = v_order;
end $$;

do $$
declare v_order uuid; v_total integer;
begin
  insert into public.orders (short_code, table_label, customer_name, note, status, created_at)
  values ('C2M', '2', 'Arjun', null, 'ready', now() - interval '11 minutes')
  returning id into v_order;

  insert into public.order_items (order_id, menu_item_id, item_name, item_price_paise, quantity, line_total_paise)
  select v_order, m.id, m.name, m.price_paise, q.qty, m.price_paise * q.qty
  from (values ('Chicken Kasha with Rice', 1), ('Gondhoraj Ghol', 2)) as q(name, qty)
  join public.menu_items m on m.name = q.name;

  select coalesce(sum(line_total_paise), 0) into v_total from public.order_items where order_id = v_order;
  update public.orders set total_paise = v_total where id = v_order;
end $$;

do $$
declare v_order uuid; v_total integer;
begin
  insert into public.orders (short_code, table_label, customer_name, note, status, created_at)
  values ('D9P', '8', null, null, 'done', now() - interval '38 minutes')
  returning id into v_order;

  insert into public.order_items (order_id, menu_item_id, item_name, item_price_paise, quantity, line_total_paise)
  select v_order, m.id, m.name, m.price_paise, q.qty, m.price_paise * q.qty
  from (values ('Fish Fry (Bhetki)', 1), ('Nolen Gur Rosogolla (2 pc)', 1)) as q(name, qty)
  join public.menu_items m on m.name = q.name;

  select coalesce(sum(line_total_paise), 0) into v_total from public.order_items where order_id = v_order;
  update public.orders set total_paise = v_total where id = v_order;
end $$;
