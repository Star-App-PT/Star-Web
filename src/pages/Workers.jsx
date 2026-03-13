import { useNavigate, useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { CATEGORIES, CITY, PICKED_DATES } from '../data/workers'
import './Workers.css'

export default function Workers() {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const [searchParams] = useSearchParams()
  const selectedCategory = searchParams.get('category') || 'cleaners'
  const current = CATEGORIES.find((category) => category.id === selectedCategory) || CATEGORIES[0]
  const categoryLabel = selectedCategory === 'cleaners' ? t('home.categoryClean') : selectedCategory === 'handymen' ? t('home.categoryRepair') : t('home.categoryServices')

  return (
    <div className="workers-page">
      <div className="workers-page__container">
        <button type="button" className="workers-page__back" onClick={() => navigate(-1)}>
          Back
        </button>

        <div className="workers-page__header">
          <p className="workers-page__eyebrow">{categoryLabel}</p>
          <h1 className="workers-page__title">{t('home.workersInLocation', { location: CITY })}</h1>
          <p className="workers-page__subtitle">
            Browse {current.workers.length} warm, professional profiles for your next booking in {CITY}.
          </p>
        </div>

        <div className="workers-page__grid">
          {current.workers.map((worker) => (
            <article key={worker.id} className="workers-page__card">
              <div className="workers-page__image-wrap">
                <img src={worker.image} alt={worker.name} className="workers-page__image" />
                <span className="workers-page__pill">{t('home.topRated')}</span>
              </div>

              <div className="workers-page__body">
                <p className="workers-page__name">{worker.name}</p>
                <p className="workers-page__skill">{worker.specialty}</p>
                <p className="workers-page__meta">{PICKED_DATES}</p>
                <p className="workers-page__price">EUR {worker.hourlyRate} / hour</p>
                <p className="workers-page__rating">★ {worker.rating.toFixed(1)}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  )
}
