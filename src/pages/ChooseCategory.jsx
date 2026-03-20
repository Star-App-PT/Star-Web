import { Navigate } from 'react-router-dom'

/** Legacy route: worker category gate now lives on /worker/signup (modals). */
export default function ChooseCategory() {
  return <Navigate to="/worker/signup" replace />
}
