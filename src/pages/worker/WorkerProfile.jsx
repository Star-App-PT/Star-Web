import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { useDemoMode } from '../../contexts/DemoModeContext'
import './WorkerProfile.css'

export default function WorkerProfile() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { isDemoMode } = useDemoMode()

  return (
    <div className="worker-profile container">
      <h1 className="worker-profile__title">{t('workerProfile.title')}</h1>
      <p className="worker-profile__intro">Complete your profile (skills, rates, etc.).</p>
      {/* DEMO ONLY — REMOVE BEFORE LAUNCH */}
      {isDemoMode && (
        <p
          onClick={() => navigate('/worker/choose-category')}
          style={{
            textAlign: 'center',
            color: '#AAAAAA',
            fontSize: '14px',
            cursor: 'pointer',
            marginTop: '16px',
          }}
        >
          Skip (Demo Only)
        </p>
      )}
    </div>
  )
}
