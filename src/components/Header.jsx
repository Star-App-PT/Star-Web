import { useState, useRef, useEffect } from 'react'
import { Link, useLocation, useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import './Header.css'

const CATEGORY_IDS = [
  { id: 'cleaners', labelKey: 'home.categoryClean', icon: '/assets/icon-clean.png' },
  { id: 'handymen', labelKey: 'home.categoryRepair', icon: '/assets/icon-repair.png' },
  { id: 'services', labelKey: 'home.categoryServices', icon: '/assets/icon-services.png' },
]

const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'pt-PT', label: 'Português' },
  { code: 'es', label: 'Español' },
]

const CODE_TO_LABEL = { en: 'ENG', 'pt-PT': 'PTG', es: 'ES' }

export default function Header() {
  const { t, i18n } = useTranslation()
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const [langOpen, setLangOpen] = useState(false)
  const langRef = useRef(null)

  const activeCategory = location.pathname === '/' ? (searchParams.get('category') || 'cleaners') : null

  const isMinimalHeader =
    location.pathname === '/worker/signup' ||
    location.pathname === '/worker/profile/intro' ||
    location.pathname === '/worker/profile/skill' ||
    location.pathname === '/worker/profile/cleaner' ||
    location.pathname === '/worker/profile'

  useEffect(() => {
    function handleClickOutside(e) {
      if (langRef.current && !langRef.current.contains(e.target)) setLangOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const currentCode = i18n.language && i18n.language.startsWith('pt') ? 'pt-PT' : i18n.language && i18n.language.startsWith('es') ? 'es' : 'en'

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
                to={location.pathname === '/' ? `/?category=${id}` : `/?category=${id}`}
                className={`star-header__category ${activeCategory === id ? 'star-header__category--active' : ''} ${id === 'services' ? 'star-header__category--services' : ''}`}
              >
                <img src={icon} alt="" className="star-header__category-icon" onError={(e) => { e.target.style.display = 'none' }} />
                <span>{t(labelKey)}</span>
              </Link>
            ))}
          </div>
        )}
        <nav className="star-header__nav">
          <div className="star-header__lang" ref={langRef}>
            <button
              type="button"
              className="star-header__lang-btn"
              onClick={() => setLangOpen((o) => !o)}
              aria-expanded={langOpen}
              aria-haspopup="true"
            >
              <span className="star-header__lang-globe" aria-hidden>🌐</span>
              <span className="star-header__lang-code">{CODE_TO_LABEL[currentCode] || 'ENG'}</span>
              <span className="star-header__lang-chevron">▼</span>
            </button>
            {langOpen && (
              <ul className="star-header__lang-dropdown">
                {LANGUAGES.map(({ code, label }) => (
                  <li key={code}>
                    <button
                      type="button"
                      className={`star-header__lang-option ${currentCode === code ? 'star-header__lang-option--active' : ''}`}
                      onClick={() => { i18n.changeLanguage(code); setLangOpen(false) }}
                    >
                      {label}
                      {currentCode === code && ' ✓'}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
          {!isMinimalHeader && (
            <Link to="/worker/signup" className="star-header__cta">
              {t('header.becomeAStar')}
            </Link>
          )}
        </nav>
      </div>
    </header>
  )
}
