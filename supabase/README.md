# Supabase setup (worker onboarding)

1. In the Supabase SQL editor, run `migrations/001_worker_onboarding.sql`.
2. Ensure Storage bucket **`avatars`** exists and is **public** (same as client avatars). Worker files are stored under `workers/{user_id}/...`.
3. Add a storage policy allowing authenticated users to upload to `workers/{user_id}/**` if uploads are denied by default.

Without the `workers` and `worker_service_packages` tables, onboarding still updates **auth user_metadata** and redirects to `/dashboard/worker`, but the **public profile** (`/worker/{uuid}`) and dashboard DB-backed fields need the migration.
