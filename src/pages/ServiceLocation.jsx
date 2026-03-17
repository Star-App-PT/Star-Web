import { useState, useCallback, useRef, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { supabase } from '../supabase'
import cleanerImg from '../assets/workers/cleaners/cleaner-4.jpg'
import handymanImg from '../assets/workers/handymen/handyman-1.jpg'
import photographerImg from '../assets/workers/services/photographer.jpg'
import './ServiceLocation.css'

const CATEGORY_META = {
  cleaning: { labelKey: 'workerSignup.cleaning', image: cleanerImg },
  repairs:  { labelKey: 'workerSignup.repairs',  image: handymanImg },
  services: { labelKey: 'workerSignup.services', image: photographerImg },
}

const KNOWN_CITIES = [
  { city: 'Porto', region: 'Portugal' },
  { city: 'Lisbon', region: 'Portugal' },
  { city: 'Faro', region: 'Portugal' },
  { city: 'Braga', region: 'Portugal' },
  { city: 'Coimbra', region: 'Portugal' },
  { city: 'Aveiro', region: 'Portugal' },
  { city: 'Funchal', region: 'Madeira, Portugal' },
  { city: 'Setúbal', region: 'Portugal' },
  { city: 'Évora', region: 'Portugal' },
  { city: 'Viseu', region: 'Portugal' },
  { city: 'Leiria', region: 'Portugal' },
  { city: 'Guimarães', region: 'Portugal' },
  { city: 'Vila Nova de Gaia', region: 'Portugal' },
  { city: 'Albufeira', region: 'Faro, Portugal' },
  { city: 'Lagos', region: 'Faro, Portugal' },
  { city: 'Cascais', region: 'Lisbon, Portugal' },
  { city: 'Sintra', region: 'Lisbon, Portugal' },
  { city: 'Madrid', region: 'Spain' },
  { city: 'Barcelona', region: 'Spain' },
  { city: 'London', region: 'United Kingdom' },
  { city: 'Paris', region: 'France' },
  { city: 'Berlin', region: 'Germany' },
  { city: 'Amsterdam', region: 'Netherlands' },
]

const DEFAULT_DISPLAY = KNOWN_CITIES.slice(0, 3)

function filterKnown(query) {
  const q = query.toLowerCase()
  return KNOWN_CITIES.filter((c) => c.city.toLowerCase().includes(q)).slice(0, 5)
}

export default function ServiceLocation() {
  const { t } = useTranslation()
  const { category } = useParams()
  const navigate = useNavigate()
  const meta = CATEGORY_META[category]

  const [city, setCity] = useState('')
  const [apiResults, setApiResults] = useState([])
  const [showDropdown, setShowDropdown] = useState(false)
  const [loading, setLoading] = useState(false)
  const timerRef = useRef(null)
  const wrapRef = useRef(null)

  useEffect(() => {
    const handler = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setShowDropdown(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const fetchCities = useCallback((query) => {
    if (timerRef.current) clearTimeout(timerRef.current)
    if (!query || query.length < 2) { setApiResults([]); setLoading(false); return }
    setLoading(true)
    timerRef.current = setTimeout(async () => {
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
          }))
        const seen = new Set()
        const unique = results.filter((r) => {
          const k = r.city.toLowerCase()
          if (seen.has(k)) return false
          seen.add(k)
          return true
        })
        setApiResults(unique)
      } catch {
        setApiResults([])
      } finally {
        setLoading(false)
      }
    }, 300)
  }, [])

  const handleInputChange = (e) => {
    const val = e.target.value
    setCity(val)
    setShowDropdown(true)
    setApiResults([])
    fetchCities(val)
  }

  const handleSelect = (name) => {
    setCity(name)
    setShowDropdown(false)
    setApiResults([])
  }

  const handleNext = async () => {
    if (!city.trim()) return
    if (supabase) {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (session?.user) {
          await supabase.auth.updateUser({ data: { service_city: city.trim() } })
        }
      } catch { /* continue even if save fails */ }
    }
    navigate(`/worker-about/${category}`)
  }

  if (!meta) {
    navigate('/choose-category', { replace: true })
    return null
  }

  const query = city.trim()
  const localMatches = query.length >= 1 ? filterKnown(query) : DEFAULT_DISPLAY
  const displaySuggestions = apiResults.length > 0 ? apiResults : localMatches

  const handleClear = () => {
    setCity('')
    setApiResults([])
    setShowDropdown(true)
  }

  return (
    <div className="svc-loc">
      <div className="svc-loc__top">
        <button type="button" className="svc-loc__back" onClick={() => navigate(-1)}>
          {t('common.back')}
        </button>
      </div>

      <div className="svc-loc__content">
        <div className="svc-loc__left">
          <h1 className="svc-loc__title">{t('serviceLocation.title')}</h1>

          <div className="svc-loc__search-wrap" ref={wrapRef}>
            <div className="svc-loc__search">
              <svg className="svc-loc__search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#717171" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/>
                <line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              <input
                type="text"
                className="svc-loc__input"
                placeholder={t('serviceLocation.placeholder')}
                value={city}
                onChange={handleInputChange}
                onFocus={() => setShowDropdown(true)}
                autoComplete="off"
              />
              {city && (
                <button type="button" className="svc-loc__clear" onClick={handleClear} aria-label="Clear">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#717171" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"/>
                    <line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                </button>
              )}
            </div>

            {showDropdown && (
              <div className="svc-loc__dropdown">
                {loading && !displaySuggestions.length && (
                  <div className="svc-loc__dd-item svc-loc__dd-item--loading">
                    {t('serviceLocation.searching')}
                  </div>
                )}
                {displaySuggestions.length > 0 && (
                  <p className="svc-loc__dd-label">{t('serviceLocation.suggested')}</p>
                )}
                {displaySuggestions.map((s) => (
                  <button
                    key={`${s.city}-${s.region}`}
                    type="button"
                    className="svc-loc__dd-item"
                    onClick={() => handleSelect(s.city)}
                  >
                    <div className="svc-loc__dd-pin">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 21c-4.97-5.37-8-8.65-8-12a8 8 0 0 1 16 0c0 3.35-3.03 6.63-8 12z"/>
                        <circle cx="12" cy="9" r="3"/>
                      </svg>
                    </div>
                    <div>
                      <span className="svc-loc__dd-city">{s.city}</span>
                      <span className="svc-loc__dd-region">{s.region}</span>
                    </div>
                  </button>
                ))}
                {!loading && query.length >= 2 && displaySuggestions.length === 0 && (
                  <div className="svc-loc__dd-item svc-loc__dd-item--loading">
                    {t('serviceLocation.noResults')}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="svc-loc__right">
          <div className="svc-loc__card">
            <img src={meta.image} alt={t(meta.labelKey)} className="svc-loc__card-img" />
            <p className="svc-loc__card-label">{t(meta.labelKey)}</p>
          </div>
        </div>
      </div>

      <div className="svc-loc__footer">
        <button
          type="button"
          className="svc-loc__next"
          disabled={!city.trim()}
          onClick={handleNext}
        >
          {t('serviceLocation.next')}
        </button>
      </div>
    </div>
  )
}
