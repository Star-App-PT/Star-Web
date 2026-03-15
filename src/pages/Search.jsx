import { useState, useMemo } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ALL_WORKERS, CATEGORIES } from '../data/workers'
import WorkerAvatar from '../components/WorkerAvatar'
import './Search.css'

const CATEGORY_LABEL_KEYS = {
  cleaners: 'home.categoryClean',
  handymen: 'home.categoryRepair',
  services: 'home.categoryServices',
}

export default function Search() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const where = searchParams.get('where') || ''
  const when = searchParams.get('when') || ''
  const who = searchParams.get('who') || ''
  const category = searchParams.get('category') || ''
  const [favorites, setFavorites] = useState(new Set())

  const toggleFavorite = (e, id) => {
    e.preventDefault()
    e.stopPropagation()
    setFavorites((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const filteredWorkers = useMemo(() => {
    let workers = ALL_WORKERS

    if (category) {
      const cat = CATEGORIES.find((c) => c.id === category)
      if (cat) workers = cat.workers
    }

    if (who) {
      workers = workers.filter((w) =>
        w.specialty.toLowerCase().includes(who.toLowerCase())
      )
    }

    return workers
  }, [category, who])

  const categoryLabel = CATEGORY_LABEL_KEYS[category] ? t(CATEGORY_LABEL_KEYS[category]) : t('search.allCategories')
  const subtitle = [when, who].filter(Boolean).join(' · ')
  const workersCountText = filteredWorkers.length === 1
    ? t('search.workersAvailable', { count: 1 })
    : t('search.workersAvailable_plural', { count: filteredWorkers.length })

  return (
    <div className="search-page">
      <div className="search-page__container">
        <button type="button" className="search-page__back" onClick={() => navigate(-1)}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5"/><path d="m12 19-7-7 7-7"/></svg>
          {t('common.back')}
        </button>

        <div className="search-page__header">
          <h1 className="search-page__title">
            {t('search.title', { category: categoryLabel, location: where || t('search.yourArea') })}
          </h1>
          {subtitle && <p className="search-page__subtitle">{subtitle}</p>}
          <p className="search-page__count">{workersCountText}</p>
        </div>

        {filteredWorkers.length === 0 ? (
          <div className="search-page__empty">
            <div className="search-page__empty-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
            </div>
            <h2 className="search-page__empty-title">{t('search.noWorkersFound')}</h2>
            <p className="search-page__empty-desc">{t('search.noWorkersDesc')}</p>
            <button type="button" className="search-page__empty-btn" onClick={() => navigate('/')}>
              {t('common.backToHome')}
            </button>
          </div>
        ) : (
          <div className="search-page__grid">
            {filteredWorkers.map((w) => (
              <a key={w.id} className="search-card" href={`/worker/${w.id}`} target="_blank" rel="noopener noreferrer">
                <div className="search-card__img-wrap">
                  <img src={w.heroImage} alt="" className="search-card__img" />
                  {w.rating != null && (
                    <span className="search-card__pill">{t('home.topRated')}</span>
                  )}
                  <button
                    type="button"
                    className={`search-card__fav ${favorites.has(w.id) ? 'search-card__fav--on' : ''}`}
                    onClick={(e) => toggleFavorite(e, w.id)}
                    aria-label={t('workerDetail.favourite')}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill={favorites.has(w.id) ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                    </svg>
                  </button>
                </div>
                <WorkerAvatar worker={w} size={68} className="search-card__avatar" />
                <div className="search-card__body">
                  <p className="search-card__name">{w.name}</p>
                  <p className="search-card__skill">{w.specialty}</p>
                  <p className="search-card__location">{w.city}</p>
                  <p className="search-card__price">{t('common.perHour', { price: w.hourlyRate })}</p>
                  {w.rating != null && (
                    <p className="search-card__rating">★ {w.rating.toFixed(1)} <span className="search-card__reviews">({w.reviews})</span></p>
                  )}
                  {w.rating == null && (
                    <p className="search-card__rating search-card__rating--new">{t('common.new')}</p>
                  )}
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
