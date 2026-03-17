import { useState, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { supabase } from '../supabase'
import './WorkerPortfolio.css'

const MAX_PHOTOS = 10

export default function WorkerPortfolio() {
  const { t } = useTranslation()
  const { category } = useParams()
  const navigate = useNavigate()
  const fileRef = useRef(null)

  const [photos, setPhotos] = useState([])

  if (!category) {
    navigate('/choose-category', { replace: true })
    return null
  }

  const handleFiles = (e) => {
    const files = Array.from(e.target.files || [])
    const remaining = MAX_PHOTOS - photos.length
    const toAdd = files.slice(0, remaining).map((f) => ({
      id: crypto.randomUUID(),
      file: f,
      url: URL.createObjectURL(f),
    }))
    setPhotos((prev) => [...prev, ...toAdd])
    if (fileRef.current) fileRef.current.value = ''
  }

  const removePhoto = (id) => {
    setPhotos((prev) => {
      const removed = prev.find((p) => p.id === id)
      if (removed) URL.revokeObjectURL(removed.url)
      return prev.filter((p) => p.id !== id)
    })
  }

  const handleNext = async () => {
    if (photos.length === 0) return
    if (supabase) {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (session?.user) {
          await supabase.auth.updateUser({
            data: { portfolio_count: photos.length },
          })
        }
      } catch { /* continue */ }
    }
    navigate(`/worker-packages/${category}`)
  }

  return (
    <div className="wp">
      <div className="wp__top">
        <span className="wp__step">{t('portfolio.step')}</span>
        <button type="button" className="wp__back btn-back" onClick={() => navigate(`/worker/signup/${category}`)}>
          {t('common.back')}
        </button>
      </div>

      <div className="wp__body">
        <div className="wp__content">
          <h1 className="wp__title">{t('portfolio.title')}</h1>
          <p className="wp__subtitle">{t('portfolio.subtitle')}</p>

          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            multiple
            className="wp__file-input"
            onChange={handleFiles}
          />

          <div className="wp__grid">
            {Array.from({ length: MAX_PHOTOS }).map((_, i) => {
              const photo = photos[i]
              const isFeatured = i === 0
              if (photo) {
                return (
                  <div key={photo.id} className={`wp__cell${isFeatured ? ' wp__cell--featured' : ''}`}>
                    <img src={photo.url} alt="" className="wp__cell-img" />
                    <button
                      type="button"
                      className="wp__cell-remove"
                      onClick={() => removePhoto(photo.id)}
                      aria-label="Remove"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                      </svg>
                    </button>
                  </div>
                )
              }
              return (
                <button
                  key={`empty-${i}`}
                  type="button"
                  className={`wp__cell wp__cell--empty${isFeatured ? ' wp__cell--featured' : ''}`}
                  onClick={() => fileRef.current?.click()}
                >
                  <svg width={isFeatured ? 32 : 22} height={isFeatured ? 32 : 22} viewBox="0 0 24 24" fill="none" stroke="#C0C0C0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                  </svg>
                  {isFeatured && <span className="wp__cell-add-label">{t('portfolio.addPhoto')}</span>}
                </button>
              )
            })}
          </div>

          <p className="wp__counter">{photos.length} / {MAX_PHOTOS} {t('portfolio.photos')}</p>
        </div>
      </div>

      <div className="wp__footer">
        <button
          type="button"
          className="wp__next btn-primary"
          disabled={photos.length === 0}
          onClick={handleNext}
        >
          {t('serviceArea.next')}
        </button>
      </div>
    </div>
  )
}
