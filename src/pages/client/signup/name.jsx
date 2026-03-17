import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './ClientSignup.css'

const COUNTRY_CODES = [
  { code: '+351', label: '🇵🇹 +351' },
  { code: '+44',  label: '🇬🇧 +44' },
  { code: '+1',   label: '🇺🇸 +1' },
  { code: '+55',  label: '🇧🇷 +55' },
  { code: '+33',  label: '🇫🇷 +33' },
  { code: '+49',  label: '🇩🇪 +49' },
  { code: '+34',  label: '🇪🇸 +34' },
  { code: '+39',  label: '🇮🇹 +39' },
  { code: '+31',  label: '🇳🇱 +31' },
]

export default function ClientSignupName() {
  const navigate = useNavigate()

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [countryCode, setCountryCode] = useState('+351')
  const [phone, setPhone] = useState('')

  const canContinue = firstName.trim() && lastName.trim() && phone.trim()

  const handleNext = () => {
    if (!canContinue) return
    navigate('/client/signup/photo')
  }

  return (
    <div className="csu">
      <div className="csu__top">
        <span className="csu__step">Step 2 of 4</span>
        <button type="button" className="csu__back" onClick={() => navigate('/client/signup')}>
          Back
        </button>
      </div>

      <div className="csu__card">
        <h1 className="csu__title">What's your name?</h1>
        <p className="csu__subtitle">Let workers know who they're visiting.</p>

        <div className="csu__field-row">
          <input
            type="text"
            className="csu__input"
            placeholder="First name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            autoComplete="given-name"
          />
          <input
            type="text"
            className="csu__input"
            placeholder="Last name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            autoComplete="family-name"
          />
        </div>

        <div className="csu__field">
          <label className="csu__field-label">Phone number</label>
          <div className="csu__phone-group">
            <select
              className="csu__country-select"
              value={countryCode}
              onChange={(e) => setCountryCode(e.target.value)}
            >
              {COUNTRY_CODES.map((c, i) => (
                <option key={`${c.code}-${i}`} value={c.code}>{c.label}</option>
              ))}
            </select>
            <input
              type="tel"
              className="csu__phone-input"
              placeholder="Phone number"
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
          Next
        </button>
        {/* DEMO ONLY — REMOVE BEFORE LAUNCH */}
        <span className="csu__skip" onClick={() => navigate('/client/signup/photo')}>
          Skip (Demo Only)
        </span>
      </div>
    </div>
  )
}
