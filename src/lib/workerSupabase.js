import { supabase } from '../supabase'

/** Must match a public bucket; paths use workers/{userId}/… */
export const WORKER_STORAGE_BUCKET = 'avatars'

const CATEGORY_TO_SERVICE_KEY = {
  cleaning: 'home.categoryClean',
  repairs: 'home.categoryRepair',
  services: 'home.categoryServices',
}

export function isUuidWorkerId(id) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(String(id || ''))
}

export async function uploadWorkerAsset(userId, relativeKey, file) {
  if (!supabase || !file) return { publicUrl: null, error: null }
  const ext = (file.name.split('.').pop() || 'jpg').replace(/[^a-z0-9]/gi, '') || 'jpg'
  const path = `workers/${userId}/${relativeKey}-${Date.now()}.${ext}`
  const { error: upErr } = await supabase.storage.from(WORKER_STORAGE_BUCKET).upload(path, file, {
    upsert: false,
    contentType: file.type || 'image/jpeg',
  })
  if (upErr) {
    console.warn('[workerSupabase] storage upload', upErr)
    return { publicUrl: null, error: upErr }
  }
  const { data } = supabase.storage.from(WORKER_STORAGE_BUCKET).getPublicUrl(path)
  return { publicUrl: data?.publicUrl ?? null, error: null }
}

export async function upsertWorkerRow(row) {
  if (!supabase) return { error: new Error('no supabase') }
  const payload = {
    ...row,
    updated_at: new Date().toISOString(),
  }
  const { error } = await supabase.from('workers').upsert(payload, { onConflict: 'id' })
  if (error) {
    const msg = String(error.message || '')
    if (error.code === '42P01' || msg.includes('does not exist')) {
      return { error: null }
    }
    console.warn('[workerSupabase] workers upsert', error)
  }
  return { error: error && error.code !== '42P01' ? error : null }
}

export async function replaceWorkerServicePackages(workerId, packageRows) {
  if (!supabase) return { error: null }
  const { error: delErr } = await supabase.from('worker_service_packages').delete().eq('worker_id', workerId)
  if (delErr && delErr.code !== '42P01' && !String(delErr.message || '').includes('does not exist')) {
    console.warn('[workerSupabase] packages delete', delErr)
  }
  if (!packageRows.length) return { error: null }
  const { error } = await supabase.from('worker_service_packages').insert(packageRows)
  if (error && error.code !== '42P01') {
    console.warn('[workerSupabase] packages insert', error)
  }
  return { error: error && error.code !== '42P01' ? error : null }
}

export function buildWorkerRowFromMeta(user, categoryFromRoute, galleryUrlsOverride) {
  const m = user.user_metadata || {}
  const parts = [m.worker_notable, m.worker_training, m.worker_honours].filter((x) => String(x || '').trim())
  const bio = parts.join('\n\n').trim() || String(m.worker_bio || '').trim()
  const cat = m.worker_category || categoryFromRoute || 'cleaning'
  let gl = []
  if (Array.isArray(galleryUrlsOverride)) {
    gl = galleryUrlsOverride
  } else if (Array.isArray(m.worker_gallery_urls)) {
    gl = m.worker_gallery_urls
  }
  return {
    id: user.id,
    display_name: m.full_name || m.name || user.email?.split('@')[0] || 'Star professional',
    bio: bio || null,
    category: cat,
    specialty: m.worker_specialty || null,
    profile_photo_url: m.avatar_url || m.profile_photo_url || null,
    cover_photo_url: m.worker_cover_photo_url || null,
    service_area_address: m.service_area_address || null,
    service_area_lat: typeof m.service_area_lat === 'number' ? m.service_area_lat : null,
    service_area_lng: typeof m.service_area_lng === 'number' ? m.service_area_lng : null,
    service_area_drive_minutes:
      typeof m.service_area_drive_time === 'number' ? m.service_area_drive_time : null,
    gallery_urls: gl,
    years_experience: typeof m.worker_years === 'number' ? m.worker_years : null,
    metadata_notable: m.worker_notable || null,
    metadata_training: m.worker_training || null,
    metadata_honours: m.worker_honours || null,
    onboarding_complete: true,
  }
}

/**
 * @param {import('@supabase/supabase-js').User} user
 * @param {string} categoryFromRoute
 * @param {Array<{ title: string, price: string|number, duration: string, priceType: string, description: string, thumbFile?: File }>} pkgList
 */
