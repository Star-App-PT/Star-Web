import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import './WorkerProfileIntro.css'

export default function WorkerProfileIntro() {
  const { t } = useTranslation()
  const navigate = useNavigate()

  return (
    <div className="worker-profile-intro container">
      <div className="worker-profile-intro__wrap">
        <p className="worker-profile-intro__step">Step 1</p>
        <h1 className="worker-profile-intro__title">Tell us about your skill</h1>
        <p className="worker-profile-intro__body">
          In this step, we'll ask which type of skill you have and whether clients will book you for an hour, a day, or longer. Then tell us more about your experience and the region you cover.
        </p>
        <hr className="worker-profile-intro__divider" />
        <div className="worker-profile-intro__footer">
          <button
            type="button"
            className="worker-profile-intro__back"
            onClick={() => navigate('/worker/signup')}
          >
            {t('common.back')}
          </button>
          <button
            type="button"
            className="worker-profile-intro__btn"
            onClick={() => navigate('/worker/profile/skill')}
          >
            {t('common.continue')}
          </button>
        </div>
      </div>
    </div>
  )
}
