import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabase'
import './AuthCallback.css'

/**
 * PKCE OAuth return handler: exchange ?code= for a session, then send the user home.
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

      const params = new URLSearchParams(window.location.search)
      if (params.get('error')) {
        navigate('/', { replace: true })
        return
      }

      const code = params.get('code')
      if (!code) {
        const { data: { session } } = await supabase.auth.getSession()
        if (!cancelled && session) {
          navigate('/', { replace: true })
          return
        }
        if (!cancelled) navigate('/', { replace: true })
        return
      }

      const { error } = await supabase.auth.exchangeCodeForSession(code)
      if (cancelled) return
      if (error) {
        const { data: { session: recovered } } = await supabase.auth.getSession()
        if (recovered) {
          navigate('/', { replace: true })
          return
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
