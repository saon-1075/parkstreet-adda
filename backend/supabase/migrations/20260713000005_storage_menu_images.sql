-- ============================================================================
-- M8 · 0005 · Storage bucket for owner-uploaded menu photos
-- Public read (photos are shown on the customer menu); only the authenticated
-- owner can upload/replace/delete. The menu_items table RLS already allows
-- authenticated writes (0002), so no table change is needed.
-- ============================================================================

insert into storage.buckets (id, name, public)
values ('menu-images', 'menu-images', true)
on conflict (id) do nothing;

create policy "menu-images public read" on storage.objects
  for select to anon, authenticated
  using (bucket_id = 'menu-images');

create policy "menu-images owner insert" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'menu-images');

create policy "menu-images owner update" on storage.objects
  for update to authenticated
  using (bucket_id = 'menu-images');

create policy "menu-images owner delete" on storage.objects
  for delete to authenticated
  using (bucket_id = 'menu-images');
