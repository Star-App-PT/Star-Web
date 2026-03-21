import { supabase } from '../supabase'
import { persistWorkerRowDraft } from './workerSupabase'

/**
 * Save chosen worker category and navigate into the onboarding flow.
 * @param {string} categoryId cleaning | repairs | services
 * @param {(path: string) => void} navigate react-router navigate
 */
export async function continueWorkerCategorySignup(categoryId, navigate) {
  if (supabase) {
    try {
      const { data: authData } = await supabase.auth.updateUser({
        data: { worker_category: categoryId },
      })
      if (authData?.user) {
        await persistWorkerRowDraft(authData.user, categoryId)
      }
    } catch {
      /* still navigate */
    }
  }
  navigate(`/worker/service-area/${categoryId}`)
}
