import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { supabase } from '../supabase'
import './Dashboard.css'

export default function Dashboard() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user)
      } else {
        navigate('/worker/signup', { replace: true })
      }
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(session.user)
      } else {
        navigate('/worker/signup', { replace: true })
      }
    })

    return () => subscription.unsubscribe()
  }, [navigate])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    navigate('/')
  }

  if (loading) {
    return (
      <div className="dashboard">
        <div className="dashboard__loading">{t('common.submitting')}</div>
      </div>
    )
  }

  if (!user) return null

  const displayName =
    user.user_metadata?.full_name ||
    user.user_metadata?.name ||
    user.email?.split('@')[0] ||
    ''

  const avatar = user.user_metadata?.avatar_url || null

  return (
    <div className="dashboard">
      <div className="dashboard__card">
        <div className="dashboard__avatar-wrap">
          {avatar ? (
            <img src={avatar} alt="" className="dashboard__avatar" />
          ) : (
            <div className="dashboard__avatar-fallback">
              {displayName.charAt(0).toUpperCase()}
            </div>
          )}
        </div>

        <h1 className="dashboard__greeting">
          {t('dashboard.welcome', { name: displayName })}
        </h1>

        <p className="dashboard__email">{user.email}</p>

        <p className="dashboard__provider">
          {t('dashboard.signedInVia', {
            provider: user.app_metadata?.provider || 'email',
          })}
        </p>

        <div className="dashboard__actions">
          <button type="button" className="dashboard__btn dashboard__btn--home" onClick={() => navigate('/')}>
            {t('common.backToHome')}
          </button>
          <button type="button" className="dashboard__btn dashboard__btn--signout" onClick={handleSignOut}>
            {t('dashboard.signOut')}
          </button>
        </div>
      </div>
    </div>
  )
}
