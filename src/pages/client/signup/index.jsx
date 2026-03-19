import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useDemoMode } from '../../../contexts/DemoModeContext'
import { supabase } from '../../../supabase'
import './ClientSignup.css'

export default function ClientSignupWelcome() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const { isDemoMode } = useDemoMode()

  const handleGoogle = () => {
    supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: 'https://starsvs.com' } })
  }
  const handleApple = () => {
    supabase.auth.signInWithOAuth({ provider: 'apple', options: { redirectTo: 'https://starsvs.com' } })
  }
  const handlePhone = () => navigate('/client/signup/name')

  const handleEmail = (e) => {
    e.preventDefault()
    if (!email.trim()) return
    navigate('/client/signup/name')
  }

  return (
    <div className="csu">
      <div className="csu__card">
        <h1 className="csu__title">{t('clientSignup.welcomeTitle')}</h1>
        <p className="csu__subtitle">{t('clientSignup.welcomeSubtitle')}</p>

        <div className="csu__options">
          <button type="button" className="csu__option" onClick={handleGoogle}>
            <span className="csu__option-icon">
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18A10.96 10.96 0 0 0 1 12c0 1.77.42 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
            </span>
            {t('clientSignup.continueGoogle')}
          </button>

          <button type="button" className="csu__option" onClick={handleApple}>
            <span className="csu__option-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
              </svg>
            </span>
            {t('clientSignup.continueApple')}
          </button>

          <button type="button" className="csu__option" onClick={handlePhone}>
            <span className="csu__option-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="5" y="2" width="14" height="20" rx="2" ry="2"/>
                <line x1="12" y1="18" x2="12.01" y2="18"/>
              </svg>
            </span>
            {t('clientSignup.continuePhone')}
          </button>
        </div>

        <div className="csu__divider"><span>{t('common.or')}</span></div>

        <form onSubmit={handleEmail} noValidate>
          <input
            type="email"
            className="csu__input"
            placeholder={t('clientSignup.emailAddress')}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />
          <button type="submit" className="csu__email-btn" disabled={!email.trim()}>
            {t('clientSignup.continueEmail')}
          </button>
        </form>

        <p className="csu__terms">
          {t('clientSignup.termsPrefix')} <a href="/terms">{t('clientSignup.termsOfService')}</a> {t('clientSignup.termsAnd')} <a href="/privacy">{t('clientSignup.privacyPolicy')}</a>.
        </p>

        <p className="csu__login">
          {t('clientSignup.alreadyHaveAccount')} <Link to="/worker/signup">{t('clientSignup.logIn')}</Link>
        </p>

        {/* DEMO ONLY — REMOVE BEFORE LAUNCH */}
        {isDemoMode && (
          <p
            onClick={() => navigate('/client/signup/name')}
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
    </div>
  )
}
