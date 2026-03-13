import { useParams, useNavigate } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import { getWorkerById, getSimilarWorkers } from '../data/workers'
import WorkerAvatar from '../components/WorkerAvatar'
import './WorkerDetail.css'

// image field is optional — when null/undefined, show first-letter initial badge
const REVIEWS_DATA = [
  { author: 'João P.', image: null, location: 'Porto', rating: 5, timeAgo: '2 days ago', text: 'Absolutely fantastic work. Punctual, professional, and left everything perfect. Will book again without hesitation!' },
  { author: 'Sara M.', image: null, location: 'Porto', rating: 5, timeAgo: '6 days ago', text: 'So reliable and friendly. Exceeded my expectations. Highly recommend to anyone in Porto.' },
  { author: 'Tomás R.', image: null, location: 'Vila Nova de Gaia', rating: 5, timeAgo: '1 week ago', text: 'Great communication from start to finish. Fair pricing and outstanding quality. The attention to detail was remarkable and I could tell they genuinely cared about doing an excellent job.' },
  { author: 'Luísa F.', image: null, location: 'Matosinhos', rating: 4, timeAgo: '1 week ago', text: 'Very good service overall. Arrived on time and did a thorough job. Would use again for sure.' },
  { author: 'Pedro C.', image: null, location: 'Porto', rating: 5, timeAgo: '2 weeks ago', text: 'Incredible attention to detail. My apartment has never looked this good. Five stars well deserved!' },
  { author: 'Ana L.', image: null, location: 'Porto', rating: 5, timeAgo: '3 weeks ago', text: 'Professional, fast, and left my home spotless. Already booked a second session.' },
]

const QUAL_ICONS = {
  clock: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>,
  award: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/></svg>,
  shield: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  star: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>,
  book: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>,
}

