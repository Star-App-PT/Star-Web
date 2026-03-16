import { useState, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { supabase } from '../../supabase'
import actionHomeCleaning from '../../assets/workers/action/action-home-cleaning.jpg'
import actionCarpentry from '../../assets/workers/action/action-carpentry.jpg'
import actionPhotography from '../../assets/workers/action/action-photography.jpg'
import './WorkerSignup.css'

const CITIES = ['Porto', 'Lisbon', 'Faro']

const CATEGORY_META = {
  cleaning: { labelKey: 'workerSignup.cleaning', defaultCard: actionHomeCleaning },
  repairs:  { labelKey: 'workerSignup.repairs',  defaultCard: actionCarpentry },
  services: { labelKey: 'workerSignup.services', defaultCard: actionPhotography },
}

async function saveWorker(data) {
  if (!supabase) return
  const { error } = await supabase.from('workers').insert({
    full_name: data.fullName,
    email: data.email,
    phone: data.phone,
    city: data.city,
    service_category: data.category,
    password: data.password,
  })
  if (error) throw error
}

export default function CategorySignup() {
  const { t } = useTranslation()
  const { category } = useParams()
  const navigate = useNavigate()
  const meta = CATEGORY_META[category]

  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    city: '',
    password: '',
    confirmPassword: '',
  })

  const [profilePreview, setProfilePreview] = useState(null)
  const [cardPreview, setCardPreview] = useState(null)
  const profileInputRef = useRef(null)
  const cardInputRef = useRef(null)

  const set = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }))

  const handleFilePreview = (e, setter) => {
    const file = e.target.files?.[0]
    if (file) setter(URL.createObjectURL(file))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!form.fullName.trim()) { setError(t('categorySignup.errFullName')); return }
    if (!form.email.trim() || !form.email.includes('@')) { setError(t('categorySignup.errEmail')); return }
    if (!form.phone.trim()) { setError(t('categorySignup.errPhone')); return }
    if (!form.city) { setError(t('categorySignup.errCity')); return }
    if (form.password.length < 6) { setError(t('categorySignup.errPasswordLength')); return }
    if (form.password !== form.confirmPassword) { setError(t('categorySignup.errPasswordMatch')); return }

    // TESTING MODE - remove duplicate email check before going live
    setSubmitting(true)
    try {
      await saveWorker({
        fullName: form.fullName.trim(),
        email: form.email.trim().toLowerCase(),
        phone: form.phone.trim(),
        city: form.city,
        category: t(meta.labelKey),
        password: form.password,
      })
      setSubmitted(true)
    } catch (err) {
      setError(err?.message || t('common.somethingWentWrong'))
    } finally {
      setSubmitting(false)
    }
  }

  if (!meta) {
    return (
      <div className="signup">
        <div className="signup__confirmation">
          <h1 className="signup__confirmation-title">{t('categorySignup.categoryNotFound')}</h1>
          <button type="button" className="signup__btn" onClick={() => navigate('/worker/signup')}>
            {t('common.goBack')}
          </button>
        </div>
      </div>
    )
  }

  if (submitted) {
    return (
      <div className="signup">
        <div className="signup__confirmation">
          <div className="signup__confirmation-icon">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#1B4FBA" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
              <path d="M22 4 12 14.01l-3-3"/>
            </svg>
          </div>
          <h1 className="signup__confirmation-title">{t('categorySignup.welcomeTitle')}</h1>
          <p className="signup__confirmation-text">{t('categorySignup.welcomeText')}</p>
          <button type="button" className="signup__btn" onClick={() => navigate('/')}>
            {t('common.backToHome')}
          </button>
        </div>
      </div>
    )
  }

  const categoryLabel = t(meta.labelKey)

  return (
    <div className="signup">
      <div className="signup__form-wrap">
        <h1 className="signup__form-title">{t('categorySignup.joinAs', { category: categoryLabel })}</h1>
        <p className="signup__form-subtitle">{t('categorySignup.createProfile')}</p>

        <form className="signup__form" onSubmit={handleSubmit} noValidate>
          <div className="signup__field">
            <label className="signup__label" htmlFor="sf-name">{t('categorySignup.fullName')}</label>
            <input id="sf-name" type="text" className="signup__input" placeholder={t('categorySignup.fullNamePlaceholder')} value={form.fullName} onChange={set('fullName')} autoComplete="name" />
          </div>

          <div className="signup__field">
            <label className="signup__label" htmlFor="sf-email">{t('categorySignup.email')}</label>
            <input id="sf-email" type="email" className="signup__input" placeholder={t('categorySignup.emailPlaceholder')} value={form.email} onChange={set('email')} autoComplete="email" />
          </div>

          <div className="signup__row">
            <div className="signup__field">
              <label className="signup__label" htmlFor="sf-phone">{t('categorySignup.phone')}</label>
              <input id="sf-phone" type="tel" className="signup__input" placeholder={t('categorySignup.phonePlaceholder')} value={form.phone} onChange={set('phone')} autoComplete="tel" />
            </div>

            <div className="signup__field">
              <label className="signup__label" htmlFor="sf-city">{t('categorySignup.city')}</label>
              <select id="sf-city" className="signup__select" value={form.city} onChange={set('city')}>
                <option value="" disabled>{t('categorySignup.selectCity')}</option>
                {CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          <div className="signup__row">
            <div className="signup__field">
              <label className="signup__label" htmlFor="sf-pw">{t('categorySignup.password')}</label>
              <input id="sf-pw" type="password" className="signup__input" placeholder={t('categorySignup.passwordPlaceholder')} value={form.password} onChange={set('password')} autoComplete="new-password" />
            </div>

            <div className="signup__field">
              <label className="signup__label" htmlFor="sf-cpw">{t('categorySignup.confirmPassword')}</label>
              <input id="sf-cpw" type="password" className="signup__input" placeholder={t('categorySignup.confirmPasswordPlaceholder')} value={form.confirmPassword} onChange={set('confirmPassword')} autoComplete="new-password" />
            </div>
          </div>

          <div className="signup__upload-section">
            <label className="signup__label">{t('categorySignup.profilePicture')}</label>
            <p className="signup__upload-hint">{t('categorySignup.profilePictureHint')}</p>
            <input ref={profileInputRef} type="file" accept="image/*" className="signup__file-input" onChange={(e) => handleFilePreview(e, setProfilePreview)} />
            <div className="signup__upload-area" onClick={() => profileInputRef.current?.click()}>
              {profilePreview ? (
                <img src={profilePreview} alt="" className="signup__upload-preview signup__upload-preview--round" />
              ) : (
                <div className="signup__upload-placeholder">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                  <span>{t('categorySignup.clickToUpload')}</span>
                </div>
              )}
            </div>
          </div>

          <div className="signup__upload-section">
            <label className="signup__label">{t('categorySignup.cardPicture')}</label>
            <p className="signup__upload-hint">{t('categorySignup.cardPictureHint')}</p>
            <input ref={cardInputRef} type="file" accept="image/*" className="signup__file-input" onChange={(e) => handleFilePreview(e, setCardPreview)} />
            <div className="signup__upload-area signup__upload-area--card" onClick={() => cardInputRef.current?.click()}>
              <img src={cardPreview || meta.defaultCard} alt="" className="signup__upload-preview signup__upload-preview--card" />
              {!cardPreview && <span className="signup__upload-badge">{t('categorySignup.default')}</span>}
            </div>
          </div>

          {error && <p className="signup__error">{error}</p>}

          <button type="submit" className="signup__btn signup__btn--full" disabled={submitting}>
            {submitting ? t('common.submitting') : t('categorySignup.createMyProfile')}
          </button>
        </form>
      </div>
    </div>
  )
}
