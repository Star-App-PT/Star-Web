import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY || ''

/** OAuth and email redirect URL — must be https://starpros.app (no localhost). */
export const AUTH_REDIRECT_URL = 'https://starpros.app'

/** PKCE OAuth return URL — add this exact URL to Supabase Auth → Redirect URLs. */
export const AUTH_OAUTH_CALLBACK_URL = `${AUTH_REDIRECT_URL}/auth/callback`

export const supabase =
  supabaseUrl && supabaseKey
    ? createClient(supabaseUrl, supabaseKey, {
        auth: {
          detectSessionInUrl: true,
          flowType: 'pkce',
        },
      })
    : null
