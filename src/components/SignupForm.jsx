import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { supabase } from '../supabase'
import { useDemoMode } from '../contexts/DemoModeContext'
import CountryCodePicker from './CountryCodePicker'
import './SignupForm.css'

export default function SignupForm({ category, onBack }) {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { isDemoMode } = useDemoMode()

  const [screen, setScreen] = useState('main')
  const [country, setCountry] = useState(null)
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // TESTING MODE - remove direct skip before going live
  const skipToProfile = () => navigate('/worker/finish-profile')

  const handleGoogleSignIn = () => skipToProfile()
  const handleAppleSignIn = () => skipToProfile()
  const handleEmailContinue = (e) => { e.preventDefault(); skipToProfile() }
  const handlePhoneContinue = (e) => { e.preventDefault(); skipToProfile() }

  /* TESTING MODE - restore these handlers before going live
  const handleGoogleSignIn = async () => {
    setError('')
    setLoading(true)
    const { error: err } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/worker/finish-profile` },
    })
    if (err) {
      setError(err.message)
      setLoading(false)
    }
  }

  const handleAppleSignIn = async () => {
    setError('')
    setLoading(true)
    const { error: err } = await supabase.auth.signInWithOAuth({
      provider: 'apple',
      options: { redirectTo: `${window.location.origin}/worker/finish-profile` },
    })
    if (err) {
      setError(err.message)
      setLoading(false)
    }
  }

  const handleEmailContinue = (e) => {
    e.preventDefault()
    if (!email.trim()) return
    setError('')
    setScreen('email-password')
  }

  const handleEmailSignUp = async (e) => {
    e.preventDefault()
    if (!email.trim() || !password.trim()) return
    if (password.length < 6) {
      setError(t('signupModal.errPasswordLength'))
      return
    }
    setError('')
    setLoading(true)
    const { error: err } = await supabase.auth.signUp({
      email: email.trim(),
      password: password,
      options: {
        emailRedirectTo: `${window.location.origin}/worker/finish-profile`,
        data: { category: category || null },
      },
    })
    setLoading(false)
    if (err) {
      setError(err.message)
    } else {
      setScreen('email-confirm')
    }
  }

  const handlePhoneContinue = (e) => {
    e.preventDefault()
    if (!phone.trim()) return
  }
  */

  const headerTitle = screen === 'email-confirm'
    ? t('signupModal.logInOrSignUp')
    : t('signupModal.logInOrSignUp')

  const handleBack = () => {
    setError('')
    if (screen === 'email') { setScreen('main'); return }
    if (screen === 'email-password') { setScreen('email'); return }
    if (screen === 'email-confirm') { navigate('/'); return }
    onBack()
  }

  return (
    <div className="sf-card">
      <div className="sf-card__header">
        <button type="button" className="sf-card__back" onClick={handleBack} aria-label={t('common.back')}>
          {screen === 'main' ? (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5"/><path d="m12 19-7-7 7-7"/></svg>
          )}
        </button>
        <span className="sf-card__header-title">{headerTitle}</span>
      </div>

      <div className="sf-card__body">
        {error && <p className="sf-card__error">{error}</p>}

        {/* ── MAIN SCREEN ── */}
        {screen === 'main' && (
          <>
            <h2 className="sf-card__welcome">{t('signupModal.welcomeTitle')}</h2>

            <form onSubmit={handlePhoneContinue} noValidate>
              <div className="sf-card__phone-group">
                <div className="sf-card__phone-top">
                  <label className="sf-card__phone-label">{t('signupModal.countryRegion')}</label>
                  <CountryCodePicker
                    value={country}
                    onChange={setCountry}
                    buttonClassName="sf-card__country-picker-button"
                  />
                </div>
                <div className="sf-card__phone-bottom">
                  <input
                    type="tel"
                    className="sf-card__phone-input"
                    placeholder={t('signupModal.phonePlaceholder')}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    autoComplete="tel"
                  />
                </div>
              </div>

              <p className="sf-card__hint">{t('signupModal.phoneHint')}</p>

              <button type="submit" className="sf-card__submit btn-primary" disabled={!phone.trim()}>
                {t('signupModal.continueBtn')}
              </button>
            </form>

            <div className="sf-card__divider">
              <span>{t('common.or')}</span>
            </div>

            <div className="sf-card__socials">
              <button type="button" className="sf-card__social-btn" onClick={handleGoogleSignIn} disabled={loading}>
                <svg className="sf-card__social-icon" width="20" height="20" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18A10.96 10.96 0 0 0 1 12c0 1.77.42 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                <span>{t('signupModal.continueGoogle')}</span>
              </button>

              <button type="button" className="sf-card__social-btn" onClick={handleAppleSignIn} disabled={loading}>
                <svg className="sf-card__social-icon" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                </svg>
                <span>{t('signupModal.continueApple')}</span>
              </button>

              <button type="button" className="sf-card__social-btn" onClick={() => setScreen('email')}>
                <svg className="sf-card__social-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="4" width="20" height="16" rx="2"/>
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                </svg>
                <span>{t('signupModal.continueEmail')}</span>
              </button>
            </div>

            {/* DEMO ONLY — REMOVE BEFORE LAUNCH */}
            {isDemoMode && (
              <p
                onClick={() => navigate('/worker/finish-profile')}
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
          </>
        )}

        {/* ── EMAIL SCREEN ── */}
        {screen === 'email' && (
          <>
            <h2 className="sf-card__welcome">{t('signupModal.emailTitle')}</h2>
            <form onSubmit={handleEmailContinue} noValidate>
              <div className="sf-card__field-group">
                <input
                  type="email"
                  className="sf-card__input"
                  placeholder={t('signupModal.emailPlaceholder')}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  autoFocus
                />
              </div>
              <button type="submit" className="sf-card__submit sf-card__submit--mt btn-primary" disabled={!email.trim()}>
                {t('signupModal.continueBtn')}
              </button>
            </form>
          </>
        )}

        {/* ── EMAIL + PASSWORD SCREEN ── */}
        {screen === 'email-password' && (
          <>
            <h2 className="sf-card__welcome">{t('signupModal.createAccount')}</h2>
            <form onSubmit={handleEmailSignUp} noValidate>
              <div className="sf-card__field-group sf-card__field-group--stacked">
                <input
                  type="email"
                  className="sf-card__input sf-card__input--top"
                  value={email}
                  readOnly
                  tabIndex={-1}
                />
                <input
                  type="password"
                  className="sf-card__input sf-card__input--bottom"
                  placeholder={t('signupModal.passwordPlaceholder')}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="new-password"
                  autoFocus
                />
              </div>
              <p className="sf-card__hint">{t('signupModal.passwordHint')}</p>
              <button
                type="submit"
                className="sf-card__submit sf-card__submit--mt btn-primary"
                disabled={!password.trim() || loading}
              >
                {loading ? t('common.submitting') : t('signupModal.signUpBtn')}
              </button>
            </form>
          </>
        )}

        {/* ── EMAIL CONFIRMATION SCREEN ── */}
        {screen === 'email-confirm' && (
          <div className="sf-card__confirm">
            <div className="sf-card__confirm-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#1B4FBA" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="4" width="20" height="16" rx="2"/>
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
              </svg>
            </div>
            <h2 className="sf-card__confirm-title">{t('signupModal.checkEmail')}</h2>
            <p className="sf-card__confirm-text">{t('signupModal.checkEmailDesc', { email })}</p>
            <button
              type="button"
              className="sf-card__submit sf-card__submit--mt btn-primary"
              onClick={() => navigate('/')}
            >
              {t('common.backToHome')}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
