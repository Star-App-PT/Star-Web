import { useParams, useNavigate, Link } from 'react-router-dom'
import { useEffect, useRef } from 'react'
import { getWorkerById, getSimilarWorkers, PICKED_DATES } from '../data/workers'
import './WorkerDetail.css'

const REVIEWS_SAMPLE = [
  { author: 'João P.', date: 'July 2025', text: 'Absolutely fantastic work. Punctual, professional, and left everything perfect. Will book again!' },
  { author: 'Sara M.', date: 'June 2025', text: 'So reliable and friendly. Exceeded my expectations. Highly recommend to anyone in Porto.' },
  { author: 'Tomás R.', date: 'May 2025', text: 'Great communication from start to finish. Fair pricing and outstanding quality.' },
]

export default function WorkerDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const mapRef = useRef(null)
  const mapInstanceRef = useRef(null)
  const worker = getWorkerById(id)

  useEffect(() => {
    if (!worker || !mapRef.current || mapInstanceRef.current) return

    let cancelled = false

    async function initMap() {
      const L = await import('leaflet')
      await import('leaflet/dist/leaflet.css')

      if (cancelled || mapInstanceRef.current) return

      const map = L.map(mapRef.current, {
        center: [worker.lat, worker.lng],
        zoom: 14,
        scrollWheelZoom: false,
        zoomControl: true,
        attributionControl: false,
      })

      L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        maxZoom: 19,
      }).addTo(map)

      L.circle([worker.lat, worker.lng], {
        radius: 600,
        color: '#2563eb',
        fillColor: '#2563eb',
        fillOpacity: 0.12,
        weight: 2,
      }).addTo(map)

      const workerIcon = L.divIcon({
        className: 'map-marker map-marker--primary',
        html: `<span>€${worker.hourlyRate}</span>`,
        iconSize: [60, 32],
        iconAnchor: [30, 16],
      })
      L.marker([worker.lat, worker.lng], { icon: workerIcon }).addTo(map)

      const similar = getSimilarWorkers(worker, 5)
      similar.forEach((sw) => {
        const icon = L.divIcon({
          className: 'map-marker map-marker--secondary',
          html: `<span>€${sw.hourlyRate}</span>`,
          iconSize: [52, 28],
          iconAnchor: [26, 14],
        })
        const marker = L.marker([sw.lat, sw.lng], { icon: icon }).addTo(map)
        marker.on('click', () => {
          navigate(`/worker/${sw.id}`)
        })
        marker.bindTooltip(`${sw.name} · ${sw.specialty}`, { direction: 'top', offset: [0, -14] })
      })

      mapInstanceRef.current = map
    }

    initMap()

    return () => {
      cancelled = true
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, [worker, navigate])

  if (!worker) {
    return (
      <div className="wd">
        <div className="wd__container">
          <p>Worker not found.</p>
          <button type="button" onClick={() => navigate(-1)} className="wd__back-btn">Go back</button>
        </div>
      </div>
    )
  }

  const similar = getSimilarWorkers(worker, 4)

  return (
    <div className="wd">
      <div className="wd__container">
        <button type="button" className="wd__back-btn" onClick={() => navigate(-1)}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5"/><path d="m12 19-7-7 7-7"/></svg>
          Back
        </button>

        <div className="wd__hero">
          <div className="wd__hero-img-wrap">
            <img src={worker.image} alt={worker.name} className="wd__hero-img" />
          </div>
        </div>

        <div className="wd__content">
          <div className="wd__main">
            <div className="wd__header">
              <h1 className="wd__name">{worker.name}</h1>
              <p className="wd__specialty">{worker.specialty} in {worker.city}</p>
              <div className="wd__stats">
                <span className="wd__stat">★ {worker.rating.toFixed(1)}</span>
                <span className="wd__stat-dot">·</span>
                <span className="wd__stat">{worker.reviews} reviews</span>
                <span className="wd__stat-dot">·</span>
                <span className="wd__stat">{worker.city}</span>
              </div>
            </div>

            <hr className="wd__divider" />

            <div className="wd__host-row">
              <img src={worker.image} alt="" className="wd__host-avatar" />
              <div>
                <p className="wd__host-name">{worker.specialty} by {worker.name}</p>
                <p className="wd__host-meta">Member since {worker.memberSince} · {worker.languages.join(', ')}</p>
              </div>
            </div>

            <hr className="wd__divider" />

            <div className="wd__about">
              <h2 className="wd__section-title">About {worker.name}</h2>
              <p className="wd__bio">{worker.bio}</p>
            </div>

            <hr className="wd__divider" />

            <div className="wd__highlights">
              <div className="wd__highlight">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 8.2c0 7.3-8 11.8-8 11.8z"/><circle cx="12" cy="10" r="3"/></svg>
                <div>
                  <p className="wd__highlight-title">Serves {worker.city}</p>
                  <p className="wd__highlight-desc">Available for bookings in the greater {worker.city} area.</p>
                </div>
              </div>
              <div className="wd__highlight">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/></svg>
                <div>
                  <p className="wd__highlight-title">Identity verified</p>
                  <p className="wd__highlight-desc">{worker.name} has verified their identity and qualifications.</p>
                </div>
              </div>
              <div className="wd__highlight">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                <div>
                  <p className="wd__highlight-title">{worker.reviews} reviews, {worker.rating.toFixed(1)} average</p>
                  <p className="wd__highlight-desc">Consistently praised for quality, punctuality, and professionalism.</p>
                </div>
              </div>
            </div>

            <hr className="wd__divider" />

            <div className="wd__reviews">
              <h2 className="wd__section-title">★ {worker.rating.toFixed(1)} · {worker.reviews} reviews</h2>
              <div className="wd__reviews-grid">
                {REVIEWS_SAMPLE.map((r, i) => (
                  <div key={i} className="wd__review">
                    <div className="wd__review-header">
                      <div className="wd__review-avatar">{r.author[0]}</div>
                      <div>
                        <p className="wd__review-author">{r.author}</p>
                        <p className="wd__review-date">{r.date}</p>
                      </div>
                    </div>
                    <p className="wd__review-text">{r.text}</p>
                  </div>
                ))}
              </div>
            </div>

            <hr className="wd__divider" />

            <div className="wd__map-section">
              <h2 className="wd__section-title">Where {worker.name} works</h2>
              <p className="wd__map-desc">Approximate service area in {worker.city}. Exact meeting point confirmed after booking.</p>
              <div ref={mapRef} className="wd__map" />
            </div>

            {similar.length > 0 && (
              <>
                <hr className="wd__divider" />
                <div className="wd__similar">
                  <h2 className="wd__section-title">Similar workers nearby</h2>
                  <div className="wd__similar-grid">
                    {similar.map((sw) => (
                      <Link key={sw.id} to={`/worker/${sw.id}`} className="wd__similar-card">
                        <img src={sw.image} alt={sw.name} className="wd__similar-img" />
                        <div className="wd__similar-body">
                          <p className="wd__similar-name">{sw.name}</p>
                          <p className="wd__similar-skill">{sw.specialty}</p>
                          <p className="wd__similar-price">€{sw.hourlyRate}/hr · ★ {sw.rating.toFixed(1)}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>

          <aside className="wd__sidebar">
            <div className="wd__booking-card">
              <div className="wd__booking-price">
                <span className="wd__booking-amount">€{worker.hourlyRate}</span>
                <span className="wd__booking-unit"> / hour</span>
              </div>
              <div className="wd__booking-fields">
                <div className="wd__booking-field">
                  <span className="wd__booking-label">DATES</span>
                  <span className="wd__booking-value">{PICKED_DATES}</span>
                </div>
                <div className="wd__booking-field">
                  <span className="wd__booking-label">SERVICE</span>
                  <span className="wd__booking-value">{worker.specialty}</span>
                </div>
              </div>
              <button type="button" className="wd__booking-btn">Book {worker.name}</button>
              <p className="wd__booking-note">You won't be charged yet</p>
              <div className="wd__booking-summary">
                <div className="wd__booking-row">
                  <span>€{worker.hourlyRate} × 3 hours</span>
                  <span>€{worker.hourlyRate * 3}</span>
                </div>
                <div className="wd__booking-row">
                  <span>Service fee</span>
                  <span>€{Math.round(worker.hourlyRate * 3 * 0.1)}</span>
                </div>
                <hr className="wd__booking-line" />
                <div className="wd__booking-row wd__booking-row--total">
                  <span>Total</span>
                  <span>€{worker.hourlyRate * 3 + Math.round(worker.hourlyRate * 3 * 0.1)}</span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
