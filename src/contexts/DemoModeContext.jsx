import { createContext, useCallback, useContext, useMemo, useState } from 'react'

const DEMO_MODE_KEY = 'isDemoMode'
const DEMO_MODE_SOURCE_KEY = 'demoModeSource'

const DemoModeContext = createContext({
  isDemoMode: false,
  bannerVisible: false,
  enableDemoMode: () => {},
  setDemoMode: () => {},
  setBannerVisible: () => {},
  exitDemoMode: () => {},
})

export function DemoModeProvider({ children }) {
  const [isDemoMode, setIsDemoMode] = useState(() => {
    if (typeof window === 'undefined') return false
    const isStoredDemoMode = window.sessionStorage.getItem(DEMO_MODE_KEY) === 'true'
    const hasDemoSource = window.sessionStorage.getItem(DEMO_MODE_SOURCE_KEY) === 'demo-route'
    if (isStoredDemoMode && hasDemoSource) return true

    window.sessionStorage.removeItem(DEMO_MODE_KEY)
    window.sessionStorage.removeItem(DEMO_MODE_SOURCE_KEY)
    return false
  })
  const [bannerVisible, setBannerVisible] = useState(() => {
    if (typeof window === 'undefined') return false
    const isStoredDemoMode = window.sessionStorage.getItem(DEMO_MODE_KEY) === 'true'
    const hasDemoSource = window.sessionStorage.getItem(DEMO_MODE_SOURCE_KEY) === 'demo-route'
    return isStoredDemoMode && hasDemoSource
  })

  const enableDemoMode = useCallback(() => {
    if (typeof window !== 'undefined') {
      window.sessionStorage.setItem(DEMO_MODE_KEY, 'true')
      window.sessionStorage.setItem(DEMO_MODE_SOURCE_KEY, 'demo-route')
    }
    setIsDemoMode(true)
    setBannerVisible(true)
  }, [])

  const setDemoMode = useCallback((value) => {
    if (!value && typeof window !== 'undefined') {
      window.sessionStorage.removeItem(DEMO_MODE_KEY)
      window.sessionStorage.removeItem(DEMO_MODE_SOURCE_KEY)
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
    enableDemoMode,
    setDemoMode,
    setBannerVisible,
    exitDemoMode,
  }), [isDemoMode, bannerVisible, enableDemoMode, setDemoMode, exitDemoMode])

  return (
    <DemoModeContext.Provider value={value}>
      {children}
    </DemoModeContext.Provider>
  )
}

export function useDemoMode() {
  return useContext(DemoModeContext)
}
