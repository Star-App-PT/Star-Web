import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useDemoMode } from '../../contexts/DemoModeContext'
import './WorkerProfileIntro.css'

export default function WorkerProfileIntro() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { isDemoMode } = useDemoMode()

  return (
    <div className="worker-profile-intro container">
      <div className="worker-profile-intro__wrap">
        <p className="worker-profile-intro__step">{t('workerProfileIntro.step')}</p>
        <h1 className="worker-profile-intro__title">{t('workerProfileIntro.title')}</h1>
        <p className="worker-profile-intro__body">
          {t('workerProfileIntro.body')}
        </p>
        <hr className="worker-profile-intro__divider" />
        <div className="worker-profile-intro__footer">
          <button
            type="button"
            className="worker-profile-intro__back btn-back"
            onClick={() => navigate('/worker/signup')}
          >
            {t('common.back')}
          </button>
          <button
            type="button"
            className="worker-profile-intro__btn btn-primary"
            onClick={() => navigate('/worker/profile/skill')}
          >
            {t('common.continue')}
          </button>
        </div>
        {/* DEMO ONLY — REMOVE BEFORE LAUNCH */}
        {isDemoMode && (
          <p
            onClick={() => navigate('/worker/profile/skill')}
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
