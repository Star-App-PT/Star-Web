-- Resume worker onboarding after refresh (no localStorage). Safe to re-run.

alter table public.workers add column if not exists onboarding_step text;
alter table public.workers add column if not exists onboarding_packages_draft jsonb default '[]'::jsonb;

comment on column public.workers.onboarding_step is 'Last reached onboarding screen: service_area | about | profile_photos | portfolio | packages';
comment on column public.workers.onboarding_packages_draft is 'In-progress packages JSON before finalizeWorkerOnboarding';
