import { useCallback, useEffect, useState } from 'react'
import { X } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { supabase, AUTH_REDIRECT_URL, getAuthSiteOrigin, getAuthOAuthCallbackUrl } from '../../supabase'
import { WORKER_SIGNUP_PENDING_KEY } from '../../constants/workerSignup'
import { useDemoMode } from '../../contexts/DemoModeContext'
import { useNavigate } from 'react-router-dom'
import './WorkerSignupModals.css'

function markWorkerSignupPending() {
  try {
    sessionStorage.setItem(WORKER_SIGNUP_PENDING_KEY, '1')
  } catch {
    /* ignore */
  }
}

function clearWorkerSignupPending() {
  try {
    sessionStorage.removeItem(WORKER_SIGNUP_PENDING_KEY)
  } catch {
    /* ignore */
  }
}

export default function WorkerSignupAuthModal({ open, onClose }) {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { isDemoMode } = useDemoMode()
  const [visible, setVisible] = useState(false)
  const [view, setView] = useState('main')
  const [sentTo, setSentTo] = useState('')
  const [code, setCode] = useState('')
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (open) {
      const id = requestAnimationFrame(() => setVisible(true))
      document.body.style.overflow = 'hidden'
      return () => {
        cancelAnimationFrame(id)
        document.body.style.overflow = ''
      }
    }
    setVisible(false)
    document.body.style.overflow = ''
  }, [open])

  useEffect(() => {
    if (!open) {
      setView('main')
      setError('')
      setCode('')
      setEmail('')
    }
  }, [open])

  const handleGoogle = useCallback(() => {
    if (!supabase) return
    setError('')
    markWorkerSignupPending()
    supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: getAuthOAuthCallbackUrl() },
    })
  }, [])

  const handleApple = useCallback(() => {
    if (!supabase) return
    setError('')
    markWorkerSignupPending()
    supabase.auth.signInWithOAuth({
      provider: 'apple',
      options: { redirectTo: `${AUTH_REDIRECT_URL}/auth/callback` },
    })
  }, [])

  const handleEmailContinue = async (e) => {
    e.preventDefault()
    setError('')
    if (!email.trim()) {
      setError(t('signupLogin.enterEmail'))
      return
    }
    if (!supabase) {
      setError(t('common.somethingWentWrong'))
      return
    }
    markWorkerSignupPending()
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
    if (!supabase) return
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
    clearWorkerSignupPending()
  }

  if (!open) return null

  const showVerify = view === 'verify'
  const showEmail = view === 'email'

  return (
    <div className={`ws-modal ws-modal--auth${visible ? ' ws-modal--open' : ''}`} role="presentation">
      <button type="button" className="ws-modal__backdrop" aria-label={t('common.cancel')} onClick={onClose} />
      <div
        className="ws-modal__panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="ws-auth-title"
        onClick={(e) => e.stopPropagation()}
      >
        <button type="button" className="ws-modal__close" onClick={onClose} aria-label={t('common.cancel')}>
          <X size={20} strokeWidth={2} />
        </button>

        <div className="ws-modal__scroll">
          {showVerify ? (
            <>
              <h1 id="ws-auth-title" className="ws-modal__title">
                {t('signupLogin.enterCodeTitle')}
              </h1>
              <p className="ws-modal__sub">{t('signupLogin.enterCodeSent', { to: sentTo })}</p>
              <form onSubmit={handleVerify} className="ws-modal__form">
                {error && <p className="ws-modal__error">{error}</p>}
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  placeholder="000000"
                  className="ws-modal__input ws-modal__code"
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                  autoComplete="one-time-code"
                />
                <button
                  type="submit"
                  className="ws-modal__btn-primary"
                  disabled={loading || code.replace(/\D/g, '').length < 6}
                >
                  {loading ? t('common.submitting') : t('signupLogin.verify')}
                </button>
                <button
                  type="button"
                  className="ws-modal__btn-text"
                  onClick={() => {
                    setView('main')
                    setError('')
                    setCode('')
                  }}
                >
                  {t('common.back')}
                </button>
              </form>
            </>
          ) : showEmail ? (
            <>
              <h1 id="ws-auth-title" className="ws-modal__title">
                {t('signupLogin.title')}
              </h1>
              <form onSubmit={handleEmailContinue} className="ws-modal__form">
                <label className="ws-modal__label" htmlFor="ws-auth-email">
                  {t('signupLogin.emailLabel')}
                </label>
                <input
                  id="ws-auth-email"
                  type="email"
                  placeholder={t('signupLogin.emailPlaceholder')}
                  className="ws-modal__input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                />
                {error && <p className="ws-modal__error">{error}</p>}
                <button type="submit" className="ws-modal__btn-primary" disabled={loading}>
                  {loading ? t('common.submitting') : t('signupLogin.continue')}
                </button>
                <button
                  type="button"
                  className="ws-modal__btn-text"
                  onClick={() => {
                    setView('main')
                    setError('')
                  }}
                >
                  {t('common.back')}
                </button>
              </form>
            </>
          ) : (
            <>
              <h1 id="ws-auth-title" className="ws-modal__title">
                {t('signupLogin.title')}
              </h1>
              <p className="ws-modal__sub">{t('workerSignupGate.authSubtitle')}</p>
              {error && <p className="ws-modal__error">{error}</p>}
              <div className="ws-modal__socials">
                <button type="button" className="ws-modal__social" onClick={handleGoogle} disabled={!supabase}>
                  <svg className="ws-modal__social-icon" viewBox="0 0 24 24" aria-hidden>
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  {t('signupLogin.continueGoogle')}
                </button>
                <button type="button" className="ws-modal__social" onClick={handleApple} disabled={!supabase}>
                  <svg className="ws-modal__social-icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                    <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
                  </svg>
                  {t('signupLogin.continueApple')}
                </button>
                <button
                  type="button"
                  className="ws-modal__social"
                  onClick={() => {
                    setView('email')
                    setError('')
                  }}
                  disabled={!supabase}
                >
                  <svg
                    className="ws-modal__social-icon"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    aria-hidden
                  >
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                  {t('signupLogin.continueEmail')}
                </button>
              </div>
              {isDemoMode && (
                <p
                  className="ws-modal__demo"
                  onClick={() => navigate('/worker/finish-profile')}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && navigate('/worker/finish-profile')}
                >
                  {t('common.demoSkip')}
                </p>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
