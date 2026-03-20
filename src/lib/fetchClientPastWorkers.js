import { supabase } from '../supabase'

function formatServiceDate(iso, lang) {
  if (!iso) return '—'
  try {
    const d = new Date(iso)
    return d.toLocaleDateString(lang?.startsWith('pt') ? 'pt-PT' : lang?.startsWith('es') ? 'es' : 'en-US', {
      month: 'long',
      year: 'numeric',
    })
  } catch {
    return '—'
  }
}

/**
 * Maps a bookings row (shape may vary) to display card fields.
 */
export function mapBookingToHiredCard(row, t, lang) {
  const rel = row.workers
  const workerObj = rel && typeof rel === 'object' && !Array.isArray(rel) ? rel : Array.isArray(rel) ? rel[0] : null

  const name =
    workerObj?.name ||
    workerObj?.full_name ||
    row.worker_name ||
    row.workerName ||
    t('profileEdit.hiredWorkerFallbackName')

  const photoUrl =
    workerObj?.avatar_url ||
    workerObj?.profile_photo_url ||
    row.worker_photo_url ||
    row.worker_avatar_url ||
    null

  const service =
    row.service_type ||
    row.service_label ||
    row.service ||
    row.category ||
    t('home.categoryClean')

  let rating = '5.0'
  const r = row.rating ?? row.worker_rating ?? row.review_rating
  if (r != null && !Number.isNaN(Number(r))) rating = Number(r).toFixed(1)

  const dateRaw = row.completed_at || row.scheduled_at || row.service_date || row.created_at

  return {
    id: String(row.id ?? `${name}-${dateRaw}`),
    name,
    service,
    rating,
    date: formatServiceDate(dateRaw, lang),
    photoUrl,
  }
}

export async function fetchClientPastWorkers(clientId, t, lang) {
  if (!supabase || !clientId) return []

  const { data, error } = await supabase
    .from('bookings')
    .select('*')
    .eq('client_id', clientId)
    .order('created_at', { ascending: false })
    .limit(15)

  if (error || !data?.length) return []

  const cards = data.map((row) => mapBookingToHiredCard(row, t, lang)).filter(Boolean)
  const seen = new Set()
  return cards
    .filter((c) => {
      if (seen.has(c.id)) return false
      seen.add(c.id)
      return true
    })
    .slice(0, 6)
}
