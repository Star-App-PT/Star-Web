import { useState, useMemo } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import './Home.css'

const CITY = 'Porto'
const PICKED_DATES = 'Aug 1 – Aug 3'

const CLEANERS = [
  { id: 'c1', name: 'Maria', specialty: 'Deep cleaning', rating: 5.0, hourlyRate: 28, image: 'https://picsum.photos/220/220?random=1' },
  { id: 'c2', name: 'Ana', specialty: 'Home cleaning', rating: 4.89, hourlyRate: 32, image: 'https://picsum.photos/220/220?random=2' },
  { id: 'c3', name: 'Inês', specialty: 'Office cleaning', rating: 4.95, hourlyRate: 25, image: 'https://picsum.photos/220/220?random=3' },
  { id: 'c4', name: 'Patrícia', specialty: 'Eco cleaning', rating: 4.8, hourlyRate: 30, image: 'https://picsum.photos/220/220?random=4' },
  { id: 'c5', name: 'Helena', specialty: 'Move-out clean', rating: 4.9, hourlyRate: 27, image: 'https://picsum.photos/220/220?random=5' },
  { id: 'c6', name: 'Sara', specialty: 'Window cleaning', rating: 4.7, hourlyRate: 29, image: 'https://picsum.photos/220/220?random=6' },
  { id: 'c7', name: 'Joana', specialty: 'Deep cleaning', rating: 4.85, hourlyRate: 31, image: 'https://picsum.photos/220/220?random=7' },
  { id: 'c8', name: 'Beatriz', specialty: 'Home cleaning', rating: 4.9, hourlyRate: 26, image: 'https://picsum.photos/220/220?random=8' },
  { id: 'c9', name: 'Andreia', specialty: 'Office cleaning', rating: 4.88, hourlyRate: 33, image: 'https://picsum.photos/220/220?random=9' },
  { id: 'c10', name: 'Carla', specialty: 'Eco cleaning', rating: 4.92, hourlyRate: 30, image: 'https://picsum.photos/220/220?random=10' },
]

const HANDYMEN = [
  { id: 'h1', name: 'João', specialty: 'Plumbing', rating: 4.92, hourlyRate: 35, image: 'https://picsum.photos/220/220?random=11' },
  { id: 'h2', name: 'Miguel', specialty: 'Electrical', rating: 5.0, hourlyRate: 42, image: 'https://picsum.photos/220/220?random=12' },
  { id: 'h3', name: 'Rui', specialty: 'General handyman', rating: 4.78, hourlyRate: 38, image: 'https://picsum.photos/220/220?random=13' },
  { id: 'h4', name: 'Carlos', specialty: 'Carpentry', rating: 4.9, hourlyRate: 40, image: 'https://picsum.photos/220/220?random=14' },
  { id: 'h5', name: 'Pedro', specialty: 'Painting', rating: 4.85, hourlyRate: 37, image: 'https://picsum.photos/220/220?random=15' },
  { id: 'h6', name: 'Bruno', specialty: 'HVAC', rating: 4.8, hourlyRate: 39, image: 'https://picsum.photos/220/220?random=16' },
  { id: 'h7', name: 'Nuno', specialty: 'Plumbing', rating: 4.75, hourlyRate: 36, image: 'https://picsum.photos/220/220?random=17' },
  { id: 'h8', name: 'Filipe', specialty: 'Electrical', rating: 4.95, hourlyRate: 41, image: 'https://picsum.photos/220/220?random=18' },
  { id: 'h9', name: 'Alex', specialty: 'General handyman', rating: 4.7, hourlyRate: 34, image: 'https://picsum.photos/220/220?random=19' },
  { id: 'h10', name: 'Daniel', specialty: 'Carpentry', rating: 4.88, hourlyRate: 38, image: 'https://picsum.photos/220/220?random=20' },
]

