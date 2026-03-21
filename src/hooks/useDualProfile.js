import { useEffect, useMemo, useState } from 'react'
import { supabase } from '../supabase'
import { hasWorkerProfileFromMetadata } from '../lib/clientWorkerMode'

/**
 * Client profile = row in `clients` (post client signup).
 * Worker profile (for nav / mode switching) = completed worker:
 * - auth metadata: is_worker, worker_packages, worker_profile_complete, OR
 * - workers row with onboarding_complete true (set when packages step finishes).
 *
 * Draft workers rows (persistWorkerRowDraft before packages finish) must NOT hide "Become a Star".
 */
export function useDualProfile(user) {
  const [hasClientProfile, setHasClientProfile] = useState(false)
  const [hasCompletedWorkerInDb, setHasCompletedWorkerInDb] = useState(false)
  const [loading, setLoading] = useState(!!user?.id)

  const hasWorkerFromMeta = useMemo(
    () => hasWorkerProfileFromMetadata(user?.user_metadata),
    [user?.user_metadata],
  )

  const hasWorkerProfile = hasWorkerFromMeta || hasCompletedWorkerInDb

  useEffect(() => {
    if (!user?.id || !supabase) {
      setHasClientProfile(false)
      setHasCompletedWorkerInDb(false)
      setLoading(false)
      return
    }

    let cancelled = false
    setLoading(true)

    Promise.all([
      supabase.from('clients').select('id').eq('id', user.id).maybeSingle(),
      supabase.from('workers').select('onboarding_complete').eq('id', user.id).maybeSingle(),
    ])
      .then(([clientRes, workerRes]) => {
        if (cancelled) return
        if (clientRes.error) {
          setHasClientProfile(false)
        } else {
          setHasClientProfile(!!clientRes.data)
        }
        if (workerRes.error) {
          setHasCompletedWorkerInDb(false)
        } else {
          const row = workerRes.data
          setHasCompletedWorkerInDb(!!row && row.onboarding_complete === true)
        }
        setLoading(false)
      })
      .catch((err) => {
        console.warn('[useDualProfile] profile fetch failed', err)
        if (!cancelled) {
          setHasClientProfile(false)
          setHasCompletedWorkerInDb(false)
          setLoading(false)
        }
      })

    return () => {
      cancelled = true
    }
  }, [user?.id, user?.last_sign_in_at])

  const hasBothProfiles = hasClientProfile && hasWorkerProfile

  return {
    loading,
    hasClientProfile,
    hasWorkerProfile,
    hasBothProfiles,
  }
}
