import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useDemoMode } from '../../contexts/DemoModeContext'
import CountryCodePicker from '../../components/CountryCodePicker'
import './WorkerProfile.css'
import './WorkerProfileCleaner.css'

const CLEANER_SKILL_IDS = [
  'deepCleaning',
  'glassCleaning',
  'exitCleaning',
  'homeCleaning',
  'bathCleaning',
  'kitchenClean',
  'fridgeDetail',
  'floorCleaning',
  'sofaCleaning',
  'workCleaning',
  'buildCleaning',
  'hostCleaning',
  'laundryClean',
  'patioCleanup',
  'carValeting',
  'autoDetailing',
]

export default function WorkerProfileCleaner() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { isDemoMode } = useDemoMode()
  const [selectedSkills, setSelectedSkills] = useState([])
  const [profilePhotoUrl, setProfilePhotoUrl] = useState(null)
  const [otherSkill, setOtherSkill] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [phoneCountry, setPhoneCountry] = useState(null)
  const [phone, setPhone] = useState('')
  const [addressLine1, setAddressLine1] = useState('')
  const [addressLine2, setAddressLine2] = useState('')
  const [city, setCity] = useState('')
  const [postcode, setPostcode] = useState('')
  const [country, setCountry] = useState('')
  const [dob, setDob] = useState('')

  const toggleSkill = (id) => {
    setSelectedSkills((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    )
  }

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setProfilePhotoUrl(URL.createObjectURL(file))
  }

  const handleContinue = () => {
    navigate('/worker/profile')
  }

  return (
    <div className="worker-profile-cleaner container">
      <div className="worker-profile-cleaner__illus">
        <div className="worker-profile-cleaner__img-placeholder" aria-hidden />
      </div>
      <h1 className="worker-profile-cleaner__title">{t('workerProfile.title')}</h1>
      <p className="worker-profile-cleaner__intro">{t('workerProfileCleaner.intro')}</p>

      <section className="worker-profile__section">
        <h2>{t('workerProfile.profilePhoto')}</h2>
        <div className="worker-profile__photo-upload">
          <div className="worker-profile__avatar">
            {profilePhotoUrl ? (
              <img
                src={profilePhotoUrl}
                alt={t('workerProfileCleaner.profileAlt')}
                className="worker-profile__avatar-img"
              />
            ) : (
              <div className="worker-profile__avatar-placeholder" aria-hidden="true">
                <svg viewBox="0 0 64 64" className="worker-profile__avatar-icon">
                  <circle cx="32" cy="24" r="12" />
                  <path d="M16 50c0-8.8 7.2-16 16-16s16 7.2 16 16" />
                </svg>
              </div>
            )}
          </div>
          <div className="worker-profile__photo-actions">
            <input
              id="worker-profile-cleaner-photo"
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
              className="worker-profile__file-input"
            />
            <label htmlFor="worker-profile-cleaner-photo" className="worker-profile__file-label">
              {t('workerProfile.choosePhoto')}
            </label>
          </div>
        </div>
      </section>

      <section className="worker-profile-cleaner__section">
        <h2 className="worker-profile-cleaner__section-title">
          {t('workerProfileCleaner.skillsTitle')}
        </h2>
        <p className="worker-profile-cleaner__hint">{t('workerProfileCleaner.skillsHint')}</p>
        <div className="worker-profile-cleaner__skills">
          {CLEANER_SKILL_IDS.map((id) => (
            <button
              key={id}
              type="button"
              className={`worker-profile-cleaner__skill ${
                selectedSkills.includes(id) ? 'worker-profile-cleaner__skill--on' : ''
              }`}
              onClick={() => toggleSkill(id)}
            >
              {t(`workerProfileCleaner.${id}`)}
            </button>
          ))}
        </div>
      </section>

      <section className="worker-profile-cleaner__section">
        <h2 className="worker-profile-cleaner__section-title">
          {t('workerProfileCleaner.other')}
        </h2>
        <textarea
          className="worker-profile-cleaner__other-input"
          placeholder={t('workerProfileCleaner.otherPlaceholder')}
          value={otherSkill}
          onChange={(e) => setOtherSkill(e.target.value)}
          rows={3}
        />
      </section>

      <section className="worker-profile-cleaner__section worker-profile-cleaner__basic">
        <h2 className="worker-profile-cleaner__section-title">
          {t('workerProfileCleaner.basicInfoTitle')}
        </h2>
        <div className="worker-profile-cleaner__field-row">
          <div className="worker-profile-cleaner__field">
            <label className="worker-profile-cleaner__field-label">
              {t('workerProfileCleaner.firstName')}
            </label>
            <input
              type="text"
              className="worker-profile-cleaner__input"
              placeholder={t('workerProfileCleaner.firstNamePlaceholder')}
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </div>
          <div className="worker-profile-cleaner__field">
            <label className="worker-profile-cleaner__field-label">
              {t('workerProfileCleaner.lastName')}
            </label>
            <input
              type="text"
              className="worker-profile-cleaner__input"
              placeholder={t('workerProfileCleaner.lastNamePlaceholder')}
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>
        </div>
        <div className="worker-profile-cleaner__field">
          <label className="worker-profile-cleaner__field-label">
            {t('workerProfileCleaner.email')}
          </label>
          <input
            type="email"
            className="worker-profile-cleaner__input"
            placeholder={t('workerProfileCleaner.emailPlaceholder')}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="worker-profile-cleaner__field">
          <label className="worker-profile-cleaner__field-label">
            {t('workerProfileCleaner.phone')}
          </label>
          <div className="worker-profile-cleaner__phone-group">
            <CountryCodePicker
              value={phoneCountry}
              onChange={setPhoneCountry}
              buttonClassName="worker-profile-cleaner__country-picker-button"
            />
            <input
              type="tel"
              className="worker-profile-cleaner__input worker-profile-cleaner__input--phone"
              placeholder={t('workerProfileCleaner.phonePlaceholder')}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
        </div>
        <div className="worker-profile-cleaner__field">
          <label className="worker-profile-cleaner__field-label">
            {t('workerProfileCleaner.address')}
          </label>
          <input
            type="text"
            className="worker-profile-cleaner__input"
            placeholder={t('workerProfileCleaner.addressPlaceholder')}
            value={addressLine1}
            onChange={(e) => setAddressLine1(e.target.value)}
          />
        </div>
        <div className="worker-profile-cleaner__field">
          <label className="worker-profile-cleaner__field-label">
            {t('workerProfileCleaner.addressLine2')}
          </label>
          <input
            type="text"
            className="worker-profile-cleaner__input"
            placeholder={t('workerProfileCleaner.addressLine2Placeholder')}
            value={addressLine2}
            onChange={(e) => setAddressLine2(e.target.value)}
          />
        </div>
        <div className="worker-profile-cleaner__field-row">
          <div className="worker-profile-cleaner__field">
            <label className="worker-profile-cleaner__field-label">
              {t('workerProfileCleaner.city')}
            </label>
            <input
              type="text"
              className="worker-profile-cleaner__input"
              placeholder={t('workerProfileCleaner.cityPlaceholder')}
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
          </div>
          <div className="worker-profile-cleaner__field">
            <label className="worker-profile-cleaner__field-label">
              {t('workerProfileCleaner.postcode')}
            </label>
            <input
              type="text"
              className="worker-profile-cleaner__input"
              placeholder={t('workerProfileCleaner.postcodePlaceholder')}
              value={postcode}
              onChange={(e) => setPostcode(e.target.value)}
            />
          </div>
        </div>
        <div className="worker-profile-cleaner__field">
          <label className="worker-profile-cleaner__field-label">
            {t('workerProfileCleaner.country')}
          </label>
          <input
            type="text"
            className="worker-profile-cleaner__input"
            placeholder={t('workerProfileCleaner.countryPlaceholder')}
            value={country}
            onChange={(e) => setCountry(e.target.value)}
          />
        </div>
        <div className="worker-profile-cleaner__field">
          <label className="worker-profile-cleaner__field-label">
            {t('workerProfileCleaner.dob')}
          </label>
          <input
            type="date"
            className="worker-profile-cleaner__input"
            value={dob}
            onChange={(e) => setDob(e.target.value)}
          />
        </div>
      </section>

      <div className="worker-profile-cleaner__footer">
        <button
          type="button"
          className="worker-profile-cleaner__back btn-back"
          onClick={() => navigate('/worker/profile/skill')}
        >
          {t('common.back')}
        </button>
        <button
          type="button"
          className="worker-profile-cleaner__continue btn-primary"
          onClick={handleContinue}
        >
          {t('common.continue')}
        </button>
      </div>
      {/* DEMO ONLY — REMOVE BEFORE LAUNCH */}
      {isDemoMode && (
        <p
          onClick={() => navigate('/worker/profile')}
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
  )
}
