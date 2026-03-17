import { Link } from 'react-router-dom'
import './SignupChoice.css'

export default function SignupChoice() {
  return (
    <div className="signup-choice">
      <div className="signup-choice__card">
        <h1 className="signup-choice__title">Sign up</h1>
        <p className="signup-choice__sub">Choose how you want to use Star SVS</p>
        <div className="signup-choice__options">
          <Link to="/client/signup" className="signup-choice__option">
            I need a service
          </Link>
          <div className="signup-choice__sep" />
          <Link to="/worker/choose-category" className="signup-choice__option">
            I want to work
          </Link>
        </div>
        <Link to="/" className="signup-choice__back">Back to home</Link>
      </div>
    </div>
  )
}
