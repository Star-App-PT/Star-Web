import { useState, useMemo, useEffect, useRef } from 'react'
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

const WHO_SUBCATEGORIES = {
  cleaners: [
    { label: 'Deep Clean', icon: '🧽' },
    { label: 'Regular Clean', icon: '🧹' },
    { label: 'Post-Build', icon: '🏗️' },
    { label: 'End of Tenancy', icon: '🏠' },
    { label: 'Office Clean', icon: '🏢' },
    { label: 'Carpet Clean', icon: '🫧' },
    { label: 'Window Clean', icon: '🪟' },
    { label: 'Oven Clean', icon: '🍳' },
    { label: 'Garage Clean', icon: '🚗' },
    { label: 'After-Party Clean', icon: '🎉' },
  ],
  handymen: [
    { label: 'Plumbing', icon: '🔧' },
    { label: 'Electrical', icon: '⚡' },
    { label: 'Painting', icon: '🎨' },
    { label: 'Tiling', icon: '🔲' },
    { label: 'Carpentry', icon: '🪵' },
    { label: 'Furniture Assembly', icon: '🪑' },
    { label: 'Appliances', icon: '🔌' },
    { label: 'Flooring', icon: '🪵' },
    { label: 'Plastering', icon: '🧱' },
    { label: 'Locksmith', icon: '🔑' },
  ],
  services: [
    { label: 'Photography', icon: '📸' },
    { label: 'Private Chef', icon: '👨‍🍳' },
    { label: 'Massage', icon: '💆' },
    { label: 'Prepared Meals', icon: '🍱' },
    { label: 'Personal Training', icon: '💪' },
    { label: 'Makeup', icon: '💄' },
    { label: 'Hair', icon: '✂️' },
    { label: 'Spa Treatments', icon: '🧖' },
    { label: 'Catering', icon: '🍽️' },
    { label: 'Nails', icon: '💅' },
  ],
}

const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
const DAY_NAMES = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

