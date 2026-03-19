import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY || ''

/** OAuth and email redirect URL — must be https://starsvs.com (no localhost). */
export const AUTH_REDIRECT_URL = 'https://starsvs.com'

export const supabase =
  supabaseUrl && supabaseKey
    ? createClient(supabaseUrl, supabaseKey)
    : null
