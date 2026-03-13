import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
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

export default function WorkerSignup() {
  const { t } = useTranslation()
  const navigate = useNavigate()

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
          onClick={() => navigate('/worker/profile/intro')}
        >
          {t('workerSignup.getStarted')}
        </button>
      </div>
    </div>
  )
}
