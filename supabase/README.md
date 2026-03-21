# Supabase setup (worker onboarding)

1. In the Supabase SQL editor, run `migrations/001_worker_onboarding.sql` (creates `workers`, `worker_service_packages`, RLS).
2. Run `migrations/002_workers_profile_complete.sql` if you use `profile_complete`.
3. Run `migrations/003_workers_schema_columns.sql` to add any missing `workers` columns (`bio`, `subcategory`, `location`, service area fields, photos, `gallery_urls`, flags, `created_at`). Safe to re-run; uses `IF NOT EXISTS`.  
   After running **003**, refresh the API schema cache: **Project Settings → API → Reload schema** (or wait a short time). This clears errors like *Could not find the 'bio' column of 'workers' in the schema cache*.
4. Run `migrations/004_worker_onboarding_resume.sql` for `onboarding_step` and `onboarding_packages_draft` (resume onboarding after refresh).
5. Ensure Storage bucket **`avatars`** exists and is **public** (same as client avatars). Worker files are stored under `workers/{user_id}/...`.
6. Add a storage policy allowing authenticated users to upload to `workers/{user_id}/**` if uploads are denied by default.

Without the `workers` and `worker_service_packages` tables, onboarding still updates **auth user_metadata** and redirects to `/dashboard/worker`, but the **public profile** (`/worker/{uuid}`) and dashboard DB-backed fields need the migration.
