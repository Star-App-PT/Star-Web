import { useState, useMemo, useEffect, useRef, useCallback } from 'react'
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

const I = { width: 18, height: 18, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.5, strokeLinecap: 'round', strokeLinejoin: 'round' }

const WHO_SUBCATEGORIES = {
  cleaners: [
    { value: 'Deep Clean', labelKey: 'subcategories.deepClean', icon: <svg {...I}><path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48 2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48 2.83-2.83"/></svg> },
    { value: 'Regular Clean', labelKey: 'subcategories.regularClean', icon: <svg {...I}><path d="M12 2v8m0 0-4 12m4-12 4 12"/><path d="M5 22h14"/></svg> },
    { value: 'Post-Build', labelKey: 'subcategories.postBuild', icon: <svg {...I}><path d="M2 20h20"/><path d="M4 20v-6a8 8 0 0 1 16 0v6"/><path d="M12 4v4"/></svg> },
    { value: 'End of Tenancy', labelKey: 'subcategories.endOfTenancy', icon: <svg {...I}><path d="m3 12 9-9 9 9"/><path d="M5 10v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V10"/><path d="M10 21v-6h4v6"/></svg> },
    { value: 'Office Clean', labelKey: 'subcategories.officeClean', icon: <svg {...I}><rect x="4" y="2" width="16" height="20" rx="1"/><path d="M9 6h1m5 0h1M9 10h1m5 0h1M9 14h1m5 0h1M9 18h1m5 0h1"/></svg> },
    { value: 'Carpet Clean', labelKey: 'subcategories.carpetClean', icon: <svg {...I}><rect x="2" y="6" width="20" height="12" rx="2"/><path d="M6 6v12m4-12v12m4-12v12m4-12v12"/></svg> },
    { value: 'Window Clean', labelKey: 'subcategories.windowClean', icon: <svg {...I}><rect x="3" y="3" width="18" height="18" rx="1"/><path d="M3 12h18M12 3v18"/></svg> },
    { value: 'Oven Clean', labelKey: 'subcategories.ovenClean', icon: <svg {...I}><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M2 12h20"/><circle cx="8" cy="8" r="1"/><circle cx="12" cy="8" r="1"/></svg> },
    { value: 'Garage Clean', labelKey: 'subcategories.garageClean', icon: <svg {...I}><path d="M5 20V9l7-6 7 6v11"/><path d="M5 20h14"/><path d="M8 20v-5h8v5"/></svg> },
    { value: 'After-Party Clean', labelKey: 'subcategories.afterPartyClean', icon: <svg {...I}><path d="M5.8 11.3 2 22l10.7-3.8"/><path d="M12 2l1 6-4 4"/><path d="m17 7-5 5"/><circle cx="19" cy="19" r="3"/></svg> },
  ],
  handymen: [
    { value: 'Plumbing', labelKey: 'subcategories.plumbing', icon: <svg {...I}><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg> },
    { value: 'Electrical', labelKey: 'subcategories.electrical', icon: <svg {...I}><path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z"/></svg> },
    { value: 'Painting', labelKey: 'subcategories.painting', icon: <svg {...I}><rect x="2" y="2" width="20" height="8" rx="2"/><path d="M10 10v4a2 2 0 0 0 4 0v-4"/><path d="M12 18v4"/></svg> },
    { value: 'Tiling', labelKey: 'subcategories.tiling', icon: <svg {...I}><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg> },
    { value: 'Carpentry', labelKey: 'subcategories.carpentry', icon: <svg {...I}><path d="M15 12 6.5 3.5l-3 3L12 15"/><path d="m18 15 4 4-3 3-4-4"/><path d="m14.5 12.5 4 4"/></svg> },
    { value: 'Drywall', labelKey: 'subcategories.drywall', icon: <svg {...I}><rect x="3" y="3" width="18" height="18" rx="1"/><path d="M3 10h18"/><path d="M10 3v7"/></svg> },
    { value: 'Furniture Assembly', labelKey: 'subcategories.furnitureAssembly', icon: <svg {...I}><path d="M5 21h14M5 21V8l7-5 7 5v13"/><path d="M9 21v-8h6v8"/></svg> },
    { value: 'Appliances', labelKey: 'subcategories.appliances', icon: <svg {...I}><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg> },
    { value: 'Flooring', labelKey: 'subcategories.flooring', icon: <svg {...I}><path d="M2 4h20v16H2z"/><path d="M2 12h20M8 4v16m8-16v16"/></svg> },
    { value: 'Plastering', labelKey: 'subcategories.plastering', icon: <svg {...I}><path d="m14 4-8 16"/><path d="M5 20h14"/><path d="M18 8l-4-4"/></svg> },
    { value: 'Locksmith', labelKey: 'subcategories.locksmith', icon: <svg {...I}><circle cx="9" cy="9" r="5"/><path d="M14 14l7 7"/><path d="M17 17l3-1"/><path d="M19 19l1-3"/></svg> },
  ],
  services: [
    { value: 'Photography', labelKey: 'subcategories.photography', icon: <svg {...I}><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg> },
    { value: 'Private Chef', labelKey: 'subcategories.privateChef', icon: <svg {...I}><path d="M6 13.87A4 4 0 0 1 7.41 6a5.11 5.11 0 0 1 9.18 0A4 4 0 0 1 18 13.87V21H6z"/><path d="M6 17h12"/></svg> },
    { value: 'Hair', labelKey: 'subcategories.hair', icon: <svg {...I}><circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M20 4 8.12 15.88M14.47 14.48 20 20M8.12 8.12 12 12"/></svg> },
    { value: 'Massage', labelKey: 'subcategories.massage', icon: <svg {...I}><path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4z"/><path d="M6 1v3m4-3v3m4-3v3"/></svg> },
    { value: 'Prepared Meals', labelKey: 'subcategories.preparedMeals', icon: <svg {...I}><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 12h18"/><path d="M9 5v14m6-14v14"/></svg> },
    { value: 'Nails', labelKey: 'subcategories.nails', icon: <svg {...I}><path d="M10 3h4l1 6H9z"/><rect x="9" y="9" width="6" height="11" rx="1"/><path d="M12 20v2"/></svg> },
    { value: 'Training', labelKey: 'subcategories.training', icon: <svg {...I}><path d="M6.5 6v12M17.5 6v12"/><path d="M3 8v8M21 8v8"/><path d="M6.5 12h11"/></svg> },
    { value: 'Makeup', labelKey: 'subcategories.makeup', icon: <svg {...I}><path d="M9 3h6l1 7H8z"/><rect x="8" y="10" width="8" height="10" rx="1"/><path d="M12 20v2"/></svg> },
    { value: 'Spa Treatments', labelKey: 'subcategories.spaTreatments', icon: <svg {...I}><path d="M12 22c6 0 8-4 8-9H4c0 5 2 9 8 9z"/><path d="M12 2C6 2 4 8 4 13"/><path d="M12 2c6 0 8 6 8 11"/></svg> },
    { value: 'Catering', labelKey: 'subcategories.catering', icon: <svg {...I}><path d="M4 18h16"/><path d="M4 18c0-8 3.5-13 8-13s8 5 8 13"/><path d="M12 2v3"/></svg> },
  ],
}

const MONTH_KEYS = ['calendar.jan', 'calendar.feb', 'calendar.mar', 'calendar.apr', 'calendar.may', 'calendar.jun', 'calendar.jul', 'calendar.aug', 'calendar.sep', 'calendar.oct', 'calendar.nov', 'calendar.dec']
const DAY_KEYS = ['calendar.mon', 'calendar.tue', 'calendar.wed', 'calendar.thu', 'calendar.fri', 'calendar.sat', 'calendar.sun']

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
  const { city: CITY, supported: citySupported, userCityName, isOutsidePortugal, nearbyCities } = useUserLocation()

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

  const [autocompleteSuggestions, setAutocompleteSuggestions] = useState([])
  const [isAutocompleteLoading, setIsAutocompleteLoading] = useState(false)
  const autocompleteTimer = useRef(null)

  const fetchAutocomplete = useCallback((query) => {
    if (autocompleteTimer.current) clearTimeout(autocompleteTimer.current)
    if (!query || query.length < 2) { setAutocompleteSuggestions([]); return }
    setIsAutocompleteLoading(true)
    autocompleteTimer.current = setTimeout(async () => {
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&addressdetails=1&limit=5&accept-language=en&featuretype=city`
        )
        const data = await res.json()
        const results = data
          .filter((r) => r.address && (r.address.city || r.address.town || r.address.village || r.type === 'city' || r.type === 'administrative'))
          .map((r) => ({
            city: r.address.city || r.address.town || r.address.village || r.display_name.split(',')[0],
            region: [r.address.state, r.address.country].filter(Boolean).join(', '),
            display: r.display_name,
            lat: parseFloat(r.lat),
            lon: parseFloat(r.lon),
          }))
        const seen = new Set()
        const unique = results.filter((r) => {
          const k = r.city.toLowerCase()
          if (seen.has(k)) return false
          seen.add(k)
          return true
        })
        setAutocompleteSuggestions(unique)
      } catch {
        setAutocompleteSuggestions([])
      } finally {
        setIsAutocompleteLoading(false)
      }
    }, 300)
  }, [])

  const current = CATEGORIES.find((c) => c.id === selectedCategory) || CATEGORIES[0]
  const categoryLabel = selectedCategory === 'cleaners' ? t('home.categoryClean') : selectedCategory === 'handymen' ? t('home.categoryRepair') : t('home.categoryServices')
  const searchCity = whereValue || userCityName || CITY
  const workersCity = citySupported ? searchCity : CITY
  const comingSoonCity = isOutsidePortugal ? t('home.yourArea') : (userCityName || t('home.yourArea'))

  const otherWorkersMixed = useMemo(() => {
    const others = CATEGORIES.filter((c) => c.id !== selectedCategory).flatMap((c) => c.workers)
    return shuffle(others).slice(0, 6)
  }, [selectedCategory])

  useEffect(() => {
    const subs = WHO_SUBCATEGORIES[selectedCategory] || []
    setWhoValue((prev) => (prev && !subs.find((s) => s.value === prev) ? '' : prev))
  }, [selectedCategory])

  useEffect(() => {
    if (userCityName && !whereValue) setWhereValue(userCityName)
  }, [userCityName])

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

  const selectWho = (value) => {
    setWhoValue((prev) => (prev === value ? '' : value))
    setOpenDropdown(null)
  }

  const whoDisplayLabel = useMemo(() => {
    if (!whoValue) return ''
    const allSubs = Object.values(WHO_SUBCATEGORIES).flat()
    const match = allSubs.find((s) => s.value === whoValue)
    return match ? t(match.labelKey) : whoValue
  }, [whoValue, t])

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
    navigate(`/search?where=${encodeURIComponent(whereValue)}&when=${encodeURIComponent(whenValue)}&who=${encodeURIComponent(whoValue)}&category=${encodeURIComponent(selectedCategory)}`)
  }

  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)
  const satOffset = today.getDay() === 6 ? 0 : (today.getDay() === 0 ? 6 : 6 - today.getDay())
  const saturday = new Date(today)
  saturday.setDate(today.getDate() + satOffset)
  const sunday = new Date(saturday)
  sunday.setDate(sunday.getDate() + 1)

  const quickDates = [
    { label: t('home.today'), sub: fmtShortDate(today), value: `${t('home.today')}, ${fmtShortDate(today)}` },
    { label: t('home.tomorrow'), sub: fmtShortDate(tomorrow), value: `${t('home.tomorrow')}, ${fmtShortDate(tomorrow)}` },
    { label: t('home.thisWeekend'), sub: `${fmtShortDate(saturday)} – ${fmtShortDate(sunday)}`, value: `${t('home.thisWeekend')}, ${fmtShortDate(saturday)} – ${fmtShortDate(sunday)}` },
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
            <div className="home__search-field" onClick={() => { if (openDropdown !== 'where') toggleDropdown('where') }}>
              <span className="home__search-label">{t('common.where')}</span>
              <input
                type="text"
                className="home__search-input"
                placeholder={t('home.placeholderWhere')}
                value={whereValue}
                onChange={(e) => { setWhereValue(e.target.value); fetchAutocomplete(e.target.value) }}
                onFocus={() => setOpenDropdown('where')}
              />
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
                {whoDisplayLabel || t('home.placeholderWho')}
              </span>
            </div>
            <button type="submit" className={`home__search-btn${!whereValue ? ' home__search-btn--off' : ''}`} disabled={!whereValue} aria-label={t('home.search')}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
            </button>
          </form>

          {openDropdown && <div className="home__dd-backdrop" onClick={() => setOpenDropdown(null)} />}

          {openDropdown === 'where' && (
            <div className="home__dd home__dd--where">
              {recentLocations.length > 0 && (
                <>
                  <p className="home__dd-heading">{t('home.recentSearches')}</p>
                  {recentLocations.map((city) => (
                    <button key={city} type="button" className="home__dd-opt" onClick={() => { selectWhere(city); setAutocompleteSuggestions([]) }}>
                      <span className="home__dd-pin">🕐</span>
                      <div><span className="home__dd-city">{city}</span></div>
                    </button>
                  ))}
                  <div className="home__dd-sep" />
                </>
              )}

              {whereValue.length >= 2 ? (
                <>
                  {isAutocompleteLoading && autocompleteSuggestions.length === 0 && (
                    <p className="home__dd-heading home__dd-heading--loading">{t('home.searching')}</p>
                  )}
                  {autocompleteSuggestions.length > 0 && (
                    <>
                      <p className="home__dd-heading">{t('home.searchResults')}</p>
                      {autocompleteSuggestions.map((s) => (
                        <button key={`${s.city}-${s.lat}`} type="button" className="home__dd-opt" onClick={() => { selectWhere(s.city); setAutocompleteSuggestions([]) }}>
                          <span className="home__dd-pin"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 21c-4.97-5.37-8-8.65-8-12a8 8 0 0 1 16 0c0 3.35-3.03 6.63-8 12z"/><circle cx="12" cy="9" r="3"/></svg></span>
                          <div>
                            <span className="home__dd-city">{s.city}</span>
                            <span className="home__dd-desc">{s.region}</span>
                          </div>
                        </button>
                      ))}
                    </>
                  )}
                  {!isAutocompleteLoading && autocompleteSuggestions.length === 0 && (
                    <p className="home__dd-heading home__dd-heading--loading">{t('home.noCitiesFound')}</p>
                  )}
                </>
              ) : (
                <>
                  <p className="home__dd-heading">{t('home.nearbyCities')}</p>
                  {nearbyCities.map(({ city, desc }) => (
                    <button key={city} type="button" className="home__dd-opt" onClick={() => { selectWhere(city); setAutocompleteSuggestions([]) }}>
                      <span className="home__dd-pin"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 21c-4.97-5.37-8-8.65-8-12a8 8 0 0 1 16 0c0 3.35-3.03 6.63-8 12z"/><circle cx="12" cy="9" r="3"/></svg></span>
                      <div>
                        <span className="home__dd-city">{city}</span>
                        <span className="home__dd-desc">{desc}</span>
                      </div>
                    </button>
                  ))}
                </>
              )}
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
                    <span className="home__cal-mo">{t(MONTH_KEYS[calMonth])} {calYear}</span>
                    <button type="button" className="home__cal-arr" onClick={nextMonth}>›</button>
                  </div>
                  <div className="home__cal-dayrow">
                    {DAY_KEYS.map((dk) => <span key={dk} className="home__cal-dn">{t(dk)}</span>)}
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
                {(WHO_SUBCATEGORIES[selectedCategory] || []).map(({ value, labelKey, icon }) => (
                  <button key={value} type="button"
                    className={`home__who-pill${whoValue === value ? ' home__who-pill--on' : ''}`}
                    onClick={() => selectWho(value)}
                  >
                    <span className="home__who-ico">{icon}</span>
                    {t(labelKey)}
                  </button>
                ))}
              </div>
              <p className="home__who-more">{t('home.moreComingSoon')}</p>
            </div>
          )}
        </div>
      </div>

      <div className="home__main container">
        {!citySupported && searchCity && (
          <div className="home__coming-soon">
            <div className="home__coming-soon-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 8.2c0 7.3-8 11.8-8 11.8z"/><circle cx="12" cy="10" r="3"/></svg>
            </div>
            <h3 className="home__coming-soon-title">{t('home.comingSoonTitle', { city: comingSoonCity })}</h3>
            <p className="home__coming-soon-desc">{t('home.comingSoonDesc')}</p>
            <p className="home__coming-soon-sub">{t('home.showingWorkersInstead', { city: workersCity })}</p>
          </div>
        )}
        <div className="home__hero-card">
          <div>
            <h2 className="home__hero-title">{t('home.continueSearching', { category: categoryLabel.toLowerCase(), location: workersCity })}</h2>
            <p className="home__hero-dates">{PICKED_DATES} · {t('common.guests', { count: 2 })}</p>
          </div>
          <div className="home__hero-thumb">
            <img src={current.workers[0].image} alt="" />
          </div>
        </div>

        <h3 className="home__section-title">{t('home.workersInLocation', { location: workersCity })}</h3>
        <div className="home__cards-scroll">
          {current.workers.map((w) => (
            <a key={w.id} className="home__worker-card" href={`/worker/${w.id}`} target="_blank" rel="noopener noreferrer">
              <div className="home__worker-card-img-wrap">
                <img src={w.heroImage} alt="" className="home__worker-card-img" />
                <span className="home__worker-card-pill">{t('home.topRated')}</span>
                <button type="button" className={`home__worker-card-fav ${favorites.has(w.id) ? 'home__worker-card-fav--on' : ''}`} onClick={(e) => toggleFavorite(e, w.id)} aria-label={t('workerDetail.favourite')}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill={favorites.has(w.id) ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                </button>
              </div>
              <WorkerAvatar worker={w} size={85} className="home__worker-card-avatar" />
              <div className="home__worker-card-body">
                <p className="home__worker-card-name">{w.name}</p>
                <p className="home__worker-card-skill">{w.specialty}</p>
                <p className="home__worker-card-meta">{PICKED_DATES}</p>
                <p className="home__worker-card-price">{t('common.perHour', { price: w.hourlyRate })}</p>
                {w.rating != null && <p className="home__worker-card-rating">★ {w.rating.toFixed(1)}</p>}
                {w.rating == null && <p className="home__worker-card-rating home__worker-card-rating--new">{t('common.new')}</p>}
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
                <button type="button" className={`home__worker-card-fav ${favorites.has(w.id) ? 'home__worker-card-fav--on' : ''}`} onClick={(e) => toggleFavorite(e, w.id)} aria-label={t('workerDetail.favourite')}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill={favorites.has(w.id) ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                </button>
              </div>
              <WorkerAvatar worker={w} size={85} className="home__worker-card-avatar" />
              <div className="home__worker-card-body">
                <p className="home__worker-card-name">{w.name}</p>
                <p className="home__worker-card-skill">{w.specialty}</p>
                <p className="home__worker-card-meta">{PICKED_DATES}</p>
                <p className="home__worker-card-price">{t('common.perHour', { price: w.hourlyRate })}</p>
                {w.rating != null && <p className="home__worker-card-rating">★ {w.rating.toFixed(1)}</p>}
                {w.rating == null && <p className="home__worker-card-rating home__worker-card-rating--new">{t('common.new')}</p>}
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
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
            <Link to="/worker/signup" className="home__cta btn-primary">
              {t('home.becomeAStar')}
            </Link>
            <Link to="/client/signup" className="home__cta home__cta--client">
              Find a professional
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
