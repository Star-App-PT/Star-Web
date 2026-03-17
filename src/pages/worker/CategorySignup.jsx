import { useState, useRef, useCallback, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { supabase } from '../../supabase'
import './CategorySignup.css'

const FRAME_SIZE = 200

export default function CategorySignup() {
  const { t } = useTranslation()
  const { category } = useParams()
  const navigate = useNavigate()
  const fileRef = useRef(null)
  const frameRef = useRef(null)

  const [imgSrc, setImgSrc] = useState(null)
  const [confirmed, setConfirmed] = useState(false)
  const [scale, setScale] = useState(1)
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const [dragging, setDragging] = useState(false)
  const dragStart = useRef({ x: 0, y: 0 })
  const offsetStart = useRef({ x: 0, y: 0 })

  const handleFile = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const url = URL.createObjectURL(file)
    setImgSrc(url)
    setConfirmed(false)
    setScale(1)
    setOffset({ x: 0, y: 0 })
  }

  const handleCancel = () => {
    setImgSrc(null)
    setConfirmed(false)
    setScale(1)
    setOffset({ x: 0, y: 0 })
    if (fileRef.current) fileRef.current.value = ''
  }

  const handleDone = () => setConfirmed(true)

  const onPointerDown = useCallback((e) => {
    if (!imgSrc || confirmed) return
    e.preventDefault()
    setDragging(true)
    dragStart.current = { x: e.clientX, y: e.clientY }
    offsetStart.current = { ...offset }
  }, [imgSrc, confirmed, offset])

  const onPointerMove = useCallback((e) => {
    if (!dragging) return
    setOffset({
      x: offsetStart.current.x + (e.clientX - dragStart.current.x),
      y: offsetStart.current.y + (e.clientY - dragStart.current.y),
    })
  }, [dragging])

  const onPointerUp = useCallback(() => setDragging(false), [])

  useEffect(() => {
    if (!dragging) return
    window.addEventListener('pointermove', onPointerMove)
    window.addEventListener('pointerup', onPointerUp)
    return () => {
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerup', onPointerUp)
    }
  }, [dragging, onPointerMove, onPointerUp])

  const onWheel = useCallback((e) => {
    if (!imgSrc || confirmed) return
    e.preventDefault()
    setScale((s) => Math.min(Math.max(s + (e.deltaY > 0 ? -0.05 : 0.05), 1), 3))
  }, [imgSrc, confirmed])

  const handleNext = async () => {
    if (!confirmed) return
    if (supabase) {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (session?.user) {
          await supabase.auth.updateUser({ data: { profile_photo_confirmed: true } })
        }
      } catch { /* continue */ }
    }
    navigate('/dashboard')
  }

  if (!category) {
    navigate('/choose-category', { replace: true })
    return null
  }

  return (
    <div className="cs">
      <div className="cs__top">
        <span className="cs__step">{t('profilePhoto.step')}</span>
        <button type="button" className="cs__back" onClick={() => navigate(`/service-area/${category}`)}>
          {t('common.back')}
        </button>
      </div>

      <div className="cs__body">
        <div className="cs__card">
          <h1 className="cs__title">{t('profilePhoto.title')}</h1>

          <div className="cs__section">
            <h2 className="cs__label">{t('profilePhoto.sectionLabel')}</h2>
            <p className="cs__hint">{t('profilePhoto.hint')}</p>

            <div
              ref={frameRef}
              className={`cs__frame${confirmed ? ' cs__frame--confirmed' : ''}`}
              onClick={() => !imgSrc && fileRef.current?.click()}
              onPointerDown={imgSrc && !confirmed ? onPointerDown : undefined}
              onWheel={imgSrc && !confirmed ? onWheel : undefined}
              style={{ cursor: imgSrc && !confirmed ? (dragging ? 'grabbing' : 'grab') : 'pointer' }}
            >
              {imgSrc ? (
                <img
                  src={imgSrc}
                  alt=""
                  className="cs__frame-img"
                  draggable={false}
                  style={{
                    transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale})`,
                  }}
                />
              ) : (
                <div className="cs__frame-empty" onClick={() => fileRef.current?.click()}>
                  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#B0B0B0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                    <circle cx="12" cy="13" r="4"/>
                  </svg>
                  <span>{t('profilePhoto.uploadLabel')}</span>
                </div>
              )}
              <input ref={fileRef} type="file" accept="image/*" className="cs__file" onChange={handleFile} />
            </div>

            {imgSrc && !confirmed && (
              <div className="cs__zoom">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#B0B0B0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="8" y1="11" x2="14" y2="11"/>
                </svg>
                <input
                  type="range"
                  className="cs__zoom-slider"
                  min="1"
                  max="3"
                  step="0.01"
                  value={scale}
                  onChange={(e) => setScale(parseFloat(e.target.value))}
                  style={{ '--fill': `${((scale - 1) / 2) * 100}%` }}
                />
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#B0B0B0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="8" y1="11" x2="14" y2="11"/><line x1="11" y1="8" x2="11" y2="14"/>
                </svg>
              </div>
            )}

            {imgSrc && (
              <div className="cs__actions">
                <button type="button" className="cs__action cs__action--cancel" onClick={handleCancel}>
                  {t('common.cancel')}
                </button>
                <button type="button" className="cs__action cs__action--done" onClick={handleDone}>
                  {t('common.done')}
                </button>
              </div>
            )}

            {imgSrc && !confirmed && (
              <p className="cs__drag-hint">{t('profilePhoto.dragHint')}</p>
            )}
          </div>
        </div>
      </div>

      <div className="cs__footer">
        <button type="button" className="cs__next" disabled={!confirmed} onClick={handleNext}>
          {t('serviceLocation.next')}
        </button>
      </div>
    </div>
  )
}
