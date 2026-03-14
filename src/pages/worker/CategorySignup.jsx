import { useState, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../../supabase'
import actionHomeCleaning from '../../assets/workers/action/action-home-cleaning.jpg'
import actionCarpentry from '../../assets/workers/action/action-carpentry.jpg'
import actionPhotography from '../../assets/workers/action/action-photography.jpg'
import './WorkerSignup.css'

const CITIES = ['Porto', 'Lisbon', 'Faro']

const CATEGORY_META = {
  cleaning: { label: 'Cleaning', defaultCard: actionHomeCleaning },
  repairs:  { label: 'Repairs',  defaultCard: actionCarpentry },
  services: { label: 'Services', defaultCard: actionPhotography },
}

async function saveWorker(data) {
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

    if (!form.fullName.trim()) { setError('Full name is required'); return }
    if (!form.email.trim() || !form.email.includes('@')) { setError('A valid email is required'); return }
    if (!form.phone.trim()) { setError('Phone number is required'); return }
    if (!form.city) { setError('Please select a city'); return }
    if (form.password.length < 6) { setError('Password must be at least 6 characters'); return }
    if (form.password !== form.confirmPassword) { setError('Passwords do not match'); return }

    // TESTING MODE - remove duplicate email check before going live
    // const { data: existing } = await supabase.from('workers').select('id').eq('email', form.email.trim().toLowerCase()).maybeSingle()
    // if (existing) { setError('This email is already registered'); return }

    setSubmitting(true)
    try {
      await saveWorker({
        fullName: form.fullName.trim(),
        email: form.email.trim().toLowerCase(),
        phone: form.phone.trim(),
        city: form.city,
        category: meta.label,
        password: form.password,
      })
      setSubmitted(true)
    } catch (err) {
      setError(err?.message || 'Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (!meta) {
    return (
      <div className="signup">
        <div className="signup__confirmation">
          <h1 className="signup__confirmation-title">Category not found</h1>
          <button type="button" className="signup__btn" onClick={() => navigate('/worker/signup')}>
            Go back
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
          <h1 className="signup__confirmation-title">Welcome to STAR!</h1>
          <p className="signup__confirmation-text">
            Your profile is under review. We will contact you shortly.
          </p>
          <button type="button" className="signup__btn" onClick={() => navigate('/')}>
            Back to Home
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="signup">
      <div className="signup__form-wrap">
        <h1 className="signup__form-title">Join STAR as {meta.label}</h1>
        <p className="signup__form-subtitle">Create your worker profile</p>

        <form className="signup__form" onSubmit={handleSubmit} noValidate>
          <div className="signup__field">
            <label className="signup__label" htmlFor="sf-name">Full name</label>
            <input id="sf-name" type="text" className="signup__input" placeholder="Your full name" value={form.fullName} onChange={set('fullName')} autoComplete="name" />
          </div>

          <div className="signup__field">
            <label className="signup__label" htmlFor="sf-email">Email</label>
            <input id="sf-email" type="email" className="signup__input" placeholder="you@example.com" value={form.email} onChange={set('email')} autoComplete="email" />
          </div>

          <div className="signup__row">
            <div className="signup__field">
              <label className="signup__label" htmlFor="sf-phone">Phone number</label>
              <input id="sf-phone" type="tel" className="signup__input" placeholder="+351 912 345 678" value={form.phone} onChange={set('phone')} autoComplete="tel" />
            </div>

            <div className="signup__field">
              <label className="signup__label" htmlFor="sf-city">City</label>
              <select id="sf-city" className="signup__select" value={form.city} onChange={set('city')}>
                <option value="" disabled>Select city</option>
                {CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          <div className="signup__row">
            <div className="signup__field">
              <label className="signup__label" htmlFor="sf-pw">Password</label>
              <input id="sf-pw" type="password" className="signup__input" placeholder="Min. 6 characters" value={form.password} onChange={set('password')} autoComplete="new-password" />
            </div>

            <div className="signup__field">
              <label className="signup__label" htmlFor="sf-cpw">Confirm password</label>
              <input id="sf-cpw" type="password" className="signup__input" placeholder="Re-enter password" value={form.confirmPassword} onChange={set('confirmPassword')} autoComplete="new-password" />
            </div>
          </div>

          <div className="signup__upload-section">
            <label className="signup__label">Profile picture</label>
            <p className="signup__upload-hint">Upload a photo that clearly shows your face and shoulders only. This is how clients will recognise you.</p>
            <input ref={profileInputRef} type="file" accept="image/*" className="signup__file-input" onChange={(e) => handleFilePreview(e, setProfilePreview)} />
            <div className="signup__upload-area" onClick={() => profileInputRef.current?.click()}>
              {profilePreview ? (
                <img src={profilePreview} alt="Profile preview" className="signup__upload-preview signup__upload-preview--round" />
              ) : (
                <div className="signup__upload-placeholder">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                  <span>Click to upload</span>
                </div>
              )}
            </div>
          </div>

          <div className="signup__upload-section">
            <label className="signup__label">Card picture</label>
            <p className="signup__upload-hint">Upload a high quality photo related to your work. This is the first thing clients see on your card. You can leave the default image if you don't have one yet.</p>
            <input ref={cardInputRef} type="file" accept="image/*" className="signup__file-input" onChange={(e) => handleFilePreview(e, setCardPreview)} />
            <div className="signup__upload-area signup__upload-area--card" onClick={() => cardInputRef.current?.click()}>
              <img src={cardPreview || meta.defaultCard} alt="Card preview" className="signup__upload-preview signup__upload-preview--card" />
              {!cardPreview && <span className="signup__upload-badge">Default</span>}
            </div>
          </div>

          {error && <p className="signup__error">{error}</p>}

          <button type="submit" className="signup__btn signup__btn--full" disabled={submitting}>
            {submitting ? 'Submitting...' : 'Create My Profile'}
          </button>
        </form>
      </div>
    </div>
  )
}
