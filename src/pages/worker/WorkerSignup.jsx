import { Link } from 'react-router-dom'
import cleanerImg from '../../assets/workers/cleaners/cleaner-4.jpg'
import handymanImg from '../../assets/workers/handymen/handyman-1.jpg'
import photographerImg from '../../assets/workers/services/photographer.jpg'
import './WorkerSignup.css'

const CATEGORIES = [
  { id: 'cleaning', label: 'Cleaning', image: cleanerImg },
  { id: 'repairs', label: 'Repairs', image: handymanImg },
  { id: 'services', label: 'Services', image: photographerImg },
]

export default function WorkerSignup() {
  return (
    <div className="signup signup--picker">
      <div className="signup__card">
        <h1 className="signup__title">What work do you do?</h1>

        <div className="signup__steps">
          {CATEGORIES.map((cat) => (
            <Link key={cat.id} to={`/worker/signup/${cat.id}`} className="signup__step signup__step--link">
              <div className="signup__img-wrap">
                <img src={cat.image} alt={cat.label} className="signup__img" />
              </div>
              <h2 className="signup__step-title">{cat.label}</h2>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
