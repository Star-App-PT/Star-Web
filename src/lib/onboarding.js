import { supabase } from '../supabase'

/**
 * Whether the user has finished onboarding (client or worker).
 * 1) Row in `clients` — completed client signup
 * 2) Row in `workers` — completed worker profile (if table exists)
 * 3) Auth metadata fallbacks for worker-only state not mirrored in DB
 */
export async function hasCompletedOnboarding(user) {
  if (!supabase || !user?.id) return true

  const meta = user.user_metadata || {}

  const { data: client, error: clientErr } = await supabase
    .from('clients')
    .select('id')
    .eq('id', user.id)
    .maybeSingle()

  if (clientErr) {
    console.warn('[onboarding] clients check failed', clientErr)
    return true
  }
  if (client) return true

  const { data: worker, error: workerErr } = await supabase
    .from('workers')
    .select('onboarding_complete,profile_complete')
    .eq('id', user.id)
    .maybeSingle()

  if (
    !workerErr &&
    worker &&
    (worker.onboarding_complete === true || worker.profile_complete === true)
  ) {
    return true
  }

  if (meta.is_worker === true) return true
  if (meta.worker_profile_complete === true) return true
  if (Array.isArray(meta.worker_packages) && meta.worker_packages.length > 0) return true

  return false
}
