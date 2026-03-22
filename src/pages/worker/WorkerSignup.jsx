import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { supabase } from '../../supabase'
import { fetchWorkerDraftRow } from '../../lib/workerSupabase'
import { inferWorkerOnboardingStep, pathForWorkerOnboardingStep } from '../../lib/workerOnboardingResume'
import { continueWorkerCategorySignup } from '../../lib/workerCategoryContinue'
import { useAuthSession } from '../../contexts/AuthSessionContext'
import WorkerSignupAuthModal from '../../components/workerSignup/WorkerSignupAuthModal'
import WorkerSignupCategoryModal from '../../components/workerSignup/WorkerSignupCategoryModal'
import './WorkerSignup.css'

export default function WorkerSignup() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { user } = useAuthSession()
  const [bootstrapped, setBootstrapped] = useState(false)

  useEffect(() => {
    if (!supabase) {
      setBootstrapped(true)
      return
    }
    supabase.auth.getSession().then(() => setBootstrapped(true))
  }, [])

  useEffect(() => {
    if (!bootstrapped) return
    if (user && user.user_metadata?.profile_complete !== true) {
      navigate('/worker/finish-profile', { replace: true })
    }
  }, [bootstrapped, user, navigate])

  useEffect(() => {
    if (!bootstrapped || !user || user.user_metadata?.profile_complete !== true) return
    if (!supabase) return
    let cancelled = false
    ;(async () => {
      const row = await fetchWorkerDraftRow(user.id)
      if (cancelled) return
      if (row?.onboarding_complete === true || row?.profile_complete === true) {
        navigate(`/worker/${user.id}`, { replace: true })
        return
      }
      const step = row?.onboarding_step || inferWorkerOnboardingStep(user, row)
      if (step === 'choose_category') return

      const cat = row?.category || user.user_metadata?.worker_category
      if (!cat || !['cleaning', 'repairs', 'services'].includes(cat)) return
      navigate(pathForWorkerOnboardingStep(step, cat), { replace: true })
    })()
    return () => {
      cancelled = true
    }
  }, [bootstrapped, user, navigate])

  const showAuth = bootstrapped && !user
  const showCategory =
    bootstrapped && user && user.user_metadata?.profile_complete === true

  const handleClose = () => navigate('/')

  const handleCategoryContinue = async (categoryId) => {
    await continueWorkerCategorySignup(categoryId, navigate)
  }

  if (!bootstrapped) {
    return (
      <div className="signup-page signup-page--gate">
        <div className="signup-page__content signup-page__content--loading">
          <p className="signup-page__loading-text">{t('common.submitting')}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="signup-page signup-page--gate" aria-hidden={showAuth || showCategory}>
      <div className="signup-page__content signup-page__content--gate" />
      <WorkerSignupAuthModal open={showAuth} onClose={handleClose} />
      <WorkerSignupCategoryModal open={showCategory} onClose={handleClose} onContinue={handleCategoryContinue} />
    </div>
  )
}
