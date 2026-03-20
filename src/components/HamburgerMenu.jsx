import { useState, useRef, useEffect, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { supabase } from '../supabase'
import { useAuthSession } from '../contexts/AuthSessionContext'
import { useAppMode } from '../contexts/AppModeContext'
import { useDualProfile } from '../hooks/useDualProfile'
import LanguageCurrencyModal from './LanguageCurrencyModal'
import starWorkerIllustration from '../assets/star-worker-illustration.png'
import './HamburgerMenu.css'

function IconHeart() {
  return (
    <svg className="hmenu__icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  )
}

function IconClipboard() {
  return (
    <svg className="hmenu__icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
      <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
    </svg>
  )
}

function IconMessage() {
  return (
    <svg className="hmenu__icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  )
}

function IconUser() {
  return (
    <svg className="hmenu__icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  )
}

function IconSettings() {
  return (
    <svg className="hmenu__icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="12" cy="12" r="3" />
      <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
    </svg>
  )
}

function IconGlobe() {
  return (
    <svg className="hmenu__icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  )
}

function IconHelp() {
  return (
    <svg className="hmenu__icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="12" cy="12" r="10" />
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  )
}

export default function HamburgerMenu() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const [menuRendered, setMenuRendered] = useState(false)
  const [menuAnimIn, setMenuAnimIn] = useState(false)
  const [langModalOpen, setLangModalOpen] = useState(false)
  const { user } = useAuthSession()
  const { mode, setMode } = useAppMode()
  const { loading: dualLoading, hasWorkerProfile, hasBothProfiles } = useDualProfile(user)
  const isLoggedIn = !!user
  const ref = useRef(null)

  useEffect(() => {
    if (open) {
      setMenuRendered(true)
      const id = requestAnimationFrame(() => {
        requestAnimationFrame(() => setMenuAnimIn(true))
      })
      return () => cancelAnimationFrame(id)
    }
    setMenuAnimIn(false)
    const tmr = setTimeout(() => setMenuRendered(false), 200)
    return () => clearTimeout(tmr)
  }, [open])

  useEffect(() => {
    function handler(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const openLanguageModal = useCallback(() => {
    setOpen(false)
    setLangModalOpen(true)
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
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
      </button>

      {menuRendered && (
        <div className={`hmenu__dropdown ${menuAnimIn ? 'hmenu__dropdown--enter' : ''}`}>
          {isLoggedIn ? (
            <>
              {!dualLoading && hasBothProfiles && mode === 'client' && (
                <Link
                  to="/dashboard/worker"
                  className="hmenu__item"
                  onClick={() => {
                    setMode('worker')
                    setOpen(false)
                  }}
                >
                  <span className="hmenu__item-text-only">{t('header.switchToWorker')}</span>
                </Link>
              )}
              {!dualLoading && hasBothProfiles && mode === 'worker' && (
                <Link
                  to="/"
                  className="hmenu__item"
                  onClick={() => {
                    setMode('client')
                    setOpen(false)
                  }}
                >
                  <span className="hmenu__item-text-only">{t('header.switchToClient')}</span>
                </Link>
              )}
              {hasBothProfiles && !dualLoading && <div className="hmenu__sep" />}

              <Link to="/client/favourites" className="hmenu__item" onClick={() => setOpen(false)}>
                <IconHeart />
                <span>{t('hamburger.savedWorkers')}</span>
              </Link>
              <Link to="/profile/bookings" className="hmenu__item" onClick={() => setOpen(false)}>
                <IconClipboard />
                <span>{t('hamburger.myBookings')}</span>
              </Link>
              <Link to="/profile/messages" className="hmenu__item" onClick={() => setOpen(false)}>
                <IconMessage />
                <span>{t('hamburger.messages')}</span>
              </Link>
              <Link to="/profile" className="hmenu__item" onClick={() => setOpen(false)}>
                <IconUser />
                <span>{t('hamburger.profile')}</span>
              </Link>

              <div className="hmenu__sep" />

              <Link to="/profile/settings" className="hmenu__item" onClick={() => setOpen(false)}>
                <IconSettings />
                <span>{t('hamburger.accountSettings')}</span>
              </Link>
              <button type="button" className="hmenu__item" onClick={openLanguageModal}>
                <IconGlobe />
                <span>{t('hamburger.languageCurrency')}</span>
              </button>
              <Link to="/help" className="hmenu__item" onClick={() => setOpen(false)}>
                <IconHelp />
                <span>{t('header.helpCentre')}</span>
              </Link>

              <div className="hmenu__sep" />

              {!dualLoading && !hasWorkerProfile && (
                <Link to="/worker/signup" className="hmenu__promo" onClick={() => setOpen(false)}>
                  <div className="hmenu__promo-text">
                    <span className="hmenu__promo-title">{t('header.becomeAStar')}</span>
                    <span className="hmenu__promo-sub">{t('header.becomeAStarSubtitle')}</span>
                  </div>
                  <img src={starWorkerIllustration} alt="" className="hmenu__promo-img" />
                </Link>
              )}

              {!dualLoading && !hasWorkerProfile && <div className="hmenu__sep" />}

              <button type="button" className="hmenu__item hmenu__item--signout" onClick={handleSignOut}>
                {t('dashboard.signOut')}
              </button>
            </>
          ) : (
            <>
              <Link to="/signup" className="hmenu__item" onClick={() => setOpen(false)}>
                <span className="hmenu__item-text-only">{t('hamburger.signUp')}</span>
              </Link>
              <Link to="/client/login" className="hmenu__item" onClick={() => setOpen(false)}>
                <span className="hmenu__item-text-only">{t('hamburger.logIn')}</span>
              </Link>

              <div className="hmenu__sep" />

              <Link to="/worker/signup" className="hmenu__item hmenu__item--plain" onClick={() => setOpen(false)}>
                {t('header.becomeAStar')}
              </Link>
              <Link to="/help" className="hmenu__item hmenu__item--plain" onClick={() => setOpen(false)}>
                {t('header.helpCentre')}
              </Link>
              <button type="button" className="hmenu__item hmenu__item--plain" onClick={openLanguageModal}>
                {t('hamburger.languageCurrency')}
              </button>
            </>
          )}
        </div>
      )}

      <LanguageCurrencyModal open={langModalOpen} onClose={() => setLangModalOpen(false)} />
    </div>
  )
}
