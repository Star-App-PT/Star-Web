import { useState, useRef, useCallback, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { moderateImage } from '../../../utils/moderateImage'
import { useDemoMode } from '../../../contexts/DemoModeContext'
import './ClientSignup.css'

export default function ClientSignupPhoto() {
  const navigate = useNavigate()
  const { isDemoMode } = useDemoMode()
  const fileRef = useRef(null)

  const [imgSrc, setImgSrc] = useState(null)
  const [confirmed, setConfirmed] = useState(false)
  const [scale, setScale] = useState(1)
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const [dragging, setDragging] = useState(false)
  const [error, setError] = useState('')
  const dragStart = useRef({ x: 0, y: 0 })
  const offsetStart = useRef({ x: 0, y: 0 })

  const handleFile = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    setError('')
    const result = await moderateImage(file)
    if (!result.safe) {
      setError(result.reason || 'Image rejected. Please upload a different photo.')
      if (fileRef.current) fileRef.current.value = ''
      return
    }

    setImgSrc(URL.createObjectURL(file))
    setConfirmed(false)
    setScale(1)
    setOffset({ x: 0, y: 0 })
  }

  const handleCancel = () => {
    setImgSrc(null)
    setConfirmed(false)
    setScale(1)
    setOffset({ x: 0, y: 0 })
    setError('')
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

  return (
    <div className="csu">
      <div className="csu__top">
        <span className="csu__step">Step 3 of 4</span>
        <button type="button" className="csu__back" onClick={() => navigate('/client/signup/name')}>
          Back
        </button>
      </div>

      <div className="csu__card">
        <h1 className="csu__title">Add a profile photo</h1>
        <p className="csu__subtitle">Workers appreciate knowing who to expect.</p>

        <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFile} />

        {error && <p className="csu__photo-error">{error}</p>}

        <div className="csu__photo-wrap">
          <div
            className={`csu__photo-frame${imgSrc ? ' csu__photo-frame--filled' : ' csu__photo-frame--empty'}`}
            onClick={!imgSrc ? () => fileRef.current?.click() : undefined}
            onPointerDown={imgSrc && !confirmed ? onPointerDown : undefined}
            onWheel={imgSrc && !confirmed ? onWheel : undefined}
            style={{ cursor: imgSrc && !confirmed ? (dragging ? 'grabbing' : 'grab') : imgSrc ? 'default' : 'pointer' }}
          >
            {imgSrc ? (
              <img
                src={imgSrc}
                alt=""
                className="csu__photo-frame-img"
                draggable={false}
                style={{ transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale})` }}
              />
            ) : (
              <div className="csu__photo-empty">
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#B0B0B0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                  <circle cx="12" cy="13" r="4"/>
                </svg>
                <span>Upload photo</span>
              </div>
            )}
          </div>

          {imgSrc && !confirmed && (
            <div className="csu__zoom">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#B0B0B0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="8" y1="11" x2="14" y2="11"/>
              </svg>
              <input
                type="range"
                className="csu__zoom-slider"
                min="1" max="3" step="0.01"
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
            <div className="csu__photo-actions">
              <button type="button" className="csu__photo-action csu__photo-action--cancel" onClick={handleCancel}>
                Cancel
              </button>
              <button type="button" className="csu__photo-action csu__photo-action--done" onClick={handleDone}>
                Done
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="csu__footer">
        <button
          type="button"
          className="csu__next btn-primary"
          disabled={!confirmed}
          onClick={() => navigate('/client/signup/commitment')}
        >
          Looks good
        </button>
        <span className="csu__photo-skip" onClick={() => navigate('/client/signup/commitment')}>
          Skip for now
        </span>
        {/* DEMO ONLY — REMOVE BEFORE LAUNCH */}
        {isDemoMode && (
          <p
            onClick={() => navigate('/client/signup/commitment')}
            style={{
              textAlign: 'center',
              color: '#AAAAAA',
              fontSize: '14px',
              cursor: 'pointer',
              marginTop: '16px',
            }}
          >
            Skip (Demo Only)
          </p>
        )}
      </div>
    </div>
  )
}
