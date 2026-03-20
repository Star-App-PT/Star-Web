import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { supabase } from '../supabase'
import { useAuthSession } from '../contexts/AuthSessionContext'
import './HamburgerMenu.css'

export default function HamburgerMenu() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const { user } = useAuthSession()
  const isLoggedIn = !!user
  const isStarWorker = !!user?.user_metadata?.is_worker
  const ref = useRef(null)

  useEffect(() => {
    function handler(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleSignOut = async () => {
    setOpen(false)
    await supabase?.auth.signOut()
    navigate('/')
  }

  return (
    <div className="hmenu" ref={ref}>
      <button
        type="button"
        className="hmenu__btn"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-label="Menu"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
      </button>

      {open && (
        <div className="hmenu__dropdown">
          <Link to="/help" className="hmenu__item hmenu__item--help" onClick={() => setOpen(false)}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
            <span>{t('header.helpCentre')}</span>
          </Link>

          <div className="hmenu__sep" />

          <Link to="/worker/signup" className="hmenu__promo" onClick={() => setOpen(false)}>
            <div className="hmenu__promo-text">
              <span className="hmenu__promo-title">{t('header.becomeAStar')}</span>
              <span className="hmenu__promo-sub">{t('header.becomeAStarSubtitle')}</span>
            </div>
            <img
              src="/assets/cleaner-illustration.png"
              alt=""
              className="hmenu__promo-img"
            />
          </Link>

          <div className="hmenu__sep" />

          {isStarWorker && (
            <button type="button" className="hmenu__item" onClick={() => setOpen(false)}>
              {t('header.joinATeam')}
            </button>
          )}

          <div className="hmenu__sep" />

          {isLoggedIn ? (
            <button type="button" className="hmenu__item" onClick={handleSignOut}>
              {t('dashboard.signOut')}
            </button>
          ) : (
            <>
              <Link to="/client/login" className="hmenu__item" onClick={() => setOpen(false)}>
                {t('header.clientLogin')}
              </Link>
              <div className="hmenu__sep" />
              <Link to="/worker/login" className="hmenu__item" onClick={() => setOpen(false)}>
                {t('header.starLogin')}
              </Link>
              <div className="hmenu__sep" />
              <Link to="/signup" className="hmenu__item" onClick={() => setOpen(false)}>
                {t('header.signUp')}
              </Link>
            </>
          )}
        </div>
      )}
    </div>
  )
}
