import { useSearchParams, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { CATEGORIES, PICKED_DATES } from '../data/workers'
import useUserLocation from '../hooks/useUserLocation'
import WorkerAvatar from '../components/WorkerAvatar'
import './Workers.css'

export default function Workers() {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const [searchParams] = useSearchParams()
  const selectedCategory = searchParams.get('category') || 'cleaners'
  const current = CATEGORIES.find((category) => category.id === selectedCategory) || CATEGORIES[0]
  const categoryLabel = selectedCategory === 'cleaners' ? t('home.categoryClean') : selectedCategory === 'handymen' ? t('home.categoryRepair') : t('home.categoryServices')
  const { city } = useUserLocation()

  return (
    <div className="workers-page">
      <div className="workers-page__container">
        <button type="button" className="workers-page__back" onClick={() => navigate(-1)}>
          {t('common.back')}
        </button>

        <div className="workers-page__header">
          <p className="workers-page__eyebrow">{categoryLabel}</p>
          <h1 className="workers-page__title">{t('home.workersInLocation', { location: city })}</h1>
          <p className="workers-page__subtitle">
            {t('home.browseProfiles', { count: current.workers.length, city })}
          </p>
        </div>

        <div className="workers-page__grid">
          {current.workers.map((worker) => (
            <a key={worker.id} className="workers-page__card" href={`/worker/${worker.id}`} target="_blank" rel="noopener noreferrer">
              <div className="workers-page__image-wrap">
                <img src={worker.heroImage} alt={worker.specialty} className="workers-page__image" />
                <span className="workers-page__pill">{t('home.topRated')}</span>
              </div>
              <WorkerAvatar worker={worker} size={68} className="workers-page__avatar" />
              <div className="workers-page__body">
                <p className="workers-page__name">{worker.name}</p>
                <p className="workers-page__skill">{worker.specialty}</p>
                <p className="workers-page__meta">{PICKED_DATES}</p>
                <p className="workers-page__price">{t('common.perHour', { price: worker.hourlyRate })}</p>
                {worker.rating != null && <p className="workers-page__rating">★ {worker.rating.toFixed(1)}</p>}
                {worker.rating == null && <p className="workers-page__rating workers-page__rating--new">{t('common.new')}</p>}
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}
