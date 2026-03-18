import { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import './MobileBottomNav.css'

function SearchIcon({ active }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  )
}

function HeartIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  )
}

function UserIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M20 21a8 8 0 0 0-16 0" />
      <circle cx="12" cy="8" r="4" />
    </svg>
  )
}

export default function MobileBottomNav() {
  const location = useLocation()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        setOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    setOpen(false)
  }, [location.pathname, location.search])

  const isSearchActive = location.pathname === '/' || location.pathname === '/search'
  const isFavouritesActive = location.pathname === '/client/favourites'
  const isLoginActive = open

  const openSearch = () => {
    const target = location.pathname === '/' ? `${location.pathname}${location.search}` : '/'
    navigate(target, { state: { openMobileSearch: true } })
  }

  return (
    <>
      {open && <button type="button" className="mbnav__backdrop" aria-label="Close login menu" onClick={() => setOpen(false)} />}

      <div className="mbnav" ref={ref}>
        {open && (
          <div className="mbnav__menu">
            <Link to="/client/login" className="mbnav__menu-item" onClick={() => setOpen(false)}>
              Client login
            </Link>
            <div className="mbnav__menu-sep" />
            <Link to="/worker/login" className="mbnav__menu-item" onClick={() => setOpen(false)}>
              Star login
            </Link>
            <div className="mbnav__menu-sep" />
            <Link to="/signup" className="mbnav__menu-item" onClick={() => setOpen(false)}>
              Sign up
            </Link>
          </div>
        )}

        <button type="button" className={`mbnav__item${isSearchActive ? ' mbnav__item--active' : ''}`} onClick={openSearch}>
          <SearchIcon />
          <span>Search</span>
        </button>

        <Link to="/client/favourites" className={`mbnav__item${isFavouritesActive ? ' mbnav__item--active' : ''}`}>
          <HeartIcon />
          <span>Favourites</span>
        </Link>

        <button type="button" className={`mbnav__item${isLoginActive ? ' mbnav__item--active' : ''}`} onClick={() => setOpen((prev) => !prev)}>
          <UserIcon />
          <span>Log in</span>
        </button>
      </div>
    </>
  )
}
