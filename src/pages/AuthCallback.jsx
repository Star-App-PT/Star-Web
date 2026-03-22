import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabase'
import './AuthCallback.css'

/**
 * PKCE OAuth return handler. Waits for the Supabase client to finish init (which
 * may already exchange ?code=), then exchanges manually only if still needed.
 */
export default function AuthCallback() {
  const navigate = useNavigate()

  useEffect(() => {
    let cancelled = false

    ;(async () => {
      if (!supabase) {
        navigate('/', { replace: true })
        return
      }

      // Ensures initializePromise runs (detectSessionInUrl may have exchanged already).
      await supabase.auth.getSession()

      if (cancelled) return

      const { data: { session: already } } = await supabase.auth.getSession()
      if (already?.user) {
        navigate('/', { replace: true })
        return
      }

      const params = new URLSearchParams(window.location.search)
      if (params.get('error')) {
        console.warn('[AuthCallback] OAuth error param', params.get('error'), params.get('error_description'))
        navigate('/', { replace: true })
        return
      }

      const code = params.get('code')
      if (!code) {
        navigate('/', { replace: true })
        return
      }

      const { error } = await supabase.auth.exchangeCodeForSession(code)
      if (cancelled) return

      if (error) {
        console.warn('[AuthCallback] exchangeCodeForSession', error.message, error)
        const { data: { session: recovered } } = await supabase.auth.getSession()
        if (!recovered?.user) {
          console.warn(
            '[AuthCallback] No session after exchange. Use the same site URL you started from (www vs non-www) and ensure this origin is in Supabase Redirect URLs:',
            window.location.origin
          )
        }
        navigate('/', { replace: true })
        return
      }

      navigate('/', { replace: true })
    })()

    return () => {
      cancelled = true
    }
  }, [navigate])

  return (
    <div className="auth-callback">
      <p className="auth-callback__text">Signing you in…</p>
    </div>
  )
}
