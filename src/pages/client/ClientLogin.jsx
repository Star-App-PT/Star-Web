import { Link } from 'react-router-dom'
import '../LoginPlaceholder.css'

export default function ClientLogin() {
  return (
    <div className="login-placeholder">
      <div className="login-placeholder__card">
        <h1 className="login-placeholder__title">Client login</h1>
        <p className="login-placeholder__sub">Login for clients — coming soon.</p>
        <Link to="/" className="login-placeholder__back">Back to home</Link>
      </div>
    </div>
  )
}
