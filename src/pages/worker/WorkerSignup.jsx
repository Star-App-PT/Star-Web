import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import './WorkerSignup.css'

export default function WorkerSignup() {
  const { t } = useTranslation()
  const navigate = useNavigate()

  return (
    <div className="become-a-star container">
      <h1 className="become-a-star__title">Create your worker account</h1>
      <p className="become-a-star__desc">Join STAR to get clients in your area.</p>
      <div className="become-a-star__grid">
        <div className="become-a-star__step">
          <div className="become-a-star__icon-wrap">
            <div className="become-a-star__icon-svg" aria-hidden />
          </div>
          <span className="become-a-star__step-num">1</span>
          <h2 className="become-a-star__step-title">Tell us about your skill</h2>
          <p className="become-a-star__step-desc">Share basic info and your specialty.</p>
        </div>
        <div className="become-a-star__step">
          <div className="become-a-star__icon-wrap">
            <div className="become-a-star__icon-svg" aria-hidden />
          </div>
          <span className="become-a-star__step-num">2</span>
          <h2 className="become-a-star__step-title">Make it stand out</h2>
          <p className="become-a-star__step-desc">Add photos and a description.</p>
        </div>
        <div className="become-a-star__step">
          <div className="become-a-star__icon-wrap">
            <div className="become-a-star__icon-svg" aria-hidden />
          </div>
          <span className="become-a-star__step-num">3</span>
          <h2 className="become-a-star__step-title">Finish and publish</h2>
          <p className="become-a-star__step-desc">Set your rate and go live.</p>
        </div>
      </div>
      <hr className="become-a-star__divider" />
      <div className="become-a-star__footer">
        <button
          type="button"
          className="become-a-star__btn"
          onClick={() => navigate('/worker/profile/intro')}
        >
          {t('workerSignup.getStarted')}
        </button>
      </div>
    </div>
  )
}