const SERVICES = [
  { id: 's1', name: 'Carlos', specialty: 'Portrait photography', rating: 4.85, hourlyRate: 45, image: 'https://picsum.photos/220/220?random=21' },
  { id: 's2', name: 'Sofia', specialty: 'Deep massage', rating: 5.0, hourlyRate: 55, image: 'https://picsum.photos/220/220?random=22' },
  { id: 's3', name: 'Tiago', specialty: 'Car detailing', rating: 4.7, hourlyRate: 22, image: 'https://picsum.photos/220/220?random=23' },
  { id: 's4', name: 'Rita', specialty: 'Event photography', rating: 4.9, hourlyRate: 48, image: 'https://picsum.photos/220/220?random=24' },
  { id: 's5', name: 'Luís', specialty: 'Hair styling', rating: 4.95, hourlyRate: 52, image: 'https://picsum.photos/220/220?random=25' },
  { id: 's6', name: 'Marta', specialty: 'Personal training', rating: 4.8, hourlyRate: 30, image: 'https://picsum.photos/220/220?random=26' },
  { id: 's7', name: 'Patrícia', specialty: 'Massage', rating: 5.0, hourlyRate: 60, image: 'https://picsum.photos/220/220?random=27' },
  { id: 's8', name: 'Gonçalo', specialty: 'Photography', rating: 4.76, hourlyRate: 47, image: 'https://picsum.photos/220/220?random=28' },
  { id: 's9', name: 'Ingrid', specialty: 'Nails', rating: 4.82, hourlyRate: 28, image: 'https://picsum.photos/220/220?random=29' },
  { id: 's10', name: 'Helder', specialty: 'Home spa', rating: 4.9, hourlyRate: 50, image: 'https://picsum.photos/220/220?random=30' },
]

const CATEGORIES = [
  { id: 'cleaners', labelKey: 'home.categoryClean', workers: CLEANERS },
  { id: 'handymen', labelKey: 'home.categoryRepair', workers: HANDYMEN },
  { id: 'services', labelKey: 'home.categoryServices', workers: SERVICES },
]

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
            <div key={w.id} className="home__worker-card" role="button" tabIndex={0} onClick={() => navigate('/workers')}>
              <div className="home__worker-card-img-wrap">
                <img src={w.image} alt="" className="home__worker-card-img" />
                <span className="home__worker-card-pill">{t('home.topRated')}</span>
                <button type="button" className={`home__worker-card-fav ${favorites.has(w.id) ? 'home__worker-card-fav--on' : ''}`} onClick={(e) => toggleFavorite(e, w.id)} aria-label="Favorite">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill={favorites.has(w.id) ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                </button>
              </div>
              <div className="home__worker-card-body">
                <p className="home__worker-card-name">{w.name}</p>
                <p className="home__worker-card-meta">{PICKED_DATES}</p>
                <p className="home__worker-card-price">€{w.hourlyRate} / hour</p>
                <p className="home__worker-card-rating">★ {w.rating.toFixed(1)}</p>
              </div>
            </div>
          ))}
        </div>

        <h3 className="home__section-title home__section-title--discover">{t('home.otherWorkersInArea')}</h3>
        <div className="home__cards-scroll">
          {otherWorkersMixed.map((w) => (
            <div key={w.id} className="home__worker-card" role="button" tabIndex={0} onClick={() => navigate('/workers')}>
              <div className="home__worker-card-img-wrap">
                <img src={w.image} alt="" className="home__worker-card-img" />
                <span className="home__worker-card-pill">{t('home.topRated')}</span>
                <button type="button" className={`home__worker-card-fav ${favorites.has(w.id) ? 'home__worker-card-fav--on' : ''}`} onClick={(e) => toggleFavorite(e, w.id)} aria-label="Favorite">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill={favorites.has(w.id) ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                </button>
              </div>
              <div className="home__worker-card-body">
                <p className="home__worker-card-name">{w.name}</p>
                <p className="home__worker-card-meta">{PICKED_DATES}</p>
                <p className="home__worker-card-price">€{w.hourlyRate} / hour</p>
                <p className="home__worker-card-rating">★ {w.rating.toFixed(1)}</p>
              </div>
            </div>
          ))}
          <div className="home__worker-card home__more-card" role="button" tabIndex={0} onClick={() => navigate('/workers')}>
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
