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

const DEFAULT_CITIES = [
  { city: 'Porto', region: 'Porto, Portugal' },
  { city: 'Lisbon', region: 'Lisbon, Portugal' },
  { city: 'Faro', region: 'Faro, Portugal' },
]

export default function ServiceLocation() {
  const { t } = useTranslation()
  const { category } = useParams()
  const navigate = useNavigate()
  const meta = CATEGORY_META[category]

  const [city, setCity] = useState('')
  const [suggestions, setSuggestions] = useState([])
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
    if (!query || query.length < 2) { setSuggestions([]); return }
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
        setSuggestions(unique.length > 0 ? unique : [])
      } catch {
        setSuggestions([])
      } finally {
        setLoading(false)
      }
    }, 300)
  }, [])

  const handleInputChange = (e) => {
    const val = e.target.value
    setCity(val)
    setShowDropdown(true)
    fetchCities(val)
  }

  const handleSelect = (name) => {
    setCity(name)
    setShowDropdown(false)
    setSuggestions([])
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
    navigate(`/worker/signup/${category}`)
  }

  if (!meta) {
    navigate('/choose-category', { replace: true })
    return null
  }

  const displaySuggestions = city.length >= 2 && suggestions.length > 0
    ? suggestions
    : city.length < 2
      ? DEFAULT_CITIES
      : []

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
              <svg className="svc-loc__search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#717171" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 21c-4.97-5.37-8-8.65-8-12a8 8 0 0 1 16 0c0 3.35-3.03 6.63-8 12z"/>
                <circle cx="12" cy="9" r="3"/>
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
            </div>

            {showDropdown && (
              <div className="svc-loc__dropdown">
                {loading && suggestions.length === 0 && (
                  <div className="svc-loc__dd-item svc-loc__dd-item--loading">
                    {t('serviceLocation.searching')}
                  </div>
                )}
                {displaySuggestions.map((s) => (
                  <button
                    key={`${s.city}-${s.region}`}
                    type="button"
                    className="svc-loc__dd-item"
                    onClick={() => handleSelect(s.city)}
                  >
                    <svg className="svc-loc__dd-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 21c-4.97-5.37-8-8.65-8-12a8 8 0 0 1 16 0c0 3.35-3.03 6.63-8 12z"/>
                      <circle cx="12" cy="9" r="3"/>
                    </svg>
                    <div>
                      <span className="svc-loc__dd-city">{s.city}</span>
                      <span className="svc-loc__dd-region">{s.region}</span>
                    </div>
                  </button>
                ))}
                {!loading && city.length >= 2 && suggestions.length === 0 && (
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
