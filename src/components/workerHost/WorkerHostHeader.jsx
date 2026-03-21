import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import HamburgerMenu from '../HamburgerMenu'
import { useAuthSession } from '../../contexts/AuthSessionContext'
import { useAppMode } from '../../contexts/AppModeContext'
import { fetchWorkerDashboardPayload } from '../../lib/workerSupabase'
import { useEffect, useState } from 'react'
import './WorkerHostHeader.css'

const nav = [
  { to: '/dashboard/worker/today', key: 'workerHost.navToday' },
  { to: '/dashboard/worker/calendar', key: 'workerHost.navCalendar' },
  { to: '/dashboard/worker/packages', key: 'workerHost.navPackages' },
  { to: '/dashboard/worker/messages', key: 'workerHost.navMessages' },
  { to: '/dashboard/worker', end: true, key: 'workerHost.navDashboard' },
]

export default function WorkerHostHeader() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { user } = useAuthSession()
  const { setMode } = useAppMode()
  const [profilePhoto, setProfilePhoto] = useState(null)

  useEffect(() => {
    if (!user?.id) return
    fetchWorkerDashboardPayload(user.id).then(({ workerRow }) => {
      setProfilePhoto(
        workerRow?.profile_photo_url ||
          user.user_metadata?.avatar_url ||
          user.user_metadata?.profile_photo_url ||
          null,
      )
    })
  }, [user?.id, user?.user_metadata?.avatar_url, user?.user_metadata?.profile_photo_url])

  const displayInitial = user
    ? (user.user_metadata?.full_name || user.user_metadata?.name || user.email || '?').charAt(0).toUpperCase()
    : '?'

  const avatarSrc =
    profilePhoto || user?.user_metadata?.avatar_url || user?.user_metadata?.profile_photo_url || user?.user_metadata?.picture

  return (
    <header className="wh-host">
      <div className="wh-host__inner container">
        <Link to="/" className="wh-host__logo" onClick={() => setMode('client')}>
          <img
            src="/star-logolblue.svg"
            onError={(e) => {
              e.target.onerror = null
              e.target.src = '/star-logo-blue.svg'
            }}
            alt="Star"
            className="wh-host__logo-img"
          />
        </Link>

        <nav className="wh-host__nav" aria-label="Hosting">
          {nav.map(({ to, key, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) => `wh-host__link${isActive ? ' wh-host__link--active' : ''}`}
            >
              {t(key)}
            </NavLink>
          ))}
        </nav>

        <div className="wh-host__right">
          <button
            type="button"
            className="wh-host__switch"
            onClick={() => {
              setMode('client')
              navigate('/')
            }}
          >
            {t('header.switchToClient')}
          </button>
          <Link
            to={user?.id ? `/worker/${user.id}` : '/profile'}
            className="wh-host__avatar-link"
            aria-label={t('workerHost.viewProfile')}
          >
            {avatarSrc ? (
              <img src={avatarSrc} alt="" className="wh-host__avatar-img" />
            ) : (
              <span className="wh-host__avatar-initial">{displayInitial}</span>
            )}
          </Link>
          <HamburgerMenu />
        </div>
      </div>
    </header>
  )
}
