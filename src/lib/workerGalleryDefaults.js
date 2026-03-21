/**
 * Default portfolio URLs (bundled assets) when the worker skips the gallery step.
 * Vite resolves these to hashed URLs in production.
 */
import cleaner1 from '../assets/workers/cleaners/cleaner-1.jpg'
import cleaner2 from '../assets/workers/cleaners/cleaner-2.jpg'
import cleaner3 from '../assets/workers/cleaners/cleaner-3.jpg'
import handyman1 from '../assets/workers/handymen/handyman-1.jpg'
import handyman2 from '../assets/workers/handymen/handyman-2.jpg'
import handyman3 from '../assets/workers/handymen/handyman-3.jpg'
import photographer from '../assets/workers/services/photographer.jpg'
import massage from '../assets/workers/services/massage-therapist.jpg'
import trainer from '../assets/workers/services/personal-trainer.jpg'
import chef from '../assets/workers/services/chef.jpg'
import babysitter from '../assets/workers/services/babysitter.jpg'

const CLEANING_DEFAULTS = [cleaner1, cleaner2, cleaner3]
const REPAIRS_DEFAULTS = [handyman1, handyman2, handyman3]
const SERVICES_DEFAULTS = [photographer, massage, trainer, chef, babysitter]

/**
 * @param {string} category cleaning | repairs | services
 * @param {string} [specialtyHint] optional metadata worker_specialty (lowercase match)
 */
export function getDefaultGalleryUrlsForCategory(category, specialtyHint) {
  const c = String(category || 'cleaning').toLowerCase()
  if (c === 'repairs') return [...REPAIRS_DEFAULTS]
  if (c === 'services') {
    const h = String(specialtyHint || '').toLowerCase()
    if (h.includes('photo')) return [photographer, massage, trainer]
    if (h.includes('massage') || h.includes('wellness')) return [massage, photographer, trainer]
    if (h.includes('fit') || h.includes('train')) return [trainer, photographer, massage]
    if (h.includes('chef') || h.includes('cook')) return [chef, babysitter, photographer]
    if (h.includes('baby') || h.includes('child')) return [babysitter, chef, photographer]
    return [...SERVICES_DEFAULTS].slice(0, 5)
  }
  return [...CLEANING_DEFAULTS]
}
