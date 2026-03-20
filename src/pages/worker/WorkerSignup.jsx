import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { supabase } from '../../supabase'
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

  const showAuth = bootstrapped && !user
  const showCategory =
    bootstrapped && user && user.user_metadata?.profile_complete === true

  const handleClose = () => navigate('/')

  const handleCategoryContinue = async (categoryId) => {
    if (supabase) {
      try {
        await supabase.auth.updateUser({ data: { worker_category: categoryId } })
      } catch {
        /* continue navigation even if metadata update fails */
      }
    }
    navigate(`/worker/service-area/${categoryId}`)
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
