import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabase'
import './MobileWorkerBookingFlow.css'

const QUICK_LABELS = ['Today', 'Tomorrow', 'This weekend']
const WEEKDAY_LABELS = ['S', 'M', 'T', 'W', 'T', 'F', 'S']
const DRIVE_RADIUS_KM = { 30: 10, 45: 18, 60: 25, 90: 40, 120: 55 }

function haversine(lat1, lng1, lat2, lng2) {
  const R = 6371
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLng = ((lng2 - lng1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

function startOfDay(dateLike = new Date()) {
  const d = new Date(dateLike)
  d.setHours(0, 0, 0, 0)
  return d
}

function formatShortDate(date) {
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

function formatLongDate(date) {
  return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })
}

function buildMonthCells(year, month) {
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const cells = []
  for (let i = 0; i < firstDay; i += 1) cells.push(null)
  for (let day = 1; day <= daysInMonth; day += 1) cells.push(day)
  return cells
}

export default function MobileWorkerBookingFlow({
  open,
  worker,
  onClose,
  userAddress,
  userCoords,
  hasPreciseLocation,
  categoryLabel,
}) {
  const navigate = useNavigate()
  const today = useMemo(() => startOfDay(), [])
  const [stage, setStage] = useState('calendar')
  const [calendarContext, setCalendarContext] = useState('booking')
  const [selectedDate, setSelectedDate] = useState(today)
  const [selectedQuick, setSelectedQuick] = useState('today')
  const [monthYear, setMonthYear] = useState({ year: today.getFullYear(), month: today.getMonth() })
  const [serviceAddress, setServiceAddress] = useState(userAddress || worker?.city || 'Porto')
  const [serviceCoords, setServiceCoords] = useState(userCoords || null)
  const [addressEditorMode, setAddressEditorMode] = useState(null)
  const [addressQuery, setAddressQuery] = useState(userAddress || worker?.city || 'Porto')
  const [addressSuggestions, setAddressSuggestions] = useState([])
  const [selectedPackageIdx, setSelectedPackageIdx] = useState(null)
  const [showPackageSheet, setShowPackageSheet] = useState(false)
  const [messageText, setMessageText] = useState('')
  const [hasManualAddress, setHasManualAddress] = useState(false)
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const timerRef = useRef(null)

  useEffect(() => {
    if (!open || !worker) return
    setStage('calendar')
    setCalendarContext('booking')
    setSelectedDate(today)
    setSelectedQuick('today')
    setMonthYear({ year: today.getFullYear(), month: today.getMonth() })
    setServiceAddress(userAddress || worker.city || 'Porto')
    setServiceCoords(userCoords || null)
    setAddressQuery(userAddress || worker.city || 'Porto')
    setAddressSuggestions([])
    setAddressEditorMode(null)
    setSelectedPackageIdx(null)
    setShowPackageSheet(false)
    setMessageText('')
    setHasManualAddress(false)
    setSending(false)
    setSent(false)
  }, [open, worker, userAddress, userCoords, today])

  useEffect(() => {
    if (!addressEditorMode || addressQuery.trim().length < 3) {
      setAddressSuggestions([])
      return undefined
    }

    const controller = new AbortController()
    const timeout = setTimeout(async () => {
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(addressQuery)}&format=json&addressdetails=1&limit=5&accept-language=en`,
          { signal: controller.signal }
        )
        const data = await res.json()
        setAddressSuggestions(
          (data || []).map((item) => ({
            id: `${item.place_id}`,
            address: item.display_name,
            city: item.address?.city || item.address?.town || item.address?.village || item.display_name.split(',')[0],
            lat: Number(item.lat),
            lng: Number(item.lon),
          }))
        )
      } catch {
        setAddressSuggestions([])
      }
    }, 250)

    return () => {
      controller.abort()
      clearTimeout(timeout)
    }
  }, [addressEditorMode, addressQuery])

  useEffect(() => () => {
    if (timerRef.current) window.clearTimeout(timerRef.current)
  }, [])

  if (!open || !worker) return null

  const tomorrow = startOfDay(new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1))
  const saturdayOffset = today.getDay() === 6 ? 0 : (today.getDay() === 0 ? 6 : 6 - today.getDay())
  const saturday = startOfDay(new Date(today.getFullYear(), today.getMonth(), today.getDate() + saturdayOffset))
  const sunday = startOfDay(new Date(today.getFullYear(), today.getMonth(), today.getDate() + saturdayOffset + 1))
  const quickDates = [
    { id: 'today', label: QUICK_LABELS[0], sub: formatShortDate(today), date: today },
    { id: 'tomorrow', label: QUICK_LABELS[1], sub: formatShortDate(tomorrow), date: tomorrow },
    { id: 'weekend', label: QUICK_LABELS[2], sub: `${formatShortDate(saturday)} - ${formatShortDate(sunday)}`, date: saturday },
  ]
  const monthCells = buildMonthCells(monthYear.year, monthYear.month)
  const todayTs = today.getTime()
  const selectedTs = selectedDate ? startOfDay(selectedDate).getTime() : null
  const monthLabel = new Date(monthYear.year, monthYear.month, 1).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
  const selectedPackage = selectedPackageIdx != null ? worker.packages?.[selectedPackageIdx] || null : null
  const withinServiceArea = (() => {
    if (!serviceCoords || (!hasPreciseLocation && !hasManualAddress)) return false
    const center = worker.service_area_coords || { lat: worker.lat, lng: worker.lng }
    const radiusKm = DRIVE_RADIUS_KM[worker.service_area_drive_time] || 18
    return haversine(serviceCoords.lat, serviceCoords.lng, center.lat, center.lng) <= radiusKm
  })()
  const counterReady = messageText.trim().length >= 20

  const changeMonth = (step) => {
    const next = new Date(monthYear.year, monthYear.month + step, 1)
    if (step < 0 && next < new Date(today.getFullYear(), today.getMonth(), 1)) return
    setMonthYear({ year: next.getFullYear(), month: next.getMonth() })
  }

  const selectQuick = (quick) => {
    setSelectedQuick(quick.id)
    setSelectedDate(quick.date)
    setMonthYear({ year: quick.date.getFullYear(), month: quick.date.getMonth() })
  }

  const selectCalendarDay = (day) => {
    if (!day) return
    const nextDate = startOfDay(new Date(monthYear.year, monthYear.month, day))
    if (nextDate.getTime() < todayTs) return
    setSelectedDate(nextDate)
    const quickMatch = quickDates.find((quick) => quick.date.getTime() === nextDate.getTime())
    setSelectedQuick(quickMatch?.id || 'custom')
  }

  const handleCalendarNext = () => {
    if (!selectedDate) return
    if (calendarContext === 'message') {
      setStage('message')
      return
    }
    setStage(withinServiceArea ? 'confirm' : 'outside')
  }

  const chooseAddress = (suggestion) => {
    const nextCoords = { lat: suggestion.lat, lng: suggestion.lng }
    setServiceAddress(suggestion.address)
    setAddressQuery(suggestion.address)
    setServiceCoords(nextCoords)
    setAddressSuggestions([])
    setHasManualAddress(true)

    const center = worker.service_area_coords || { lat: worker.lat, lng: worker.lng }
    const radiusKm = DRIVE_RADIUS_KM[worker.service_area_drive_time] || 18
    const inside = haversine(nextCoords.lat, nextCoords.lng, center.lat, center.lng) <= radiusKm

    if (addressEditorMode === 'outside') {
      setAddressEditorMode(null)
      setStage(inside ? 'confirm' : 'outside')
      return
    }

    setAddressEditorMode(null)
  }

  const handleRequestVisit = () => {
    onClose()
    navigate(`/worker/${worker.id}`)
  }

  const handleSendMessage = async () => {
    if (!counterReady || sending) return
    setSending(true)
    try {
      if (supabase) {
        const { data: { session } } = await supabase.auth.getSession()
        await supabase.from('messages').insert({
          id: crypto.randomUUID(),
          worker_id: worker.id,
          client_id: session?.user?.id || null,
          message_text: messageText.trim(),
          when_date: selectedDate ? selectedDate.toISOString() : null,
          where_address: serviceAddress || null,
          what_package: selectedPackage?.name || null,
          created_at: new Date().toISOString(),
          status: 'pending',
        })
      }
    } catch {
      // Investor demo flow should remain usable even if the table is absent locally.
    } finally {
      setSending(false)
      setSent(true)
      timerRef.current = window.setTimeout(() => {
        onClose()
        navigate(`/worker/${worker.id}`)
      }, 2000)
    }
  }

  return (
    <div className="mwbf">
      <div className="mwbf__overlay" onClick={onClose} />

      {stage === 'calendar' && (
        <div className="mwbf__sheet" onClick={(e) => e.stopPropagation()}>
          <div className="mwbf__topbar">
            <button type="button" className="mwbf__icon-btn" onClick={onClose} aria-label="Close">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m18 6-12 12"/><path d="m6 6 12 12"/></svg>
            </button>
          </div>
          <div className="mwbf__body">
            <h2 className="mwbf__title">When do you need {worker.name}?</h2>
            <div className="mwbf__quick-row">
              {quickDates.map((quick) => (
                <button
                  key={quick.id}
                  type="button"
                  className={`mwbf__quick-pill${selectedQuick === quick.id ? ' mwbf__quick-pill--active' : ''}`}
                  onClick={() => selectQuick(quick)}
                >
                  <span className="mwbf__quick-pill-title">{quick.label}</span>
                  <span className="mwbf__quick-pill-sub">{quick.sub}</span>
                </button>
              ))}
            </div>

            <div className="mwbf__calendar">
              <div className="mwbf__calendar-head">
                <button type="button" className="mwbf__calendar-nav" onClick={() => changeMonth(-1)}>‹</button>
                <span className="mwbf__calendar-month">{monthLabel}</span>
                <button type="button" className="mwbf__calendar-nav" onClick={() => changeMonth(1)}>›</button>
              </div>
              <div className="mwbf__calendar-labels">
                {WEEKDAY_LABELS.map((label) => (
                  <span key={label} className="mwbf__calendar-label">{label}</span>
                ))}
              </div>
              <div className="mwbf__calendar-grid">
                {monthCells.map((day, idx) => {
                  const dateObj = day ? startOfDay(new Date(monthYear.year, monthYear.month, day)) : null
                  const isPast = dateObj && dateObj.getTime() < todayTs
                  const isToday = dateObj && dateObj.getTime() === todayTs
                  const isSelected = dateObj && dateObj.getTime() === selectedTs
                  return (
                    <button
                      key={`${monthLabel}-${idx}`}
                      type="button"
                      className={`mwbf__calendar-day${!day ? ' mwbf__calendar-day--empty' : ''}${isPast ? ' mwbf__calendar-day--past' : ''}${isToday ? ' mwbf__calendar-day--today' : ''}${isSelected ? ' mwbf__calendar-day--selected' : ''}`}
                      disabled={!day || isPast}
                      onClick={() => selectCalendarDay(day)}
                    >
                      {day || ''}
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
          <div className="mwbf__footer">
            <button
              type="button"
              className="mwbf__reset"
              onClick={() => {
                setSelectedDate(null)
                setSelectedQuick(null)
              }}
            >
              Reset
            </button>
            <button type="button" className="mwbf__next btn-primary" disabled={!selectedDate} onClick={handleCalendarNext}>
              Next
            </button>
          </div>
        </div>
      )}

      {stage === 'confirm' && (
        <div className="mwbf__sheet" onClick={(e) => e.stopPropagation()}>
          <div className="mwbf__topbar">
            <button type="button" className="mwbf__icon-btn" onClick={() => setStage('calendar')} aria-label="Back">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5"/><path d="m12 19-7-7 7-7"/></svg>
            </button>
            <button type="button" className="mwbf__icon-btn" onClick={onClose} aria-label="Close">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m18 6-12 12"/><path d="m6 6 12 12"/></svg>
            </button>
          </div>
          <div className="mwbf__body">
            <h2 className="mwbf__title">Confirm your request</h2>
            <div className="mwbf__summary-card">
              <img src={worker.heroImage} alt="" className="mwbf__summary-img" />
              <div className="mwbf__summary-copy">
                <p className="mwbf__summary-name">{worker.name}</p>
                <p className="mwbf__summary-line">{formatLongDate(selectedDate)}</p>
                <p className="mwbf__summary-line">{serviceAddress}</p>
                <p className="mwbf__summary-note">This address is inside {worker.name}&apos;s service area.</p>
              </div>
            </div>
          </div>
          <div className="mwbf__footer">
            <span />
            <button type="button" className="mwbf__next btn-primary" onClick={handleRequestVisit}>
              Request visit
            </button>
          </div>
        </div>
      )}

      {stage === 'outside' && (
        <div className="mwbf__outside" onClick={(e) => e.stopPropagation()}>
          <div className="mwbf__outside-hero" style={{ backgroundImage: `url(${worker.heroImage})` }}>
            <button type="button" className="mwbf__outside-close" onClick={onClose} aria-label="Close">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m18 6-12 12"/><path d="m6 6 12 12"/></svg>
            </button>
          </div>
          <div className="mwbf__outside-card">
            <div className="mwbf__pin">📍</div>
            <h2 className="mwbf__title">Where would you like your service?</h2>
            <p className="mwbf__outside-address">{serviceAddress}</p>
            <div className="mwbf__outside-info">
              This address is outside {worker.name}&apos;s service area, but you can ask if they&apos;ll make an exception.
            </div>

            {addressEditorMode === 'outside' && (
              <div className="mwbf__address-editor">
                <input
                  type="text"
                  className="mwbf__address-input"
                  value={addressQuery}
                  onChange={(e) => setAddressQuery(e.target.value)}
                  placeholder="Search your address"
                  autoFocus
                />
                {addressSuggestions.length > 0 && (
                  <div className="mwbf__address-results">
                    {addressSuggestions.map((suggestion) => (
                      <button
                        key={suggestion.id}
                        type="button"
                        className="mwbf__address-result"
                        onClick={() => chooseAddress(suggestion)}
                      >
                        {suggestion.address}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            <button type="button" className="mwbf__message-btn btn-primary" onClick={() => setStage('message')}>
              Message {worker.name}
            </button>
            <button
              type="button"
              className="mwbf__text-link"
              onClick={() => {
                setAddressEditorMode((prev) => (prev === 'outside' ? null : 'outside'))
                setAddressQuery(serviceAddress)
              }}
            >
              Change service location
            </button>
          </div>
        </div>
      )}

      {stage === 'message' && (
        <div className="mwbf__sheet mwbf__sheet--full" onClick={(e) => e.stopPropagation()}>
          <div className="mwbf__topbar">
            <button type="button" className="mwbf__icon-btn" onClick={() => setStage('outside')} aria-label="Back">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5"/><path d="m12 19-7-7 7-7"/></svg>
            </button>
            <button type="button" className="mwbf__icon-btn" onClick={onClose} aria-label="Close">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m18 6-12 12"/><path d="m6 6 12 12"/></svg>
            </button>
          </div>

          <div className="mwbf__body mwbf__body--message">
            <h2 className="mwbf__title">Write a message to {worker.name}</h2>
            <p className="mwbf__subtitle">You can also add booking details for them to review.</p>

            <textarea
              className="mwbf__message-area"
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              placeholder={`Example: Hi! I'm looking for a ${categoryLabel.toLowerCase()} professional and was wondering if you're available in my area.`}
            />
            <p className={`mwbf__counter${counterReady ? ' mwbf__counter--ready' : ''}`}>
              {counterReady ? `${messageText.trim().length} characters` : `${messageText.trim().length}/20 required characters`}
            </p>

            <div className="mwbf__details-card">
              <h3 className="mwbf__details-title">Add optional details</h3>

              <button
                type="button"
                className="mwbf__detail-row"
                onClick={() => {
                  setCalendarContext('message')
                  setStage('calendar')
                }}
              >
                <div>
                  <p className="mwbf__detail-label">When</p>
                  <p className={`mwbf__detail-value${selectedDate ? '' : ' mwbf__detail-value--muted'}`}>
                    {selectedDate ? formatLongDate(selectedDate) : 'Add a date'}
                  </p>
                </div>
                <span className="mwbf__detail-action">Change</span>
              </button>

              <button
                type="button"
                className="mwbf__detail-row"
                onClick={() => {
                  setAddressEditorMode((prev) => (prev === 'message' ? null : 'message'))
                  setAddressQuery(serviceAddress)
                }}
              >
                <div>
                  <p className="mwbf__detail-label">Where</p>
                  <p className={`mwbf__detail-value${serviceAddress ? '' : ' mwbf__detail-value--muted'}`}>
                    {serviceAddress || 'Add your address'}
                  </p>
                </div>
                <span className="mwbf__detail-action">Change</span>
              </button>

              {addressEditorMode === 'message' && (
                <div className="mwbf__detail-editor">
                  <input
                    type="text"
                    className="mwbf__address-input"
                    value={addressQuery}
                    onChange={(e) => setAddressQuery(e.target.value)}
                    placeholder="Search your address"
                    autoFocus
                  />
                  {addressSuggestions.length > 0 && (
                    <div className="mwbf__address-results">
                      {addressSuggestions.map((suggestion) => (
                        <button
                          key={suggestion.id}
                          type="button"
                          className="mwbf__address-result"
                          onClick={() => chooseAddress(suggestion)}
                        >
                          {suggestion.address}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              <button type="button" className="mwbf__detail-row" onClick={() => setShowPackageSheet(true)}>
                <div>
                  <p className="mwbf__detail-label">What</p>
                  <p className={`mwbf__detail-value${selectedPackage ? '' : ' mwbf__detail-value--muted'}`}>
                    {selectedPackage ? `${selectedPackage.name} · €${selectedPackage.price}` : 'Select a package'}
                  </p>
                </div>
                <span className="mwbf__detail-action">{selectedPackage ? 'Change' : 'Add'}</span>
              </button>
            </div>
          </div>

          <div className="mwbf__sendbar">
            <button
              type="button"
              className="mwbf__send-btn"
              disabled={!counterReady || sending}
              onClick={handleSendMessage}
            >
              {sending ? 'Sending...' : 'Send message'}
            </button>
          </div>

          {showPackageSheet && (
            <div className="mwbf__subsheet-wrap">
              <button type="button" className="mwbf__subsheet-backdrop" onClick={() => setShowPackageSheet(false)} aria-label="Close packages" />
              <div className="mwbf__subsheet">
                <div className="mwbf__subsheet-handle" />
                <h3 className="mwbf__subsheet-title">Select a package</h3>
                <div className="mwbf__package-list">
                  {worker.packages?.length ? worker.packages.map((pkg, idx) => (
                    <button
                      key={pkg.name}
                      type="button"
                      className={`mwbf__package-card${selectedPackageIdx === idx ? ' mwbf__package-card--active' : ''}`}
                      onClick={() => {
                        setSelectedPackageIdx(idx)
                        setShowPackageSheet(false)
                      }}
                    >
                      <img src={worker.heroImage} alt="" className="mwbf__package-thumb" />
                      <div className="mwbf__package-copy">
                        <p className="mwbf__package-name">{pkg.name}</p>
                        <p className="mwbf__package-meta">€{pkg.price} · {pkg.duration}</p>
                      </div>
                    </button>
                  )) : (
                    <p className="mwbf__empty-packages">This worker has not added packages yet.</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {sent && (
            <div className="mwbf__success">
              <div className="mwbf__success-check">✓</div>
              <p className="mwbf__success-text">Message sent to {worker.name}!</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
