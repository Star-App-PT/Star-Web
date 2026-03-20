import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { useTranslation } from 'react-i18next'
import { useCurrency, CURRENCY_CODES } from '../contexts/CurrencyContext'
import './LanguageCurrencyModal.css'

const LANG_CODES = ['pt-PT', 'en', 'es']

export default function LanguageCurrencyModal({ open, onClose }) {
  const { t, i18n } = useTranslation()
  const { currency, setCurrency } = useCurrency()
  const overlayRef = useRef(null)

  const currentLang =
    i18n.language?.startsWith('pt') ? 'pt-PT' : i18n.language?.startsWith('es') ? 'es' : 'en'
  const resolvedLang = LANG_CODES.includes(currentLang) ? currentLang : 'pt-PT'

  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [open])

  useEffect(() => {
    if (!open) return
    function onKey(e) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  function onOverlayMouseDown(e) {
    if (e.target === overlayRef.current) onClose()
  }

  return createPortal(
    <div
      className="lang-currency-modal__overlay"
      ref={overlayRef}
      onMouseDown={onOverlayMouseDown}
      role="presentation"
    >
      <div
        className="lang-currency-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="lang-currency-modal-title"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="lang-currency-modal__header">
          <button
            type="button"
            className="lang-currency-modal__close"
            onClick={onClose}
            aria-label={t('languageModal.closeAria')}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
          <h2 id="lang-currency-modal-title" className="lang-currency-modal__title">
            {t('languageModal.heading')}
          </h2>
        </div>

        <div className="lang-currency-modal__body">
          <section className="lang-currency-modal__section">
            <label className="lang-currency-modal__label" htmlFor="star-lang-select">
              {t('languageModal.chooseLanguage')}
            </label>
            <select
              id="star-lang-select"
              className="lang-currency-modal__select"
              value={resolvedLang}
              onChange={(e) => {
                i18n.changeLanguage(e.target.value)
              }}
            >
              <option value="pt-PT">{t('languageModal.langPtPT')}</option>
              <option value="en">{t('languageModal.langEn')}</option>
              <option value="es">{t('languageModal.langEs')}</option>
            </select>
          </section>

          <section className="lang-currency-modal__section">
            <label className="lang-currency-modal__label" htmlFor="star-currency-select">
              {t('languageModal.chooseCurrency')}
            </label>
            <select
              id="star-currency-select"
              className="lang-currency-modal__select"
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
            >
              {CURRENCY_CODES.map((code) => (
                <option key={code} value={code}>
                  {t(`languageModal.currency.${code}`)}
                </option>
              ))}
            </select>
          </section>
        </div>
      </div>
    </div>,
    document.body,
  )
}
