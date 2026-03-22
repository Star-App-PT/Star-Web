import { useState, useRef, useCallback, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { supabase } from '../../supabase'
import { uploadWorkerAsset, persistWorkerRowDraft } from '../../lib/workerSupabase'
import { useWorkerOnboardingResume } from '../../hooks/useWorkerOnboardingResume'
import { useDemoMode } from '../../contexts/DemoModeContext'
import { Camera } from 'lucide-react'
import actionHomeCleaning from '../../assets/workers/action/action-home-cleaning.jpg'
import actionCarpentry from '../../assets/workers/action/action-carpentry.jpg'
import actionPhotography from '../../assets/workers/action/action-photography.jpg'
import './CategorySignup.css'

const CATEGORY_META = {
  cleaning: { defaultCover: actionHomeCleaning, roleKey: 'profilePhoto.roleCleaning' },
  repairs:  { defaultCover: actionCarpentry,     roleKey: 'profilePhoto.roleRepairs' },
  services: { defaultCover: actionPhotography,   roleKey: 'profilePhoto.roleServices' },
}

export default function CategorySignup() {
  const { t } = useTranslation()
  const { category } = useParams()
  const navigate = useNavigate()
  const { isDemoMode } = useDemoMode()
  const meta = CATEGORY_META[category] || CATEGORY_META.cleaning

  useWorkerOnboardingResume('profile_photos', category)

  const fileRef = useRef(null)
  const coverInputRef = useRef(null)
  const profileFileRef = useRef(null)
  const coverFileRef = useRef(null)
  const frameRef = useRef(null)
  const pickerOpen = useRef(false)
  const suppressFrameClickRef = useRef(false)

  const [imgSrc, setImgSrc] = useState(null)
  const [confirmed, setConfirmed] = useState(false)
  const [scale, setScale] = useState(1)
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const [dragging, setDragging] = useState(false)
  const dragStart = useRef({ x: 0, y: 0 })
  const offsetStart = useRef({ x: 0, y: 0 })

  const [coverSrc, setCoverSrc] = useState(null)
  const [uploadingProfile, setUploadingProfile] = useState(false)

  useEffect(() => {
    let cancelled = false
    if (!supabase) return undefined
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (cancelled || !session?.user) return
      const m = session.user.user_metadata || {}
      const av = m.avatar_url || m.profile_photo_url
      const cv = m.worker_cover_photo_url
      if (av) {
        setImgSrc(av)
        if (m.profile_photo_confirmed) setConfirmed(true)
      }
      if (cv) setCoverSrc(cv)
    })
    return () => {
      cancelled = true
    }
  }, [])

  const openPicker = () => {
    if (pickerOpen.current || imgSrc) return
    pickerOpen.current = true
    fileRef.current?.click()
  }

  const handleFile = (e) => {
    pickerOpen.current = false
    const file = e.target.files?.[0]
    if (!file) return
    profileFileRef.current = file
    setImgSrc(URL.createObjectURL(file))
    setConfirmed(false)
    setScale(1)
    setOffset({ x: 0, y: 0 })
  }

  const handleCoverFile = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    coverFileRef.current = file
    const local = URL.createObjectURL(file)
    setCoverSrc(local)
    if (!supabase) return
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.user) return
      const { publicUrl } = await uploadWorkerAsset(session.user.id, 'cover', file)
      if (!publicUrl) return
      const { data: authData } = await supabase.auth.updateUser({
        data: {
          ...session.user.user_metadata,
          worker_cover_photo_url: publicUrl,
        },
      })
      if (authData?.user) {
        await persistWorkerRowDraft(authData.user, category, undefined, { onboardingStep: 'profile_photos' })
      }
      URL.revokeObjectURL(local)
      setCoverSrc(publicUrl)
      coverFileRef.current = null
    } catch {
      /* keep local preview */
    }
  }

  const handleCancel = () => {
    setImgSrc(null)
    setConfirmed(false)
    setScale(1)
    setOffset({ x: 0, y: 0 })
    profileFileRef.current = null
    if (fileRef.current) fileRef.current.value = ''
  }

  const handleDone = async () => {
    setConfirmed(true)
    const file = profileFileRef.current
    if (!file || !supabase) return
    setUploadingProfile(true)
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.user) return
      const { publicUrl } = await uploadWorkerAsset(session.user.id, 'profile', file)
      if (!publicUrl) return
      const { data: authData } = await supabase.auth.updateUser({
        data: {
          ...session.user.user_metadata,
          profile_photo_confirmed: true,
          avatar_url: publicUrl,
          profile_photo_url: publicUrl,
        },
      })
      if (authData?.user) {
        await persistWorkerRowDraft(authData.user, category, undefined, { onboardingStep: 'profile_photos' })
      }
      setImgSrc(publicUrl)
      profileFileRef.current = null
    } finally {
      setUploadingProfile(false)
    }
  }

  const openProfileReplace = () => {
    pickerOpen.current = true
    fileRef.current?.click()
  }

  const handleFrameClick = () => {
    if (suppressFrameClickRef.current) {
      suppressFrameClickRef.current = false
      return
    }
    if (!imgSrc) openPicker()
    else openProfileReplace()
  }

  const onPointerDown = useCallback((e) => {
    if (!imgSrc || confirmed) return
    e.preventDefault()
    suppressFrameClickRef.current = false
    setDragging(true)
    dragStart.current = { x: e.clientX, y: e.clientY }
    offsetStart.current = { ...offset }
  }, [imgSrc, confirmed, offset])

  const onPointerMove = useCallback((e) => {
    if (!dragging) return
    const dx = e.clientX - dragStart.current.x
    const dy = e.clientY - dragStart.current.y
    if (dx * dx + dy * dy > 64) suppressFrameClickRef.current = true
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
    if (!imgSrc) return
    if (supabase) {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (session?.user) {
          let profileUrl =
            typeof imgSrc === 'string' && imgSrc.startsWith('http') ? imgSrc : session.user.user_metadata?.avatar_url || null
          let coverUrl =
            typeof coverSrc === 'string' && coverSrc.startsWith('http')
              ? coverSrc
              : session.user.user_metadata?.worker_cover_photo_url || null
          if (profileFileRef.current) {
            const { publicUrl } = await uploadWorkerAsset(session.user.id, 'profile', profileFileRef.current)
            if (publicUrl) profileUrl = publicUrl
          }
          if (coverFileRef.current) {
            const { publicUrl } = await uploadWorkerAsset(session.user.id, 'cover', coverFileRef.current)
            if (publicUrl) coverUrl = publicUrl
          }
          const { data: authData } = await supabase.auth.updateUser({
            data: {
              ...session.user.user_metadata,
              profile_photo_confirmed: true,
              ...(profileUrl && { avatar_url: profileUrl, profile_photo_url: profileUrl }),
              ...(coverUrl && { worker_cover_photo_url: coverUrl }),
            },
          })
          if (authData?.user) {
            await persistWorkerRowDraft(authData.user, category, undefined, { onboardingStep: 'portfolio' })
          }
        }
      } catch { /* continue */ }
    }
    navigate(`/worker/portfolio/${category}`)
  }

  const handleBack = async () => {
    if (!category) return
    if (supabase) {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (session?.user) {
          let profileUrl =
            typeof imgSrc === 'string' && imgSrc.startsWith('http') ? imgSrc : session.user.user_metadata?.avatar_url || null
          let coverUrl =
            typeof coverSrc === 'string' && coverSrc.startsWith('http')
              ? coverSrc
              : session.user.user_metadata?.worker_cover_photo_url || null
          if (profileFileRef.current) {
            const { publicUrl } = await uploadWorkerAsset(session.user.id, 'profile', profileFileRef.current)
            if (publicUrl) profileUrl = publicUrl
          }
          if (coverFileRef.current) {
            const { publicUrl } = await uploadWorkerAsset(session.user.id, 'cover', coverFileRef.current)
            if (publicUrl) coverUrl = publicUrl
          }
          const { data: authData } = await supabase.auth.updateUser({
            data: {
              ...session.user.user_metadata,
              profile_photo_confirmed: true,
              ...(profileUrl && { avatar_url: profileUrl, profile_photo_url: profileUrl }),
              ...(coverUrl && { worker_cover_photo_url: coverUrl }),
            },
          })
          if (authData?.user) {
            await persistWorkerRowDraft(authData.user, category, undefined, { onboardingStep: 'about' })
          }
        }
      } catch { /* continue */ }
    }
    navigate(`/worker/about/${category}`)
  }

  if (!category) {
    navigate('/worker/signup', { replace: true })
    return null
  }

  const workerName = t('profilePhoto.yourName')

  return (
    <div className="cs">
      <div className="cs__top">
        <span className="cs__step">{t('profilePhoto.step')}</span>
        <button type="button" className="cs__back btn-back" onClick={handleBack}>
          {t('common.back')}
        </button>
      </div>

      <div className="cs__body">
        <div className="cs__content">
          <h1 className="cs__title">{t('profilePhoto.title')}</h1>

          {/* ── Profile photo section ── */}
          <div className="cs__section">
            <h2 className="cs__label">{t('profilePhoto.sectionLabel')}</h2>
            <p className="cs__hint">{t('profilePhoto.hint')}</p>

            <input ref={fileRef} type="file" accept="image/*" className="cs__file" onChange={handleFile} />
            <div className="cs__frame-wrap">
            <div
              ref={frameRef}
              className={`cs__frame${imgSrc ? '' : ' cs__frame--empty'}`}
              onClick={handleFrameClick}
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
                  style={{ transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale})` }}
                />
              ) : (
                <div className="cs__frame-empty">
                  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#B0B0B0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                    <circle cx="12" cy="13" r="4"/>
                  </svg>
                  <span>{t('profilePhoto.uploadLabel')}</span>
                </div>
              )}
            </div>
            <button
              type="button"
              className="cs__frame-cam"
              onClick={(e) => {
                e.stopPropagation()
                if (!imgSrc) openPicker()
                else openProfileReplace()
              }}
              aria-label={t('profilePhoto.changePhoto')}
            >
              <Camera className="cs__frame-cam-icon" strokeWidth={1.5} aria-hidden />
            </button>
            </div>

            {imgSrc && !confirmed && (
              <div className="cs__zoom">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#B0B0B0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="8" y1="11" x2="14" y2="11"/>
                </svg>
                <input
                  type="range"
                  className="cs__zoom-slider"
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
              <div className="cs__actions">
                <button type="button" className="cs__action cs__action--cancel" onClick={handleCancel}>
                  {t('common.cancel')}
                </button>
                <button type="button" className="cs__action cs__action--done" onClick={handleDone} disabled={uploadingProfile}>
                  {uploadingProfile ? t('common.submitting') : t('common.done')}
                </button>
              </div>
            )}

            {imgSrc && !confirmed && (
              <p className="cs__drag-hint">{t('profilePhoto.dragHint')}</p>
            )}
          </div>

          {/* ── Card photo section ── */}
          <div className="cs__section cs__section--card">
            <h2 className="cs__label">{t('profilePhoto.cardLabel')}</h2>
            <p className="cs__hint">{t('profilePhoto.cardHint')}</p>
          </div>

          {/* ── Worker card preview ── */}
            <input ref={coverInputRef} type="file" accept="image/*" className="cs__file" onChange={handleCoverFile} />
          <div className="cs__preview">
            <div
              className="cs__preview-cover"
              onClick={() => coverInputRef.current?.click()}
              onKeyDown={(e) => e.key === 'Enter' && coverInputRef.current?.click()}
              role="button"
              tabIndex={0}
            >
              <img
                src={coverSrc || meta.defaultCover}
                alt=""
                className="cs__preview-cover-img"
              />
              <span className="cs__preview-badge">{t('profilePhoto.topRated')}</span>
              <span className="cs__preview-heart">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                </svg>
              </span>
              <button
                type="button"
                className="cs__preview-cam"
                onClick={(e) => {
                  e.stopPropagation()
                  coverInputRef.current?.click()
                }}
                aria-label={t('profilePhoto.changeCover')}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                  <circle cx="12" cy="13" r="4"/>
                </svg>
              </button>
            </div>

            <div className="cs__preview-avatar-wrap">
              <div className={`cs__preview-avatar star-profile-ring${confirmed && imgSrc ? '' : ' star-profile-ring--empty'}`}>
                {imgSrc ? (
                  <img
                    src={imgSrc}
                    alt=""
                    className="cs__preview-avatar-img"
                    style={{ transform: `translate(${offset.x * 0.5}px, ${offset.y * 0.5}px) scale(${scale})` }}
                  />
                ) : (
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#C0C0C0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                  </svg>
                )}
              </div>
            </div>

            <div className="cs__preview-info">
              <p className="cs__preview-name">{workerName}</p>
              <p className="cs__preview-role">{t(meta.roleKey)}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="cs__footer">
        <button type="button" className="cs__next btn-primary" disabled={!imgSrc} onClick={handleNext}>
          {t('serviceArea.next')}
        </button>
        {/* DEMO ONLY — REMOVE BEFORE LAUNCH */}
        {isDemoMode && (
          <p
            onClick={() => navigate(`/worker/portfolio/${category}`)}
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
