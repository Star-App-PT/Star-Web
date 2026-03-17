import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Header from './components/Header'
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

export default function App() {
  return (
    <BrowserRouter>
      <Header />
      <main>
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
          <Route path="/finish-profile" element={<FinishProfile />} />
          <Route path="/choose-category" element={<ChooseCategory />} />
          <Route path="/worker-about/:category" element={<WorkerAbout />} />
          <Route path="/service-area/:category" element={<ServiceArea />} />
          <Route path="/worker-portfolio/:category" element={<WorkerPortfolio />} />
          <Route path="/worker-packages/:category" element={<WorkerPackages />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </main>
    </BrowserRouter>
  )
}
