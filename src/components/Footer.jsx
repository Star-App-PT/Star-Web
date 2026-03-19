import { Link } from 'react-router-dom'
import './Footer.css'

export default function Footer() {
  return (
    <footer className="star-footer">
      <div className="star-footer__inner">
        <nav className="star-footer__links">
          <Link to="/privacy" className="star-footer__link">Privacy Policy</Link>
          <span className="star-footer__sep">·</span>
          <Link to="/terms" className="star-footer__link">Terms of Service</Link>
        </nav>
        <p className="star-footer__copy">© 2025 Starsvs</p>
      </div>
    </footer>
  )
}