export async function finalizeWorkerOnboarding(user, categoryFromRoute, pkgList) {
  if (!supabase || !user?.id) return { error: new Error('Not signed in') }

  const row = buildWorkerRowFromMeta(user, categoryFromRoute)
  await upsertWorkerRow(row)

  const pkgRows = []
  for (let i = 0; i < pkgList.length; i++) {
    const p = pkgList[i]
    if (!p.title?.trim() || p.price === '' || p.price == null) continue
    const priceNum = parseFloat(String(p.price))
    if (Number.isNaN(priceNum) || priceNum <= 0) continue
    let imageUrl = null
    if (p.thumbFile instanceof File) {
      const { publicUrl } = await uploadWorkerAsset(user.id, `package-${i}`, p.thumbFile)
      imageUrl = publicUrl
    }
    pkgRows.push({
      worker_id: user.id,
      title: p.title.trim(),
      description: (p.description || '').trim(),
      price: priceNum,
      duration: p.duration || null,
      price_type: p.priceType || 'visit',
      image_url: imageUrl,
      sort_order: i,
    })
  }

  await replaceWorkerServicePackages(user.id, pkgRows)

  const pkgMeta = pkgRows.map((r) => ({
    title: r.title,
    price: r.price,
    duration: r.duration,
    priceType: r.price_type,
    description: r.description,
  }))

  const { data: freshSession } = await supabase.auth.getSession()
  const meta = freshSession?.session?.user?.user_metadata || user.user_metadata || {}

  const { error: authErr } = await supabase.auth.updateUser({
    data: {
      ...meta,
      worker_packages: pkgMeta,
      is_worker: true,
      profile_complete: true,
    },
  })

  return { error: authErr }
}

function extractCity(address) {
  if (!address) return 'Porto'
  const parts = String(address).split(',')
  if (parts.length >= 2) return parts[parts.length - 2].trim() || parts[parts.length - 1].trim()
  return parts[0].trim() || 'Porto'
}

function normalizeGalleryUrls(raw) {
  if (Array.isArray(raw)) return raw.filter(Boolean)
  if (raw && typeof raw === 'string') {
    try {
      const p = JSON.parse(raw)
      return Array.isArray(p) ? p.filter(Boolean) : []
    } catch {
      return []
    }
  }
  return []
}

/**
 * @returns {Promise<object|null>} Worker view-model for WorkerDetail or null
 */
export async function fetchWorkerProfileForDisplay(workerId) {
  if (!supabase || !isUuidWorkerId(workerId)) return null

  const { data: w, error: wErr } = await supabase.from('workers').select('*').eq('id', workerId).maybeSingle()
  if (wErr || !w) return null

  const { data: pkgs } = await supabase
    .from('worker_service_packages')
    .select('*')
    .eq('worker_id', workerId)
    .order('sort_order', { ascending: true })

  const name = w.display_name || 'Professional'
  const list = pkgs || []
  const minPrice = list.length ? Math.min(...list.map((p) => Number(p.price))) : 0
  const hero = w.cover_photo_url || w.profile_photo_url || '/star-logo-blue.svg'
  const image = w.profile_photo_url || '/star-logo-blue.svg'
  const gallery = normalizeGalleryUrls(w.gallery_urls)
  const packages = list.map((p) => ({
    name: p.title,
    desc: p.description || '',
    price: Number(p.price),
    priceType: p.price_type || 'visit',
    duration: p.duration || '',
    imageUrl: p.image_url || null,
  }))

  return {
    id: w.id,
    name,
    specialty: w.specialty || w.category || 'Services',
    tagline: w.specialty || w.category || '',
    rating: null,
    hourlyRate: minPrice > 0 ? minPrice : 0,
    image,
    heroImage: hero,
    city: extractCity(w.service_area_address),
    lat: typeof w.service_area_lat === 'number' ? w.service_area_lat : 41.1579,
    lng: typeof w.service_area_lng === 'number' ? w.service_area_lng : -8.6291,
    bio: w.bio || '',
    packages,
    gallery: gallery.length ? gallery : [hero],
    qualifications: [],
    clientReviews: [],
    serviceLocation: w.service_area_address || null,
    serviceCategoryLabelKey: CATEGORY_TO_SERVICE_KEY[w.category] || 'home.categoryClean',
    isFromDirectory: false,
    memberSince: new Date().getFullYear().toString(),
    languages: [],
  }
}

/**
 * Dashboard: same DB read; returns raw row + packages for stats.
 */
export async function fetchWorkerDashboardPayload(workerId) {
  if (!supabase || !isUuidWorkerId(workerId)) return { workerRow: null, packages: [] }
  const { data: w } = await supabase.from('workers').select('*').eq('id', workerId).maybeSingle()
  const { data: pkgs } = await supabase
    .from('worker_service_packages')
    .select('*')
    .eq('worker_id', workerId)
    .order('sort_order', { ascending: true })
  return { workerRow: w, packages: pkgs || [] }
}
