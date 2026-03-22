import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabase'
import { useAuthSession } from '../contexts/AuthSessionContext'
import { persistWorkerRowDraft, fetchWorkerDraftRow } from '../lib/workerSupabase'
import {
  inferWorkerOnboardingStep,
  pathForWorkerOnboardingStep,
  stepIndex,
} from '../lib/workerOnboardingResume'

const VALID_CATEGORY = new Set(['cleaning', 'repairs', 'services'])

/**
 * On refresh: if the user is *behind* their saved progress (e.g. bookmark), send them forward.
 * If they navigated *back* (saved step ahead of this screen), stay here and downgrade saved step in DB.
 * @param {'service_area'|'about'|'profile_photos'|'portfolio'|'packages'} expectedStep
 */
export function useWorkerOnboardingResume(expectedStep, category) {
  const navigate = useNavigate()
  const { user } = useAuthSession()

  useEffect(() => {
    if (!supabase || !user?.id || !category || !VALID_CATEGORY.has(category)) return undefined

    let cancelled = false

    ;(async () => {
      const { data: { session } } = await supabase.auth.getSession()
      const sessionUser = session?.user
      if (!sessionUser?.id || cancelled) return

      const row = await fetchWorkerDraftRow(sessionUser.id)
      if (cancelled) return

      if (row?.onboarding_complete === true || row?.profile_complete === true) {
        navigate(`/worker/${sessionUser.id}`, { replace: true })
        return
      }

      const saved = row?.onboarding_step || inferWorkerOnboardingStep(sessionUser, row)
      const si = stepIndex(saved)
      const ci = stepIndex(expectedStep)

      /* Only block jumping *ahead* of allowed progress (si < ci). Never block going back (si > ci). */
      if (si < ci) {
        const cat = row?.category || sessionUser.user_metadata?.worker_category || category
        navigate(pathForWorkerOnboardingStep(saved, cat), { replace: true })
        return
      }

      await persistWorkerRowDraft(sessionUser, category, undefined, { onboardingStep: expectedStep })
    })()

    return () => {
      cancelled = true
    }
  }, [user?.id, category, expectedStep, navigate])
}
