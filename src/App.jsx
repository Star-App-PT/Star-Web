import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Home from './pages/Home'
import WorkerSignup from './pages/worker/WorkerSignup'
import WorkerProfileIntro from './pages/worker/WorkerProfileIntro'
import WorkerSkillType from './pages/worker/WorkerSkillType'
import WorkerProfileCleaner from './pages/worker/WorkerProfileCleaner'
import WorkerProfile from './pages/worker/WorkerProfile'

export default function App() {
  return (
    <BrowserRouter>
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/worker/signup" element={<WorkerSignup />} />
          <Route path="/worker/profile/intro" element={<WorkerProfileIntro />} />
          <Route path="/worker/profile/skill" element={<WorkerSkillType />} />
          <Route path="/worker/profile/cleaner" element={<WorkerProfileCleaner />} />
          <Route path="/worker/profile" element={<WorkerProfile />} />
        </Routes>
      </main>
    </BrowserRouter>
  )
}
