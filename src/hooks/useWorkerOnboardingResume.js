import { useEffect, useRef } from 'react'
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
 * Keeps worker onboarding on the correct step after refresh; stamps onboarding_step to Supabase.
 * @param {'service_area'|'about'|'profile_photos'|'portfolio'|'packages'} expectedStep
 * @param {string|undefined} category route param
 */
export function useWorkerOnboardingResume(expectedStep, category) {
  const navigate = useNavigate()
  const { user } = useAuthSession()
  const stampOnce = useRef(false)

  useEffect(() => {
    stampOnce.current = false
  }, [expectedStep, category])

  useEffect(() => {
    if (!supabase || !user?.id || !category || !VALID_CATEGORY.has(category)) return undefined

    let cancelled = false

    ;(async () => {
      const row = await fetchWorkerDraftRow(user.id)
      if (cancelled) return

      if (row?.onboarding_complete === true || row?.profile_complete === true) {
        navigate(`/worker/${user.id}`, { replace: true })
        return
      }

      const saved = row?.onboarding_step || inferWorkerOnboardingStep(user, row)
      const si = stepIndex(saved)
      const ci = stepIndex(expectedStep)
      if (si !== ci) {
        navigate(pathForWorkerOnboardingStep(saved, category), { replace: true })
        return
      }

      if (!stampOnce.current) {
        stampOnce.current = true
        await persistWorkerRowDraft(user, category, undefined, { onboardingStep: expectedStep })
      }
    })()

    return () => {
      cancelled = true
    }
  }, [user?.id, category, expectedStep, navigate])
}
