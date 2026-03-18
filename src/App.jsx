import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import MobileBottomNav from './components/MobileBottomNav'
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
import SignupChoice from './pages/SignupChoice'
import ClientLogin from './pages/client/ClientLogin'
import ClientFavourites from './pages/client/ClientFavourites'
import WorkerLogin from './pages/worker/WorkerLogin'

export default function App() {
  return (
    <BrowserRouter>
      <Header />
      <main className="app-main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Search />} />
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
          <Route path="/client/signup" element={<ClientSignupWelcome />} />
          <Route path="/client/signup/name" element={<ClientSignupName />} />
          <Route path="/client/signup/photo" element={<ClientSignupPhoto />} />
          <Route path="/client/signup/commitment" element={<ClientSignupCommitment />} />
          <Route path="/client/login" element={<ClientLogin />} />
          <Route path="/client/favourites" element={<ClientFavourites />} />
          <Route path="/worker/login" element={<WorkerLogin />} />
          <Route path="/signup" element={<SignupChoice />} />
        </Routes>
      </main>
      <MobileBottomNav />
    </BrowserRouter>
  )
}
