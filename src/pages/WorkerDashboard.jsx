import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { supabase } from '../supabase'
import { useAuthSession } from '../contexts/AuthSessionContext'
import { useAppMode } from '../contexts/AppModeContext'
import { hasWorkerProfileFromMetadata, workerCategoryToLabelKey } from '../lib/clientWorkerMode'
import './WorkerDashboard.css'

export default function WorkerDashboard() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { user } = useAuthSession()
  const { setMode } = useAppMode()
  const [sessionReady, setSessionReady] = useState(false)
  const [reviewsCount, setReviewsCount] = useState(0)

  const meta = user?.user_metadata
  const hasWorker = hasWorkerProfileFromMetadata(meta)

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
  }, [user?.id])

  useEffect(() => {
    if (!sessionReady || !user) return
    if (!hasWorker) navigate('/', { replace: true })
  }, [sessionReady, hasWorker, user, navigate])

  const displayName = useMemo(
    () => meta?.full_name || meta?.name || user?.email?.split('@')[0] || '',
    [meta, user?.email],
  )

  const avatarUrl = meta?.avatar_url || meta?.picture || meta?.profile_photo_url || null
  const initial = (displayName || '?').charAt(0).toUpperCase()

  const categoryKey = workerCategoryToLabelKey(meta?.worker_category)
  const categoryLabel = categoryKey ? t(categoryKey) : t('workerDashboard.categoryNotSet')

  const ratingRaw = meta?.worker_rating
  const ratingDisplay =
    typeof ratingRaw === 'number' && !Number.isNaN(ratingRaw) ? ratingRaw.toFixed(1) : '—'

  const pkgCategory = ['cleaning', 'repairs', 'services'].includes(String(meta?.worker_category || ''))
    ? meta.worker_category
    : 'cleaning'

  if (!sessionReady || !user) {
    return (
      <div className="worker-dash worker-dash--loading">
        <p>{t('common.submitting')}</p>
      </div>
    )
  }

  if (!hasWorker) return null

  const activeBookings = 0
  const completedJobs = 0
  const upcomingSchedule = []

  return (
    <div className="worker-dash">
      <div className="worker-dash__inner container">
        <div className="worker-dash__topbar">
          <Link
            to="/"
            className="worker-dash__switch-client"
            onClick={() => setMode('client')}
          >
            {t('header.switchToClient')}
          </Link>
        </div>

        <header className="worker-dash__hero">
          <div className="worker-dash__avatar-wrap">
            {avatarUrl ? (
              <img src={avatarUrl} alt="" className="worker-dash__avatar" />
            ) : (
              <span className="worker-dash__avatar-initial">{initial}</span>
            )}
          </div>
          <h1 className="worker-dash__name">{displayName}</h1>
          <p className="worker-dash__category">{categoryLabel}</p>
          <div className="worker-dash__rating-row">
            <span className="worker-dash__rating-stars" aria-hidden>
              ★
            </span>
            <span className="worker-dash__rating-value">{ratingDisplay}</span>
            <span className="worker-dash__rating-label">{t('workerDashboard.starRating')}</span>
          </div>
          <Link to="/profile/edit" className="worker-dash__edit">
            {t('workerDashboard.editProfile')}
          </Link>
        </header>

        <div className="worker-dash__grid">
          <section className="worker-dash__card">
            <h2 className="worker-dash__card-title">{t('workerDashboard.jobsTitle')}</h2>
            <ul className="worker-dash__stats">
              <li>
                <span className="worker-dash__stat-value">{activeBookings}</span>
                <span className="worker-dash__stat-label">{t('workerDashboard.activeBookings')}</span>
              </li>
              <li>
                <span className="worker-dash__stat-value">{completedJobs}</span>
                <span className="worker-dash__stat-label">{t('workerDashboard.completedJobs')}</span>
              </li>
            </ul>
            {activeBookings === 0 && completedJobs === 0 ? (
              <p className="worker-dash__empty">{t('workerDashboard.noBookingsYet')}</p>
            ) : null}
            <Link to="/dashboard/worker/jobs" className="worker-dash__card-link">
              {t('workerDashboard.viewAllJobs')}
            </Link>
          </section>

          <section className="worker-dash__card">
            <h2 className="worker-dash__card-title">{t('workerDashboard.messagesTitle')}</h2>
            <p className="worker-dash__empty">{t('workerDashboard.noMessagesYet')}</p>
            <Link to="/dashboard/worker/messages" className="worker-dash__card-link">
              {t('workerDashboard.openInbox')}
            </Link>
          </section>

          <section className="worker-dash__card">
            <h2 className="worker-dash__card-title">{t('workerDashboard.scheduleTitle')}</h2>
            {upcomingSchedule.length === 0 ? (
              <p className="worker-dash__empty">{t('workerDashboard.noUpcomingBookings')}</p>
            ) : (
              <ul className="worker-dash__schedule-list">
                {upcomingSchedule.map((row) => (
                  <li key={row.id}>{row.label}</li>
                ))}
              </ul>
            )}
            <Link to="/dashboard/worker/schedule" className="worker-dash__card-link">
              {t('workerDashboard.viewCalendar')}
            </Link>
          </section>

          <section className="worker-dash__card">
            <h2 className="worker-dash__card-title">{t('workerDashboard.profileCardTitle')}</h2>
            <ul className="worker-dash__stats worker-dash__stats--compact">
              <li>
                <span className="worker-dash__stat-value">{ratingDisplay}</span>
                <span className="worker-dash__stat-label">{t('workerDashboard.rating')}</span>
              </li>
              <li>
                <span className="worker-dash__stat-value">{reviewsCount}</span>
                <span className="worker-dash__stat-label">{t('workerDashboard.reviews')}</span>
              </li>
              <li>
                <span className="worker-dash__stat-value">{completedJobs}</span>
                <span className="worker-dash__stat-label">{t('workerDashboard.jobsDone')}</span>
              </li>
            </ul>
            <div className="worker-dash__card-actions">
              <Link to="/profile/edit" className="worker-dash__card-link">
                {t('workerDashboard.editProfile')}
              </Link>
              <Link
                to={`/worker/packages/${pkgCategory}`}
                className="worker-dash__card-link worker-dash__card-link--secondary"
              >
                {t('workerDashboard.managePackages')}
              </Link>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
