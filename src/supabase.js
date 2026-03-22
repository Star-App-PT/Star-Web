import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY || ''

/**
 * Production site URL when `window` is unavailable.
 * PKCE stores the code verifier in localStorage, which is per-origin — OAuth
 * redirect URLs must use the same origin the user had when starting sign-in
 * (e.g. www vs non-www).
 */
export const AUTH_REDIRECT_URL = 'https://starpros.app'

/** Same as AUTH_REDIRECT_URL; use getAuthSiteOrigin() in browser OAuth/email handlers. */
export const AUTH_SITE_URL_DEFAULT = AUTH_REDIRECT_URL

export function getAuthSiteOrigin() {
  if (typeof window !== 'undefined' && window.location?.origin) {
    return window.location.origin.replace(/\/$/, '')
  }
  return AUTH_SITE_URL_DEFAULT
}

export function getAuthOAuthCallbackUrl() {
  return `${getAuthSiteOrigin()}/auth/callback`
}

export const supabase =
  supabaseUrl && supabaseKey
    ? createClient(supabaseUrl, supabaseKey, {
        auth: {
          detectSessionInUrl: true,
          flowType: 'pkce',
        },
      })
    : null
