import { useState, useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import './LanguageToggle.css'

const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'pt-PT', label: 'Português' },
  { code: 'es', label: 'Español' },
]

const CODE_TO_LABEL = { en: 'ENG', 'pt-PT': 'PTG', es: 'ES' }

export default function LanguageToggle({ className = '' }) {
  const { i18n } = useTranslation()
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    function handler(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const current = i18n.language?.startsWith('pt') ? 'pt-PT' : i18n.language?.startsWith('es') ? 'es' : 'en'

  return (
    <div className={`lang-toggle ${className}`} ref={ref}>
      <button
        type="button"
        className="lang-toggle__btn"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-haspopup="true"
      >
        <span className="lang-toggle__globe" aria-hidden>🌐</span>
        <span className="lang-toggle__code">{CODE_TO_LABEL[current] || 'ENG'}</span>
        <span className="lang-toggle__chevron">▼</span>
      </button>
      {open && (
        <ul className="lang-toggle__dropdown">
          {LANGUAGES.map(({ code, label }) => (
            <li key={code}>
              <button
                type="button"
                className={`lang-toggle__option ${current === code ? 'lang-toggle__option--active' : ''}`}
                onClick={() => { i18n.changeLanguage(code); setOpen(false) }}
              >
                {label}
                {current === code && ' ✓'}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
