import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { supabase } from '../supabase'
import './FinishProfile.css'

const currentYear = new Date().getFullYear()
const YEARS = Array.from({ length: 100 }, (_, i) => currentYear - i)
const DAYS = Array.from({ length: 31 }, (_, i) => i + 1)

export default function FinishProfile() {
  const { t } = useTranslation()
  const navigate = useNavigate()

  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [dobMonth, setDobMonth] = useState('')
  const [dobDay, setDobDay] = useState('')
  const [dobYear, setDobYear] = useState('')
  const [email, setEmail] = useState('')
  const [provider, setProvider] = useState('email')

  const MONTH_KEYS = [
    'jan','feb','mar','apr','may','jun',
    'jul','aug','sep','oct','nov','dec',
  ]

  useEffect(() => {
    // TESTING MODE - remove direct skip before going live
    // Allow page to load without a session for testing the profile form
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        const u = session.user
        setUser(u)
        setEmail(u.email || '')
        setProvider(u.app_metadata?.provider || 'email')

        const meta = u.user_metadata || {}
        const fullName = meta.full_name || meta.name || ''
        if (fullName) {
          const parts = fullName.split(' ')
          setFirstName(parts[0] || '')
          setLastName(parts.slice(1).join(' ') || '')
        }
      }
      setLoading(false)
    })

    /* TESTING MODE - restore this block before going live
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session?.user) {
        navigate('/worker/signup', { replace: true })
        return
      }
      const u = session.user
      setUser(u)
      setEmail(u.email || '')
      setProvider(u.app_metadata?.provider || 'email')

      const meta = u.user_metadata || {}
      const fullName = meta.full_name || meta.name || ''
      if (fullName) {
        const parts = fullName.split(' ')
        setFirstName(parts[0] || '')
        setLastName(parts.slice(1).join(' ') || '')
      }

      setLoading(false)
    })
    */
  }, [navigate])

  const canSubmit =
    firstName.trim() &&
    lastName.trim() &&
    dobMonth &&
    dobDay &&
    dobYear &&
    email.trim()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!canSubmit) return

    const age = currentYear - Number(dobYear)
    if (age < 18) {
      setError(t('finishProfile.errUnder18'))
      return
    }

    setError('')
    setSubmitting(true)

    const dob = `${dobYear}-${String(dobMonth).padStart(2, '0')}-${String(dobDay).padStart(2, '0')}`

    // TESTING MODE - remove direct skip before going live
    if (!user) {
      setSubmitting(false)
      navigate('/choose-category', { replace: true })
      return
    }

    const { error: updateErr } = await supabase.auth.updateUser({
      data: {
        full_name: `${firstName.trim()} ${lastName.trim()}`,
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        date_of_birth: dob,
        profile_complete: true,
      },
    })

    setSubmitting(false)

    if (updateErr) {
      setError(updateErr.message)
    } else {
      navigate('/choose-category', { replace: true })
    }
  }

  if (loading) {
    return (
      <div className="fp-page">
        <div className="fp-page__content">
          <div className="fp-card">
            <div className="fp-card__body fp-card__body--center">
              <p className="fp-card__loading">{t('common.submitting')}</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const isOAuth = provider === 'google' || provider === 'apple'
  const providerLabel = provider === 'google' ? 'Google' : provider === 'apple' ? 'Apple' : null

  return (
    <div className="fp-page">
      <div className="fp-page__content">
        <div className="fp-card">
          <div className="fp-card__header">
            <button
              type="button"
              className="fp-card__back"
              onClick={() => navigate(-1)}
              aria-label={t('common.back')}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5"/><path d="m12 19-7-7 7-7"/></svg>
            </button>
            <span className="fp-card__header-title">{t('finishProfile.title')}</span>
          </div>

          <form className="fp-card__body" onSubmit={handleSubmit} noValidate>
            {error && <p className="fp-card__error">{error}</p>}

            {/* Legal name */}
            <div className="fp-card__section">
              <h3 className="fp-card__label">{t('finishProfile.legalName')}</h3>
              <div className="fp-card__field-group fp-card__field-group--stacked">
                <input
                  type="text"
                  className="fp-card__input fp-card__input--top"
                  placeholder={t('finishProfile.firstNamePlaceholder')}
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  autoComplete="given-name"
                />
                <input
                  type="text"
                  className="fp-card__input fp-card__input--bottom"
                  placeholder={t('finishProfile.lastNamePlaceholder')}
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  autoComplete="family-name"
                />
              </div>
              <p className="fp-card__hint">{t('finishProfile.legalNameHint')}</p>
            </div>

            {/* Date of birth */}
            <div className="fp-card__section">
              <div className="fp-card__label-row">
                <h3 className="fp-card__label">{t('finishProfile.dateOfBirth')}</h3>
                <span className="fp-card__info-icon" title={t('finishProfile.dobHint')}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                </span>
              </div>
              <div className="fp-card__dob-row">
                <select
                  className="fp-card__select fp-card__select--month"
                  value={dobMonth}
                  onChange={(e) => setDobMonth(e.target.value)}
                >
                  <option value="" disabled>{t('finishProfile.month')}</option>
                  {MONTH_KEYS.map((key, i) => (
                    <option key={key} value={i + 1}>{t(`calendar.${key}`)}</option>
                  ))}
                </select>
                <select
                  className="fp-card__select fp-card__select--day"
                  value={dobDay}
                  onChange={(e) => setDobDay(e.target.value)}
                >
                  <option value="" disabled>{t('finishProfile.day')}</option>
                  {DAYS.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
                <select
                  className="fp-card__select fp-card__select--year"
                  value={dobYear}
                  onChange={(e) => setDobYear(e.target.value)}
                >
                  <option value="" disabled>{t('finishProfile.year')}</option>
                  {YEARS.map((y) => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              </div>
              <p className="fp-card__hint">{t('finishProfile.dobHint')}</p>
            </div>

            {/* Contact info */}
            <div className="fp-card__section">
              <h3 className="fp-card__label">{t('finishProfile.contactInfo')}</h3>
              <div className="fp-card__field-group">
                <input
                  type="email"
                  className={`fp-card__input ${isOAuth ? 'fp-card__input--readonly' : ''}`}
                  placeholder={t('finishProfile.emailPlaceholder')}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  readOnly={isOAuth}
                  tabIndex={isOAuth ? -1 : 0}
                  autoComplete="email"
                />
              </div>
              <p className="fp-card__hint">{t('finishProfile.emailHint')}</p>
              {isOAuth && providerLabel && (
                <p className="fp-card__provider-note">
                  {t('finishProfile.infoFromProvider', { provider: providerLabel })}
                </p>
              )}
            </div>

            {/* Terms */}
            <p className="fp-card__terms">
              {t('finishProfile.termsPre')}
              <a href="/terms" className="fp-card__terms-link">{t('finishProfile.termsOfService')}</a>
              {t('finishProfile.termsAnd')}
              <a href="/privacy" className="fp-card__terms-link">{t('finishProfile.privacyPolicy')}</a>.
            </p>

            <button
              type="submit"
              className="fp-card__submit"
              disabled={!canSubmit || submitting}
            >
              {submitting ? t('common.submitting') : t('finishProfile.agreeAndContinue')}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
