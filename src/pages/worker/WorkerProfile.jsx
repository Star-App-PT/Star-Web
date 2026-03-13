import { useTranslation } from 'react-i18next'
import './WorkerProfile.css'

export default function WorkerProfile() {
  const { t } = useTranslation()

  return (
    <div className="worker-profile container">
      <h1 className="worker-profile__title">{t('workerProfile.title')}</h1>
      <p className="worker-profile__intro">Complete your profile (skills, rates, etc.).</p>
    </div>
  )
}
