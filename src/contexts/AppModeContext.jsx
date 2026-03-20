import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { readStoredAppMode, writeStoredAppMode } from '../lib/clientWorkerMode'

const AppModeContext = createContext(null)

export function AppModeProvider({ children }) {
  const [mode, setModeState] = useState(() => readStoredAppMode())

  const setMode = useCallback((next) => {
    writeStoredAppMode(next)
    setModeState(next)
  }, [])

  const value = useMemo(() => ({ mode, setMode }), [mode, setMode])

  return <AppModeContext.Provider value={value}>{children}</AppModeContext.Provider>
}

export function useAppMode() {
  const ctx = useContext(AppModeContext)
  if (!ctx) throw new Error('useAppMode must be used within AppModeProvider')
  return ctx
}
