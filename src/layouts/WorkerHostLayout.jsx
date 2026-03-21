import { Outlet } from 'react-router-dom'
import WorkerHostHeader from '../components/workerHost/WorkerHostHeader'

export default function WorkerHostLayout() {
  return (
    <div className="worker-host-layout">
      <WorkerHostHeader />
      <Outlet />
    </div>
  )
}
