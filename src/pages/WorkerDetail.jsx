import { useParams, useNavigate } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { getWorkerById, getSimilarWorkers } from '../data/workers'
import { supabase } from '../supabase'
import WorkerAvatar from '../components/WorkerAvatar'
import './WorkerDetail.css'

const HOW_I_WORK_OPTIONS = [
  'Works alone', 'Works in a team', 'Brings own equipment', 'Pet-friendly',
  'Available weekends', 'Speaks English', 'Speaks Spanish',
  'Smoke-free environment', 'Insured & certified',
]

const SERVICE_DETAIL_OPTIONS = [
  'Minimum job applies', 'Travel surcharge may apply', 'Requires parking access',
  'Requires electricity on site', 'Requires deposit', 'Brings own materials',
  'Client must provide materials',
]

const QUAL_ICONS = {
  clock: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>,
  award: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/></svg>,
  shield: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  star: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>,
  book: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>,
}

export default function WorkerDetail() {
  const { t } = useTranslation()
  const { id } = useParams()
  const navigate = useNavigate()
  const mapRef = useRef(null)
  const mapInstanceRef = useRef(null)
  const [expandedReviews, setExpandedReviews] = useState(new Set())
  const [showAllReviews, setShowAllReviews] = useState(false)
  const [howIWork, setHowIWork] = useState([])
  const [serviceDetailChecks, setServiceDetailChecks] = useState([])
  const [goodToKnow, setGoodToKnow] = useState('')
  const [emergency24h, setEmergency24h] = useState(false)
  const [showBookingModal, setShowBookingModal] = useState(false)
  const [weekStart, setWeekStart] = useState(() => {
    const d = new Date(); d.setHours(0, 0, 0, 0)
    d.setDate(d.getDate() - d.getDay())
    return d
  })
  const [selectedDate, setSelectedDate] = useState(null)
  const [selectedPkgIdx, setSelectedPkgIdx] = useState(null)
  const [selectedTime, setSelectedTime] = useState(null)
  const worker = getWorkerById(id)

  const saveToSupabase = async (data) => {
    if (!supabase) return
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user) {
        await supabase.auth.updateUser({ data })
      }
    } catch { /* continue */ }
  }

  const toggleChip = (arr, setArr, opt, field) => {
    const next = arr.includes(opt) ? arr.filter((v) => v !== opt) : [...arr, opt]
    setArr(next)
    saveToSupabase({ [field]: next })
  }

  useEffect(() => {
    if (!worker || !mapRef.current || mapInstanceRef.current) return
    let cancelled = false

    async function initMap() {
      const L = await import('leaflet')
      await import('leaflet/dist/leaflet.css')
      if (cancelled || mapInstanceRef.current) return

      const map = L.map(mapRef.current, {
        center: [worker.lat, worker.lng], zoom: 14,
        scrollWheelZoom: false, zoomControl: true, attributionControl: false,
      })
      L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', { maxZoom: 19 }).addTo(map)
      L.circle([worker.lat, worker.lng], {
        radius: 800, color: '#2563eb', fillColor: '#2563eb', fillOpacity: 0.10, weight: 2,
      }).addTo(map)

      const workerIcon = L.divIcon({
        className: 'map-marker map-marker--primary',
        html: `<span>€${worker.hourlyRate}</span>`, iconSize: [60, 32], iconAnchor: [30, 16],
      })
      L.marker([worker.lat, worker.lng], { icon: workerIcon }).addTo(map)

      getSimilarWorkers(worker, 5).forEach((sw) => {
        const icon = L.divIcon({
          className: 'map-marker map-marker--secondary',
          html: `<span>€${sw.hourlyRate}</span>`, iconSize: [52, 28], iconAnchor: [26, 14],
        })
        const marker = L.marker([sw.lat, sw.lng], { icon }).addTo(map)
        marker.on('click', () => window.open(`/worker/${sw.id}`, '_blank'))
        marker.bindTooltip(`${sw.name} · ${sw.specialty}`, { direction: 'top', offset: [0, -14] })
      })
      mapInstanceRef.current = map
    }
    initMap()
    return () => { cancelled = true; if (mapInstanceRef.current) { mapInstanceRef.current.remove(); mapInstanceRef.current = null } }
  }, [worker, navigate])

  if (!worker) {
    return (
      <div className="wd"><div className="wd__container">
        <p>{t('workerDetail.workerNotFound')}</p>
        <button type="button" onClick={() => navigate(-1)} className="wd__back-btn btn-back">{t('common.goBack')}</button>
      </div></div>
    )
  }

  const hasPackages = worker.packages && worker.packages.length > 0
  const lowestPkg = hasPackages ? worker.packages.reduce((a, b) => a.price < b.price ? a : b) : null
  const lowestPrice = lowestPkg ? lowestPkg.price : 0
  const lowestPriceType = lowestPkg?.priceType || 'visit'

  const today = new Date(); today.setHours(0, 0, 0, 0)
  const TIME_SLOTS = ['09:00', '10:00', '11:00', '12:00', '14:00', '15:00', '16:00', '17:00']
  const DAY_LABELS = ['S', 'M', 'T', 'W', 'T', 'F', 'S']

  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(weekStart)
    d.setDate(d.getDate() + i)
    return d
  })
  const weekMonthLabel = weekDays[0].toLocaleString('en', { month: 'long', year: 'numeric' })

  const prevWeek = () => setWeekStart((prev) => { const d = new Date(prev); d.setDate(d.getDate() - 7); return d })
  const nextWeek = () => setWeekStart((prev) => { const d = new Date(prev); d.setDate(d.getDate() + 7); return d })

  const isDatePast = (d) => d < today
  const isToday2 = (d) => d.getTime() === today.getTime()
  const isSameDay = (a, b) => a && b && a.getTime() === b.getTime()

  const firstName = worker.name.split(' ')[0]

  const reviews = worker.clientReviews || []
  const hasReviews = reviews.length > 0
  const hasQualifications = worker.qualifications && worker.qualifications.length > 0
  const hasGallery = worker.gallery && worker.gallery.length > 0
  const visibleReviews = showAllReviews ? reviews : reviews.slice(0, 4)

  const toggleReviewExpand = (i) => {
    setExpandedReviews((prev) => {
      const next = new Set(prev)
      next.has(i) ? next.delete(i) : next.add(i)
      return next
    })
  }

  const scrollToReviews = (e) => {
    e.preventDefault()
    document.getElementById('wd-reviews')?.scrollIntoView({ behavior: 'smooth' })
  }

  const reviewWord = reviews.length !== 1 ? t('common.reviews') : t('common.review')

  return (
    <div className="wd">
      <div className="wd__container">
        <button type="button" className="wd__back-btn btn-back" onClick={() => navigate(-1)}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5"/><path d="m12 19-7-7 7-7"/></svg>
          {t('common.back')}
        </button>

        <div className="wd__layout">
          <aside className="wd__left">
            <div className="wd__card">
              <div className="wd__card-hero-wrap">
                <img src={worker.heroImage} alt={`${worker.specialty} in action`} className="wd__card-hero" />
              </div>
              <WorkerAvatar worker={worker} size={100} className="wd__card-avatar" />
              <div className="wd__card-info">
                <h1 className="wd__card-name">{worker.name}</h1>
                <p className="wd__card-tagline">{worker.tagline || worker.bio}</p>
                <p className="wd__card-meta">{worker.specialty} in {worker.city}</p>
                <p className="wd__card-location">{worker.serviceLocation || t('workerDetail.serviceAtHome')}</p>
                {hasReviews && (
                  <a href="#wd-reviews" onClick={scrollToReviews} className="wd__card-rating">
                    ★ {worker.rating.toFixed(1)} · {reviews.length} {reviewWord}
                  </a>
                )}
                <p className="wd__card-price" dangerouslySetInnerHTML={{ __html: t('common.fromPerHour', { price: worker.hourlyRate }) }} />
              </div>
              <div className="wd__card-actions">
                <button type="button" className="wd__card-share" aria-label={t('workerDetail.share')}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg>
                </button>
                <button type="button" className="wd__card-fav" aria-label={t('workerDetail.favourite')}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                </button>
              </div>
            </div>
          </aside>

          <main className="wd__right">
            <section className="wd__section">
              {hasPackages ? (
                <>
                  {worker.packages.map((pkg, i) => (
                    <div key={i} className="wd__pkg">
                      <div className="wd__pkg-img">
                        <img src={worker.heroImage} alt="" />
                      </div>
                      <div className="wd__pkg-info">
                        <h3 className="wd__pkg-name">{pkg.name}</h3>
                        <p className="wd__pkg-price">€{pkg.price} <span>/ {pkg.priceType || 'visit'}</span></p>
                        <p className="wd__pkg-desc">{pkg.desc}</p>
                      </div>
                    </div>
                  ))}
                  <p className="wd__pkg-note">{t('workerDetail.customiseNote', { name: worker.name })}</p>
                </>
              ) : (
                <div className="wd__pkg-empty">
                  <p>{t('workerDetail.noPackages')}</p>
                </div>
              )}
            </section>

            <section className="wd__section" id="wd-reviews">
              {!hasReviews ? (
                <p className="wd__empty-text">{t('workerDetail.noReviews')}</p>
              ) : (
                <>
                  <h2 className="wd__section-title">★ {worker.rating.toFixed(1)} · {reviews.length} {reviewWord}</h2>
                  <div className="wd__reviews-grid">
                    {visibleReviews.map((r, i) => (
                      <div key={i} className="wd__review">
                        <div className="wd__review-header">
                          {r.image
                            ? <img src={r.image} alt={r.author} className="wd__review-avatar wd__review-avatar--photo" />
                            : <div className="wd__review-avatar">{r.author[0]}</div>
                          }
                          <div>
                            <p className="wd__review-author">{r.author}</p>
                            <p className="wd__review-loc">{r.location}</p>
                          </div>
                        </div>
                        <div className="wd__review-meta">
                          <span className="wd__review-stars">{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</span>
                          <span className="wd__review-time"> · {r.timeAgo}</span>
                        </div>
                        <p className={`wd__review-text ${expandedReviews.has(i) ? 'wd__review-text--open' : ''}`}>{r.text}</p>
                        {r.text.length > 120 && !expandedReviews.has(i) && (
                          <button type="button" className="wd__review-more" onClick={() => toggleReviewExpand(i)}>{t('workerDetail.showMore')}</button>
                        )}
                      </div>
                    ))}
                  </div>
                  {!showAllReviews && reviews.length > 4 && (
                    <button type="button" className="wd__show-all-btn btn-back" onClick={() => setShowAllReviews(true)}>
                      {t('workerDetail.showAllReviews', { count: reviews.length })}
                    </button>
                  )}
                </>
              )}
            </section>

            {hasQualifications && (
              <section className="wd__section">
                <h2 className="wd__section-title">{t('workerDetail.myQualifications')}</h2>
                <div className="wd__quals-layout">
                  <div className="wd__quals-card">
                    <WorkerAvatar worker={worker} size={100} className="wd__quals-avatar" />
                    <p className="wd__quals-name">{worker.name}</p>
                    <p className="wd__quals-spec">{worker.specialty}</p>
                  </div>
                  <div className="wd__quals-list">
                    {worker.qualifications.map((q, i) => (
                      <div key={i} className="wd__qual">
                        <div className="wd__qual-icon">{QUAL_ICONS[q.icon] || QUAL_ICONS.star}</div>
                        <div>
                          <p className="wd__qual-title">{q.title}</p>
                          <p className="wd__qual-desc">{q.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            )}

            <section className="wd__section">
              <h2 className="wd__section-title">{t('workerDetail.myGallery')}</h2>
              {hasGallery ? (
                <div className="wd__gallery-grid">
                  {worker.gallery.map((img, i) => (
                    <img key={i} src={img} alt="" className="wd__gallery-img" />
                  ))}
                </div>
              ) : (
                <div className="wd__gallery-grid wd__gallery-grid--placeholder">
                  <div className="wd__gallery-main">
                    <img src={worker.heroImage} alt="" />
                  </div>
                  <div className="wd__gallery-side">
                    <img src={worker.heroImage} alt="" style={{ filter: 'brightness(0.92) saturate(0.9)' }} />
                    <img src={worker.heroImage} alt="" style={{ filter: 'brightness(1.05) saturate(1.1)' }} />
                  </div>
                </div>
              )}
            </section>

            <section className="wd__section">
              <h2 className="wd__section-title">{t('workerDetail.whereIWork')}</h2>
              <p className="wd__section-sub">{t('workerDetail.whereIWorkDesc')}</p>
              <div ref={mapRef} className="wd__map" />
            </section>

            <section className="wd__section">
              <h2 className="wd__section-title">Service details</h2>

              <div className="wd__sd-group">
                <h3 className="wd__sd-label">How I work</h3>
                <div className="wd__sd-chips">
                  {HOW_I_WORK_OPTIONS.map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      className={`wd__sd-chip${howIWork.includes(opt) ? ' wd__sd-chip--on' : ''}`}
                      onClick={() => toggleChip(howIWork, setHowIWork, opt, 'how_i_work')}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              <hr className="wd__sd-divider" />

              <div className="wd__sd-group">
                <h3 className="wd__sd-label">Service details</h3>
                <div className="wd__sd-chips">
                  {SERVICE_DETAIL_OPTIONS.map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      className={`wd__sd-chip${serviceDetailChecks.includes(opt) ? ' wd__sd-chip--on' : ''}`}
                      onClick={() => toggleChip(serviceDetailChecks, setServiceDetailChecks, opt, 'service_details')}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              <hr className="wd__sd-divider" />

              <div className="wd__sd-group">
                <h3 className="wd__sd-label">Good to know</h3>
                <div className="wd__sd-textarea-wrap">
                  <textarea
                    className="wd__sd-textarea"
                    maxLength={150}
                    rows={3}
                    placeholder="Anything clients should know before booking — e.g. 'I always send a confirmation photo after the job is done.'"
                    value={goodToKnow}
                    onChange={(e) => setGoodToKnow(e.target.value)}
                    onBlur={() => saveToSupabase({ good_to_know: goodToKnow })}
                  />
                  <span className="wd__sd-counter">{goodToKnow.length}/150</span>
                </div>
              </div>

              <hr className="wd__sd-divider" />

              <div className="wd__sd-group">
                <div className="wd__sd-emergency-row">
                  <div className="wd__sd-emergency-left">
                    <span className="wd__sd-emergency-bolt">⚡</span>
                    <h3 className="wd__sd-label wd__sd-label--inline">Emergency 24h</h3>
                  </div>
                  <label className="wd__sd-toggle">
                    <input
                      type="checkbox"
                      checked={emergency24h}
                      onChange={() => {
                        const next = !emergency24h
                        setEmergency24h(next)
                        saveToSupabase({ emergency_24h: next })
                      }}
                    />
                    <span className="wd__sd-toggle-track" />
                  </label>
                </div>
                <p className={`wd__sd-emergency-status${emergency24h ? ' wd__sd-emergency-status--on' : ''}`}>
                  {emergency24h
                    ? '⚡ You are available for emergency callouts at any hour'
                    : 'Not currently available for emergency callouts'}
                </p>
                <p className="wd__sd-emergency-note">
                  Only turn this on if you are genuinely available to respond at any hour. Clients booking you under Emergency 24h will expect a fast response.
                </p>
              </div>
            </section>

            <section className="wd__trust">
              <img src="/star-logo-blue.svg" alt="Star" className="wd__trust-logo" />
              <h2 className="wd__trust-title">{t('workerDetail.trustTitle')}</h2>
              <p className="wd__trust-desc">{t('workerDetail.trustDesc')}</p>
            </section>

          </main>
        </div>
      </div>

      <div className="wd__booking-bar">
        <div className="wd__booking-bar-inner">
          <div className="wd__booking-bar-left">
            <span className="wd__booking-bar-price">
              {hasPackages ? `From €${lowestPrice} / ${lowestPriceType}` : 'Free visit'}
            </span>
            <span className="wd__booking-bar-cancel">Free cancellation</span>
          </div>
          <button type="button" className="wd__booking-bar-btn btn-primary" onClick={() => setShowBookingModal(true)}>
            Show dates
          </button>
        </div>
      </div>

      {showBookingModal && (
        <div className="wd__bm-overlay" onClick={() => setShowBookingModal(false)}>
          <div className="wd__bm" onClick={(e) => e.stopPropagation()}>
            <button type="button" className="wd__bm-close" onClick={() => setShowBookingModal(false)} aria-label="Close">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>

            <h2 className="wd__bm-title">Schedule your visit</h2>

            <div className="wd__bm-cal">
              <div className="wd__bm-cal-header">
                <span className="wd__bm-cal-month">{weekMonthLabel}</span>
                <div className="wd__bm-cal-header-right">
                  <button type="button" className="wd__bm-cal-nav" onClick={prevWeek} disabled={weekStart <= today}>‹</button>
                  <button type="button" className="wd__bm-cal-nav" onClick={nextWeek}>›</button>
                </div>
              </div>
              <div className="wd__bm-cal-labels">
                {DAY_LABELS.map((d, i) => (
                  <span key={i} className="wd__bm-cal-label">{d}</span>
                ))}
              </div>
              <div className="wd__bm-cal-grid">
                {weekDays.map((d) => {
                  const past = isDatePast(d)
                  const sel = isSameDay(selectedDate, d)
                  const tod = isToday2(d)
                  return (
                    <button
                      key={d.toISOString()}
                      type="button"
                      className={`wd__bm-cal-day${past ? ' wd__bm-cal-day--past' : ''}${sel ? ' wd__bm-cal-day--sel' : ''}${tod && !sel ? ' wd__bm-cal-day--today' : ''}`}
                      disabled={past}
                      onClick={() => { setSelectedDate(new Date(d)); setSelectedTime(null); setSelectedPkgIdx(null) }}
                    >
                      {d.getDate()}
                    </button>
                  )
                })}
              </div>
            </div>

            {selectedDate && hasPackages && (
              <div className="wd__bm-packages">
                {worker.packages.map((pkg, i) => (
                  <div key={i} className="wd__bm-pkg-group">
                    <div className="wd__bm-pkg">
                      <div className="wd__bm-pkg-thumb">
                        <img src={worker.heroImage} alt="" />
                      </div>
                      <div className="wd__bm-pkg-info">
                        <p className="wd__bm-pkg-name">{pkg.name}</p>
                        <p className="wd__bm-pkg-price">€{pkg.price} <span>/{pkg.priceType || 'visit'}</span> · {pkg.duration}</p>
                      </div>
                    </div>
                    <div className="wd__bm-times">
                      {TIME_SLOTS.map((slot) => {
                        const isSelected = selectedPkgIdx === i && selectedTime === slot
                        return (
                          <button
                            key={slot}
                            type="button"
                            className={`wd__bm-time${isSelected ? ' wd__bm-time--sel' : ''}`}
                            onClick={() => { setSelectedPkgIdx(i); setSelectedTime(slot) }}
                          >
                            {slot}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {selectedDate && !hasPackages && (
              <div className="wd__bm-times" style={{ marginTop: 16 }}>
                {TIME_SLOTS.map((slot) => (
                  <button
                    key={slot}
                    type="button"
                    className={`wd__bm-time${selectedTime === slot ? ' wd__bm-time--sel' : ''}`}
                    onClick={() => setSelectedTime(slot)}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            )}

            <button
              type="button"
              className="wd__bm-confirm"
              disabled={!selectedDate || !selectedTime}
            >
              Request visit
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
