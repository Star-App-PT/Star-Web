import { BrowserRouter, Routes, Route, useLocation, useNavigate, Navigate, useParams } from 'react-router-dom'
import { useEffect } from 'react'
import { supabase } from './supabase'
import Header from './components/Header'
import Footer from './components/Footer'
import MobileBottomNav from './components/MobileBottomNav'
import { DemoModeProvider, useDemoMode } from './contexts/DemoModeContext'
import Home from './pages/Home'
import WorkerSignup from './pages/worker/WorkerSignup'
import CategorySignup from './pages/worker/CategorySignup'
import WorkerProfileIntro from './pages/worker/WorkerProfileIntro'
import WorkerSkillType from './pages/worker/WorkerSkillType'
import WorkerProfileCleaner from './pages/worker/WorkerProfileCleaner'
import WorkerProfile from './pages/worker/WorkerProfile'
import Search from './pages/Search'
import Workers from './pages/Workers'
import WorkerDetail from './pages/WorkerDetail'
import Dashboard from './pages/Dashboard'
import WorkerDashboard from './pages/WorkerDashboard'
import WorkerHostLayout from './layouts/WorkerHostLayout'
import WorkerToday from './pages/worker/WorkerToday'
import WorkerCalendar from './pages/worker/WorkerCalendar'
import WorkerPackagesManage from './pages/worker/WorkerPackagesManage'
import WorkerMessagesHost from './pages/worker/WorkerMessagesHost'
import Profile from './pages/Profile'
import ProfileEdit from './pages/ProfileEdit'
import ProfilePlaceholder from './pages/ProfilePlaceholder'
import FinishProfile from './pages/FinishProfile'
import ChooseCategory from './pages/ChooseCategory'
import WorkerAbout from './pages/WorkerAbout'
import ServiceArea from './pages/ServiceArea'
import WorkerPortfolio from './pages/WorkerPortfolio'
import WorkerPackages from './pages/WorkerPackages'
import ClientSignupWelcome from './pages/client/signup/index'
import ClientSignupName from './pages/client/signup/name'
import ClientSignupPhoto from './pages/client/signup/photo'
import ClientSignupCommitment from './pages/client/signup/commitment'
import SignupLogin from './pages/SignupLogin'
import SignupChoice from './pages/SignupChoice'
import ClientLogin from './pages/client/ClientLogin'
import ClientFavourites from './pages/client/ClientFavourites'
import WorkerLogin from './pages/worker/WorkerLogin'
import DemoLanding from './pages/DemoLanding'
import Privacy from './pages/Privacy'
import Terms from './pages/Terms'
import AuthCallback from './pages/AuthCallback'
import { AuthSessionProvider } from './contexts/AuthSessionContext'
import { CurrencyProvider } from './contexts/CurrencyContext'
import { AppModeProvider } from './contexts/AppModeContext'
import { WORKER_SIGNUP_PENDING_KEY } from './constants/workerSignup'

function WorkerPublicProfileRedirect() {
  const { id } = useParams()
  return <Navigate to={`/worker/${id}`} replace />
}

