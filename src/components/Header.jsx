import { Link, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import './Header.css'

export default function Header() {
  const { t } = useTranslation()
  const location = useLocation()
  const isMinimalHeader =
    location.pathname === '/worker/signup' ||
    location.pathname === '/worker/profile/intro' ||
    location.pathname === '/worker/profile/skill' ||
    location.pathname === '/worker/profile/cleaner' ||
    location.pathname === '/worker/profile'

  return (
    <header className="star-header">
      <div className="star-header__inner container">
        <Link to="/" className="star-header__logo">
          <img
            src="/assets/Star-App-Logo-Transp.png"
          onError={(e) => { e.target.onerror = null; e.target.src = '/vite.svg' }}
            alt="Star"
            className="star-header__logo-img"
          />
        </Link>
        {!isMinimalHeader && (
          <nav className="star-header__nav">
            <Link to="/worker/signup" className="star-header__cta">
              {t('header.becomeAStar')}
            </Link>
          </nav>
        )}
      </div>
    </header>
  )
}
