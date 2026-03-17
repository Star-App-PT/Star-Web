import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import cleanerImg from '../assets/workers/cleaners/cleaner-4.jpg'
import handymanImg from '../assets/workers/handymen/handyman-1.jpg'
import photographerImg from '../assets/workers/services/photographer.jpg'
import './worker/WorkerSignup.css'

const CATEGORIES = [
  { id: 'cleaning', labelKey: 'workerSignup.cleaning', image: cleanerImg },
  { id: 'repairs', labelKey: 'workerSignup.repairs', image: handymanImg },
  { id: 'services', labelKey: 'workerSignup.services', image: photographerImg },
]

export default function ChooseCategory() {
  const { t } = useTranslation()
  const navigate = useNavigate()

  const handleSelect = (categoryId) => {
    navigate(`/service-area/${categoryId}`)
  }

  return (
    <div className="signup signup--picker">
      <div className="signup__card">
        <h1 className="signup__title">{t('workerSignup.whatWorkTitle')}</h1>

        <div className="signup__steps">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              className="signup__step signup__step--link"
              onClick={() => handleSelect(cat.id)}
            >
              <div className="signup__img-wrap">
                <img src={cat.image} alt={t(cat.labelKey)} className="signup__img" />
                <h2 className="signup__step-title">{t(cat.labelKey)}</h2>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
