import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import './WorkerSkillType.css'

const OPTIONS = [
  { id: 'clean', labelKey: 'workerSkill.clean' },
  { id: 'repair', labelKey: 'workerSkill.repair' },
  { id: 'services', labelKey: 'workerSkill.services' },
]

export default function WorkerSkillType() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [selectedId, setSelectedId] = useState(null)

  const handleNext = () => {
    if (!selectedId) return
    if (selectedId === 'clean') {
      navigate('/worker/profile/cleaner')
    } else {
      navigate('/worker/profile')
    }
  }

  return (
    <div className="worker-skill container">
      <div className="worker-skill__wrap">
        <p className="worker-skill__step">Step 2</p>
        <h1 className="worker-skill__title">{t('workerSkill.heading')}</h1>
        <div className="worker-skill__grid">
          {OPTIONS.map(({ id, labelKey }) => (
            <button
              key={id}
              type="button"
              className={`worker-skill__option ${selectedId === id ? 'worker-skill__option--on' : ''}`}
              onClick={() => setSelectedId(id)}
            >
              <span className="worker-skill__label">{t(labelKey)}</span>
            </button>
          ))}
        </div>
        <hr className="worker-skill__divider" />
        <div className="worker-skill__footer">
          <button
            type="button"
            className="worker-skill__back"
            onClick={() => navigate('/worker/profile/intro')}
          >
            {t('common.back')}
          </button>
          <button
            type="button"
            className="worker-skill__next"
            onClick={handleNext}
            disabled={!selectedId}
          >
            {t('common.continue')}
          </button>
        </div>
      </div>
    </div>
  )
}
