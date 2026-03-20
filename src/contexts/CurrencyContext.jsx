import { createContext, useCallback, useContext, useMemo, useState } from 'react'

const STORAGE_KEY = 'star_currency'

export const CURRENCY_CODES = ['EUR', 'GBP', 'USD', 'BRL']

const CurrencyContext = createContext(null)

export function CurrencyProvider({ children }) {
  const [currency, setCurrencyState] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored && CURRENCY_CODES.includes(stored)) return stored
    } catch {
      /* ignore */
    }
    return 'EUR'
  })

  const setCurrency = useCallback((code) => {
    if (!CURRENCY_CODES.includes(code)) return
    try {
      localStorage.setItem(STORAGE_KEY, code)
    } catch {
      /* ignore */
    }
    setCurrencyState(code)
  }, [])

  const value = useMemo(() => ({ currency, setCurrency }), [currency, setCurrency])

  return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>
}

export function useCurrency() {
  const ctx = useContext(CurrencyContext)
  if (!ctx) throw new Error('useCurrency must be used within CurrencyProvider')
  return ctx
}
