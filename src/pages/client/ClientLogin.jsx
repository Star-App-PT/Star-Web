import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../supabase'
import SignupLogin from '../SignupLogin'
import '../SignupLogin.css'

export default function ClientLogin() {
  const navigate = useNavigate()
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    if (!supabase) {
      setChecking(false)
      return
    }
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        navigate('/', { replace: true })
        return
      }
      setChecking(false)
    })
  }, [navigate])

  if (checking) {
    return (
      <div className="signup-login">
        <div className="signup-login__card">
          <p className="signup-login__sub" style={{ textAlign: 'center', margin: 0 }}>Loading…</p>
        </div>
      </div>
    )
  }

  return <SignupLogin titleKey="signupLogin.loginTitle" />
}