function fmtShortDate(d) {
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

function buildCalendarCells(year, month) {
  let startPad = new Date(year, month, 1).getDay() - 1
  if (startPad < 0) startPad = 6
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const cells = []
  for (let i = 0; i < startPad; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(d)
  return cells
}

export default function Home() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const selectedCategory = searchParams.get('category') || 'cleaners'
  const [favorites, setFavorites] = useState(new Set())
  const { city: CITY, supported: citySupported, userCityName, nearbyCities } = useUserLocation()

  const [openDropdown, setOpenDropdown] = useState(null)
  const [whereValue, setWhereValue] = useState('')
  const [whenValue, setWhenValue] = useState('')
  const [whoValue, setWhoValue] = useState('')
  const searchWrapRef = useRef(null)
  const todayRef = useRef(new Date())
  const today = todayRef.current
  const [calYear, setCalYear] = useState(today.getFullYear())
  const [calMonth, setCalMonth] = useState(today.getMonth())
  const [recentLocations, setRecentLocations] = useState(() => {
    try { return JSON.parse(localStorage.getItem('star-recent-locations') || '[]') }
    catch { return [] }
  })

  const current = CATEGORIES.find((c) => c.id === selectedCategory) || CATEGORIES[0]
  const categoryLabel = selectedCategory === 'cleaners' ? t('home.categoryClean') : selectedCategory === 'handymen' ? t('home.categoryRepair') : t('home.categoryServices')

  const otherWorkersMixed = useMemo(() => {
    const others = CATEGORIES.filter((c) => c.id !== selectedCategory).flatMap((c) => c.workers)
    return shuffle(others).slice(0, 6)
  }, [selectedCategory])

  useEffect(() => {
    const subs = WHO_SUBCATEGORIES[selectedCategory] || []
    setWhoValue((prev) => (prev && !subs.find((s) => s.label === prev) ? '' : prev))
  }, [selectedCategory])

  useEffect(() => {
    const handler = (e) => {
      if (searchWrapRef.current && !searchWrapRef.current.contains(e.target)) setOpenDropdown(null)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const toggleDropdown = (name) => setOpenDropdown((prev) => (prev === name ? null : name))

  const selectWhere = (city) => {
    setWhereValue(city)
    setOpenDropdown(null)
    const updated = [city, ...recentLocations.filter((c) => c !== city)].slice(0, 5)
    setRecentLocations(updated)
    localStorage.setItem('star-recent-locations', JSON.stringify(updated))
  }

  const selectWhen = (displayText) => {
    setWhenValue(displayText)
    setOpenDropdown(null)
  }

  const selectCalendarDay = (day) => {
    if (!day) return
    const d = new Date(calYear, calMonth, day)
    if (d < new Date(today.getFullYear(), today.getMonth(), today.getDate())) return
    selectWhen(fmtShortDate(d))
  }

  const selectWho = (label) => {
    setWhoValue((prev) => (prev === label ? '' : label))
    setOpenDropdown(null)
  }

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
    if (!whereValue) return
    navigate(`/search?where=${encodeURIComponent(whereValue)}&when=${encodeURIComponent(whenValue)}&who=${encodeURIComponent(whoValue)}`)
  }

  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)
  const satOffset = today.getDay() === 6 ? 0 : (today.getDay() === 0 ? 6 : 6 - today.getDay())
  const saturday = new Date(today)
  saturday.setDate(today.getDate() + satOffset)
  const sunday = new Date(saturday)
  sunday.setDate(sunday.getDate() + 1)

  const quickDates = [
    { label: 'Today', sub: fmtShortDate(today), value: `Today, ${fmtShortDate(today)}` },
    { label: 'Tomorrow', sub: fmtShortDate(tomorrow), value: `Tomorrow, ${fmtShortDate(tomorrow)}` },
    { label: 'This weekend', sub: `${fmtShortDate(saturday)} – ${fmtShortDate(sunday)}`, value: `This weekend, ${fmtShortDate(saturday)} – ${fmtShortDate(sunday)}` },
  ]

  const calendarCells = buildCalendarCells(calYear, calMonth)
  const isCurrentMonth = calYear === today.getFullYear() && calMonth === today.getMonth()
  const canGoPrev = calYear > today.getFullYear() || (calYear === today.getFullYear() && calMonth > today.getMonth())

  const prevMonth = () => {
    if (calMonth === 0) { setCalYear((y) => y - 1); setCalMonth(11) }
    else setCalMonth((m) => m - 1)
  }
  const nextMonth = () => {
    if (calMonth === 11) { setCalYear((y) => y + 1); setCalMonth(0) }
    else setCalMonth((m) => m + 1)
  }

  return (
    <div className="home">
      <div className="home__hero container">
        <div className="home__search-wrap" ref={searchWrapRef}>
          <form className="home__search" onSubmit={handleSearch}>
            <div className="home__search-field" onClick={() => toggleDropdown('where')}>
              <span className="home__search-label">{t('common.where')}</span>
              <span className={`home__search-val ${!whereValue ? 'home__search-val--ph' : ''}`}>
                {whereValue || t('home.placeholderWhere')}
              </span>
            </div>
            <div className="home__search-divider" />
            <div className="home__search-field" onClick={() => toggleDropdown('when')}>
              <span className="home__search-label">{t('common.when')}</span>
              <span className={`home__search-val ${!whenValue ? 'home__search-val--ph' : ''}`}>
                {whenValue || t('home.placeholderWhen')}
              </span>
            </div>
            <div className="home__search-divider" />
            <div className="home__search-field" onClick={() => toggleDropdown('who')}>
              <span className="home__search-label">{t('common.who')}</span>
              <span className={`home__search-val ${!whoValue ? 'home__search-val--ph' : ''}`}>
                {whoValue || t('home.placeholderWho')}
              </span>
            </div>
            <button type="submit" className={`home__search-btn${!whereValue ? ' home__search-btn--off' : ''}`} disabled={!whereValue} aria-label="Search">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
            </button>
          </form>

          {openDropdown && <div className="home__dd-backdrop" onClick={() => setOpenDropdown(null)} />}

          {openDropdown === 'where' && (
            <div className="home__dd home__dd--where">
              {recentLocations.length > 0 && (
                <>
                  <p className="home__dd-heading">Recent searches</p>
                  {recentLocations.map((city) => (
                    <button key={city} type="button" className="home__dd-opt" onClick={() => selectWhere(city)}>
                      <span className="home__dd-pin">🕐</span>
                      <div><span className="home__dd-city">{city}</span></div>
                    </button>
                  ))}
                  <div className="home__dd-sep" />
                </>
              )}
              <p className="home__dd-heading">Nearby cities</p>
              {nearbyCities.map(({ city, desc }) => (
                <button key={city} type="button" className="home__dd-opt" onClick={() => selectWhere(city)}>
                  <span className="home__dd-pin">📍</span>
                  <div>
                    <span className="home__dd-city">{city}</span>
                    <span className="home__dd-desc">{desc}</span>
                  </div>
                </button>
              ))}
            </div>
          )}

          {openDropdown === 'when' && (
            <div className="home__dd home__dd--when">
              <div className="home__when-row">
                <div className="home__when-quick">
                  {quickDates.map((q) => (
                    <button key={q.label} type="button" className="home__when-opt" onClick={() => selectWhen(q.value)}>
                      <span className="home__when-opt-lbl">{q.label}</span>
                      <span className="home__when-opt-sub">{q.sub}</span>
                    </button>
                  ))}
                </div>
                <div className="home__cal">
                  <div className="home__cal-head">
                    <button type="button" className="home__cal-arr" onClick={prevMonth} disabled={!canGoPrev}>‹</button>
                    <span className="home__cal-mo">{MONTH_NAMES[calMonth]} {calYear}</span>
                    <button type="button" className="home__cal-arr" onClick={nextMonth}>›</button>
                  </div>
                  <div className="home__cal-dayrow">
                    {DAY_NAMES.map((d) => <span key={d} className="home__cal-dn">{d}</span>)}
                  </div>
                  <div className="home__cal-grid">
                    {calendarCells.map((day, i) => {
                      const isPast = day && new Date(calYear, calMonth, day) < new Date(today.getFullYear(), today.getMonth(), today.getDate())
                      const isToday = day && isCurrentMonth && day === today.getDate()
                      return (
                        <button key={i} type="button"
                          className={`home__cal-c${!day ? ' home__cal-c--e' : ''}${isToday ? ' home__cal-c--today' : ''}${isPast ? ' home__cal-c--past' : ''}`}
                          onClick={() => selectCalendarDay(day)} disabled={!day || isPast}
                        >{day || ''}</button>
                      )
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {openDropdown === 'who' && (
            <div className="home__dd home__dd--who">
              <div className="home__who-pills">
                {(WHO_SUBCATEGORIES[selectedCategory] || []).map(({ label, icon }) => (
                  <button key={label} type="button"
                    className={`home__who-pill${whoValue === label ? ' home__who-pill--on' : ''}`}
                    onClick={() => selectWho(label)}
                  >
                    <span className="home__who-ico">{icon}</span>
                    {label}
                  </button>
                ))}
              </div>
              <p className="home__who-more">✨ More coming soon</p>
            </div>
          )}
        </div>
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
