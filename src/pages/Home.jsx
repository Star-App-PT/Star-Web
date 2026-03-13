import { useState, useMemo } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import './Home.css'
import { CATEGORIES, PICKED_DATES, CLEANERS, HANDYMEN, SERVICES } from '../data/workers'
import useUserLocation from '../hooks/useUserLocation'
import WorkerAvatar from '../components/WorkerAvatar'

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export default function Home() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const selectedCategory = searchParams.get('category') || 'cleaners'
  const [favorites, setFavorites] = useState(new Set())
  const { city: CITY, supported: citySupported, userCityName } = useUserLocation()

  const current = CATEGORIES.find((c) => c.id === selectedCategory) || CATEGORIES[0]
  const categoryLabel = selectedCategory === 'cleaners' ? t('home.categoryClean') : selectedCategory === 'handymen' ? t('home.categoryRepair') : t('home.categoryServices')

  const otherWorkersMixed = useMemo(() => {
    const others = CATEGORIES.filter((c) => c.id !== selectedCategory).flatMap((c) => c.workers)
    return shuffle(others).slice(0, 6)
  }, [selectedCategory])

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

  const handleSearch = (e) => {
    e.preventDefault()
    navigate('/search')
  }

  return (
    <div className="home">
      <div className="home__hero container">
        <form className="home__search" onSubmit={handleSearch}>
          <div className="home__search-field">
            <span className="home__search-label">{t('common.where')}</span>
            <input type="text" placeholder={t('home.placeholderWhere')} className="home__search-input" readOnly />
          </div>
          <div className="home__search-divider" />
          <div className="home__search-field">
            <span className="home__search-label">{t('common.when')}</span>
            <input type="text" placeholder={t('home.placeholderWhen')} className="home__search-input" readOnly />
          </div>
          <div className="home__search-divider" />
          <div className="home__search-field">
            <span className="home__search-label">{t('common.who')}</span>
            <input type="text" placeholder={t('home.placeholderWho')} className="home__search-input" readOnly />
          </div>
          <button type="submit" className="home__search-btn" aria-label="Search">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
          </button>
        </form>
      </div>

      <div className="home__main container">
        {!citySupported && userCityName && (
          <div className="home__coming-soon">
            <div className="home__coming-soon-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 8.2c0 7.3-8 11.8-8 11.8z"/><circle cx="12" cy="10" r="3"/></svg>
            </div>
            <h3 className="home__coming-soon-title">Star is coming soon to {userCityName}!</h3>
            <p className="home__coming-soon-desc">
              Try choosing a different service type, or change the location to find workers in other areas.
            </p>
            <p className="home__coming-soon-sub">Showing workers in {CITY} instead.</p>
          </div>
        )}
        <div className="home__hero-card">
          <div>
            <h2 className="home__hero-title">{t('home.continueSearching', { category: categoryLabel.toLowerCase(), location: CITY })}</h2>
            <p className="home__hero-dates">{PICKED_DATES} · 2 guests</p>
          </div>
          <div className="home__hero-thumb">
            <img src={current.workers[0].image} alt="" />
          </div>
        </div>

        <h3 className="home__section-title">{t('home.workersInLocation', { location: CITY })}</h3>
        <div className="home__cards-scroll">
          {current.workers.map((w) => (
            <a key={w.id} className="home__worker-card" href={`/worker/${w.id}`} target="_blank" rel="noopener noreferrer">
              <div className="home__worker-card-img-wrap">
                <img src={w.heroImage} alt="" className="home__worker-card-img" />
                <span className="home__worker-card-pill">{t('home.topRated')}</span>
                <button type="button" className={`home__worker-card-fav ${favorites.has(w.id) ? 'home__worker-card-fav--on' : ''}`} onClick={(e) => toggleFavorite(e, w.id)} aria-label="Favorite">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill={favorites.has(w.id) ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                </button>
              </div>
              <WorkerAvatar worker={w} size={68} className="home__worker-card-avatar" />
              <div className="home__worker-card-body">
                <p className="home__worker-card-name">{w.name}</p>
                <p className="home__worker-card-skill">{w.specialty}</p>
                <p className="home__worker-card-meta">{PICKED_DATES}</p>
                <p className="home__worker-card-price">€{w.hourlyRate} / hour</p>
                {w.rating != null && <p className="home__worker-card-rating">★ {w.rating.toFixed(1)}</p>}
                {w.rating == null && <p className="home__worker-card-rating home__worker-card-rating--new">New</p>}
              </div>
            </a>
          ))}
        </div>

        <h3 className="home__section-title home__section-title--discover">{t('home.otherWorkersInArea')}</h3>
        <div className="home__cards-scroll">
          {otherWorkersMixed.map((w) => (
            <a key={w.id} className="home__worker-card" href={`/worker/${w.id}`} target="_blank" rel="noopener noreferrer">
              <div className="home__worker-card-img-wrap">
                <img src={w.heroImage} alt="" className="home__worker-card-img" />
                <span className="home__worker-card-pill">{t('home.topRated')}</span>
                <button type="button" className={`home__worker-card-fav ${favorites.has(w.id) ? 'home__worker-card-fav--on' : ''}`} onClick={(e) => toggleFavorite(e, w.id)} aria-label="Favorite">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill={favorites.has(w.id) ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                </button>
              </div>
              <WorkerAvatar worker={w} size={68} className="home__worker-card-avatar" />
              <div className="home__worker-card-body">
                <p className="home__worker-card-name">{w.name}</p>
                <p className="home__worker-card-skill">{w.specialty}</p>
                <p className="home__worker-card-meta">{PICKED_DATES}</p>
                <p className="home__worker-card-price">€{w.hourlyRate} / hour</p>
                {w.rating != null && <p className="home__worker-card-rating">★ {w.rating.toFixed(1)}</p>}
                {w.rating == null && <p className="home__worker-card-rating home__worker-card-rating--new">New</p>}
              </div>
            </a>
          ))}
          <div className="home__worker-card home__more-card" role="button" tabIndex={0} onClick={() => navigate(`/workers?category=${selectedCategory}`)}>
            <div className="home__more-imgs">
              <img src={CLEANERS[0].image} alt="" />
              <img src={HANDYMEN[0].image} alt="" />
              <img src={SERVICES[0].image} alt="" />
            </div>
            <p className="home__more-label">{t('home.more')}</p>
          </div>
        </div>

        <div className="home__cta-block">
          <p className="home__cta-text">{t('home.ctaText')}</p>
          <Link to="/worker/signup" className="home__cta">
            {t('home.becomeAStar')}
          </Link>
        </div>
      </div>
    </div>
  )
}
