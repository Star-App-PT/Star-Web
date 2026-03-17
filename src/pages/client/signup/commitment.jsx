import { useNavigate } from 'react-router-dom'
import { supabase } from '../../../supabase'
import './ClientSignup.css'

export default function ClientSignupCommitment() {
  const navigate = useNavigate()

  const handleAgree = async () => {
    if (supabase) {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (session?.user) {
          await supabase.from('clients').upsert({
            id: session.user.id,
            first_name: session.user.user_metadata?.first_name || '',
            last_name: session.user.user_metadata?.last_name || '',
            phone: session.user.user_metadata?.phone || '',
            email: session.user.email || '',
            profile_photo_url: session.user.user_metadata?.profile_photo_url || null,
            created_at: new Date().toISOString(),
          })
        }
      } catch { /* continue */ }
    }
    navigate('/')
  }

  const handleDecline = () => {
    navigate('/')
  }

  return (
    <div className="csu">
      <div className="csu__top">
        <span className="csu__step">Step 4 of 4</span>
        <button type="button" className="csu__back" onClick={() => navigate('/client/signup/photo')}>
          Back
        </button>
      </div>

      <div className="csu__card" style={{ display: 'flex', justifyContent: 'center' }}>
        <div className="csu__commit-card">
          <img src="/star-logo-blue.svg" alt="Star SVS" className="csu__commit-logo" />

          <h1 className="csu__commit-title">Our community commitment</h1>

          <p className="csu__commit-body">
            Star SVS is a community where everyone is welcome. We ask all members to treat each other with respect, kindness, and professionalism.
          </p>

          <button type="button" className="csu__commit-agree" onClick={handleAgree}>
            Agree and continue
          </button>

          <button type="button" className="csu__commit-decline" onClick={handleDecline}>
            Decline
          </button>
        </div>
      </div>

      {/* DEMO ONLY — REMOVE BEFORE LAUNCH */}
      <span className="csu__skip" onClick={() => navigate('/')}>
        Skip (Demo Only)
      </span>
    </div>
  )
}
