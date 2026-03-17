import { Link, useLocation, useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import LanguageToggle from './LanguageToggle'
import HamburgerMenu from './HamburgerMenu'
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

  const activeCategory = location.pathname === '/' ? (searchParams.get('category') || 'cleaners') : null

  const isMinimalHeader =
    location.pathname === '/worker/signup' ||
    location.pathname === '/worker/profile/intro' ||
    location.pathname === '/worker/profile/skill' ||
    location.pathname === '/worker/profile/cleaner' ||
    location.pathname === '/worker/profile' ||
    location.pathname === '/finish-profile' ||
    location.pathname === '/choose-category' ||
    location.pathname.startsWith('/service-location') ||
    location.pathname.startsWith('/worker-about') ||
    location.pathname.startsWith('/service-area') ||
    location.pathname === '/dashboard'

  return (
    <header className="star-header">
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
          {!isMinimalHeader && (
            <Link to="/worker/signup" className="star-header__cta btn-primary">
              {t('header.becomeAStar')}
            </Link>
          )}
          <LanguageToggle />
          <HamburgerMenu />
        </nav>
      </div>
    </header>
  )
}