function AppShell() {
  const location = useLocation()
  const navigate = useNavigate()
  const { isDemoMode, bannerVisible, setBannerVisible, exitDemoMode } = useDemoMode()

  useEffect(() => {
    if (!supabase) return
    const stripHashPreservePath = () => {
      const path = location.pathname
      const search = location.search
      if (path === '/profile/edit' || path === '/worker/signup') {
        navigate(`${path}${search}`, { replace: true })
      } else {
        navigate('/', { replace: true })
      }
    }
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session && window.location.hash) {
        stripHashPreservePath()
      }
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) return
      if (event === 'SIGNED_IN') {
        try {
          if (sessionStorage.getItem(WORKER_SIGNUP_PENDING_KEY)) {
            sessionStorage.removeItem(WORKER_SIGNUP_PENDING_KEY)
            navigate('/worker/signup', { replace: true })
            return
          }
        } catch {
          /* ignore */
        }
        if (
          location.pathname !== '/profile/edit' &&
          location.pathname !== '/worker/signup' &&
          location.pathname !== '/auth/callback'
        ) {
          navigate('/', { replace: true })
        }
      }
      if (event === 'INITIAL_SESSION' && window.location.hash) {
        stripHashPreservePath()
      }
    })
    return () => subscription?.unsubscribe()
  }, [navigate, location.pathname, location.search])

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    if (params.get('demo') !== 'exit') return

    params.delete('demo')
    const search = params.toString()
    const nextUrl = `${location.pathname}${search ? `?${search}` : ''}${location.hash || ''}` || '/'
    window.location.replace(nextUrl)
  }, [location])

  const handleExitDemo = () => {
    exitDemoMode()
  }

  return (
    <div className="app-shell">
      <Header />
      {isDemoMode && bannerVisible && (
        <div
          style={{
            backgroundColor: '#F59E0B',
            color: 'white',
            padding: '8px 16px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '13px',
            fontWeight: 600,
            zIndex: 9999,
            position: 'sticky',
            top: 0,
          }}
        >
          <span>🎬 Demo Mode — Skip buttons enabled for preview</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span onClick={() => setBannerVisible(false)} style={{ cursor: 'pointer' }}>✕</span>
            <span
              onClick={handleExitDemo}
              style={{ cursor: 'pointer', textDecoration: 'underline' }}
            >
              Exit demo
            </span>
          </div>
        </div>
      )}
      <main className="app-main">
        <Routes>
          <Route path="/demo" element={<DemoLanding />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Search />} />
          <Route path="/workers/:id" element={<WorkerPublicProfileRedirect />} />
          <Route path="/workers" element={<Workers />} />
          <Route path="/worker/signup" element={<WorkerSignup />} />
          <Route path="/worker/signup/:category" element={<CategorySignup />} />
          <Route path="/worker/profile/intro" element={<WorkerProfileIntro />} />
          <Route path="/worker/profile/skill" element={<WorkerSkillType />} />
          <Route path="/worker/profile/cleaner" element={<WorkerProfileCleaner />} />
          <Route path="/worker/profile" element={<WorkerProfile />} />
          <Route path="/worker/:id" element={<WorkerDetail />} />
          <Route path="/worker/finish-profile" element={<FinishProfile />} />
          <Route path="/worker/choose-category" element={<ChooseCategory />} />
          <Route path="/worker/about/:category" element={<WorkerAbout />} />
          <Route path="/worker/service-area/:category" element={<ServiceArea />} />
          <Route path="/worker/portfolio/:category" element={<WorkerPortfolio />} />
          <Route path="/worker/packages/:category" element={<WorkerPackages />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboard/worker" element={<WorkerHostLayout />}>
            <Route index element={<WorkerDashboard />} />
            <Route path="today" element={<WorkerToday />} />
            <Route path="calendar" element={<WorkerCalendar />} />
            <Route path="packages" element={<WorkerPackagesManage />} />
            <Route path="messages" element={<WorkerMessagesHost />} />
          </Route>
          <Route path="/profile" element={<Profile />} />
          <Route path="/profile/edit" element={<ProfileEdit />} />
          <Route path="/profile/bookings" element={<ProfilePlaceholder />} />
          <Route path="/profile/messages" element={<ProfilePlaceholder />} />
          <Route path="/profile/settings" element={<ProfilePlaceholder />} />
          <Route path="/help" element={<ProfilePlaceholder />} />
          <Route path="/client/signup" element={<ClientSignupWelcome />} />
          <Route path="/client/signup/name" element={<ClientSignupName />} />
          <Route path="/client/signup/photo" element={<ClientSignupPhoto />} />
          <Route path="/client/signup/commitment" element={<ClientSignupCommitment />} />
          <Route path="/client/login" element={<ClientLogin />} />
          <Route path="/client/favourites" element={<ClientFavourites />} />
          <Route path="/worker/login" element={<WorkerLogin />} />
          <Route path="/signup" element={<SignupLogin />} />
          <Route path="/signup/choose" element={<SignupChoice />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
        </Routes>
      </main>
      <MobileBottomNav />
      <Footer />
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthSessionProvider>
        <CurrencyProvider>
          <AppModeProvider>
            <DemoModeProvider>
              <AppShell />
            </DemoModeProvider>
          </AppModeProvider>
        </CurrencyProvider>
      </AuthSessionProvider>
    </BrowserRouter>
  )
}
