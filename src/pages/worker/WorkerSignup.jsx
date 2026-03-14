import { useState } from 'react'
import cleanerImg from '../../assets/workers/cleaners/cleaner-4.jpg'
import handymanImg from '../../assets/workers/handymen/handyman-1.jpg'
import photographerImg from '../../assets/workers/services/photographer.jpg'
import SignupModal from '../../components/SignupModal'
import './WorkerSignup.css'

const CATEGORIES = [
  { id: 'cleaning', label: 'Cleaning', image: cleanerImg },
  { id: 'repairs', label: 'Repairs', image: handymanImg },
  { id: 'services', label: 'Services', image: photographerImg },
]

export default function WorkerSignup() {
  const [selectedCategory, setSelectedCategory] = useState(null)

  return (
    <div className="signup signup--picker">
      <div className="signup__card">
        <h1 className="signup__title">What work best describes you?</h1>

        <div className="signup__steps">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              className="signup__step signup__step--link"
              onClick={() => setSelectedCategory(cat.id)}
            >
              <div className="signup__img-wrap">
                <img src={cat.image} alt={cat.label} className="signup__img" />
              </div>
              <h2 className="signup__step-title">{cat.label}</h2>
            </button>
          ))}
        </div>
      </div>

      <SignupModal
        open={!!selectedCategory}
        onClose={() => setSelectedCategory(null)}
        category={selectedCategory}
      />
    </div>
  )
}
