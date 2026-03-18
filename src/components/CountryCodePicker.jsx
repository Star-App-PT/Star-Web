import { useEffect, useMemo, useRef, useState } from 'react'
import { getCountries, getCountryCallingCode } from 'libphonenumber-js'
import { useTranslation } from 'react-i18next'
import './CountryCodePicker.css'

const DETECTED_COUNTRY_KEY = 'star_user_country_code'
const DEFAULT_COUNTRY = 'PT'
const PRIORITY_COUNTRIES = ['PT', 'BR', 'GB', 'US', 'ES', 'FR', 'DE', 'IT', 'NL', 'AO', 'MZ', 'CV']

function isoToFlag(iso2) {
  return iso2
    .toUpperCase()
    .split('')
    .map((char) => String.fromCodePoint(char.charCodeAt(0) + 127397))
    .join('')
}

function getStoredCountryIso2() {
  if (typeof window === 'undefined') return DEFAULT_COUNTRY
  const stored = window.sessionStorage.getItem(DETECTED_COUNTRY_KEY)
  return stored ? stored.toUpperCase() : DEFAULT_COUNTRY
}

export default function CountryCodePicker({ value, onChange, buttonClassName = '', dropdownClassName = '' }) {
  const { t, i18n } = useTranslation()
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [isMobile, setIsMobile] = useState(() => typeof window !== 'undefined' && window.innerWidth <= 768)
  const rootRef = useRef(null)
  const searchRef = useRef(null)
  const initializedRef = useRef(false)

  const countryOptions = useMemo(() => {
    const displayNames = typeof Intl !== 'undefined'
      ? new Intl.DisplayNames([i18n.resolvedLanguage || 'en'], { type: 'region' })
      : null

    return getCountries()
      .map((iso2) => {
        const name = displayNames?.of(iso2) || iso2
        return {
          iso2,
          name,
          dialCode: `+${getCountryCallingCode(iso2)}`,
          flag: isoToFlag(iso2),
        }
      })
      .sort((a, b) => {
        const priorityA = PRIORITY_COUNTRIES.indexOf(a.iso2)
        const priorityB = PRIORITY_COUNTRIES.indexOf(b.iso2)
        if (priorityA !== -1 || priorityB !== -1) {
          if (priorityA === -1) return 1
          if (priorityB === -1) return -1
          return priorityA - priorityB
        }
        return a.name.localeCompare(b.name)
      })
  }, [i18n.resolvedLanguage])

  const fallbackOption = useMemo(() => {
    const detectedIso2 = getStoredCountryIso2()
    return countryOptions.find((option) => option.iso2 === detectedIso2)
      || countryOptions.find((option) => option.iso2 === DEFAULT_COUNTRY)
      || countryOptions[0]
  }, [countryOptions])

  const selectedOption = value || fallbackOption

  const filteredOptions = useMemo(() => {
    const normalized = query.trim().toLowerCase()
    if (!normalized) return countryOptions

    return countryOptions.filter((option) => {
      const dial = option.dialCode.replace('+', '')
      return (
        option.name.toLowerCase().includes(normalized) ||
        option.iso2.toLowerCase().includes(normalized) ||
        dial.includes(normalized.replace('+', ''))
      )
    })
  }, [countryOptions, query])

  useEffect(() => {
    if (initializedRef.current || value || !fallbackOption) return
    initializedRef.current = true
    onChange?.(fallbackOption)
  }, [fallbackOption, onChange, value])

  useEffect(() => {
    if (typeof window === 'undefined') return undefined
    const mediaQuery = window.matchMedia('(max-width: 768px)')
    const update = () => setIsMobile(mediaQuery.matches)
    update()
    mediaQuery.addEventListener('change', update)
    return () => mediaQuery.removeEventListener('change', update)
  }, [])

  useEffect(() => {
    if (!open) return undefined
    const handleClickOutside = (event) => {
      if (rootRef.current && !rootRef.current.contains(event.target)) {
        setOpen(false)
        setQuery('')
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [open])

  useEffect(() => {
    if (!open) return
    const timer = window.setTimeout(() => searchRef.current?.focus(), 60)
    return () => window.clearTimeout(timer)
  }, [open])

  const handleSelect = (option) => {
    onChange?.(option)
    setOpen(false)
    setQuery('')
  }

  return (
    <div className="country-code-picker" ref={rootRef}>
      <button
        type="button"
        className={`country-code-picker__button ${buttonClassName}`.trim()}
        onClick={() => setOpen(true)}
        aria-expanded={open}
      >
        <span className="country-code-picker__value">
          <span className="country-code-picker__flag">{selectedOption?.flag}</span>
          <span className="country-code-picker__dial">{selectedOption?.dialCode}</span>
        </span>
        <span className="country-code-picker__chevron">⌄</span>
      </button>

      {open && (
        <>
          <div className={`country-code-picker__backdrop${isMobile ? ' country-code-picker__backdrop--mobile' : ''}`} onClick={() => { setOpen(false); setQuery('') }} />
          <div className={`country-code-picker__panel ${isMobile ? 'country-code-picker__panel--sheet' : 'country-code-picker__panel--dropdown'} ${dropdownClassName}`.trim()}>
            {isMobile && <div className="country-code-picker__sheet-handle" />}
            <div className="country-code-picker__panel-header">
              {isMobile && <p className="country-code-picker__panel-title">{t('countryPicker.title')}</p>}
              <input
                ref={searchRef}
                type="text"
                className="country-code-picker__search"
                placeholder={t('countryPicker.searchPlaceholder')}
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
            </div>
            <div className="country-code-picker__list">
              {filteredOptions.map((option) => {
                const isSelected = option.iso2 === selectedOption?.iso2
                return (
                  <button
                    key={option.iso2}
                    type="button"
                    className={`country-code-picker__option${isSelected ? ' country-code-picker__option--selected' : ''}`}
                    onClick={() => handleSelect(option)}
                  >
                    <span className="country-code-picker__option-flag">{option.flag}</span>
                    <span className="country-code-picker__option-name">{option.name}</span>
                    <span className="country-code-picker__option-dial">{option.dialCode}</span>
                  </button>
                )
              })}
              {filteredOptions.length === 0 && (
                <div className="country-code-picker__empty">{t('countryPicker.noResults')}</div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
