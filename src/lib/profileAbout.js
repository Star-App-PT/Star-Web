import { supabase } from '../supabase'

/** Keys match optional `profiles` table columns and `user_metadata.profile_about` object. */
export const ABOUT_FIELD_KEYS = [
  'school',
  'dream_destination',
  'work',
  'pets',
  'birth_decade',
  'fav_song_childhood',
  'hobbies',
  'useless_skill',
  'fun_fact',
  'languages',
]

/** i18n keys for Profile / ProfileEdit labels */
export const ABOUT_FIELD_LABEL_KEYS = {
  school: 'profileEdit.school',
  dream_destination: 'profileEdit.dreamDestination',
  work: 'profileEdit.work',
  pets: 'profileEdit.pets',
  birth_decade: 'profileEdit.birthDecade',
  fav_song_childhood: 'profileEdit.favSong',
  hobbies: 'profileEdit.hobbies',
  useless_skill: 'profileEdit.uselessSkill',
  fun_fact: 'profileEdit.funFact',
  languages: 'profileEdit.languages',
}

export function emptyAboutFields() {
  return Object.fromEntries(ABOUT_FIELD_KEYS.map((k) => [k, '']))
}

export function getAboutFromUserMeta(user) {
  const raw = user?.user_metadata?.profile_about
  if (raw && typeof raw === 'object' && !Array.isArray(raw)) {
    const out = emptyAboutFields()
    for (const k of ABOUT_FIELD_KEYS) {
      if (raw[k] != null) out[k] = String(raw[k])
    }
    return out
  }
  return emptyAboutFields()
}

export async function fetchProfileAbout(user) {
  const merged = { ...emptyAboutFields(), ...getAboutFromUserMeta(user) }
  if (!supabase || !user?.id) return { fields: merged, source: 'meta' }

  const { data, error } = await supabase
    .from('profiles')
    .select(ABOUT_FIELD_KEYS.join(','))
    .eq('id', user.id)
    .maybeSingle()

  if (!error && data) {
    for (const k of ABOUT_FIELD_KEYS) {
      if (data[k] != null) merged[k] = String(data[k])
    }
  }

  return { fields: merged, source: error ? 'meta' : 'db' }
}

export async function persistProfileAbout(user, fields) {
  if (!supabase || !user?.id) return { error: new Error('Not signed in') }

  const profile_about = { ...getAboutFromUserMeta(user) }
  for (const k of ABOUT_FIELD_KEYS) {
    profile_about[k] = fields[k] ?? ''
  }

  const { error: metaErr } = await supabase.auth.updateUser({
    data: {
      ...user.user_metadata,
      profile_about,
    },
  })
  if (metaErr) return { error: metaErr }

  const row = { id: user.id, updated_at: new Date().toISOString() }
  for (const k of ABOUT_FIELD_KEYS) {
    row[k] = fields[k] ?? ''
  }

  const { error: dbErr } = await supabase.from('profiles').upsert(row, { onConflict: 'id' })
  if (dbErr) {
    const msg = String(dbErr.message || '')
    if (!msg.includes('does not exist') && dbErr.code !== '42P01') {
      console.warn('[profileAbout] profiles upsert failed', dbErr)
    }
  }

  return { error: null }
}

export async function uploadProfileAvatar(userId, file) {
  if (!supabase || !file) return { publicUrl: null, error: null }
  const ext = (file.name.split('.').pop() || 'jpg').replace(/[^a-z0-9]/gi, '') || 'jpg'
  const path = `${userId}/avatar-${Date.now()}.${ext}`
  const { error: upErr } = await supabase.storage.from('avatars').upload(path, file, {
    upsert: true,
    contentType: file.type || 'image/jpeg',
  })
  if (upErr) return { publicUrl: null, error: upErr }
  const { data } = supabase.storage.from('avatars').getPublicUrl(path)
  return { publicUrl: data?.publicUrl ?? null, error: null }
}
