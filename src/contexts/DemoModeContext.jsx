import { createContext, useCallback, useContext, useMemo, useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

const DemoModeContext = createContext({
  isDemoMode: false,
  bannerVisible: false,
  enableDemoMode: () => {},
  setDemoMode: () => {},
  setBannerVisible: () => {},
  exitDemoMode: () => {},
})

export function DemoModeProvider({ children }) {
  const location = useLocation()
  const navigate = useNavigate()
  const isDemoMode = location.pathname === '/demo'
  const [bannerVisible, setBannerVisible] = useState(true)

  useEffect(() => {
    if (location.pathname === '/demo') setBannerVisible(true)
  }, [location.pathname])

  const enableDemoMode = useCallback(() => {}, [])
  const setDemoMode = useCallback(() => {}, [])

  const exitDemoMode = useCallback(() => {
    navigate('/')
  }, [navigate])

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
