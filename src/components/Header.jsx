import { Link, useLocation, useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import HamburgerMenu from './HamburgerMenu'
import { useAuthSession } from '../contexts/AuthSessionContext'
import { useAppMode } from '../contexts/AppModeContext'
import { useDualProfile } from '../hooks/useDualProfile'
import './Header.css'

const CATEGORY_IDS = [
  { id: 'cleaners', labelKey: 'home.categoryClean', icon: '/assets/icon-clean.png' },
  { id: 'handymen', labelKey: 'home.categoryRepair', icon: '/assets/icon-repair.png' },
  { id: 'services', labelKey: 'home.categoryServices', icon: '/assets/icon-services.png' },
]

export default function Header() {
  const { t } = useTranslation()
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const { user } = useAuthSession()
  const { mode, setMode } = useAppMode()
  const { loading: dualLoading, hasWorkerProfile, hasBothProfiles } = useDualProfile(user)

  const activeCategory = location.pathname === '/' ? (searchParams.get('category') || 'cleaners') : null

  const isMinimalHeader =
    location.pathname === '/worker/signup' ||
    location.pathname === '/worker/profile/intro' ||
    location.pathname === '/worker/profile/skill' ||
    location.pathname === '/worker/profile/cleaner' ||
    location.pathname === '/worker/profile' ||
    location.pathname === '/worker/finish-profile' ||
    location.pathname === '/worker/choose-category' ||
    location.pathname.startsWith('/worker/service-area') ||
    location.pathname.startsWith('/worker/about') ||
    location.pathname.startsWith('/worker/portfolio') ||
    location.pathname.startsWith('/worker/packages') ||
    location.pathname === '/dashboard' ||
    location.pathname.startsWith('/client/signup')

  const avatarUrl = user?.user_metadata?.avatar_url || user?.user_metadata?.picture || null
  const displayInitial = user
    ? (user.user_metadata?.full_name || user.user_metadata?.name || user.email || '?').charAt(0).toUpperCase()
    : null

  const isHome = location.pathname === '/'

  return (
    <header className={`star-header${isHome ? ' star-header--home' : ''}`}>
      <div className="star-header__inner container">
        <Link to="/" className="star-header__logo">
          <img
            src="/star-logolblue.svg"
            onError={(e) => { e.target.onerror = null; e.target.src = '/star-logo-blue.svg' }}
            alt="Star"
            className="star-header__logo-img"
          />
        </Link>
        {!isMinimalHeader && (
          <div className="star-header__categories">
            {CATEGORY_IDS.map(({ id, labelKey, icon }) => (
              <Link
                key={id}
                to={`/?category=${id}`}
                className={`star-header__category ${activeCategory === id ? 'star-header__category--active' : ''} ${id === 'services' ? 'star-header__category--services' : ''}`}
              >
                <img src={icon} alt="" className="star-header__category-icon" onError={(e) => { e.target.style.display = 'none' }} />
                <span>{t(labelKey)}</span>
              </Link>
            ))}
          </div>
        )}
        <nav className="star-header__nav">
          {user && !dualLoading && hasBothProfiles && mode === 'client' && (
            <Link
              to="/dashboard/worker"
              className="star-header__mode-link"
              onClick={() => setMode('worker')}
            >
              {t('header.switchToWorker')}
            </Link>
          )}
          {user && !dualLoading && hasBothProfiles && mode === 'worker' && (
            <Link to="/" className="star-header__mode-link" onClick={() => setMode('client')}>
              {t('header.switchToClient')}
            </Link>
          )}
          {user && !dualLoading && !hasWorkerProfile && (
            <Link to="/worker/signup" className="star-header__mode-link star-header__mode-link--become">
              {t('header.becomeAStar')}
            </Link>
          )}
          {user && (
            <Link to="/profile" className="star-header__avatar-link" aria-label="Go to profile">
              {avatarUrl ? (
                <img src={avatarUrl} alt="" className="star-header__avatar-img" />
              ) : (
                <span className="star-header__avatar-initial">{displayInitial}</span>
              )}
            </Link>
          )}
          <HamburgerMenu />
        </nav>
      </div>
    </header>
  )
}
