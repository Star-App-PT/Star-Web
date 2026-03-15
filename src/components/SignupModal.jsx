import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import './SignupModal.css'

export default function SignupModal({ open, onClose, category }) {
  const { t } = useTranslation()
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    dob: '',
    email: '',
    password: '',
  })

  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  if (!open) return null

  const set = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }))

  const canSubmit = form.firstName.trim() && form.lastName.trim() && form.email.trim() && form.password.trim()

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!canSubmit) return
    // TODO: submit to Supabase
  }

  return (
    <div className="smodal-overlay" onClick={onClose}>
      <div className="smodal" onClick={(e) => e.stopPropagation()}>
        <div className="smodal__header">
          <button type="button" className="smodal__back" onClick={onClose} aria-label={t('common.back')}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5"/><path d="m12 19-7-7 7-7"/></svg>
          </button>
          <h2 className="smodal__title">{t('signupModal.title')}</h2>
        </div>

        <form className="smodal__body" onSubmit={handleSubmit} noValidate>
          <div className="smodal__section">
            <h3 className="smodal__label">{t('signupModal.legalName')}</h3>
            <div className="smodal__field-group">
              <input
                type="text"
                className="smodal__input smodal__input--top"
                placeholder={t('signupModal.firstName')}
                value={form.firstName}
                onChange={set('firstName')}
                autoComplete="given-name"
              />
              <input
                type="text"
                className="smodal__input smodal__input--bottom"
                placeholder={t('signupModal.lastName')}
                value={form.lastName}
                onChange={set('lastName')}
                autoComplete="family-name"
              />
            </div>
            <p className="smodal__hint">{t('signupModal.legalNameHint')}</p>
          </div>

          <div className="smodal__section">
            <h3 className="smodal__label">{t('signupModal.dateOfBirth')}</h3>
            <div className="smodal__field-group">
              <div className="smodal__input-wrap">
                <input
                  type="date"
                  className="smodal__input smodal__input--date"
                  placeholder={t('signupModal.birthDate')}
                  value={form.dob}
                  onChange={set('dob')}
                  autoComplete="bday"
                />
                <svg className="smodal__date-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
              </div>
            </div>
            <p className="smodal__hint">{t('signupModal.dobHint')}</p>
          </div>

          <div className="smodal__section">
            <h3 className="smodal__label">{t('signupModal.contactInfo')}</h3>
            <div className="smodal__field-group">
              <input
                type="email"
                className="smodal__input"
                placeholder={t('signupModal.email')}
                value={form.email}
                onChange={set('email')}
                autoComplete="email"
              />
            </div>
            <p className="smodal__hint">{t('signupModal.emailHint')}</p>
          </div>

          <div className="smodal__section">
            <h3 className="smodal__label">{t('signupModal.passwordLabel')}</h3>
            <div className="smodal__field-group">
              <input
                type="password"
                className="smodal__input"
                placeholder={t('signupModal.password')}
                value={form.password}
                onChange={set('password')}
                autoComplete="new-password"
              />
            </div>
          </div>

          <button
            type="submit"
            className="smodal__continue"
            disabled={!canSubmit}
          >
            {t('signupModal.agreeAndContinue')}
          </button>
        </form>
      </div>
    </div>
  )
}
