-- Run once on a fresh Supabase project, AFTER the Drizzle migrations create the tables.
-- (Applied to aosbhowyndetvgiikftl on 2026-11-04 via the Supabase MCP.)
-- These are the Supabase-side pieces Drizzle migrations don't cover.

-- 1. Mirror every new auth user into public.users (collaborator search + Liveblocks auth read it)
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.users (id, email, full_name, avatar_url)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url')
  on conflict (id) do nothing;
  return new;
end $$;
-- trigger-only; don't expose it as /rest/v1/rpc/handle_new_user
revoke execute on function public.handle_new_user() from public, anon, authenticated;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- 2. Public buckets: file banners (Header) and workspace logos (DashboardSetup / settings)
insert into storage.buckets (id, name, public) values
  ('banners', 'banners', true),
  ('workspace-logos', 'workspace-logos', true)
on conflict (id) do nothing;

create policy "app buckets: authenticated upload" on storage.objects
  for insert to authenticated with check (bucket_id in ('banners', 'workspace-logos'));
create policy "app buckets: authenticated update" on storage.objects
  for update to authenticated using (bucket_id in ('banners', 'workspace-logos'));
-- upload({ upsert: true }) also needs select
create policy "app buckets: authenticated select" on storage.objects
  for select to authenticated using (bucket_id in ('banners', 'workspace-logos'));

-- deleting an auth user removes their profile (and cascades to their collaborators/tags)
alter table public.users
  add constraint users_id_auth_fk foreign key (id) references auth.users(id) on delete cascade;

-- 3. Lock the public REST API. All table access goes through Drizzle server actions
--    (postgres role, bypasses RLS), so no policies are needed and the anon key can't touch data.
do $$
declare t text;
begin
  for t in select tablename from pg_tables where schemaname = 'public' loop
    execute format('alter table public.%I enable row level security', t);
  end loop;
end $$;

-- 4. Tags are per user (migrations/0001 made the name globally unique)
alter table public.tags drop constraint if exists tags_name_unique;
alter table public.tags add constraint tags_created_by_name_unique unique (created_by, name);
alter table public.tags drop constraint if exists tags_created_by_users_id_fk;
alter table public.tags add constraint tags_created_by_users_id_fk
  foreign key (created_by) references public.users(id) on delete cascade;

-- 5. One membership row per user per workspace
alter table public.collaborators
  add constraint collaborators_workspace_user_unique unique (workspace_id, user_id);
