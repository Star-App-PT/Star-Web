/** @typedef {'client' | 'worker'} AppMode */

export const APP_MODE_STORAGE_KEY = 'star_active_mode'

/**
 * Worker profile = completed worker onboarding (metadata mirrors onboarding.js).
 * @param {import('@supabase/supabase-js').User['user_metadata'] | null | undefined} meta
 */
export function hasWorkerProfileFromMetadata(meta) {
  if (!meta || typeof meta !== 'object') return false
  // Do not use profile_complete — FinishProfile sets that for legal/client signup, not worker onboarding.
  if (meta.is_worker === true) return true
  if (meta.worker_profile_complete === true) return true
  if (Array.isArray(meta.worker_packages) && meta.worker_packages.length > 0) return true
  return false
}

/** @returns {AppMode} */
export function readStoredAppMode() {
  try {
    const v = sessionStorage.getItem(APP_MODE_STORAGE_KEY)
    if (v === 'worker' || v === 'client') return v
  } catch {
    /* ignore */
  }
  return 'client'
}

/** @param {AppMode} mode */
export function writeStoredAppMode(mode) {
  try {
    sessionStorage.setItem(APP_MODE_STORAGE_KEY, mode)
  } catch {
    /* ignore */
  }
}

/**
 * Map stored worker_category to home.* translation keys.
 * @param {string | undefined} raw
 */
export function workerCategoryToLabelKey(raw) {
  const c = String(raw || '').toLowerCase()
  if (c === 'cleaning') return 'home.categoryClean'
  if (c === 'repairs') return 'home.categoryRepair'
  if (c === 'services') return 'home.categoryServices'
  return null
}
