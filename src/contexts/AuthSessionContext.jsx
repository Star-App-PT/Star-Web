import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { supabase } from '../supabase'

const AuthSessionContext = createContext({ session: null, user: null })

export function AuthSessionProvider({ children }) {
  const [session, setSession] = useState(null)

  useEffect(() => {
    if (!supabase) return

    supabase.auth.getSession().then(({ data: { session: s } }) => {
      setSession(s ?? null)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s ?? null)
    })

    return () => subscription?.unsubscribe()
  }, [])

  const value = useMemo(() => ({ session, user: session?.user ?? null }), [session])

  return (
    <AuthSessionContext.Provider value={value}>
      {children}
    </AuthSessionContext.Provider>
  )
}

export function useAuthSession() {
  return useContext(AuthSessionContext)
}
