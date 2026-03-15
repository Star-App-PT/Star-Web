import { useNavigate } from 'react-router-dom'
import SignupForm from '../../components/SignupForm'
import './WorkerSignup.css'

export default function WorkerSignup() {
  const navigate = useNavigate()

  return (
    <div className="signup-page">
      <div className="signup-page__content">
        <SignupForm
          category={null}
          onBack={() => navigate('/')}
        />
      </div>
    </div>
  )
}
