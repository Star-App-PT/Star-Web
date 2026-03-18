import { Link } from 'react-router-dom'
import '../LoginPlaceholder.css'

export default function ClientFavourites() {
  return (
    <div className="login-placeholder">
      <div className="login-placeholder__card">
        <h1 className="login-placeholder__title">Favourites</h1>
        <p className="login-placeholder__sub">Saved workers for clients will appear here soon.</p>
        <Link to="/" className="login-placeholder__back">Back to home</Link>
      </div>
    </div>
  )
}
