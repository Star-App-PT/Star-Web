// Map uses Leaflet + CartoDB tiles (free, no API key required).
// To switch to Google Maps, set VITE_GOOGLE_MAPS_API_KEY in .env
// and replace the Leaflet code below with @react-google-maps/api.
import { useState, useRef, useCallback, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { supabase } from '../supabase'
import 'leaflet/dist/leaflet.css'
import cleanerImg from '../assets/workers/cleaners/cleaner-4.jpg'
import handymanImg from '../assets/workers/handymen/handyman-1.jpg'
import photographerImg from '../assets/workers/services/photographer.jpg'
import { useDemoMode } from '../contexts/DemoModeContext'
import './ServiceArea.css'

const CATEGORY_META = {
  cleaning: { labelKey: 'workerSignup.cleaning', image: cleanerImg },
  repairs:  { labelKey: 'workerSignup.repairs',  image: handymanImg },
  services: { labelKey: 'workerSignup.services', image: photographerImg },
}

const DRIVE_OPTIONS = [
  { value: 30, labelKey: 'serviceArea.opt30' },
  { value: 60, labelKey: 'serviceArea.opt60' },
  { value: 90, labelKey: 'serviceArea.opt90' },
  { value: 120, labelKey: 'serviceArea.opt120' },
]

const DRIVE_RADIUS = { 30: 15000, 60: 40000, 90: 65000, 120: 90000 }

export default function ServiceArea() {
  const { t } = useTranslation()
  const { category } = useParams()
  const navigate = useNavigate()
  const { isDemoMode } = useDemoMode()
  const meta = CATEGORY_META[category] || CATEGORY_META.cleaning

  const [query, setQuery] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const [loading, setLoading] = useState(false)
  const [address, setAddress] = useState(null)
  const [driveTime, setDriveTime] = useState(60)
  const [modalOpen, setModalOpen] = useState(false)
  const [pendingDrive, setPendingDrive] = useState(60)
  const [showSuggestions, setShowSuggestions] = useState(false)

  const timerRef = useRef(null)
  const wrapRef = useRef(null)
  const mapRef = useRef(null)
  const mapInstance = useRef(null)
  const circleRef = useRef(null)
  const markerRef = useRef(null)
  const geoAttempted = useRef(false)

  // Auto-detect location on mount
  useEffect(() => {
    if (geoAttempted.current) return
    geoAttempted.current = true
    if (!navigator.geolocation) return
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&accept-language=en`
          )
          const data = await res.json()
          if (data?.display_name) {
            setQuery(data.display_name)
            setAddress({ display: data.display_name, lat: latitude, lng: longitude })
          }
        } catch { /* fallback: worker types manually */ }
      },
      () => { /* permission denied or error — worker types manually */ },
      { timeout: 8000 }
    )
  }, [])

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setShowSuggestions(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const fetchAddresses = useCallback((q) => {
    if (timerRef.current) clearTimeout(timerRef.current)
    if (!q || q.length < 3) { setSuggestions([]); setLoading(false); return }
    setLoading(true)
    timerRef.current = setTimeout(async () => {
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q)}&format=json&addressdetails=1&limit=5&accept-language=en`
        )
        const data = await res.json()
        setSuggestions(
          data.map((r) => ({
            display: r.display_name,
            lat: parseFloat(r.lat),
            lng: parseFloat(r.lon),
          }))
        )
      } catch {
        setSuggestions([])
      } finally {
        setLoading(false)
      }
    }, 300)
  }, [])

  const handleInput = (e) => {
    const val = e.target.value
    setQuery(val)
    setShowSuggestions(true)
    if (!val.trim()) setAddress(null)
    fetchAddresses(val)
  }

  const handleClear = () => {
    setQuery('')
    setAddress(null)
    setSuggestions([])
    setShowSuggestions(false)
  }

  const handleSelect = (s) => {
    setQuery(s.display)
    setAddress({ display: s.display, lat: s.lat, lng: s.lng })
    setSuggestions([])
    setShowSuggestions(false)
  }

  // Map init / update
  useEffect(() => {
    if (!address || !mapRef.current) return
    let cancelled = false

    async function initMap() {
      const L = await import('leaflet')
      if (cancelled) return

      if (mapInstance.current) {
        mapInstance.current.setView([address.lat, address.lng], 11)
      } else {
        const map = L.map(mapRef.current, {
          center: [address.lat, address.lng],
          zoom: 11,
          scrollWheelZoom: true,
          zoomControl: true,
          attributionControl: false,
        })
        L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
          maxZoom: 19,
        }).addTo(map)
        mapInstance.current = map
        setTimeout(() => { map.invalidateSize() }, 100)
      }

      if (markerRef.current) markerRef.current.remove()
      const homeIcon = L.divIcon({
        className: 'sa-map-pin',
        html: '<svg width="28" height="28" viewBox="0 0 24 24" fill="#1B4FBA" stroke="white" stroke-width="1.5"><path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>',
        iconSize: [28, 28],
        iconAnchor: [14, 14],
      })
      markerRef.current = L.marker([address.lat, address.lng], { icon: homeIcon }).addTo(mapInstance.current)

      if (circleRef.current) circleRef.current.remove()
      circleRef.current = L.circle([address.lat, address.lng], {
        radius: DRIVE_RADIUS[driveTime] || 40000,
        color: '#1B4FBA',
        fillColor: '#1B4FBA',
        fillOpacity: 0.08,
        weight: 2,
      }).addTo(mapInstance.current)

      mapInstance.current.fitBounds(circleRef.current.getBounds(), { padding: [20, 20] })
      setTimeout(() => { mapInstance.current?.invalidateSize() }, 200)
    }

    initMap()
    return () => { cancelled = true }
  }, [address, driveTime])

  // Cleanup map on unmount
  useEffect(() => {
    return () => {
      if (mapInstance.current) { mapInstance.current.remove(); mapInstance.current = null }
    }
  }, [])

  const openModal = () => {
    setPendingDrive(driveTime)
    setModalOpen(true)
  }

  const confirmDrive = () => {
    setDriveTime(pendingDrive)
    setModalOpen(false)
  }

  const driveLabel = DRIVE_OPTIONS.find((o) => o.value === driveTime)
  const driveLabelText = driveLabel ? t(driveLabel.labelKey) : ''

  const handleNext = async () => {
    if (!address) return
    if (supabase) {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (session?.user) {
          await supabase.auth.updateUser({
            data: {
              service_area_address: address.display,
              service_area_lat: address.lat,
              service_area_lng: address.lng,
              service_area_drive_time: driveTime,
            },
          })
        }
      } catch { /* continue */ }
    }
    navigate(`/worker/about/${category}`)
  }

  if (!category || !CATEGORY_META[category]) {
    navigate('/worker/choose-category', { replace: true })
    return null
  }

  return (
    <div className="sa">
      <div className="sa__top">
        <button type="button" className="sa__back btn-back" onClick={() => navigate(-1)}>
          {t('common.back')}
        </button>
      </div>

      <div className="sa__body">
        <div className="sa__left">
          <h1 className="sa__title">{t('serviceArea.title')}</h1>
          <p className="sa__subtitle">{t('serviceArea.subtitle')}</p>

          <div className="sa__search-wrap" ref={wrapRef}>
            <div className="sa__search">
              <svg className="sa__search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#717171" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/>
                <line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              <input
                type="text"
                className="sa__input"
                placeholder={t('serviceArea.placeholder')}
                value={query}
                onChange={handleInput}
                onFocus={() => setShowSuggestions(true)}
                autoComplete="off"
              />
              {query && (
                <button type="button" className="sa__clear" onClick={handleClear} aria-label={t('serviceArea.clear')}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#717171" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"/>
                    <line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                </button>
              )}
            </div>

            {showSuggestions && suggestions.length > 0 && (
              <div className="sa__dropdown">
                {suggestions.map((s, i) => (
                  <button key={i} type="button" className="sa__dd-item" onClick={() => handleSelect(s)}>
                    <svg className="sa__dd-pin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#717171" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 21c-4.97-5.37-8-8.65-8-12a8 8 0 0 1 16 0c0 3.35-3.03 6.63-8 12z"/>
                      <circle cx="12" cy="9" r="3"/>
                    </svg>
                    <span className="sa__dd-text">{s.display}</span>
                  </button>
                ))}
              </div>
            )}

            {showSuggestions && loading && suggestions.length === 0 && (
              <div className="sa__dropdown">
                <div className="sa__dd-item sa__dd-item--loading">{t('serviceArea.searching')}</div>
              </div>
            )}
          </div>

          {address && (
            <div className="sa__map-wrap">
              <div ref={mapRef} className="sa__map" />
              <button type="button" className="sa__drive-pill" onClick={openModal}>
                <span className="sa__drive-emoji">🚗</span> {driveLabelText}
              </button>
            </div>
          )}
        </div>

        <div className="sa__right">
          <div className="sa__cat-card">
            <img src={meta.image} alt={t(meta.labelKey)} className="sa__cat-card-img" />
            <p className="sa__cat-card-label">{t(meta.labelKey)}</p>
          </div>
        </div>
      </div>

      <div className="sa__footer">
        <button type="button" className="sa__next btn-primary" disabled={!address} onClick={handleNext}>
          {t('serviceArea.next')}
        </button>
        {/* DEMO ONLY — REMOVE BEFORE LAUNCH */}
        {isDemoMode && (
          <p
            onClick={() => navigate(`/worker/about/${category}`)}
            style={{
              textAlign: 'center',
              color: '#AAAAAA',
              fontSize: '14px',
              cursor: 'pointer',
              marginTop: '16px',
            }}
          >
            {t('common.demoSkip')}
          </p>
        )}
      </div>

      {modalOpen && (
        <div className="sa-modal__overlay" onClick={() => setModalOpen(false)}>
          <div className="sa-modal" onClick={(e) => e.stopPropagation()}>
            <div className="sa-modal__header">
              <h2 className="sa-modal__title">{t('serviceArea.modalTitle')}</h2>
              <button type="button" className="sa-modal__close" onClick={() => setModalOpen(false)} aria-label={t('serviceArea.close')}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"/>
                  <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>

            <div className="sa-modal__options">
              {DRIVE_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  className={`sa-modal__opt${pendingDrive === opt.value ? ' sa-modal__opt--active' : ''}`}
                  onClick={() => setPendingDrive(opt.value)}
                >
                  {t(opt.labelKey)}
                </button>
              ))}
            </div>

            <button type="button" className="sa-modal__done btn-primary" onClick={confirmDrive}>
              {t('serviceArea.done')}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
