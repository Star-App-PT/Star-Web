-- Run in Supabase SQL editor (or via CLI). Adjust RLS for your product rules.
-- Storage: use existing public bucket `avatars` with folder `workers/{user_id}/...` OR create `worker-media` and update WORKER_STORAGE_BUCKET in src/lib/workerSupabase.js

create table if not exists public.workers (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text,
  bio text,
  category text,
  specialty text,
  profile_photo_url text,
  cover_photo_url text,
  service_area_address text,
  service_area_lat double precision,
  service_area_lng double precision,
  service_area_drive_minutes int,
  gallery_urls jsonb default '[]'::jsonb,
  years_experience int,
  metadata_notable text,
  metadata_training text,
  metadata_honours text,
  onboarding_complete boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.worker_service_packages (
  id uuid primary key default gen_random_uuid(),
  worker_id uuid not null references public.workers (id) on delete cascade,
  title text not null,
  description text,
  price numeric not null,
  duration text,
  price_type text,
  image_url text,
  sort_order int default 0,
  created_at timestamptz default now()
);

create index if not exists idx_worker_service_packages_worker_id on public.worker_service_packages (worker_id);

alter table public.workers enable row level security;
alter table public.worker_service_packages enable row level security;

create policy "workers_select_public_or_own" on public.workers
  for select using (true);

create policy "workers_insert_own" on public.workers
  for insert with check (auth.uid() = id);

create policy "workers_update_own" on public.workers
  for update using (auth.uid() = id);

create policy "worker_packages_select_public_or_own" on public.worker_service_packages
  for select using (true);

create policy "worker_packages_insert_own" on public.worker_service_packages
  for insert with check (worker_id = auth.uid());

create policy "worker_packages_update_own" on public.worker_service_packages
  for update using (worker_id = auth.uid());

create policy "worker_packages_delete_own" on public.worker_service_packages
  for delete using (worker_id = auth.uid());
