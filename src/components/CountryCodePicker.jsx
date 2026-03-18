import { useEffect, useMemo, useRef, useState } from 'react'
import { getCountries, getCountryCallingCode } from 'libphonenumber-js'
import { useTranslation } from 'react-i18next'
import './CountryCodePicker.css'

const DETECTED_COUNTRY_KEY = 'star_user_country_code'
const DEFAULT_COUNTRY = 'PT'
const PRIORITY_COUNTRIES = ['PT', 'BR', 'GB', 'US', 'ES', 'FR', 'DE', 'IT', 'NL', 'AO', 'MZ', 'CV']
const COUNTRY_ALIASES = {
  BR: ['Brasil', 'Brazil'],
  GB: ['UK', 'United Kingdom', 'Britain', 'Great Britain'],
  US: ['USA', 'United States', 'America'],
  PT: ['Portugal'],
  ES: ['Spain', 'España', 'Espanha'],
  FR: ['France', 'Franca', 'França'],
  DE: ['Germany', 'Alemanha'],
  IT: ['Italy', 'Italia'],
  NL: ['Netherlands', 'Holland', 'Países Baixos', 'Paises Baixos'],
  AO: ['Angola'],
  MZ: ['Mozambique', 'Moçambique', 'Mocambique'],
  CV: ['Cape Verde', 'Cabo Verde'],
}

function normalizeSearchTerm(value) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
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
  const rootRef = useRef(null)
  const searchRef = useRef(null)
  const initializedRef = useRef(false)

  const countryOptions = useMemo(() => {
    const displayNames = typeof Intl !== 'undefined'
      ? new Intl.DisplayNames([i18n.resolvedLanguage || 'en'], { type: 'region' })
      : null
    const englishDisplayNames = typeof Intl !== 'undefined'
      ? new Intl.DisplayNames(['en'], { type: 'region' })
      : null

    return getCountries()
      .map((iso2) => {
        const localizedName = displayNames?.of(iso2) || iso2
        const englishName = englishDisplayNames?.of(iso2) || localizedName
        const name = displayNames?.of(iso2) || iso2
        return {
          iso2,
          name,
          dialCode: `+${getCountryCallingCode(iso2)}`,
          searchTerms: [
            localizedName,
            englishName,
            ...(COUNTRY_ALIASES[iso2] || []),
            iso2,
            `+${getCountryCallingCode(iso2)}`,
            `${getCountryCallingCode(iso2)}`,
          ].map(normalizeSearchTerm),
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
    const normalized = normalizeSearchTerm(query)
    if (!normalized) return countryOptions

    return countryOptions.filter((option) => {
      return option.searchTerms.some((term) => term.includes(normalized))
    })
  }, [countryOptions, query])

  useEffect(() => {
    if (initializedRef.current || value || !fallbackOption) return
    initializedRef.current = true
    onChange?.(fallbackOption)
  }, [fallbackOption, onChange, value])

  useEffect(() => {
    if (!open) return undefined
    const handlePointerDown = (event) => {
      if (rootRef.current && !rootRef.current.contains(event.target)) {
        setOpen(false)
        setQuery('')
      }
    }
    document.addEventListener('pointerdown', handlePointerDown)
    return () => document.removeEventListener('pointerdown', handlePointerDown)
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
      {open ? (
        <div className={`country-code-picker__inline-search ${buttonClassName}`.trim()}>
          <input
            ref={searchRef}
            type="text"
            className="country-code-picker__search-input"
            placeholder={selectedOption?.dialCode || t('countryPicker.searchPlaceholder')}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </div>
      ) : (
        <button
          type="button"
          className={`country-code-picker__button ${buttonClassName}`.trim()}
          onClick={() => setOpen(true)}
          aria-expanded={open}
        >
          <span className="country-code-picker__value">
            <span className="country-code-picker__dial">{selectedOption?.dialCode}</span>
          </span>
          <span className="country-code-picker__chevron">⌄</span>
        </button>
      )}

      {open && (
        <div className={`country-code-picker__panel country-code-picker__panel--dropdown ${dropdownClassName}`.trim()}>
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
      )}
    </div>
  )
}
