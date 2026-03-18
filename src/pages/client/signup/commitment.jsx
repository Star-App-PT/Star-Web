import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { supabase } from '../../../supabase'
import { useDemoMode } from '../../../contexts/DemoModeContext'
import './ClientSignup.css'

export default function ClientSignupCommitment() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { isDemoMode } = useDemoMode()

  const handleAgree = async () => {
    if (supabase) {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (session?.user) {
          await supabase.from('clients').upsert({
            id: session.user.id,
            first_name: session.user.user_metadata?.first_name || '',
            last_name: session.user.user_metadata?.last_name || '',
            phone: session.user.user_metadata?.phone || '',
            email: session.user.email || '',
            profile_photo_url: session.user.user_metadata?.profile_photo_url || null,
            created_at: new Date().toISOString(),
          })
        }
      } catch { /* continue */ }
    }
    navigate('/')
  }

  const handleDecline = () => {
    navigate('/')
  }

  return (
    <div className="csu">
      <div className="csu__top">
        <span className="csu__step">{t('clientSignup.step4')}</span>
        <button type="button" className="csu__back" onClick={() => navigate('/client/signup/photo')}>
          {t('common.back')}
        </button>
      </div>

      <div className="csu__card" style={{ display: 'flex', justifyContent: 'center' }}>
        <div className="csu__commit-card">
          <img src="/star-logo-blue.svg" alt="Star SVS" className="csu__commit-logo" />

          <h1 className="csu__commit-title">{t('clientSignup.commitmentTitle')}</h1>

          <p className="csu__commit-body">
            {t('clientSignup.commitmentBody')}
          </p>

          <button type="button" className="csu__commit-agree" onClick={handleAgree}>
            {t('clientSignup.agreeAndContinue')}
          </button>

          <button type="button" className="csu__commit-decline" onClick={handleDecline}>
            {t('clientSignup.decline')}
          </button>
        </div>
      </div>

      {/* DEMO ONLY — REMOVE BEFORE LAUNCH */}
      {isDemoMode && (
        <p
          onClick={() => navigate('/')}
          style={{
            textAlign: 'center',
            color: '#AAAAAA',
            fontSize: '14px',
            cursor: 'pointer',
            marginTop: '16px',
          }}
        >
          {t('common.demoSkip')}
        </p>
      )}
    </div>
  )
}
