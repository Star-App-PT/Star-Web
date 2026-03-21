import { useEffect, useMemo, useState } from 'react'
import { supabase } from '../supabase'
import { hasWorkerProfileFromMetadata } from '../lib/clientWorkerMode'

/**
 * Client profile = row in `clients` (post client signup).
 * Worker profile = workers row for auth user id, and/or auth metadata (is_worker, worker_packages).
 */
export function useDualProfile(user) {
  const [hasClientProfile, setHasClientProfile] = useState(false)
  const [hasWorkerRow, setHasWorkerRow] = useState(false)
  const [loading, setLoading] = useState(!!user?.id)

  const hasWorkerFromMeta = useMemo(
    () => hasWorkerProfileFromMetadata(user?.user_metadata),
    [user?.user_metadata],
  )

  const hasWorkerProfile = hasWorkerFromMeta || hasWorkerRow

  useEffect(() => {
    if (!user?.id || !supabase) {
      setHasClientProfile(false)
      setHasWorkerRow(false)
      setLoading(false)
      return
    }

    let cancelled = false
    setLoading(true)

    Promise.all([
      supabase.from('clients').select('id').eq('id', user.id).maybeSingle(),
      supabase.from('workers').select('id').eq('id', user.id).maybeSingle(),
    ]).then(([clientRes, workerRes]) => {
      if (cancelled) return
      if (clientRes.error) {
        setHasClientProfile(false)
      } else {
        setHasClientProfile(!!clientRes.data)
      }
      if (workerRes.error) {
        setHasWorkerRow(false)
      } else {
        setHasWorkerRow(!!workerRes.data)
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
