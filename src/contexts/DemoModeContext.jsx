import { createContext, useCallback, useContext, useMemo, useState } from 'react'

const DemoModeContext = createContext({
  isDemoMode: false,
  bannerVisible: false,
  setDemoMode: () => {},
  setBannerVisible: () => {},
  exitDemoMode: () => {},
})

export function DemoModeProvider({ children }) {
  const [isDemoMode, setIsDemoMode] = useState(() => {
    if (typeof window === 'undefined') return false
    return window.sessionStorage.getItem('isDemoMode') === 'true'
  })
  const [bannerVisible, setBannerVisible] = useState(() => {
    if (typeof window === 'undefined') return false
    return window.sessionStorage.getItem('isDemoMode') === 'true'
  })

  const setDemoMode = useCallback((value) => {
    if (typeof window !== 'undefined') {
      if (value) {
        window.sessionStorage.setItem('isDemoMode', 'true')
      } else {
        window.sessionStorage.removeItem('isDemoMode')
      }
    }
    setIsDemoMode(value)
    setBannerVisible(value)
  }, [])

  const exitDemoMode = useCallback(() => {
    setDemoMode(false)
  }, [setDemoMode])

  const value = useMemo(() => ({
    isDemoMode,
    bannerVisible,
    setDemoMode,
    setBannerVisible,
    exitDemoMode,
  }), [isDemoMode, bannerVisible])

  return (
    <DemoModeContext.Provider value={value}>
      {children}
    </DemoModeContext.Provider>
  )
}

export function useDemoMode() {
  return useContext(DemoModeContext)
}
