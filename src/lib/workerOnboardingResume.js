import { normalizeGalleryUrls } from './workerSupabase'

export const WORKER_ONBOARDING_STEPS = [
  'choose_category',
  'service_area',
  'about',
  'profile_photos',
  'portfolio',
  'packages',
]

const VALID_CATEGORY = new Set(['cleaning', 'repairs', 'services'])

export function stepIndex(step) {
  const i = WORKER_ONBOARDING_STEPS.indexOf(step)
  return i === -1 ? 0 : i
}

export function pathForWorkerOnboardingStep(step, category) {
  if (step === 'choose_category') return '/worker/signup'
  const c = VALID_CATEGORY.has(category) ? category : 'cleaning'
  switch (step) {
    case 'about':
      return `/worker/about/${c}`
    case 'profile_photos':
      return `/worker/signup/${c}`
    case 'portfolio':
      return `/worker/portfolio/${c}`
    case 'packages':
      return `/worker/packages/${c}`
    case 'service_area':
    default:
      return `/worker/service-area/${c}`
  }
}

/** Best-effort step when onboarding_step column is null (older rows). */
export function inferWorkerOnboardingStep(user, row) {
  const m = user?.user_metadata || {}
  const cat = row?.category || m.worker_category
  if (!cat || !VALID_CATEGORY.has(cat)) return 'choose_category'

  const addr = row?.service_area_address || m.service_area_address
  if (!addr) return 'service_area'

  const hasAbout =
    (m.worker_notable && String(m.worker_notable).trim()) ||
    (row?.metadata_notable && String(row.metadata_notable).trim())
  if (!hasAbout) return 'about'

  /* OAuth avatars exist before this step; only metadata confirms the worker finished the photo UI. */
  const hasProfile = m.profile_photo_confirmed === true
  if (!hasProfile) return 'profile_photos'

  const gl = row?.gallery_urls ?? m.worker_gallery_urls
  if (normalizeGalleryUrls(gl).length < 1) return 'portfolio'

  return 'packages'
}
