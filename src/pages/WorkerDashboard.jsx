import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { supabase } from '../supabase'
import { useAuthSession } from '../contexts/AuthSessionContext'
import { useAppMode } from '../contexts/AppModeContext'
import { workerCategoryToLabelKey } from '../lib/clientWorkerMode'
import { useDualProfile } from '../hooks/useDualProfile'
import { fetchWorkerDashboardPayload } from '../lib/workerSupabase'
import './WorkerDashboard.css'

function normalizeGalleryUrls(raw) {
  if (Array.isArray(raw)) return raw.filter(Boolean)
  return []
}

export default function WorkerDashboard() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { user } = useAuthSession()
  const { setMode } = useAppMode()
  const { hasWorkerProfile: hasWorkerFromDual, loading: dualLoading } = useDualProfile(user)
  const [sessionReady, setSessionReady] = useState(false)
  const [reviewsCount, setReviewsCount] = useState(0)
  const [avgReviewRating, setAvgReviewRating] = useState(null)
  const [dbWorker, setDbWorker] = useState(null)
  const [dbPackages, setDbPackages] = useState([])

  const meta = user?.user_metadata
  const hasWorker = hasWorkerFromDual

  useEffect(() => {
    if (!supabase) {
      setSessionReady(true)
      return
    }
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSessionReady(true)
      if (!session?.user) navigate('/', { replace: true })
    })
  }, [navigate])

  useEffect(() => {
    setMode('worker')
  }, [setMode])

  useEffect(() => {
    if (!user?.id || !supabase) return
    supabase
      .from('reviews')
      .select('id', { count: 'exact', head: true })
      .eq('reviewee_id', user.id)
      .then(({ count }) => setReviewsCount(typeof count === 'number' ? count : 0))
      .catch(() => setReviewsCount(0))
    supabase
      .from('reviews')
      .select('rating')
      .eq('reviewee_id', user.id)
      .then(({ data }) => {
        if (!data?.length) {
          setAvgReviewRating(null)
          return
        }
        const nums = data.map((r) => Number(r.rating)).filter((n) => !Number.isNaN(n))
        if (!nums.length) setAvgReviewRating(null)
        else setAvgReviewRating((nums.reduce((a, b) => a + b, 0) / nums.length).toFixed(1))
      })
      .catch(() => setAvgReviewRating(null))
  }, [user?.id])

  useEffect(() => {
    if (!user?.id || !supabase) return
    fetchWorkerDashboardPayload(user.id).then(({ workerRow, packages }) => {
      setDbWorker(workerRow)
      setDbPackages(packages || [])
    })
  }, [user?.id])

  useEffect(() => {
    if (!sessionReady || !user || dualLoading) return
    if (!hasWorker) navigate('/', { replace: true })
  }, [sessionReady, hasWorker, user, navigate, dualLoading])

  const displayName = useMemo(
    () =>
      dbWorker?.display_name ||
      meta?.full_name ||
      meta?.name ||
      user?.email?.split('@')[0] ||
      '',
    [dbWorker?.display_name, meta, user?.email],
  )

  const categoryKey = workerCategoryToLabelKey(dbWorker?.category || meta?.worker_category)
  const categoryLabel = categoryKey ? t(categoryKey) : t('workerDashboard.categoryNotSet')

  const galleryUrls = normalizeGalleryUrls(dbWorker?.gallery_urls || meta?.worker_gallery_urls)
  const jobsCompleted = 0
  const earningsMonth = 0
  const earningsAll = 0

  const completion = useMemo(() => {
    let score = 0
    const missing = []
    const checks = [
      { ok: !!(dbWorker?.profile_photo_url || meta?.avatar_url), label: t('workerHost.missingPhoto') },
      { ok: !!(dbWorker?.bio || meta?.worker_notable), label: t('workerHost.missingBio') },
      { ok: galleryUrls.length > 0, label: t('workerHost.missingPortfolio') },
      { ok: dbPackages.length > 0, label: t('workerHost.missingPackages') },
      { ok: !!dbWorker?.service_area_address || !!meta?.service_area_address, label: t('workerHost.missingArea') },
    ]
    checks.forEach((c) => {
      if (c.ok) score += 20
      else missing.push(c.label)
    })
    return { pct: Math.min(100, score), missing }
  }, [dbWorker, meta, galleryUrls.length, dbPackages.length, t])

  const ratingDisplay =
    avgReviewRating ||
    (typeof meta?.worker_rating === 'number' && !Number.isNaN(meta.worker_rating)
      ? meta.worker_rating.toFixed(1)
      : '—')

  if (!sessionReady || !user || dualLoading) {
    return (
      <div className="worker-dash worker-dash--loading">
        <p>{t('common.submitting')}</p>
      </div>
    )
  }

  if (!hasWorker) return null

  return (
    <div className="worker-dash worker-dash--host">
      <div className="worker-dash__inner container">
        <header className="worker-dash__welcome">
          <h1 className="worker-dash__welcome-title">{t('workerHost.dashWelcome', { name: displayName })}</h1>
          <p className="worker-dash__welcome-sub">{categoryLabel}</p>
        </header>

        <section className="worker-dash__stat-grid" aria-label={t('workerHost.summaryStats')}>
          <div className="worker-dash__stat-card">
            <span className="worker-dash__stat-label">{t('workerHost.statJobsDone')}</span>
            <span className="worker-dash__stat-value">{jobsCompleted}</span>
          </div>
          <div className="worker-dash__stat-card">
            <span className="worker-dash__stat-label">{t('workerHost.statEarningsMonth')}</span>
            <span className="worker-dash__stat-value">€{earningsMonth.toFixed(0)}</span>
          </div>
          <div className="worker-dash__stat-card">
            <span className="worker-dash__stat-label">{t('workerHost.statEarningsAll')}</span>
            <span className="worker-dash__stat-value">€{earningsAll.toFixed(0)}</span>
          </div>
          <div className="worker-dash__stat-card">
            <span className="worker-dash__stat-label">{t('workerHost.statRating')}</span>
            <span className="worker-dash__stat-value">{ratingDisplay}</span>
          </div>
          <div className="worker-dash__stat-card">
            <span className="worker-dash__stat-label">{t('workerHost.statReviews')}</span>
            <span className="worker-dash__stat-value">{reviewsCount}</span>
          </div>
          <div className="worker-dash__stat-card">
            <span className="worker-dash__stat-label">{t('workerHost.statProfile')}</span>
            <span className="worker-dash__stat-value">{completion.pct}%</span>
            {completion.missing.length > 0 && (
              <p className="worker-dash__stat-hint">{completion.missing.join(' · ')}</p>
            )}
          </div>
        </section>

        <section className="worker-dash__quick">
          <h2 className="worker-dash__section-h">{t('workerHost.quickActions')}</h2>
          <div className="worker-dash__quick-links">
            <Link to="/dashboard/worker/today" className="worker-dash__quick-link">
              {t('workerHost.goToday')}
            </Link>
            <Link to="/dashboard/worker/calendar" className="worker-dash__quick-link">
              {t('workerHost.goCalendar')}
            </Link>
            <Link to="/dashboard/worker/packages" className="worker-dash__quick-link">
              {t('workerHost.goPackages')}
            </Link>
          </div>
        </section>

        <section className="worker-dash__activity">
          <h2 className="worker-dash__section-h">{t('workerHost.recentActivity')}</h2>
          <div className="worker-dash__activity-box">
            <p className="worker-dash__empty">{t('workerHost.activityEmpty')}</p>
          </div>
        </section>
      </div>
    </div>
  )
}
