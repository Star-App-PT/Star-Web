import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useDemoMode } from '../../../contexts/DemoModeContext'
import CountryCodePicker from '../../../components/CountryCodePicker'
import './ClientSignup.css'

export default function ClientSignupName() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { isDemoMode } = useDemoMode()

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [country, setCountry] = useState(null)
  const [phone, setPhone] = useState('')

  const canContinue = firstName.trim() && lastName.trim() && phone.trim()

  const handleNext = () => {
    if (!canContinue) return
    navigate('/client/signup/photo')
  }

  return (
    <div className="csu">
      <div className="csu__top">
        <span className="csu__step">{t('clientSignup.step2')}</span>
        <button type="button" className="csu__back" onClick={() => navigate('/client/signup')}>
          {t('common.back')}
        </button>
      </div>

      <div className="csu__card">
        <h1 className="csu__title">{t('clientSignup.nameTitle')}</h1>
        <p className="csu__subtitle">{t('clientSignup.nameSubtitle')}</p>

        <div className="csu__field-row">
          <input
            type="text"
            className="csu__input"
            placeholder={t('clientSignup.firstName')}
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            autoComplete="given-name"
          />
          <input
            type="text"
            className="csu__input"
            placeholder={t('clientSignup.lastName')}
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            autoComplete="family-name"
          />
        </div>

        <div className="csu__field">
          <label className="csu__field-label">{t('clientSignup.phoneNumber')}</label>
          <div className="csu__phone-group">
            <CountryCodePicker
              value={country}
              onChange={setCountry}
              buttonClassName="csu__country-picker-button"
            />
            <input
              type="tel"
              className="csu__phone-input"
              placeholder={t('clientSignup.phoneNumber')}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              autoComplete="tel"
            />
          </div>
        </div>
      </div>

      <div className="csu__footer">
        <button
          type="button"
          className="csu__next btn-primary"
          disabled={!canContinue}
          onClick={handleNext}
        >
          {t('serviceArea.next')}
        </button>
        {/* DEMO ONLY — REMOVE BEFORE LAUNCH */}
        {isDemoMode && (
          <p
            onClick={() => navigate('/client/signup/photo')}
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
