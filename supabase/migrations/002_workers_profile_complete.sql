-- Run after 001_worker_onboarding.sql in the Supabase SQL editor.
-- Adds workers.profile_complete (mirrored by the app on onboarding finish).
-- Package-like data lives in worker_service_packages (not a separate "packages" table name).

alter table public.workers add column if not exists profile_complete boolean default false;

update public.workers
set profile_complete = true
where coalesce(onboarding_complete, false) = true
  and coalesce(profile_complete, false) is distinct from true;

-- RLS from 001: workers_insert_own / workers_update_own with auth.uid() = id
-- If policies are missing, re-run the policy section from 001_worker_onboarding.sql.

comment on column public.workers.profile_complete is 'True when worker finished onboarding (packages step); distinct from auth user_metadata.profile_complete (legal/client signup).';