export default function WorkerDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const mapRef = useRef(null)
  const mapInstanceRef = useRef(null)
  const [expandedReviews, setExpandedReviews] = useState(new Set())
  const [showAllReviews, setShowAllReviews] = useState(false)
  const worker = getWorkerById(id)

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
        <p>Worker not found.</p>
        <button type="button" onClick={() => navigate(-1)} className="wd__back-btn">Go back</button>
      </div></div>
    )
  }

  const hasPackages = worker.packages && worker.packages.length > 0
  const hasReviews = worker.reviews > 0
  const hasQualifications = worker.qualifications && worker.qualifications.length > 0
  const hasGallery = worker.gallery && worker.gallery.length > 0
  const visibleReviews = showAllReviews ? REVIEWS_DATA : REVIEWS_DATA.slice(0, 4)

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

  return (
    <div className="wd">
      {/* Mobile top bar */}
      <div className="wd__mobile-bar">
        <WorkerAvatar worker={worker} size={36} className="wd__mobile-bar-avatar" />
        <div className="wd__mobile-bar-info">
          <span className="wd__mobile-bar-name">{worker.name}</span>
          <span className="wd__mobile-bar-rate">From €{worker.hourlyRate}/hr</span>
        </div>
        <button type="button" className="wd__mobile-bar-btn">Message</button>
      </div>

      <div className="wd__container">
        <button type="button" className="wd__back-btn" onClick={() => navigate(-1)}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5"/><path d="m12 19-7-7 7-7"/></svg>
          Back
        </button>

        <div className="wd__layout">
          {/* LEFT — Sticky worker card */}
          <aside className="wd__left">
            <div className="wd__card">
              <div className="wd__card-hero-wrap">
                <img src={worker.heroImage} alt={`${worker.specialty} in action`} className="wd__card-hero" />
              </div>
              <WorkerAvatar worker={worker} size={80} className="wd__card-avatar" />
              <div className="wd__card-info">
                <h1 className="wd__card-name">{worker.name}</h1>
                <p className="wd__card-tagline">{worker.tagline || worker.bio}</p>
                <p className="wd__card-meta">{worker.specialty} in {worker.city}</p>
                <p className="wd__card-location">{worker.serviceLocation || `Service provided at client's home`}</p>
                <a href="#wd-reviews" onClick={scrollToReviews} className="wd__card-rating">
                  ★ {worker.rating.toFixed(2)} · {worker.reviews} reviews
                </a>
                <p className="wd__card-price">From <strong>€{worker.hourlyRate}</strong> / hour</p>
              </div>
              <div className="wd__card-actions">
                <button type="button" className="wd__card-share" aria-label="Share">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg>
                </button>
                <button type="button" className="wd__card-fav" aria-label="Favourite">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                </button>
              </div>
              <button type="button" className="wd__card-message-btn">Message {worker.name}</button>
            </div>
          </aside>

          {/* RIGHT — Scrollable content */}
          <main className="wd__right">

            {/* Section 1: Service Packages */}
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
                        <p className="wd__pkg-price">€{pkg.price} <span>/ {pkg.duration}</span></p>
                        <p className="wd__pkg-desc">{pkg.desc}</p>
                      </div>
                    </div>
                  ))}
                  <p className="wd__pkg-note">You can message {worker.name} to customise or make changes.</p>
                </>
              ) : (
                <div className="wd__pkg-empty">
                  <p>This worker hasn't added service packages yet. Message them to discuss your job.</p>
                </div>
              )}
            </section>

            {/* Section 2: Client Reviews */}
            <section className="wd__section" id="wd-reviews">
              <h2 className="wd__section-title">★ {worker.rating.toFixed(1)} · {worker.reviews} reviews</h2>
              {!hasReviews ? (
                <p className="wd__empty-text">No client reviews yet</p>
              ) : (
                <>
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
                          <button type="button" className="wd__review-more" onClick={() => toggleReviewExpand(i)}>Show more</button>
                        )}
                      </div>
                    ))}
                  </div>
                  {!showAllReviews && REVIEWS_DATA.length > 4 && (
                    <button type="button" className="wd__show-all-btn" onClick={() => setShowAllReviews(true)}>
                      Show all {worker.reviews} reviews
                    </button>
                  )}
                </>
              )}
            </section>

            {/* Section 3: Qualifications */}
            {hasQualifications && (
              <section className="wd__section">
                <h2 className="wd__section-title">My qualifications</h2>
                <div className="wd__quals-layout">
                  <div className="wd__quals-card">
                    <WorkerAvatar worker={worker} size={80} className="wd__quals-avatar" />
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

            {/* Section 4: Gallery */}
            <section className="wd__section">
              <h2 className="wd__section-title">My gallery</h2>
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

            {/* Section 5: Map */}
            <section className="wd__section">
              <h2 className="wd__section-title">Where I work</h2>
              <p className="wd__section-sub">I travel to clients in the area shown on the map. Message me to discuss locations outside this area.</p>
              <div ref={mapRef} className="wd__map" />
            </section>

            {/* Section 6: Things to Know */}
            <section className="wd__section">
              <h2 className="wd__section-title">Things to know</h2>
              <div className="wd__know-grid">
                <div className="wd__know-item">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                  <h3>Client requirements</h3>
                  <p>Clients must be aged 18 or over to book.</p>
                </div>
                <div className="wd__know-item">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>
                  <h3>Accessibility</h3>
                  <p>Message {worker.name} for accessibility details.</p>
                </div>
                <div className="wd__know-item">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/><line x1="10" y1="14" x2="10" y2="14.01"/></svg>
                  <h3>Cancellation policy</h3>
                  <p>Cancel at any time. No penalty for clients.</p>
                </div>
              </div>
            </section>

            {/* Section 7: Trust Banner */}
            <section className="wd__trust">
              <img src="/star-logo-blue.svg" alt="Star" className="wd__trust-logo" />
              <h2 className="wd__trust-title">Workers on STAR are vetted for quality</h2>
              <p className="wd__trust-desc">Every worker on STAR is reviewed for professionalism, reliability, and quality of work before being listed on the platform. Message us to learn more.</p>
            </section>

          </main>
        </div>
      </div>
    </div>
  )
}
