import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import cleanerImg from '../../assets/workers/cleaners/cleaner-4.jpg'
import handymanImg from '../../assets/workers/handymen/handyman-1.jpg'
import photographerImg from '../../assets/workers/services/photographer.jpg'
import './WorkerSignup.css'

const STEPS = [
  {
    image: cleanerImg,
    title: 'Tell us about your skill',
    desc: 'Share some basic info, like your specialty and where you work.',
  },
  {
    image: handymanImg,
    title: 'Make it stand out',
    desc: 'Add photos, a short bio, and highlight what makes you great.',
  },
  {
    image: photographerImg,
    title: 'Finish and publish',
    desc: 'Set your hourly rate, choose your availability, and go live.',
  },
]

const CITIES = ['Porto', 'Lisbon', 'Faro']
const CATEGORIES = ['Cleaning', 'Repairs', 'Services']

function saveApplication(data) {
  // TODO: Replace localStorage with Supabase insert when backend is ready
  // e.g. supabase.from('worker_applications').insert(data)
  const existing = JSON.parse(localStorage.getItem('star-worker-applications') || '[]')
  existing.push({ ...data, id: crypto.randomUUID(), createdAt: new Date().toISOString() })
  localStorage.setItem('star-worker-applications', JSON.stringify(existing))
}

export default function WorkerSignup() {
  const navigate = useNavigate()
  const [showForm, setShowForm] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    city: '',
    category: '',
    password: '',
    confirmPassword: '',
  })

  const set = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!form.fullName.trim()) { setError('Full name is required'); return }
    if (!form.email.trim() || !form.email.includes('@')) { setError('A valid email is required'); return }
    if (!form.phone.trim()) { setError('Phone number is required'); return }
    if (!form.city) { setError('Please select a city'); return }
    if (!form.category) { setError('Please select a service category'); return }
    if (form.password.length < 6) { setError('Password must be at least 6 characters'); return }
    if (form.password !== form.confirmPassword) { setError('Passwords do not match'); return }

    // TESTING MODE - remove duplicate email check before going live
    // In production, check if email already exists:
    // const { data: existing } = await supabase.from('worker_applications').select('id').eq('email', form.email).single()
    // if (existing) { setError('This email is already registered'); return }

    setSubmitting(true)
    try {
      saveApplication({
        fullName: form.fullName.trim(),
        email: form.email.trim().toLowerCase(),
        phone: form.phone.trim(),
        city: form.city,
        category: form.category,
        password: form.password,
      })
      setSubmitted(true)
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
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
            Your application is under review. We will contact you shortly.
          </p>
          <button type="button" className="signup__btn" onClick={() => navigate('/')}>
            Back to Home
          </button>
        </div>
      </div>
    )
  }

  if (showForm) {
    return (
      <div className="signup">
        <div className="signup__form-wrap">
          <h1 className="signup__form-title">Create your account</h1>
          <p className="signup__form-subtitle">Fill in your details to join STAR as a worker</p>

          <form className="signup__form" onSubmit={handleSubmit} noValidate>
            <div className="signup__field">
              <label className="signup__label" htmlFor="sf-name">Full name</label>
              <input id="sf-name" type="text" className="signup__input" placeholder="Your full name" value={form.fullName} onChange={set('fullName')} autoComplete="name" />
            </div>

            <div className="signup__field">
              <label className="signup__label" htmlFor="sf-email">Email</label>
              <input id="sf-email" type="email" className="signup__input" placeholder="you@example.com" value={form.email} onChange={set('email')} autoComplete="email" />
            </div>

            <div className="signup__field">
              <label className="signup__label" htmlFor="sf-phone">Phone number</label>
              <input id="sf-phone" type="tel" className="signup__input" placeholder="+351 912 345 678" value={form.phone} onChange={set('phone')} autoComplete="tel" />
            </div>

            <div className="signup__row">
              <div className="signup__field">
                <label className="signup__label" htmlFor="sf-city">City</label>
                <select id="sf-city" className="signup__select" value={form.city} onChange={set('city')}>
                  <option value="" disabled>Select city</option>
                  {CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div className="signup__field">
                <label className="signup__label" htmlFor="sf-cat">Service category</label>
                <select id="sf-cat" className="signup__select" value={form.category} onChange={set('category')}>
                  <option value="" disabled>Select category</option>
                  {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
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

            {error && <p className="signup__error">{error}</p>}

            <button type="submit" className="signup__btn signup__btn--full" disabled={submitting}>
              {submitting ? 'Submitting...' : 'Create Account'}
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="signup">
      <div className="signup__hero">
        <h1 className="signup__title">Become a Star</h1>
        <p className="signup__subtitle">
          Join us in three simple steps
        </p>
      </div>

      <div className="signup__steps">
        {STEPS.map((step, i) => (
          <div key={i} className="signup__step">
            <div className="signup__img-wrap">
              <img
                src={step.image}
                alt={step.title}
                className="signup__img"
              />
              <span className="signup__num">{i + 1}</span>
            </div>
            <h2 className="signup__step-title">{step.title}</h2>
            <p className="signup__step-desc">{step.desc}</p>
          </div>
        ))}
      </div>

      <div className="signup__cta">
        <button
          type="button"
          className="signup__btn"
          onClick={() => setShowForm(true)}
        >
          Get Started
        </button>
      </div>
    </div>
  )
}
