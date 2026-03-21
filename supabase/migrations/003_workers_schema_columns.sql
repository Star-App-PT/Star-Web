-- Run in Supabase SQL Editor (Dashboard) or: supabase db push / migration apply.
-- Fixes PostgREST errors like: Could not find the 'bio' column of 'workers' in the schema cache.
-- Safe to re-run: every statement uses IF NOT EXISTS.
--
-- After applying: Dashboard → Project Settings → API → "Reload schema" (or wait ~1 min for cache refresh).

alter table public.workers add column if not exists bio text;
alter table public.workers add column if not exists subcategory text;
alter table public.workers add column if not exists location text;
alter table public.workers add column if not exists service_area_lat numeric;
alter table public.workers add column if not exists service_area_lng numeric;
alter table public.workers add column if not exists service_area_radius_km numeric;
alter table public.workers add column if not exists cover_photo_url text;
alter table public.workers add column if not exists profile_photo_url text;
alter table public.workers add column if not exists gallery_urls text[] default '{}'::text[];
alter table public.workers add column if not exists onboarding_complete boolean default false;
alter table public.workers add column if not exists is_active boolean default true;
alter table public.workers add column if not exists created_at timestamptz default now();

-- Existing rows: ensure booleans are non-null where columns were just added (PG 11+ fills default on ADD COLUMN).
update public.workers set is_active = true where is_active is null;
update public.workers set onboarding_complete = false where onboarding_complete is null;

comment on column public.workers.subcategory is 'Optional finer classification under category.';
comment on column public.workers.location is 'Display or search location string (optional).';
comment on column public.workers.service_area_radius_km is 'Optional service radius in km (map-based area).';
