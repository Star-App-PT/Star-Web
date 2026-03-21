import { useState, useRef, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { supabase } from '../supabase'
import {
  uploadWorkerAsset,
  persistWorkerRowDraft,
  fetchWorkerDraftRow,
  normalizeGalleryUrls,
} from '../lib/workerSupabase'
import { useWorkerOnboardingResume } from '../hooks/useWorkerOnboardingResume'
import { getDefaultGalleryUrlsForCategory } from '../lib/workerGalleryDefaults'
import { useDemoMode } from '../contexts/DemoModeContext'
import './WorkerPortfolio.css'

const MAX_PHOTOS = 10

export default function WorkerPortfolio() {
  const { t } = useTranslation()
  const { category } = useParams()
  const navigate = useNavigate()
  const { isDemoMode } = useDemoMode()
  const fileRef = useRef(null)

  const [photos, setPhotos] = useState([])

  useWorkerOnboardingResume('portfolio', category)

  useEffect(() => {
    if (!category) {
      navigate('/worker/signup', { replace: true })
    }
  }, [category, navigate])

  useEffect(() => {
    if (!supabase) return undefined
    let cancelled = false
    ;(async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (cancelled || !session?.user) return
      const m = session.user.user_metadata || {}
      let urls = normalizeGalleryUrls(m.worker_gallery_urls)
      if (!urls.length) {
        const row = await fetchWorkerDraftRow(session.user.id)
        urls = normalizeGalleryUrls(row?.gallery_urls)
      }
      if (urls.length) {
        setPhotos(
          urls.map((url) => ({
            id: crypto.randomUUID(),
            url,
            file: null,
          }))
        )
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  if (!category) {
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

  const persistGalleryAndGo = async (urls) => {
    if (!urls.length) {
      navigate(`/worker/packages/${category}`)
      return
    }
    if (!supabase) {
      navigate(`/worker/packages/${category}`)
      return
    }
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user) {
        const { data: authData } = await supabase.auth.updateUser({
          data: {
            ...session.user.user_metadata,
            portfolio_count: urls.length,
            worker_gallery_urls: urls,
          },
        })
        if (authData?.user) {
          await persistWorkerRowDraft(authData.user, category, urls, { onboardingStep: 'packages' })
        }
      }
    } catch { /* continue */ }
    navigate(`/worker/packages/${category}`)
  }

  const handleNext = async () => {
    if (photos.length === 0) return
    if (supabase) {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (session?.user) {
          const urls = []
          for (let i = 0; i < photos.length; i++) {
            const p = photos[i]
            if (p.file) {
              const { publicUrl } = await uploadWorkerAsset(session.user.id, `gallery-${i}`, p.file)
              if (publicUrl) urls.push(publicUrl)
            } else if (typeof p.url === 'string' && p.url.startsWith('http')) {
              urls.push(p.url)
            }
          }
          await persistGalleryAndGo(urls)
          return
        }
      } catch { /* continue */ }
    }
    navigate(`/worker/packages/${category}`)
  }

  const handleSkip = async () => {
    const { data: { session } } = (await supabase?.auth.getSession()) || { data: { session: null } }
    const specialty = session?.user?.user_metadata?.worker_specialty
    const defaults = getDefaultGalleryUrlsForCategory(category, specialty)
    await persistGalleryAndGo(defaults)
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
                      aria-label={t('portfolio.remove')}
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

          <div className="wp__skip-block">
            <button type="button" className="wp__skip btn-back" onClick={handleSkip}>
              {t('portfolio.skipForNow')}
            </button>
            <p className="wp__skip-hint">{t('portfolio.skipHint')}</p>
          </div>
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
        {/* DEMO ONLY — REMOVE BEFORE LAUNCH */}
        {isDemoMode && (
          <p
            onClick={() => navigate(`/worker/packages/${category}`)}
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
    </div>
  )
}
