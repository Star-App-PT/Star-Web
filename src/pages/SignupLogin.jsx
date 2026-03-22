import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { supabase, getAuthSiteOrigin, getAuthOAuthCallbackUrl } from '../supabase'
import './SignupLogin.css'

const CONTINUE_BLUE = '#1B4FBA'

export default function SignupLogin({ titleKey = 'signupLogin.title' }) {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [view, setView] = useState('main') // 'main' | 'verify' | 'email'
  const [sentTo, setSentTo] = useState('') // email for verify screen
  const [code, setCode] = useState('')
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleEmailContinue = async (e) => {
    e.preventDefault()
    setError('')
    if (!email.trim()) {
      setError(t('signupLogin.enterEmail'))
      return
    }
    setLoading(true)
    const { error: err } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: { emailRedirectTo: getAuthSiteOrigin() },
    })
    setLoading(false)
    if (err) {
      setError(err.message || t('signupLogin.sendError'))
      return
    }
    setSentTo(email.trim())
    setView('verify')
    setCode('')
  }

  const handleVerify = async (e) => {
    e.preventDefault()
    setError('')
    const token = code.replace(/\D/g, '').slice(0, 6)
    if (token.length < 6) {
      setError(t('signupLogin.enterCode'))
      return
    }
    setLoading(true)
    const { error: err } = await supabase.auth.verifyOtp({
      email: sentTo,
      token,
      type: 'email',
    })
    setLoading(false)
    if (err) {
      setError(err.message || t('signupLogin.verifyError'))
      return
    }
    navigate('/', { replace: true })
  }

  const handleGoogle = () => {
    setError('')
    supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: getAuthOAuthCallbackUrl() },
    })
  }

  const handleApple = () => {
    setError('')
    supabase.auth.signInWithOAuth({
      provider: 'apple',
      options: { redirectTo: getAuthOAuthCallbackUrl() },
    })
  }

  const showEmailInput = view === 'email'
  const showVerify = view === 'verify'

  if (showVerify) {
    return (
      <div className="signup-login">
        <div className="signup-login__card">
          <h1 className="signup-login__title">{t('signupLogin.enterCodeTitle')}</h1>
          <p className="signup-login__sub">{t('signupLogin.enterCodeSent', { to: sentTo })}</p>
          <form onSubmit={handleVerify} className="signup-login__form">
            {error && <p className="signup-login__error">{error}</p>}
            <input
              type="text"
              inputMode="numeric"
              maxLength={6}
              placeholder="000000"
              className="signup-login__input signup-login__code"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
              autoComplete="one-time-code"
            />
            <button
              type="submit"
              className="signup-login__continue"
              style={{ background: CONTINUE_BLUE }}
              disabled={loading || code.replace(/\D/g, '').length < 6}
            >
              {loading ? t('common.submitting') : t('signupLogin.verify')}
            </button>
            <button
              type="button"
              className="signup-login__back"
              onClick={() => { setView('main'); setError(''); setCode(''); }}
            >
              {t('common.back')}
            </button>
          </form>
          <Link to="/" className="signup-login__back-link">{t('signupChoice.backToHome')}</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="signup-login">
      <div className="signup-login__card">
        <h1 className="signup-login__title">{t(titleKey)}</h1>

        {showEmailInput ? (
          <form onSubmit={handleEmailContinue} className="signup-login__form">
            <label className="signup-login__label">{t('signupLogin.emailLabel')}</label>
            <input
              type="email"
              placeholder={t('signupLogin.emailPlaceholder')}
              className="signup-login__input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
            {error && <p className="signup-login__error">{error}</p>}
            <button
              type="submit"
              className="signup-login__continue"
              style={{ background: CONTINUE_BLUE }}
              disabled={loading}
            >
              {loading ? t('common.submitting') : t('signupLogin.continue')}
            </button>
            <button
              type="button"
              className="signup-login__back"
              onClick={() => { setView('main'); setError(''); }}
            >
              {t('common.back')}
            </button>
          </form>
        ) : (
          <div className="signup-login__socials">
              <button type="button" className="signup-login__social" onClick={handleGoogle}>
                <svg className="signup-login__social-icon" viewBox="0 0 24 24" aria-hidden>
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                {t('signupLogin.continueGoogle')}
              </button>
              <button type="button" className="signup-login__social" onClick={handleApple}>
                <svg className="signup-login__social-icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                  <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                </svg>
                {t('signupLogin.continueApple')}
              </button>
              <button
                type="button"
                className="signup-login__social"
                onClick={() => { setView('email'); setError(''); }}
              >
                <svg className="signup-login__social-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
                {t('signupLogin.continueEmail')}
              </button>
            </div>
        )}
        <Link to="/" className="signup-login__back-link">{t('signupChoice.backToHome')}</Link>
      </div>
    </div>
  )
}
