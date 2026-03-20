import { useEffect, useMemo, useState } from 'react'
import { supabase } from '../supabase'
import { hasWorkerProfileFromMetadata } from '../lib/clientWorkerMode'

/**
 * Client profile = row in `clients` (post client signup).
 * Worker profile = auth metadata (see hasWorkerProfileFromMetadata).
 */
export function useDualProfile(user) {
  const [hasClientProfile, setHasClientProfile] = useState(false)
  const [loading, setLoading] = useState(!!user?.id)

  const hasWorkerProfile = useMemo(
    () => hasWorkerProfileFromMetadata(user?.user_metadata),
    [user?.user_metadata],
  )

  useEffect(() => {
    if (!user?.id || !supabase) {
      setHasClientProfile(false)
      setLoading(false)
      return
    }

    let cancelled = false
    setLoading(true)

    supabase
      .from('clients')
      .select('id')
      .eq('id', user.id)
      .maybeSingle()
      .then(({ data, error }) => {
        if (cancelled) return
        if (error) {
          setHasClientProfile(false)
        } else {
          setHasClientProfile(!!data)
        }
        setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [user?.id])

  const hasBothProfiles = hasClientProfile && hasWorkerProfile

  return {
    loading,
    hasClientProfile,
    hasWorkerProfile,
    hasBothProfiles,
  }
}
