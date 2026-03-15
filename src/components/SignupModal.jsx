import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import LanguageToggle from './LanguageToggle'
import './SignupModal.css'

const COUNTRY_CODES = [
  { code: '+351', label: 'Portugal (+351)', flag: '🇵🇹' },
  { code: '+44',  label: 'United Kingdom (+44)', flag: '🇬🇧' },
  { code: '+1',   label: 'United States (+1)', flag: '🇺🇸' },
  { code: '+1',   label: 'Canada (+1)', flag: '🇨🇦' },
  { code: '+55',  label: 'Brazil (+55)', flag: '🇧🇷' },
  { code: '+33',  label: 'France (+33)', flag: '🇫🇷' },
  { code: '+49',  label: 'Germany (+49)', flag: '🇩🇪' },
  { code: '+34',  label: 'Spain (+34)', flag: '🇪🇸' },
  { code: '+39',  label: 'Italy (+39)', flag: '🇮🇹' },
  { code: '+31',  label: 'Netherlands (+31)', flag: '🇳🇱' },
]

export default function SignupModal({ open, onClose, category }) {
  const { t } = useTranslation()
  const [countryCode, setCountryCode] = useState('+351')
  const [phone, setPhone] = useState('')

  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  if (!open) return null

  const handleContinue = () => {
    if (!phone.trim()) return
    // TODO: Send SMS verification code via Supabase Auth or Twilio
  }

  return (
    <div className="smodal-overlay" onClick={onClose}>
      <div className="smodal" onClick={(e) => e.stopPropagation()}>
        <div className="smodal__header">
          <button type="button" className="smodal__close" onClick={onClose} aria-label={t('common.cancel')}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          </button>
          <h2 className="smodal__title">{t('signupModal.title')}</h2>
          <LanguageToggle className="smodal__lang" />
        </div>

        <div className="smodal__body">
          <div className="smodal__phone-group">
            <div className="smodal__phone-top">
              <label className="smodal__phone-label">{t('signupModal.countryRegion')}</label>
              <select
                className="smodal__country-select"
                value={countryCode}
                onChange={(e) => setCountryCode(e.target.value)}
              >
                {COUNTRY_CODES.map((c, i) => (
                  <option key={`${c.code}-${i}`} value={c.code}>{c.flag} {c.label}</option>
                ))}
              </select>
              <svg className="smodal__country-chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
            </div>
            <div className="smodal__phone-bottom">
              <input
                type="tel"
                className="smodal__phone-input"
                placeholder={t('signupModal.phonePlaceholder')}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                autoComplete="tel"
              />
            </div>
          </div>

          <p className="smodal__hint">{t('signupModal.hint')}</p>

          <button
            type="button"
            className="smodal__continue"
            onClick={handleContinue}
            disabled={!phone.trim()}
          >
            {t('common.continue')}
          </button>

          <div className="smodal__divider">
            <span>{t('common.or')}</span>
          </div>

          <div className="smodal__socials">
            <button type="button" className="smodal__social-btn">
              <svg className="smodal__social-icon" width="20" height="20" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18A10.96 10.96 0 0 0 1 12c0 1.77.42 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              <span>{t('signupModal.continueGoogle')}</span>
            </button>

            <button type="button" className="smodal__social-btn">
              <svg className="smodal__social-icon" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
              </svg>
              <span>{t('signupModal.continueApple')}</span>
            </button>

            <button type="button" className="smodal__social-btn">
              <svg className="smodal__social-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="4" width="20" height="16" rx="2"/>
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
              </svg>
              <span>{t('signupModal.continueEmail')}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
